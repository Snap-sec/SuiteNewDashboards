import { useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { EmptyScreen } from '@/components/common/empty-screen';
import PageHeading from '@/components/custom/page-heading';
import { useGetAutoPtVulnsQuery } from '@/services/auto-pt/autoPtVulnerabilityApi';
import { CloudMetrics } from './components/cloud-metrics';
import { CloudFindingsTable } from './components/cloud-findings-table';
import useDebounce from '@/hooks/use-debounce';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import ApiErrorHandler from '@/components/common/api-error-handler';
import { Button } from '@/components/ui/button';
import { ArrowRight, Plus } from 'lucide-react';

export default function CloudSecurityFindings() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 25 });
  const [sorting, setSorting] = useState([]);
  const filtersRef = useRef([]);

  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading, isFetching, error, isError } = useGetAutoPtVulnsQuery({
    search: debouncedSearch,
    scan_type: 'cloud',
    project_type: 'cloud-security',
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
          <title>Strike | Cloud Security - Findings</title>
        </Helmet>
       
        <EmptyScreen
          title="No Cloud Security Findings"
          subTitle="All connected cloud environments are complying with security benchmarks."
          engage={
            <AuthorityGuard forbidRoles={['Auditor']}>
              <Button mode="link" underlined="dashed" asChild>
                <Link
                  to="/apt/cloud-security/projects?type=cloud"
                  state={{ from: '/apt/cloud-security/findings?type=cloud' }}
                >
                  <ArrowRight /> Go to Accounts
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
        <title>Strike | Cloud Security - Findings</title>
      </Helmet>

      <PageHeading
        title="Cloud Security Findings"
        description="Identify misconfigurations, IAM overprivileges, and compliance violations across cloud infrastructure."
      />

      <CloudMetrics metrics={metrics} isLoading={isLoading} />

      <div className="mt-4">
        <CloudFindingsTable
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

