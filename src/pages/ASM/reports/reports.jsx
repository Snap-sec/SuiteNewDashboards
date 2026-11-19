import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { EmptyScreen } from '@/components/common/empty-screen';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import PageHeading from '@/components/custom/page-heading';
import { useGetAsmReportsQuery, useGetAsmSupportedReportsQuery } from '../../../services/asm/reportsApi';
import GenerateReportModel from './components/modals/generate-report-modal';
import useStore from './store';
import { CardIntegration } from './components/card-integration';
import {
  Card,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import ReportList from './components/lists/reports-list';
import AsmReportBulkUpdate from './components/lists/asm-report-bulk-update';
import useDebounce from '../../../hooks/use-debounce';

const Reports = () => {
  const search = useStore((state) => state.searchQuery);
  const pagination = useStore((state) => state.pagination);
  const setPagination = useStore((state) => state.setPagination);
  const rowSelection = useStore((state) => state.rowSelection);

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    if (pagination?.pageIndex !== 0) {
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }
  }, [search]);

  const {
    data: Allreports,
    isLoading: isAllLoading,
    isFetching: isAllFetching,
  } = useGetAsmReportsQuery({
    search: debouncedSearch,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  }, { pollingInterval: 10000 });

  const {
    data: reports,
    isLoading,
    isFetching,
  } = useGetAsmSupportedReportsQuery({
    search,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  });

  if (!isLoading && !isAllLoading && !isFetching && reports?.total == 0)
    return (
      <EmptyScreen
        title="No Reports Found"
        subTitle="To get started, generate a new report on an assessment"
        engage={
          <AuthorityGuard forbidRoles={['Auditor']} roles={['Admin']}>
            <GenerateReportModel />
          </AuthorityGuard>
        }
      />
    );

  return (
    <div className="p-4">
      <Helmet>
        <title>Xpose | Reports</title>
      </Helmet>

      <div className="flex items-center justify-between mb-5">
        <PageHeading title="Reports" description="View, manage, and generate reports across your attack surface." />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-5 lg:gap-6">
        {(isLoading || isFetching) &&
          [1, 2, 3, 4].map((v) => (
            <Card key={v}>
              <CardContent className="p-5 lg:p-7.5">
                <div className="flex items-center justify-between mb-3 lg:mb-5">
                  <div className="flex items-center justify-center">
                    <Skeleton className="h-11 w-11 rounded-md" />
                  </div>
                </div>

                <div className="flex flex-col gap-1 lg:gap-2.5">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-full max-" />
                </div>
              </CardContent>

              <CardFooter className="justify-between items-center py-3.5">
                <div className="flex items-center gap-2.5">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
                <Skeleton className="h-4 w-24" />
              </CardFooter>
            </Card>
          ))}

        {!isLoading && !isFetching &&
          reports?.data?.map((item) => (
            <CardIntegration
              key={item._id}
              id={item.reportId}
              logo={item?.format === 'PDF' ? 'pdf.svg' : 'csv.svg'}
              format={item?.format?.toLowerCase?.()}
              formats={item?.formats}
              name={item?.name}
              type={item?.type}
              reportId={item?.reportId}
              isGeneratedAt={item?.createdAt}
              status={item?.status}
              description={item?.description}
            />
          ))}
      </div>


      <div>
        <p className="mt-6 mb-2 font-medium">Report History</p>
        <ReportList
          data={Allreports?.data}
          totalCount={Allreports?.total}
          totalPages={Allreports?.totalPages}
          isLoading={isAllLoading}
        />
        {Object.keys(rowSelection).length > 1 && <AsmReportBulkUpdate />}
      </div>
    </div>
  );
};

export default Reports;
