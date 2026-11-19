import { useState, useEffect } from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { useUpdateVmVulnMutation } from '../../../../../../services/vm/vulnerabilityApi';
import InputWithCopy from '../../../../../../components/custom/input-with-copy';
import { Switch } from '@/components/ui/switch';
import { CustomTooltip } from '@/components/custom/tooltip';
function Share({ ReportDetail, assessmentId, vulnId }) {
  const [enabled, setEnabled] = useState(false);
  const [updateVmVuln, { isLoading }] = useUpdateVmVulnMutation();

  // Sync initial state when ReportDetail is loaded
  useEffect(() => {
    if (typeof ReportDetail?.vulnTokenSwitch === 'boolean') {
      setEnabled(ReportDetail.vulnTokenSwitch);
    }
  }, [ReportDetail]);

  const handleSwitchChange = async (checked) => {
    setEnabled(checked);

    try {
      await updateVmVuln({
        assessmentId,
        vulnId,
        body: {
          vulnTokenSwitch: checked,
        },
      }).unwrap();

      toast.success(`Sharing ${checked ? 'enabled' : 'disabled'} successfully.`);
    } catch (error) {
      toast.error('Failed to update sharing status.');
      setEnabled((prev) => !prev); // revert switch state on failure
    }
  };

  return (
    <TableRow>
      <TableCell className="py-3 text-secondary-foreground font-normal">
        Share Report
      </TableCell>

      <TableCell className="py-2 text-foreground font-normal text-sm">
        <InputWithCopy value={`http://127.0.0.1:5173/public/share-report?id=${ReportDetail?.vulnToken}`} />
      </TableCell>

      <TableCell className="py-3 text-center">
        <CustomTooltip text="Public Access">
            <Switch
            checked={enabled}
            onCheckedChange={handleSwitchChange}
            disabled={isLoading}
            variant="primary"
            shape="pill"
            size="md"
            />
        </CustomTooltip>
      </TableCell>
    </TableRow>
  );
}

export default Share;
