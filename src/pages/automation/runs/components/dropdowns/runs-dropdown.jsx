import { useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { useCancelWorkflowRunMutation, useRetryFailedWorkflowRunMutation } from '@/services/automation/workflowRunsApi';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';

const RunsDropdown = ({ row }) => {
  const [open, setOpen] = useState(false);
  const run = row.original;
  const status = (run?.status || '').toLowerCase();
  const runId = run?._id || run?.id;
  const wfName = run?.workflow?.name || run?.workflowName || run?.name || 'Workflow Run';

  const [cancelWorkflowRun, { isLoading: isCanceling }] = useCancelWorkflowRunMutation();
  const [retryFailedWorkflowRun, { isLoading: isRetrying }] = useRetryFailedWorkflowRunMutation();

  const cancelRun = () => {
    toast.promise(cancelWorkflowRun(runId).unwrap(), {
      loading: 'Canceling Run...',
      success: 'Run Canceled Successfully',
      error: (err) => {
        console.log(err);
        return err?.data?.message || 'Failed to cancel the Run';
      },
    });
  };

  const retryRun = () => {
    toast.promise(retryFailedWorkflowRun(runId).unwrap(), {
      loading: 'Retrying Failed Run...',
      success: 'Run Retried Successfully',
      error: (err) => {
        console.log(err);
        return err?.data?.message || 'Failed to retry the Run';
      },
    });
  };

  if (status === 'completed' || status === 'success') {
    return null;
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[150px]" side="bottom" align="end">
        {(status === 'failed' || status === 'error' || status === 'cancelled' || status === 'canceled') && (
          <DropdownMenuItem asChild>
            <ButtonWithConfirm
              disabled={isRetrying}
              variant="ghost"
              confirm={true}
              confirmOnInput={wfName}
              onConfirm={() => {
                if (isRetrying) return;
                retryRun();
                setOpen(false);
              }}
              confirmButton={
                <Button variant="primary" disabled={isRetrying}>
                  Proceed
                </Button>
              }
              cancelButton={<Button variant="outline">Cancel</Button>}
              className="w-full justify-start hover:cursor-pointer !font-normal !hover:bg-transparent !bg-transparent !text-inherit px-2 py-1.5 text-sm h-8"
            >
              <span>{status === 'cancelled' || status === 'canceled' ? 'Retry' : 'Retry'}</span>
            </ButtonWithConfirm>
          </DropdownMenuItem>
        )}

        {(status === 'running' || status === 'in_progress' || status === 'pending') && (
          <DropdownMenuItem asChild>
            <AuthorityGuard forbidRoles={['Auditor']}>
              <ButtonWithConfirm
                disabled={isCanceling}
                variant="ghost"
                confirm={true}
                dialog="This action requires confirmation, click Cancel to proceed."
                confirmOnInput={wfName}
                onConfirm={() => {
                  if (isCanceling) return;
                  cancelRun();
                  setOpen(false);
                }}
                confirmButton={
                  <Button variant="destructive" disabled={isCanceling}>
                    Cancel Run
                  </Button>
                }
                cancelButton={<Button variant="outline">Back</Button>}
                className="w-full justify-start !font-normal hover:bg-red-200/20 px-2 py-1.5 text-sm h-8"
              >
                <span className="text-destructive">Cancel</span>
              </ButtonWithConfirm>
            </AuthorityGuard>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RunsDropdown;
