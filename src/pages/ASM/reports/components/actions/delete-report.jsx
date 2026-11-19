import { Trash } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { useDeleteAsmReportMutation } from '../../../../../services/asm/reportsApi';

function DeleteReport({ reportName, reportId, isDisabled }) {



  console.log("XXXXXXXXXXXXXX", reportId)
  const [deleteAsmReport, { isLoading: isDeleting }] =
    useDeleteAsmReportMutation();

  const deleteReport = () => {
    toast.promise(deleteAsmReport(reportId).unwrap(), {
      loading: 'Deleting Report',
      success: 'Report Deleted Successfully',
      error: 'Failed to delete the Report',
    });
  };

  return (
    <ButtonWithConfirm
      disabled={isDisabled || isDeleting}
      variant="ghost"
      confirm={true}
      confirmOnInput={reportName}
      onConfirm={() => (isDeleting ? null : deleteReport())}
      confirmButton={
        <Button variant="primary" disabled={isDeleting}>
          Proceed
        </Button>
      }
      cancelButton={<Button variant="outline">Cancel</Button>}
    >
      <Trash />
    </ButtonWithConfirm>
  );
}

export default DeleteReport;
