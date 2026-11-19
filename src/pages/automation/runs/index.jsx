import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet';
import RunsTable from './components/RunsTable';
import {
  useGetWorkflowRunsQuery,
  useCancelWorkflowRunMutation,
} from '@/services/automation/workflowRunsApi';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyScreen } from '@/components/common/empty-screen';
import PageHeading from '@/components/custom/page-heading';
import ApiErrorHandler from '@/components/common/api-error-handler';
import { useStore } from './store';
import useDebounce from '@/hooks/use-debounce';

import DashboardMetrics from '../dashboard/components/DashboardMetrics';

export default function AutomationRuns() {
  const search = useStore((s) => s.searchQuery);
  const setSearch = useStore((s) => s.setSearchQuery);
  const pagination = useStore((s) => s.pagination);
  const setPagination = useStore((s) => s.setPagination);

  const debouncedSearch = useDebounce(search, 400);
  const searchFilter = search ? debouncedSearch : '';

  const queryParams = useMemo(() => ({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    ...(searchFilter ? { search: searchFilter } : {}),
  }), [pagination.pageIndex, pagination.pageSize, searchFilter]);

  const { data: runsData, isLoading: isLoadingRuns, isFetching, isError, error } = useGetWorkflowRunsQuery(queryParams);
  const [cancelWorkflowRun] = useCancelWorkflowRunMutation();

  const runsList = useMemo(() => {
    if (!runsData) return [];
    if (Array.isArray(runsData)) return runsData;
    if (Array.isArray(runsData.data)) return runsData.data;
    if (Array.isArray(runsData.data?.runs)) return runsData.data.runs;
    if (Array.isArray(runsData.runs)) return runsData.runs;
    return [];
  }, [runsData]);

  const totalCount = runsData?.meta?.total || runsData?.total || runsData?.pagination?.total || runsList.length;
  const totalPages = runsData?.meta?.totalPages || runsData?.totalPages || runsData?.pagination?.totalPages || Math.ceil(totalCount / pagination.pageSize);

  const runsMetrics = useMemo(() => {
    if (runsData?.data?.metrics) {
      return runsData.data.metrics;
    }
    if (runsData?.metrics) {
      return runsData.metrics;
    }
    let completed = 0;
    let failed = 0;
    let partiallyFailed = 0;
    let tokens = 0;
    runsList.forEach((run) => {
      if (run.status === 'completed') completed += 1;
      else if (run.status === 'failed') failed += 1;
      else if (run.status === 'partially_failed') partiallyFailed += 1;
      tokens += run.tokensUsed || 0;
    });
    return {
      totalRuns: totalCount,
      completedRuns: completed,
      failedRuns: failed,
      partiallyFailedRuns: partiallyFailed,
      tokensUsed: tokens,
    };
  }, [runsData, runsList, totalCount]);

  const runsStatsConfig = [
    { label: 'Total Runs', key: 'totalRuns' },
    { label: 'Completed Runs', key: 'completedRuns' },
    { label: 'Failed Runs', key: 'failedRuns' },
    { label: 'Partially Failed Runs', key: 'partiallyFailedRuns' },
    { label: 'Tokens Used', key: 'tokensUsed' },
  ];

  const handleCancelRun = async (runId) => {
    try {
      await cancelWorkflowRun(runId).unwrap();
      toast.success('Workflow run cancelled');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to cancel run');
    }
  };

  const isEmpty = !isLoadingRuns && !isFetching && !debouncedSearch && runsList.length === 0;

  if (isError) {
    return <ApiErrorHandler error={error} />;
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <Helmet>
        <title>Automation | Runs</title>
      </Helmet>

      {isEmpty ? (
        <EmptyScreen
          title="No runs yet"
          subTitle="Execute a workflow to see its run history here."
          engage={
            <Link to="/ai-agent-builder/workflows">
              <Button className="gap-2">
                <Play size={14} /> View Workflows
              </Button>
            </Link>
          }
        />
      ) : (
        <>
          <PageHeading title="Runs" description="View and manage your automation workflow runs." />

          <DashboardMetrics data={runsMetrics} isLoading={isLoadingRuns || isFetching} stats={runsStatsConfig} />

          <RunsTable
            runs={runsList}
            isLoading={isLoadingRuns || isFetching}
            pagination={pagination}
            setPagination={setPagination}
            totalCount={totalCount}
            totalPages={totalPages}
            search={search}
            setSearch={setSearch}
            onCancelRun={handleCancelRun}
          />
        </>
      )}
    </div>
  );
}
