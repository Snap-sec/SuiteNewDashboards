import { Helmet } from 'react-helmet';
import { useGetVsScannersQuery } from '@/services/vs/vsApi';
import PageHeading from '@/components/custom/page-heading';
import ScannersList from './components/lists/scanners-list';
import Toolbar from './components/toolbar';
import { useStore } from './store';
import { EmptyScreen } from "@/components/common/empty-screen";
import ApiErrorHandler from '@/components/common/api-error-handler';
import CreateScannerModel from './components/Modal/create-scanner-model';
import useDebounce from '@/hooks/use-debounce';
import AuthorityGuard from '../../../../components/custom/authority-guard/AuthorityGuard';

function Scanner() {
  const pagination = useStore((state) => state.pagination);
  const setPage = useStore((state) => state.setPage);
  const searchQuery = useStore((state) => state.searchQuery);
  const filters = useStore((state) => state.filters);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const {
    data: scanners,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetVsScannersQuery({
    ...pagination,
    search: debouncedSearchQuery,
    ...filters,
  });

  if (isError) return <ApiErrorHandler error={error} />;

  if (
    !isLoading &&
    !isError &&
    scanners?.scanners.length == 0 &&
    !debouncedSearchQuery &&
    !Object.keys(filters)?.length
  )
    return <EmptyScreen
      title="No Scanners Found"
      subTitle="To get started, create a new scanner"
      engage={
        <AuthorityGuard forbidRoles={['Auditor']}>
          <CreateScannerModel />
        </AuthorityGuard>
      } />;

  return (
    <div className="p-4">
      <Helmet>
        <title>VS | Scanners</title>
      </Helmet>

      <div className="w-full flex flex-col">
        <PageHeading title="Scanner" description="View and manage vulnerability scanners, configurations, and scanning capabilities." />
        <Toolbar />
      </div>
      
      <ScannersList
        scanners={scanners?.scanners}
        isLoading={isLoading || isFetching}
      />
    </div>
  );
}

export default Scanner;
