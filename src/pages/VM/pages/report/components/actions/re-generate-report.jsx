import { RefreshCcw, Trash } from 'lucide-react';
import { toast } from 'sonner';
import {
  useDeleteVmReportMutation,
  useReGenerateVmReportMutation,
} from '@/services/vm/reportApi';
import { Button } from '@/components/ui/button';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { CustomTooltip } from '../../../../../../components/custom/tooltip';

function ReGenerateReport({ reportName, reportId }) {
  const [reGenerateVmReport, { isLoading: isRegenerating }] =
    useReGenerateVmReportMutation();

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

  return (
    <CustomTooltip text="Regenerate Report">
      <ButtonWithConfirm
        disabled={isRegenerating}
        variant="ghost"
        confirm={true}
        confirmOnInput={reportName}
        onConfirm={() => {
          if (isRegenerating) return;
          regenerateReport();
        }}
        confirmButton={
          <Button variant="destructive" disabled={isRegenerating}>
            Proceed
          </Button>
        }
        cancelButton={<Button variant="outline">Cancel</Button>}
      >
        <RefreshCcw className="h-4 w-4" />
      </ButtonWithConfirm>
    </CustomTooltip>
  );
}

export default ReGenerateReport;
