import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ButtonWithConfirm } from "@/components/custom/button-with-confirmation";
import { useSendVulnToVmMutation, useSuppressApiSecVulnMutation, useUnsuppressApiSecVulnMutation } from "@/services/apisec/vulnerabilityApi";
import { toast } from "sonner";

const ThreatActions = ({ row }) => {
  const vuln = row.original;
  
  const [sendToVm, { isLoading: isSending }] = useSendVulnToVmMutation();
  const [suppressVuln, { isLoading: isSuppressing }] = useSuppressApiSecVulnMutation();
  const [unsuppressVuln, { isLoading: isUnsuppressing }] = useUnsuppressApiSecVulnMutation();

  const handleSendToVm = () => {
    toast.promise(
      sendToVm({ vulnId: vuln?._id }).unwrap(),
      {
        loading: 'Sending to VM',
        error: (err) => err?.data?.message || 'Failed to send to VM',
        success: 'Vulnerability sent to VM successfully',
      }
    );
  };

  const handleSuppressVuln = () => {
    toast.promise(suppressVuln({ vulnId: vuln?._id }).unwrap(), {
      loading: 'Suppressing Vulnerability',
      error: (err) => err?.data?.message || 'Failed to suppress vulnerability',
      success: 'Vulnerability suppressed successfully',
    });
  };

  const handleUnsuppressVuln = () => {
    toast.promise(unsuppressVuln({ vulnId: vuln?._id }).unwrap(), {
      loading: 'Unsuppressing Vulnerability',
      error: (err) => err?.data?.message || 'Failed to unsuppress vulnerability',
      success: 'Vulnerability unsuppressed successfully',
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-3.5 w-3.5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        {vuln?.sentToVm ? (
          <Button
            variant="ghost"
            onClick={() => window.open(`/vm/vulnerability-report?id=${vuln?.universalVulnId}&assessmentId=${vuln?.assessmentId}`, '_blank')}
            className="w-full justify-start px-2 py-1.5 h-auto font-normal text-[0.8125rem] rounded-md hover:bg-accent text-left bg-transparent"
          >
            View Ticket
          </Button>
        ) : (
          <ButtonWithConfirm
            confirm={true}
            variant="ghost"
            disabled={isSending}
            onConfirm={handleSendToVm}
            className="w-full justify-start px-2 py-1.5 h-auto font-normal text-[0.8125rem] rounded-md hover:bg-accent text-left bg-transparent"
          >
            Send to VM
          </ButtonWithConfirm>
        )}

        <ButtonWithConfirm
          confirm={true}
          variant="ghost"
          disabled={isSuppressing || isUnsuppressing}
          onConfirm={vuln?.isSuppressed ? handleUnsuppressVuln : handleSuppressVuln}
          className="w-full justify-start px-2 py-1.5 h-auto font-normal text-[0.8125rem] rounded-md hover:bg-accent text-left bg-transparent"
        >
          {vuln?.isSuppressed ? "Unsuppress" : "Suppress"}
        </ButtonWithConfirm>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThreatActions;
