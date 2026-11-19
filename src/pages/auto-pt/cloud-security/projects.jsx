import { useMemo, useState } from 'react';
import IntegrationsPanel from '@/pages/integrations/components/integrations-panel';
import { Helmet } from 'react-helmet';
import useDebounce from '@/hooks/use-debounce';
import { useGetAptProjectsQuery } from '@/services/auto-pt/projectsApi';
import ApiErrorHandler from '@/components/common/api-error-handler';
import { EmptyScreen } from '@/components/common/empty-screen';
import { NoSearchResultsFound } from '@/components/common/no-search-found';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import PageHeading from '@/components/custom/page-heading';
import PaginationView from '@/components/custom/pagination';
import { SearchInput } from '@/components/custom/search';
import { CloudCard } from './components/cloud-card';

export default function CloudSecurityProjects() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading, isFetching, error, isError, refetch } =
    useGetAptProjectsQuery({
      scan_type: 'cloud',
      page,
      limit: pageSize,
      search: debouncedSearch,
    });

  const projectsList = useMemo(() => {
    return (
      data?.data?.pentests ||
      data?.data?.projects ||
      (Array.isArray(data?.data) ? data.data : []) ||
      []
    );
  }, [data]);

  const totalCount =
    data?.data?.meta?.total ??
    data?.meta?.total ??
    data?.pagination?.total ??
    data?.data?.totalItems ??
    projectsList.length;

  const totalPages =
    data?.data?.meta?.totalPages ??
    data?.meta?.totalPages ??
    data?.pagination?.pages ??
    Math.ceil(totalCount / pageSize) ??
    1;

  if (isError) return <ApiErrorHandler error={error} />;

  if (
    !isLoading &&
    !isFetching &&
    !debouncedSearch &&
    projectsList.length === 0
  )
    return (
      <EmptyScreen
        title="No Cloud Projects Found"
        subTitle="Connect an AWS, GCP, or Azure account to scan for IAM and resource misconfigurations."
        engage={
          <AuthorityGuard forbidRoles={['Auditor']}>
            <IntegrationsPanel
              mode="button"
              filterTypes={['aws', 'gcp', 'azure', 'oracle']}
              category="cloud-infra"
              menuLabel="Connect a cloud provider"
              onAccountChange={refetch}
              label="Create New Project"
              emptyState
            />
          </AuthorityGuard>
        }
      />
    );

  return (
    <div className="p-4 space-y-4">
      <Helmet>
        <title>Strike | Cloud Security - Projects</title>
      </Helmet>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <PageHeading
          title="Cloud Security Projects"
          description="Manage connected cloud integrations (AWS, GCP, Azure) and continuous posture scans."
        />

        <AuthorityGuard forbidRoles={['Auditor']}>
          <IntegrationsPanel
            mode="button"
            filterTypes={['aws', 'gcp', 'azure', 'oracle']}
            category="cloud-infra"
            menuLabel="Connect a cloud provider"
            label="Add Account"
            onAccountChange={refetch}
          />
        </AuthorityGuard>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-full sm:w-72">
          <SearchInput
            placeholder="Search cloud environments..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {search.trim() &&
      !isLoading &&
      !isFetching &&
      projectsList.length === 0 ? (
        <NoSearchResultsFound />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {isLoading || isFetching
              ? Array.from({ length: 8 }).map((_, index) => (
                  <CloudCard key={index} isLoading={isLoading || isFetching} />
                ))
              : projectsList.map((item) => (
                  <CloudCard key={item._id || item.id} item={item} />
                ))}
          </div>

          {totalPages > 1 && (
            <div className="pt-4 flex justify-end">
              <PaginationView
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
