import { useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate, useSearchParams } from 'react-router';
import useDebounce from '@/hooks/use-debounce';
import { useGetAptScansQuery } from '@/services/auto-pt/scansApi';
import { Button } from '@/components/ui/button';
import ApiErrorHandler from '@/components/common/api-error-handler';
import { EmptyScreen } from '@/components/common/empty-screen';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import PageHeading from '@/components/custom/page-heading';
import ScansTable from './components/tables/scans-table';
import useStore from './store';


const Scans = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const rawScanType =
    searchParams.get('scan_type') || searchParams.get('pentest_type');

  const filters = useStore((state) => state.filters);

  const searchQuery = useStore((state) => state.searchQuery);

  const debouncedSearch = useDebounce(searchQuery, 500);

  const pagination = useStore((state) => state.pagination);
  const setPagination = useStore((state) => state.setPagination);
  const sorting = useStore((state) => state.sorting);

  const scanQueryParams = {
    search: debouncedSearch,
    ...(rawScanType ? { scan_type: rawScanType } : {}),
    ...filters,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    ...(sorting?.length && sorting[0]
      ? { sortBy: sorting[0]?.id, order: sorting[0]?.desc ? 'desc' : 'asc' }
      : {}),
  };
  if (scanQueryParams.pentest_type && !scanQueryParams.scan_type) {
    scanQueryParams.scan_type = scanQueryParams.pentest_type;
    delete scanQueryParams.pentest_type;
  }
  if (scanQueryParams.status && !scanQueryParams.state) {
    scanQueryParams.state = scanQueryParams.status;
  }
  if (scanQueryParams.state && !scanQueryParams.status) {
    scanQueryParams.status = scanQueryParams.state;
  }
  if (scanQueryParams.project && !scanQueryParams.projectId) {
    scanQueryParams.projectId = scanQueryParams.project;
  }
  if (scanQueryParams.projectId && !scanQueryParams.project) {
    scanQueryParams.project = scanQueryParams.projectId;
  }
  if (scanQueryParams.project && !scanQueryParams.pentestId) {
    scanQueryParams.pentestId = scanQueryParams.project;
  }

  const {
    data: scansData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetAptScansQuery(
    scanQueryParams,
    { pollingInterval: 10000 },
  );

  // Reset pagination when filters, search or scan type changes
  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [filters, debouncedSearch, rawScanType, setPagination]);

  // Show empty state only when there's no data and no filters applied
  if (
    !isError &&
    !isLoading &&
    !isFetching &&
    !scansData?.data?.length &&
    !scansData?.data?.upcoming?.length &&
    !scansData?.future_scans?.length &&
    !scansData?.upcoming?.length &&
    !Object.keys(filters).length &&
    !debouncedSearch
  ) {
    return (
      <EmptyScreen
        title="No Scans available"
        subTitle="There are no Scans to show, please create a Project first, click the button below."
        engage={
          <AuthorityGuard forbidRoles={['Auditor']}>
            <Button mode="link" underlined="dashed" asChild>
              <Link to="/apt/pentests/create">
                <Plus /> Create New Project
              </Link>
            </Button>
          </AuthorityGuard>
        }
      />
    );
  }

  if (isError) return <ApiErrorHandler error={error} />

  return (
    <div className="p-4">
      <Helmet>
        <title>Strike | Scans</title>
      </Helmet>
      <div className="w-full flex items-center justify-between mb-1">
        <PageHeading title="Scans" description="View and manage security scans, execution status, and history." />

        <AuthorityGuard forbidRoles={['Auditor']}>
          <Button asChild size="sm">
            <Link to="/apt/pentests/create">
              <Plus className="size-4 mr-1.5" /> Create New Scan
            </Link>
          </Button>
        </AuthorityGuard>
      </div>

      <ScansTable
        scans={scansData}
        isLoading={isLoading}
        isFetching={isFetching}
        totalCount={scansData?.meta?.total}
      />
    </div>
  );
};

export default Scans;