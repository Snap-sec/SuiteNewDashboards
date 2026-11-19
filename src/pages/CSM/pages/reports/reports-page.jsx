import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useGetVmReportsQuery, useGenerateVmReportMutation } from '@/services/vm/reportApi';
import { EmptyScreen } from '@/components/common/empty-screen';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import PageHeading from '@/components/custom/page-heading';
import useDebounce from '@/hooks/use-debounce';
import { FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

import CsmReportList from './components/report-list';
import CsmReportBulkUpdate from './components/report-bulk-update';
import useReportStore from './store';
import GenerateReportModel2 from '@/pages/VM/pages/report/components/modals/generate-report-modal2';
import ApiErrorHandler from '../../../../components/common/api-error-handler';

function CsmReportsPage() {
  const search = useReportStore((s) => s.searchQuery);
  const pagination = useReportStore((s) => s.pagination);
  const setPagination = useReportStore((s) => s.setPagination);
  const rowSelection = useReportStore((s) => s.rowSelection);

  const debouncedSearch = useDebounce(search, 400);

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
    {
      search: debouncedSearch,
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      supported_for: 'cspm-internal-assessment'
    },
    { pollingInterval: 5000 },
  );

  if (!isError && !isLoading && !reports?.data?.reports?.length && !search)
    return (
      <div className="p-4">
        <Helmet>
          <title>CSM | Reports</title>
        </Helmet>
        <EmptyScreen
          title="No Reports Found"
          subTitle="No cloud compliance reports have been generated yet."
          engage={
            <AuthorityGuard roles={['Admin']}>
              <GenerateReportModel2
                supportedFormats={reports?.data?.supportedFormats}
                supportedFor="cspm-internal-assessment"
                systemAssessmentSlug="cspm-internal-assessment"
              />
            </AuthorityGuard>
          }
        />
      </div>
    );

  if(isError) return <ApiErrorHandler error={error} />

  return (
    <div className="p-4">
      <Helmet>
        <title>CSM | Reports</title>
      </Helmet>

      <div className="flex items-center justify-between mb-1">
        <PageHeading
          title="Reports"
          description="View, generate, and manage cloud security and compliance reports, including findings, posture summaries, and assessment results."
        />
        <div className="flex flex-wrap items-center gap-2 justify-end">
          <AuthorityGuard roles={['Admin']}>
            <GenerateReportModel2
              supportedFormats={reports?.data?.supportedFormats}
              supportedFor="cspm-internal-assessment"
              systemAssessmentSlug="cspm-internal-assessment"
            />
          </AuthorityGuard>
        </div>
      </div>

      <div>
        <CsmReportList
          data={reports?.data?.reports}
          paginationData={reports?.data?.pagination}
          isLoading={isLoading}
        />
        {Object.keys(rowSelection).length > 1 && <CsmReportBulkUpdate />}
      </div>
    </div>
  );
}

export default CsmReportsPage;
