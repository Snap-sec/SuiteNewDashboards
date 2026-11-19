import { Link2, RefreshCcw, SendHorizonal } from 'lucide-react';
import { toast } from 'sonner';
import { useSendVulnToVmMutation } from '@/services/apisec/vulnerabilityApi';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { CustomTooltip } from '@/components/custom/tooltip';
import { Button } from '@/components/ui/button';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';

function SendToVM({ row, iconOnly = true, disableSync }) {
  const [sendToVm, { isLoading: isSending }] = useSendVulnToVmMutation();

  const item = row?.original || row;
  const isDisabled = disableSync !== undefined ? disableSync : item?.projectId?.[0]?.vm_configuration_exists === false;

  const handleSendToVm = () => {
    toast.promise(
      sendToVm({ vulnId: row.original?._id || row?._id }).unwrap(),
      {
        loading: 'Sending to VM',
        error: (err) => {
          return err?.data?.message || 'Failed to send to VM';
        },
        success: 'Vuln sent to VM successful',
      },
    );
  };

  return item?.sentToVm ? (
    <Button
      className="cursor-pointer h-7 text-[11px] flex gap-1.5 items-center border-dashed"
      variant="outline"
      size="sm"
      onClick={() =>
        window.open(
          `/vm/vulnerability-report?id=${item?.universalVulnId}&assessmentId=${item?.assessmentId}`,
          '_blank',
        )
      }
    >
      <Link2 size={12} />
      View Ticket
    </Button>
  ) : (
    <AuthorityGuard forbidRoles={['Auditor']}>
      {isDisabled ? (
        <CustomTooltip text="Configure assessment in application setting">
          <span>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-[11px] flex gap-1.5 items-center border-dashed"
              disabled
            >
              <RefreshCcw size={12} />
              Create a Ticket
            </Button>
          </span>
        </CustomTooltip>
      ) : (
        <ButtonWithConfirm
          confirm={true}
          confirmTitle="Create Ticket in VM"
          dialog="Are you sure you want to send this vulnerability to Vulnerability Management (VM)? A new ticket will be created for centralized tracking, assessment, and remediation planning."
          confirmVariant="info"
          variant="outline"
          size="sm"
          className="h-7 text-[11px] flex gap-1.5 items-center border-dashed"
          onConfirm={() => handleSendToVm()}
          disabled={isSending}
        >
          <RefreshCcw size={12} className={isSending ? 'animate-spin' : ''} />
          Create a Ticket
        </ButtonWithConfirm>
      )}
    </AuthorityGuard>
  );
}

export default SendToVM;
