import { useState } from 'react';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Modal } from '@/components/custom/modal';
import { CustomTooltip } from '@/components/custom/tooltip';
import { StatusBadge } from '../../../../../components/custom/status-badge';

function UnderstandingState() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Modal
      open={isOpen}
      setOpen={setIsOpen}
      title="Understand States"
      description="Learn more about the different states a threat can be in."
      className="w-[600px]"
      trigger={
        <Button className=" text-xs" mode="link">
          <CustomTooltip text="Understand States">
            <Info className=" text-black dark:text-white cursor-pointer" />
          </CustomTooltip>
        </Button>
      }
    >
      <Table
        className="align-middle text-sm text-muted-foreground"
        id="general_info_table"
      >
        <TableBody>
          <TableRow>
            <TableCell>
              <StatusBadge status="pending" />
            </TableCell>
            <TableCell>
              The threat has been identified but not yet reviewed. Awaiting
              triage or attention from the team.
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>
              <StatusBadge status="acknowledged" />
            </TableCell>
            <TableCell>
              The threat has been reviewed and confirmed as valid. It awaits
              remediation or risk mitigation.
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>
              <StatusBadge status="risk_accepted" />
            </TableCell>
            <TableCell>
              The risk from this threat has been accepted. No further action
              will be taken unless the conditions change.
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>
              <StatusBadge status="rejected" />
            </TableCell>
            <TableCell>
              The threat was analyzed and deemed invalid. No action is required.
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell className="w-[140px]">
              <StatusBadge status="need_more_info" />
            </TableCell>
            <TableCell>
              Additional information is needed to properly assess this threat.
              Waiting for more details or clarification.
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>
              <StatusBadge status="in_progress" />
            </TableCell>
            <TableCell>
              The development team is actively working on fixing or mitigating
              this threat.
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>
              <StatusBadge status="fixed" />
            </TableCell>
            <TableCell>
              A fix has been applied, but verification of its effectiveness is
              still pending.
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell>
              <StatusBadge status="fix_verified" />
            </TableCell>
            <TableCell>
              The fix has been tested and verified. The threat is considered
              resolved and closed.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Modal>
  );
}

export default UnderstandingState;
