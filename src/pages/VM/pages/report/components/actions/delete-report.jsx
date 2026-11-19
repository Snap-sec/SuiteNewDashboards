import { Trash } from 'lucide-react';
import { toast } from 'sonner';
import { useDeleteVmReportMutation } from '@/services/vm/reportApi';
import { Button } from '@/components/ui/button';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { CustomTooltip } from '../../../../../../components/custom/tooltip';

function DeleteReport({ reportName, reportId }) {
  const [deleteVmReport, { isLoading: isDeleting }] =
    useDeleteVmReportMutation();

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

  return (
    <CustomTooltip text="Delete Report">
    <ButtonWithConfirm
      disabled={isDeleting}
      variant="ghost"
      confirm={true}
      confirmOnInput={reportName}
      onConfirm={() => {
        if (isDeleting) return;
        deleteReport();
      }}
      confirmButton={
        <Button variant="destructive" disabled={isDeleting}>
          Proceed
        </Button>
      }
      cancelButton={<Button variant="outline">Cancel</Button>}
    >
      <Trash />
    </ButtonWithConfirm>
    </CustomTooltip>
  );
}

export default DeleteReport;
