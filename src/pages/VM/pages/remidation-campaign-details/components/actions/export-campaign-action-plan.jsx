import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { useExportVmRemidationCampaignActionPlanMutation } from '@/services/vm/remidationCampaignApi';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinners';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { CustomTooltip } from '@/components/custom/tooltip';

export default function ExportCampaignActionPlan({
  campaignId,
  iconOnly = false,
  ...props
}) {
  const [exportActionPlan, { isLoading: isExporting }] =
    useExportVmRemidationCampaignActionPlanMutation();

  const handleExport = () => {
    const downloadPromise = async () => {
      const blob = await exportActionPlan(campaignId).unwrap();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `remediation-campaign-action-plan-${campaignId}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      return 'Export successful';
    };

    toast.promise(downloadPromise(), {
      loading: 'Exporting Remediation Campaign...',
      success: 'Remediation Campaign Exported Successfully',
      error: 'Failed to export Remediation Campaign',
    });
  };

  return (
    <CustomTooltip text="Export Action Plan">
      <div>
        <ButtonWithConfirm
          disabled={isExporting}
          variant="outline"
          confirm={true}
          onConfirm={() => handleExport()}
          confirmVariant="info"
          confirmTitle="Export Action Plan?"
          dialog="This will generate and download the action plan for this remediation campaign. Proceed?"
          confirmButton={<Button variant="primary">Proceed</Button>}
          cancelButton={<Button variant="outline">Cancel</Button>}
          className={iconOnly ? 'text-secondary-foreground' : 'flex'}
          {...props}
        >
          {isExporting ? (
            <Spinner className="w-4 h-4 animate-spin" />
          ) : iconOnly ? (
            <Download className="size-4" />
          ) : (
            <div className="font-normal flex gap-2 w-full items-center">
              <Download className="size-4" />
            </div>
          )}
        </ButtonWithConfirm>
      </div>
    </CustomTooltip>
  );
}
