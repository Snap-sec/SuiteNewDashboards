import React, { useMemo, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Plus, Library } from 'lucide-react';
import WorkflowsTable from './components/WorkflowsTable';
import { useNavigate } from 'react-router-dom';
import {
  useGetWorkflowsQuery,
  useDeleteWorkflowMutation,
  useExecuteWorkflowMutation,
} from '@/services/automation/workflowsApi';
import { toast } from 'sonner';
import PageHeading from '@/components/custom/page-heading';
import ApiErrorHandler from '@/components/common/api-error-handler';
import { Button } from '@/components/ui/button';
import { EmptyScreen } from '@/components/common/empty-screen';
import useDebounce from '@/hooks/use-debounce';
import { useStore } from './store';

export default function AutomationWorkflows() {
  const navigate = useNavigate();
  const search = useStore((s) => s.searchQuery);
  const setSearch = useStore((s) => s.setSearchQuery);
  const pagination = useStore((s) => s.pagination);
  const setPagination = useStore((s) => s.setPagination);

  const debouncedSearch = useDebounce(search, 400);

  const queryParams = useMemo(() => ({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
  }), [pagination.pageIndex, pagination.pageSize, debouncedSearch]);

  const [hasActiveWorkflows, setHasActiveWorkflows] = useState(false);

  const { data: workflowsData, isLoading: isLoadingWorkflows, isFetching: isFetchingWorkflows, isError, error } = useGetWorkflowsQuery(
    queryParams,
    { pollingInterval: hasActiveWorkflows ? 4000 : 0 }
  );
  const [deleteWorkflow] = useDeleteWorkflowMutation();
  const [executeWorkflow] = useExecuteWorkflowMutation();

  const workflowsList = useMemo(() => {
    if (Array.isArray(workflowsData)) return workflowsData;
    return workflowsData?.data || workflowsData?.workflows || [];
  }, [workflowsData]);

  useEffect(() => {
    const active = workflowsList.some((wf) => ['pending', 'running'].includes(wf.latestRun?.status));
    setHasActiveWorkflows(active);
  }, [workflowsList]);

  const totalCount = workflowsData?.meta?.total || workflowsData?.total || workflowsData?.pagination?.total || workflowsList.length;
  const totalPages = workflowsData?.meta?.totalPages || workflowsData?.totalPages || workflowsData?.pagination?.totalPages || Math.ceil(totalCount / pagination.pageSize);

  const handleCreateNewWorkflow = () => {
    navigate('/ai-agent-builder/workflows/new');
  };

  const handleEditWorkflow = (wf) => {
    navigate(`/ai-agent-builder/workflows/${wf.id || wf._id}`);
  };

  const handleDeleteWorkflowById = async (wfId) => {
    toast.promise(deleteWorkflow(wfId).unwrap(), {
      loading: 'Deleting workflow...',
      success: 'Workflow deleted successfully',
      error: (err) => err?.data?.message || 'Failed to delete workflow',
    });
  };

  const handleExecuteWorkflowById = async (wfId) => {
    try {
      await executeWorkflow(wfId).unwrap();
      toast.success('Workflow execution scheduled successfully');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to execute workflow');
    }
  };

  // Only show empty screen when not loading, no search active, and truly no data
  const isEmpty = !isLoadingWorkflows && !debouncedSearch && workflowsList.length === 0;

  if (isError) {
    return <ApiErrorHandler error={error} />;
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <Helmet>
        <title>Automation | Workflows</title>
      </Helmet>

      {isEmpty ? (
        <EmptyScreen
          title="No workflows available"
          subTitle="Create your first workflow to get started."
          engage={
            <div className="flex items-center gap-2 mt-2 justify-center">
              <Button onClick={handleCreateNewWorkflow} className="gap-2">
                <Plus size={14} /> Create Workflow
              </Button>
              <Button variant="outline" onClick={() => navigate('/ai-agent-builder/agents/library')} className="gap-2">
                <Library size={14} /> Explore workflow library
              </Button>
            </div>
          }
        />
      ) : (
        <>
          <div className="flex items-start justify-between">
            <PageHeading title="Workflows" description="Build and manage your automation workflows." />
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => navigate('/ai-agent-builder/agents/library')} className="gap-2 text-xs h-9 shrink-0">
                <Library size={14} /> Explore Agent Library
              </Button>
              <Button onClick={handleCreateNewWorkflow} className="gap-2 text-xs h-9 shrink-0">
                <Plus size={14} /> Create Workflow
              </Button>
            </div>
          </div>

          <WorkflowsTable
            workflows={workflowsList}
            isLoading={isFetchingWorkflows}
            search={search}
            setSearch={setSearch}
            pagination={pagination}
            setPagination={setPagination}
            totalCount={totalCount}
            totalPages={totalPages}
            onCreateNew={handleCreateNewWorkflow}
            onEditWorkflow={handleEditWorkflow}
            onDeleteWorkflow={handleDeleteWorkflowById}
            onExecuteWorkflow={handleExecuteWorkflowById}
          />
        </>
      )}
    </div>
  );
}


