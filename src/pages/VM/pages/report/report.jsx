import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useGetVmReportsQuery } from '@/services/vm/reportApi';
import { EmptyScreen } from '@/components/common/empty-screen';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import PageHeading from '@/components/custom/page-heading';
import ApiErrorHandler from '../../../../components/common/api-error-handler';
import useDebounce from '../../../../hooks/use-debounce';
import useTransitionFetching from '@/hooks/use-transition-fetching';
import GenerateReportModel2 from './components/modals/generate-report-modal2';
import ReportBulkUpdate from './components/report-bulk-update';
import ReportList from './components/report-list';
import useStore from './store';


function Report() {
  const search = useStore((state) => state.searchQuery);
  const pagination = useStore((state) => state.pagination);
  const setPagination = useStore((state) => state.setPagination);
  const rowSelection = useStore((state) => state.rowSelection);

  const debouncedSearch = useDebounce(search, 400);
  const searchFilter = search ? debouncedSearch : '';

  useEffect(() => {
    if (pagination?.pageIndex !== 0) {
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }
  }, [search]);

  const {
    data: reports,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetVmReportsQuery(
    { search: searchFilter, page: pagination.pageIndex + 1, limit: pagination.pageSize },
    { pollingInterval: 5000 }
  );

  const isTransitionFetching = useTransitionFetching(
    { search: searchFilter, page: pagination?.pageIndex, limit: pagination?.pageSize },
    isFetching,
    isLoading,
    reports
  );

  if (
    !isError &&
    !isLoading &&
    !reports?.data?.reports?.length &&
    !search &&
    !debouncedSearch
  )
    return (
      <EmptyScreen
        title="No Reports Found"
        subTitle="To get started, generate a new report on an assessment"
        engage={<GenerateReportModel2 supportedFormats={reports?.data?.supportedFormats} />}
      />
    );

  if(isError) return <ApiErrorHandler error={error} />

  return (
    <div className="p-4">
      <Helmet>
        <title>UniRisk | Reports</title>
      </Helmet>

      <div className="flex items-center justify-between">
        <PageHeading
          title="Reports"
          description="Generate and manage detailed security, risk, vulnerability, and compliance reports."
        />
        <div className="flex flex-wrap items-center gap-2 justify-end pb-4">
          <AuthorityGuard roles={['Admin']}>
            {/* <GenerateReportModel /> */}
            <GenerateReportModel2
              supportedFormats={reports?.data?.supportedFormats}
            />
          </AuthorityGuard>
        </div>
      </div>

      <div>
        <ReportList
          data={reports?.data?.reports}
          paginationData={reports?.data?.pagination}
          isLoading={isLoading}
          isFetching={isTransitionFetching}
        />
        {Object.keys(rowSelection).length > 1 && <ReportBulkUpdate />}
      </div>
    </div>
  );
}

export default Report;