import { useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { EmptyScreen } from '@/components/common/empty-screen';
import ApiErrorHandler from '@/components/common/api-error-handler';
import PageHeading from '@/components/custom/page-heading';
import { useGetVsScansQuery } from '../../../../services/vs/scansApi';
import CreateScanModel from './components/modals/create-scan';
import ScansTable from './components/tables/scans-table';
import useStore from './store';
import useDebounce from '@/hooks/use-debounce';
import AuthorityGuard from '../../../../components/custom/authority-guard/AuthorityGuard';

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
  } = useGetVsScansQuery(
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

  if (isError) return <ApiErrorHandler error={error} />;

  // Show empty state only when there's no data and no filters applied
  if (
    !isLoading &&
    !isError &&
    scansData?.scans?.length === 0 &&
    scansData?.upcoming?.length === 0 &&
    Object.keys(filters).length === 0 &&
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
            <CreateScanModel />
          </AuthorityGuard>
        }
      />
    );
  }

  return (
    <div className="p-4">
      <Helmet>
        <title>VS | Scans</title>
      </Helmet>
      <div className="w-full flex items-center justify-between mb-4">
        <PageHeading title="Scans" description="View, monitor, and manage vulnerability scans, schedules, results, and execution status." />

        <AuthorityGuard forbidRoles={['Auditor']}>
          <CreateScanModel />
        </AuthorityGuard>
      </div>

      <ScansTable
        scans={scansData}
        isLoading={isLoading}
        totalCount={scansData?.pagination?.total}
      />
    </div>
  );
};

export default Scans;
