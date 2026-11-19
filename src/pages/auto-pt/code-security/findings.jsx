import { useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { EmptyScreen } from '@/components/common/empty-screen';
import PageHeading from '@/components/custom/page-heading';
import { useGetAutoPtVulnsQuery } from '@/services/auto-pt/autoPtVulnerabilityApi';
import { CodeMetrics } from './components/code-metrics';
import { CodeFindingsTable } from './components/code-findings-table';
import useDebounce from '@/hooks/use-debounce';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import ApiErrorHandler from '@/components/common/api-error-handler';
import { Button } from '@/components/ui/button';
import { ArrowRight, Plus } from 'lucide-react';

export default function CodeSecurityFindings() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 25 });
  const [sorting, setSorting] = useState([]);
  const filtersRef = useRef([]);

  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading, isFetching, error, isError } = useGetAutoPtVulnsQuery({
    search: debouncedSearch,
    project_type: 'code-security',
    vuln_type: 'code-sca,code-sast',
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    ...filters,
    ...(sorting?.length && sorting[0]
      ? { sortBy: sorting[0]?.id, sortOrder: sorting[0]?.desc ? 'desc' : 'asc' }
      : {}),
  });

  const rawAdvancedFilters = data?.data?.advanced_filters || data?.advanced_filters;
  if (rawAdvancedFilters && rawAdvancedFilters.length > 0) {
    filtersRef.current = rawAdvancedFilters;
  }
  const supportedFilters = rawAdvancedFilters?.length ? rawAdvancedFilters : filtersRef.current;

  const vulnerabilitiesList = useMemo(() => {
    return (
      data?.data?.vulnerabilities ||
      (Array.isArray(data?.data) ? data?.data : []) ||
      []
    );
  }, [data]);

  const metrics = data?.data?.metrics || data?.summary || {};

  const totalCount =
    data?.data?.meta?.total ??
    data?.meta?.total ??
    data?.data?.totalItems ??
    data?.pagination?.total ??
    vulnerabilitiesList.length;

  const totalPages =
    (data?.data?.meta?.totalPages ??
      data?.meta?.totalPages ??
      data?.data?.totalPages ??
      data?.pagination?.pages) ||
    Math.ceil(totalCount / (pagination.pageSize || 25)) ||
    1;

  const metadata = data?.metadata || data?.data?.metadata || data?.meta?.metadata || {};

  if (isError) return <ApiErrorHandler error={error} />;

  const isEmpty =
    !isLoading &&
    !isFetching &&
    !debouncedSearch &&
    !Object.keys(filters).length &&
    (!data || !totalCount || vulnerabilitiesList.length === 0);

  if (isEmpty) {
    return (
      <div className="p-4 space-y-4">
        <Helmet>
          <title>Strike | Code Security - Findings</title>
        </Helmet>
        <EmptyScreen
          title="No Code Security Findings"
          subTitle="No code weaknesses or vulnerable third-party dependencies have been identified."
          engage={
            <AuthorityGuard forbidRoles={['Auditor']}>
              <Button mode="link" underlined="dashed" asChild>
                <Link
                  to="/apt/code-security/projects?type=code-security"
                  state={{ from: '/apt/code-security/findings?type=code-security' }}
                >
                  <ArrowRight /> Go to Projects
                </Link>
              </Button>
            </AuthorityGuard>
          }
        />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <Helmet>
        <title>Strike | Code Security - Findings</title>
      </Helmet>

      <PageHeading
        title="Code Security Findings"
        description="Source code weaknesses (SAST) and vulnerable dependencies (SCA) detected across repositories."
      />

      <CodeMetrics metrics={metrics} isLoading={isLoading} />

      <div className="mt-4">
        <CodeFindingsTable
          data={vulnerabilitiesList}
          totalPages={totalPages}
          totalCount={totalCount}
          isLoading={isLoading}
          isFetching={isFetching}
          search={search}
          setSearch={setSearch}
          pagination={pagination}
          setPagination={setPagination}
          sorting={sorting}
          setSorting={setSorting}
          filters={filters}
          setFilters={setFilters}
          supportedFilters={supportedFilters}
        />
      </div>
    </div>
  );
}

