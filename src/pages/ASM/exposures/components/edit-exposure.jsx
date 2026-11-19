import { Modal } from "@/components/custom/modal";
import useStore from "../store";
import { Button } from "@/components/ui/button";
import { Edit, Upload } from "lucide-react";

import { Input } from "@/components/ui/input";
import Select from "@/components/custom/select";
import { useState } from "react";
import { useEffect } from "react";


import { useUpdateAsmExposureMutation } from "../../../../services/asm/exposureApi";
import { toast } from "sonner";
import { Textarea } from "../../../../components/ui/textarea";


const SEVERITY = [
    { label: "Critical", value: "critical" },
    { label: "High", value: "high" },
    { label: "Medium", value: "medium" },
    { label: "Low", value: "low" },
    { label: "Info", value: "info" },
]


function EditExposure() {

    const [updateExposure] = useUpdateAsmExposureMutation();

    const showEdit = useStore((state) => state.showEdit);
    const setShowEdit = useStore((state) => state.setShowEdit);
    const selectedExposure = useStore((state) => state.selectedExposure);

    const [updates, setUpdates] = useState({
        reason: selectedExposure?.reason || "",
        severity: selectedExposure?.severity || ""
    });

    useEffect(() => {
        if (selectedExposure)
            setUpdates({
                reason: selectedExposure.reason,
                severity: selectedExposure.severity
            })
    }, [selectedExposure]);


    const handleUpdate = () => {
        toast.promise(
            updateExposure({ exposureId: selectedExposure?._id, ...updates }).unwrap(),
            {
                loading: "Updating Exposure",
                success: () => {
                    setShowEdit(false);
                    return "Exposure updated";
                },
                error: "Failed to update exposure"
            }
        );
    }

    return (
        <Modal
            open={showEdit}
            setOpen={setShowEdit}
            title="Edit Exposure"
            footer={
                <div className="w-full flex items-center gap-2 justify-end">
                    <Button variant="blank" onClick={() => setShowEdit(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleUpdate}>
                        <Edit />
                        Update
                    </Button>
                </div>
            }
        >
            <div className="flex gap-1 flex-col">
                <p className="text-[12px] mb">Reason <span className="text-destructive">*</span></p>
                <Textarea placeholder="Reason" value={updates.reason} onChange={(e) => setUpdates(prev => ({ ...prev, reason: e.target.value }))} />

                <p className="text-[12px] mt-2">Severity <span className="text-destructive">*</span></p>
                <Select
                    defaultValue={updates.severity}
                    options={SEVERITY}
                    enableSearch={false}
                    onChange={option => setUpdates(prev => ({ ...prev, severity: option.value }))}
                />
            </div>
        </Modal>
    )
}


export default EditExposure;