import { Modal } from "@/components/custom/modal";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { TriangleAlert } from "lucide-react";
import { useState } from "react";


function ReasonModal({ onDecommission, trigger, title, description, showWarning = false, open, setOpen }) {
    const [reason, setReason] = useState("");

    return (
        <Modal
            open={open}
            setOpen={setOpen}
            title={title ? title : "Reason for Decommissioning"}
            description={description ? description : "Why is this asset being decommissioned"}
            trigger={trigger}
            footer={
                <Button onClick={() => {
                    onDecommission(reason);
                    setOpen(false);
                    setReason("");
                }}>Confirm</Button>
            }
        >
            <div className="flex flex-col gap-3">
                {showWarning && (
                    <div className="flex items-start gap-2.5 rounded-md border border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/40 px-3.5 py-3 text-amber-800 dark:text-amber-400">
                        <TriangleAlert className="size-3 shrink-0 mt-0.5" />
                        <p className="text-[11px] leading-snug">
                            If the asset is decommissioned, all of its vulnerabilities will be resolved.
                        </p>
                    </div>
                )}
                <Textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Enter reason..."
                    rows={3}
                />
            </div>
        </Modal>
    )
}


export default ReasonModal;
