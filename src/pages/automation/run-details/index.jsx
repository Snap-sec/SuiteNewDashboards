import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import ApiErrorHandler from '@/components/common/api-error-handler';
import { useGetWorkflowRunByIdQuery } from '@/services/automation/workflowRunsApi';
import { RunSummaryCard } from './components/run-summary-card';
import { RunLogsTable } from './components/run-logs-table';

export default function RunDetails() {
  const { id } = useParams();
  const { data: runData, isLoading, isFetching, isError, error } = useGetWorkflowRunByIdQuery(id, { skip: !id });

  const runInfo = useMemo(() => {
    if (!runData) return null;
    let run = runData;
    if (runData.data) run = runData.data;
    if (runData.data?.data) run = runData.data.data;
    return run;
  }, [runData]);

  if (isError) {
    return <ApiErrorHandler error={error} />;
  }

  const isEmptyState = !isLoading && !runInfo;

  return (
    <div className="p-4 flex flex-col gap-4">
      <Helmet>
        <title>Automation | Run Details</title>
      </Helmet>

      {!isEmptyState && (
        <>
          <RunSummaryCard runInfo={runInfo} />
          <RunLogsTable runInfo={runInfo} isLoading={isLoading} isFetching={isFetching} />
        </>
      )}
      
      {isEmptyState && (
        <div className="py-12">
          <Skeleton className="h-48 w-full mb-8 rounded-xl" />
          <Skeleton className="h-[400px] w-full rounded-xl" />
        </div>
      )}
    </div>
  );
}
