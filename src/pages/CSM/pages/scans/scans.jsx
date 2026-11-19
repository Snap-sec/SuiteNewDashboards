import { useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { EmptyScreen } from '@/components/common/empty-screen';
import PageHeading from '@/components/custom/page-heading';
import { useGetScansQuery } from '@/services/csm/scansApi';
import CreateScanModel from './components/modals/create-scan';
import ScansTable from './components/tables/scans-table';
import useStore from './store';
import useDebounce from '@/hooks/use-debounce';
import AuthorityGuard from '../../../../components/custom/authority-guard/AuthorityGuard';
import ApiErrorHandler from '../../../../components/common/api-error-handler';

const Scans = () => {
  const filters = useStore((state) => state.filters);

  const searchQuery = useStore((state) => state.searchQuery);

  const debouncedSearch = useDebounce(searchQuery, 500);

  const pagination = useStore((state) => state.pagination);
  const setPagination = useStore((state) => state.setPagination);
  const sorting = useStore((state) => state.sorting);

  const {
    data: scansData,
    isLoading: isLoading,
    isError,
    error,
  } = useGetScansQuery(
    {
      search: debouncedSearch,
      ...filters,
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      ...(sorting?.length && sorting[0]
        ? { sortBy: sorting[0]?.id, order: sorting[0]?.desc ? 'desc' : 'asc' }
        : {}),
    },
    { pollingInterval: 10000 },
  );

  // Reset pagination when filters or search changes
  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [filters, debouncedSearch]);

  // Show empty state only when there's no data and no filters applied
  if (
    !isError &&
    !isLoading &&
    !scansData?.data?.scans?.length &&
    !scansData?.data?.upcoming?.length &&
    !Object.keys(filters).length &&
    !searchQuery
  ) {
    return (
      <EmptyScreen
        title="No data available"
        subTitle="There are no data to show, please create a scan, click the button below."
        engage={
          // <Link to={`/casm/settings`}>
          //   <Button>
          //     <Plus /> Create Scan
          //   </Button>
          // </Link>

          <AuthorityGuard forbidRoles={['Auditor']}>
            <CreateScanModel supportedFrameworks={scansData?.supportedComplianceFrameworks || []} />
          </AuthorityGuard>
        }
      />
    );
  }

  if(isError) return <ApiErrorHandler error={error} />

  return (
    <div className="p-4">
      <Helmet>
        <title>CSM | Scans</title>
      </Helmet>
      <div className="w-full flex items-center justify-between mb-1">
        <PageHeading title="Scans" description="View and manage cloud security scans, including scan status, findings, execution schedules, and scan history across connected environments." />

        <AuthorityGuard forbidRoles={['Auditor']}>
          <CreateScanModel supportedFrameworks={scansData?.supportedComplianceFrameworks || []} />
        </AuthorityGuard>
      </div>

      <ScansTable
        scans={scansData}
        isLoading={isLoading}
        totalCount={scansData?.data?.pagination?.total}
      />
    </div>
  );
};

export default Scans;
