import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { ConfirmDialog } from '@/components/custom/button-with-confirmation';
import { useCancelAsmReportMutation } from '@/services/asm/reportsApi';

/**
 * Checks if a report status is in an active cancellable state
 * (pending, processing, generating, in progress, running, or any action ending in -ing).
 */
export function isReportCancellable(status) {
  if (!status) return false;
  const s = status.toLowerCase().trim();
  return (
    s === 'pending' ||
    s === 'processing' ||
    s === 'generating' ||
    s === 'running' ||
    s === 'in progress' ||
    s === 'in_progress' ||
    s.endsWith('ing')
  );
}

function CancelReport({
  reportId,
  reportName,
  isDisabled = false,
  asDropdownItem = true,
  className,
  onSuccess,
  children,
}) {
  const [open, setOpen] = useState(false);
  const [cancelAsmReport, { isLoading: isCancelling }] = useCancelAsmReportMutation();

  const handleCancelReport = () => {
    toast.promise(cancelAsmReport(reportId).unwrap(), {
      loading: 'Cancelling report...',
      success: 'Report cancelled successfully',
      error: (error) => error?.data?.message || 'Failed to cancel the report',
    });
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <>
      {asDropdownItem ? (
        <DropdownMenuItem
          disabled={isDisabled || isCancelling}
          onSelect={(e) => {
            e.preventDefault();
            if (!isDisabled && !isCancelling) {
              setOpen(true);
            }
          }}
          className={`cursor-pointer text-destructive focus:text-destructive flex items-center gap-2 ${
            className || ''
          }`}
        >
          {children || (
            <>
              <span>Cancel</span>
            </>
          )}
        </DropdownMenuItem>
      ) : (
        <Button
          variant="outline"
          disabled={isDisabled || isCancelling}
          onClick={() => setOpen(true)}
          className={className}
        >
          {children || (
            <span className="flex items-center gap-2">
              <span>Cancel</span>
            </span>
          )}
        </Button>
      )}

      <ConfirmDialog
        open={open}
        setOpen={setOpen}
        onConfirm={handleCancelReport}
        variant="destructive"
        title="Cancel Report"
        dialog={
          <div className="flex flex-col gap-1 text-left">
            <span>
              Are you sure you want to cancel{' '}
              {reportName ? <strong>"{reportName}"</strong> : 'this report'}?
            </span>
            <span className="text-xs text-muted-foreground">
              Report generation will be stopped immediately. This action cannot be undone.
            </span>
          </div>
        }
        confirmButton={
          <Button variant="destructive" disabled={isCancelling}>
            {isCancelling ? 'Cancelling...' : 'Cancel Report'}
          </Button>
        }
        cancelButton={<Button variant="outline">Back</Button>}
      />
    </>
  );
}

export { CancelReport };
export default CancelReport;
