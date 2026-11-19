import { useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import appConfig from '@/config/appConfig';
import { useDeleteVmReportMutation, useReGenerateVmReportMutation } from '@/services/vm/reportApi';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator,DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';


const ReportListDropdown = ({ row }) => {
  const [open, setOpen] = useState(false);
  const report = row.original;
  const status = report?.status;
  const reportId = report?.reportId;
  const reportName = report?.name;

  const [deleteVmReport, { isLoading: isDeleting }] = useDeleteVmReportMutation();
  const [reGenerateVmReport, { isLoading: isRegenerating }] = useReGenerateVmReportMutation();

  const deleteReport = () => {
    toast.promise(deleteVmReport(reportId).unwrap(), {
      loading: 'Deleting Report',
      success: 'Report Deleted Successfully',
      error: (err) => {
        console.log(err);
        return err?.data?.message || 'Failed to delete the Report';
      },
    });
  };

  const regenerateReport = () => {
    toast.promise(reGenerateVmReport(reportId).unwrap(), {
      loading: 'Regenerating Report',
      success: 'Report Regenerated Successfully',
      error: (err) => {
        console.log(err);
        return err?.data?.message || 'Failed to regenerate the Report';
      },
    });
  };

  const downloadReport = () => {
    const downloadReportURL = `${appConfig.BASE_URL}/csm/api/reports/${reportId}/download`;
    window.location.href = downloadReportURL;
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[150px]" side="bottom" align="end">
        {status === 'failed' ? (
          <DropdownMenuItem asChild>
            <ButtonWithConfirm
              disabled={isRegenerating}
              variant="ghost"
              confirm={true}
              confirmOnInput={reportName}
              onConfirm={() => {
                if (isRegenerating) return;
                regenerateReport();
                setOpen(false);
              }}
              confirmButton={
                <Button variant="primary" disabled={isRegenerating}>
                  Proceed
                </Button>
              }
              cancelButton={<Button variant="outline">Cancel</Button>}
              className="w-full justify-start !font-normal !hover:bg-transparent !bg-transparent !text-inherit px-2 py-1.5 text-sm h-8"
            >
              <span>Regenerate</span>
            </ButtonWithConfirm>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={() => {
              if (status === 'completed') {
                downloadReport();
                setOpen(false);
              }
            }}
            disabled={status !== 'completed'}
            className="cursor-pointer"
          >
            Download
          </DropdownMenuItem>
        )}

        
        <AuthorityGuard roles={['Admin']}>
        <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <AuthorityGuard forbidRoles={['Auditor']}>
              <ButtonWithConfirm
                disabled={isDeleting}
                variant="ghost"
                confirm={true}
                dialog="This action requires confirmation, click Delete to proceed."
                confirmOnInput={reportName}
                onConfirm={() => {
                  if (isDeleting) return;
                  deleteReport();
                  setOpen(false);
                }}
                confirmButton={
                  <Button variant="destructive" disabled={isDeleting}>
                    Delete
                  </Button>
                }
                cancelButton={<Button variant="outline">Cancel</Button>}
                className="w-full justify-start !font-normal hover:bg-red-200/20 px-2 py-1.5 text-sm h-8"
              >
                <span className="text-destructive">Delete</span>
              </ButtonWithConfirm>
            </AuthorityGuard>
          </DropdownMenuItem>
        </AuthorityGuard>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ReportListDropdown;