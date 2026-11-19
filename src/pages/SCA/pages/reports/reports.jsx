import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import PageHeading from '@/components/custom/page-heading';
import { useGetScaReportsQuery, useGetScaSupportedReportsQuery } from '@/services/sca/reportsApi';
import { CardIntegration } from './components/card-integration';
import useStore from './store';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import ReportList from './components/lists/reports-list';
import useDebounce from '@/hooks/use-debounce';
import ApiErrorHandler from '../../../../components/common/api-error-handler';

const SCAReportsPage = () => {
  const search = useStore((state) => state.searchQuery);
  const filters = useStore((state) => state.filters);
  const pagination = useStore((state) => state.pagination);
  const setPagination = useStore((state) => state.setPagination);

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    if (pagination?.pageIndex !== 0) {
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }
  }, [search, filters]);

  // Fetch Report History
  const {
    data: allReportsRes,
    isLoading: isAllLoading,
    isFetching: isAllFetching,
    isError,
    error
  } = useGetScaReportsQuery(
    {
      search: debouncedSearch,
      format: filters.format ? decodeURIComponent(filters.format) : undefined,
      status: filters.status ? decodeURIComponent(filters.status) : undefined,
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    },
    { pollingInterval: 10000 }
  );

  // Fetch Supported Report Templates
  const {
    data: supportedReportsRes,
    isLoading: isSupportedLoading,
    isFetching: isSupportedFetching,
  } = useGetScaSupportedReportsQuery();

  const supportedReports = supportedReportsRes?.data?.data || [];
  const allReportsData = allReportsRes?.data || [];
  const totalCount = allReportsRes?.data?.total || 0;
  const totalPages = allReportsRes?.data?.totalPages || 1;

  if(isError) return <ApiErrorHandler error={error} />

  return (
    <div className="p-4 flex flex-col w-full">
      <Helmet>
        <title>SCA | Reports & Export</title>
      </Helmet>

      <div className="flex items-center justify-between mb-1">
        <PageHeading
          title="Reports & Export"
          description="Generate and export detailed security reports, SBOMs, audit summaries, and executive-ready insights for vulnerability tracking, compliance, and remediation."
        />
      </div>

      {/* Available Report Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-7.5">
        {(isSupportedLoading) &&
          [1, 2, 3].map((v) => (
            <Card key={v} className="shadow-sm">
              <CardContent className="p-5 lg:p-7.5">
                <div className="flex items-center justify-between mb-3 lg:mb-5">
                  <Skeleton className="h-10 w-10 rounded-md" />
                  <Skeleton className="h-5 w-12 rounded" />
                </div>
                <div className="flex flex-col gap-2.5">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </CardContent>
              <CardFooter className="py-3.5 px-5 border-t border-border/50">
                <Skeleton className="h-9 w-32 rounded-md" />
              </CardFooter>
            </Card>
          ))}

        {!isSupportedLoading &&
          supportedReports.map((item) => (
            <CardIntegration
              key={item._id || item.reportId}
              id={item.reportId}
              format={item.format}
              name={item.name}
              type={item.type}
              reportId={item.reportId}
              isGeneratedAt={item.createdAt}
              status={item.status}
              description={item.description}
            />
          ))}
      </div>

      {/* Generated Report History Table */}
      <div className="flex flex-col gap-2 mt-4">
        <h3 className="font-semibold text-sm text-foreground tracking-tight">Report History</h3>
        <ReportList
          data={allReportsData}
          totalCount={totalCount}
          totalPages={totalPages}
          isLoading={isAllLoading}
        />
      </div>
    </div>
  );
};

export default SCAReportsPage;
