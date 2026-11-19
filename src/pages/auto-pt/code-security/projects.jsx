import { useEffect, useMemo, useState } from 'react';
import IntegrationsPanel from '@/pages/integrations/components/integrations-panel';
import { Helmet } from 'react-helmet';
import useDebounce from '@/hooks/use-debounce';
import { useGetAptProjectsQuery } from '@/services/auto-pt/projectsApi';
import ApiErrorHandler from '@/components/common/api-error-handler';
import { EmptyScreen } from '@/components/common/empty-screen';
import TableToolbarFilters from '@/components/common/table-toolbar-filters';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import PageHeading from '@/components/custom/page-heading';
import CodeRepositoryTable from './components/code-repository-table';

export default function CodeSecurityProjects() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});
  const [supportedFilters, setSupportedFilters] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 12 });
  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading, isFetching, error, isError, refetch } =
    useGetAptProjectsQuery({
      type: 'code-security',
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      search: debouncedSearch,
      ...filters,
    });

  useEffect(() => {
    const definitions = data?.advanced_filters ?? data?.data?.advanced_filters;
    if (Array.isArray(definitions) && definitions.length) {
      setSupportedFilters([
        ...new Map(
          definitions
            .filter((filter) => filter?.key)
            .map((filter) => [filter.key, filter]),
        ).values(),
      ]);
    }
  }, [data]);

  const handleFiltersChange = (updater) => {
    setFilters(updater);
    setPagination((previous) => ({ ...previous, pageIndex: 0 }));
  };

  const projectsList = useMemo(() => {
    const rows =
      data?.data?.pentests ||
      data?.data?.projects ||
      (Array.isArray(data?.data) ? data.data : []);
    return rows.map((row) => ({ ...row, _id: row._id || row.id }));
  }, [data]);

  const totalCount =
    data?.data?.meta?.total ??
    data?.meta?.total ??
    data?.data?.pagination?.total ??
    data?.pagination?.total ??
    data?.data?.totalItems ??
    data?.total ??
    projectsList.length;

  const totalPages =
    data?.data?.meta?.totalPages ??
    data?.meta?.totalPages ??
    data?.data?.pagination?.totalPages ??
    data?.pagination?.totalPages ??
    data?.pagination?.pages ??
    data?.totalPages ??
    Math.max(1, Math.ceil(totalCount / pagination.pageSize));

  if (isError) return <ApiErrorHandler error={error} />;

  if (
    !isLoading &&
    !isFetching &&
    !debouncedSearch &&
    !Object.keys(filters).length &&
    projectsList.length === 0
  )
    return (
      <EmptyScreen
        title="No Code Repositories Found"
        subTitle="Connect GitHub or GitLab to scan for security flaws in code and dependencies."
        engage={
          <AuthorityGuard forbidRoles={['Auditor']}>
            <IntegrationsPanel
              mode="button"
              filterTypes={['github', 'gitlab']}
              menuLabel="Connect a code provider"
              label="Create New Project"
              emptyState
              onAccountChange={refetch}
            />
          </AuthorityGuard>
        }
      />
    );

  return (
    <div className="p-4 space-y-4">
      <Helmet>
        <title>Strike | Code Security - Projects</title>
      </Helmet>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <PageHeading
          title="Code Security Repositories"
          description="Manage connected Git repositories, source code archives, and SAST/SCA security scans."
        />

        <AuthorityGuard forbidRoles={['Auditor']}>
          <IntegrationsPanel
            mode="button"
            filterTypes={['github', 'gitlab']}
            menuLabel="Connect a code provider"
            label="Add Account"
            onAccountChange={refetch}
          />
        </AuthorityGuard>
      </div>

      <CodeRepositoryTable
        data={projectsList}
        isLoading={isLoading || isFetching}
        totalPages={totalPages}
        totalCount={totalCount}
        toolbar={
          <TableToolbarFilters
            filters={filters}
            setFilters={handleFiltersChange}
            supportedFilters={supportedFilters}
            isLoadingFilters={isLoading && !supportedFilters.length}
          />
        }
        pagination={pagination}
        setPagination={(updater) =>
          setPagination((previous) => {
            const next =
              typeof updater === 'function' ? updater(previous) : updater;
            return next.pageSize !== previous.pageSize
              ? { ...next, pageIndex: 0 }
              : next;
          })
        }
        search={search}
        setSearch={(value) => {
          setSearch(value);
          setPagination((previous) => ({ ...previous, pageIndex: 0 }));
        }}
      />
    </div>
  );
}
