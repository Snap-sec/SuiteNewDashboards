import { MoreHorizontal, RotateCcw, Trash2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  useCancelAptScanMutation,
  useDeleteAptScanMutation,
  useRetryAptScanMutation,
  useTriggerAptScanMutation,
} from '@/services/auto-pt/scansApi';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import useStore from '../../store';

function ActionColumn({ scan }) {
  const [deleteScan, { isLoading: isDeleting }] = useDeleteAptScanMutation();
  const [cancelScan, { isLoading: isCancelling }] = useCancelAptScanMutation();
  const [retryScan, { isLoading: isRetrying }] = useRetryAptScanMutation();

  const scanId = scan?._id || scan?.id;

  const handleDelete = async () => {
    if (!scanId) return;
    try {
      await deleteScan(scanId).unwrap();
      toast.success('Scan deleted successfully');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to delete scan');
    }
  };

  const handleCancelScan = async () => {
    if (!scanId) return;
    try {
      await cancelScan(scanId).unwrap();
      toast.success('Scan cancelled successfully');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to cancel scan');
    }
  };

  const handleRetryScan = async () => {
    if (!scanId) return;
    try {
      await retryScan(scanId).unwrap();
      toast.success('Scan retry triggered successfully');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to retry scan');
    }
  };

  const status = (scan?.status || scan?.lastRunStatus || '').toLowerCase();
  const isFailed = status === 'failed' || status === 'fail' || status === 'error';
  const isCancellable = ['running', 'queued', 'pending', 'in_progress', 'in progress'].includes(status);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {isFailed && (
          <>
            <ButtonWithConfirm
              variant="ghost"
              confirm
              confirmTitle="Retry Scan"
              confirmVariant="info"
              disabled={isRetrying}
              dialog={
                <p>
                  Are you sure you want to retry this scan?
                </p>
              }
              onConfirm={handleRetryScan}
              className="w-full justify-start px-2 py-1.5 h-auto font-normal text-sm rounded-md hover:bg-accent text-left bg-transparent flex items-center gap-2 cursor-pointer"
            >
              Retry
            </ButtonWithConfirm>
            <DropdownMenuSeparator />
          </>
        )}

        {isCancellable && (
          <>
            <ButtonWithConfirm
              variant="ghost"
              confirm
              confirmTitle="Cancel Scan"
              confirmVariant="destructive"
              disabled={isCancelling}
              dialog={
                <p>
                  Are you sure you want to cancel this scan? This action cannot
                  be undone.
                </p>
              }
              onConfirm={handleCancelScan}
              className="w-full justify-start px-2 py-1.5 h-auto font-normal text-sm rounded-md hover:bg-accent text-left bg-transparent hover:text-destructive flex items-center gap-2 cursor-pointer"
            >
              Cancel
            </ButtonWithConfirm>
            <DropdownMenuSeparator />
          </>
        )}

        <ButtonWithConfirm
          variant="ghost"
          confirm
          confirmTitle="Delete Scan"
          confirmVariant="destructive"
          disabled={isDeleting}
          dialog={
            <p>
              Are you sure you want to delete this scan? This action cannot be
              undone.
            </p>
          }
          onConfirm={handleDelete}
          className="w-full justify-start px-2 py-1.5 h-auto font-normal text-sm rounded-md hover:bg-accent text-left bg-transparent text-destructive hover:text-destructive flex items-center gap-2 cursor-pointer"
        >
          Delete
        </ButtonWithConfirm>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ActionColumn;
