import { Button } from "@/components/ui/button";
import { ButtonWithConfirm } from "@/components/custom/button-with-confirmation";
import { Link2, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

import { useSendVsToVmMutation } from "@/services/vs/vsApi";
import { toast } from "sonner";
import { CustomTooltip } from "@/components/custom/tooltip";


function SendToVM({ row, onlyShowIcon = false }) {
    const navigate = useNavigate();

    const [sendToVm] = useSendVsToVmMutation();

    const handleSendToVm = () => {
        toast.promise(sendToVm({ vulnIds: [row.original?._id] }).unwrap(), {
            loading: "Sending to VM",
            error: (err) => err?.data?.message || err?.message || "Failed to send to VM",
            success: "Ticket created in VM"
        });
    }

    if (!row.original.sentToVm)
        return (
            <CustomTooltip text="Send to VM">
                <ButtonWithConfirm confirm={true} variant="ghost" onConfirm={() => handleSendToVm()}>
                    <Send />
                </ButtonWithConfirm>
            </CustomTooltip>
        )
    else
        return (
            <Badge className="cursor-pointer text-[10px]" onClick={() => window.open(`/vm/vulnerability-report?id=${row.original?.universalVulnId}&assessmentId=${row.original.assessmentId}`, "_blank")}>
                <Link2 /> {!onlyShowIcon && "View Ticket"}
            </Badge>
        )
}


export default SendToVM;