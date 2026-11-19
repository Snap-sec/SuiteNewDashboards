import React, { useState } from 'react';
import {
    Trash2,
    TriangleAlert,
    Edit3,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import Select from '@/components/custom/select';
import FloatingCard from '@/components/custom/floating-card';
import { Input } from '@/components/ui/input';
import {
    useBulkDeleteAsmExposureMutation,
    useBulkUpdateAsmExposureMutation,
} from '@/services/asm/exposureApi';
import useStore from '../store';

const SEVERITY_OPTIONS = [
    { label: 'Critical', value: 'critical' },
    { label: 'High', value: 'high' },
    { label: 'Medium', value: 'medium' },
    { label: 'Low', value: 'low' },
    { label: 'Info', value: 'info' },
];

function AsmBulkUpdate({ exposures }) {
    const [bulkUpdate, { isLoading: isUpdating }] = useBulkUpdateAsmExposureMutation();
    const [bulkDelete, { isLoading: isDeleting }] = useBulkDeleteAsmExposureMutation();
    const rowSelection = useStore((state) => state.rowSelection);
    const setRowSelection = useStore((state) => state.setRowSelection);

    const selectedExposures = exposures?.filter(
        (exposure) => rowSelection[exposure._id]
    );

    const [showSeveritySelect, setShowSeveritySelect] = useState(false);
    const [showReasonInput, setShowReasonInput] = useState(false);

    const [selectedSeverity, setSelectedSeverity] = useState(null);
    const [reason, setReason] = useState('');

    const exposureIds = Object.keys(rowSelection).filter((id) => rowSelection[id]);

    // BUILD PAYLOAD FOR UPDATE
    let updateField = {};
    if (selectedSeverity) updateField.severity = selectedSeverity.value;
    if (reason) updateField.reason = reason;

    const handleBulkUpdate = async () => {
        if (!exposureIds.length || !Object.keys(updateField).length) return;

        toast.promise(bulkUpdate({ exposureIds, ...updateField }).unwrap(), {
            loading: 'Updating exposures...',
            success: (data) => {
                setRowSelection(() => ({}));
                return data?.message || 'Bulk update successful';
            },
            error: (e) => e?.data?.message || 'Bulk update failed',
        });
    };

    const handleBulkDelete = async () => {
        if (!exposureIds.length) return;
        toast.promise(bulkDelete(exposureIds).unwrap(), {
            loading: 'Deleting exposures...',
            success: (data) => {
                setRowSelection(() => ({}));
                return data?.message || 'Bulk delete successful';
            },
            error: (e) => {
                setRowSelection(() => ({}));
                return e?.data?.message || 'Bulk delete failed';
            },
        });
    };

    return (
        <FloatingCard
            position="sticky-bottom"
            updateButton={{
                text: isUpdating ? 'Updating...' : `Update ${selectedExposures?.length} Exposures`,
                onClick: handleBulkUpdate,
                disabled:
                    isUpdating || !exposureIds.length || !Object.keys(updateField).length,
            }}
        >
            <div className="flex flex-wrap items-center justify-between w-full gap-4">
                <div className="flex flex-wrap gap-4">

                    {/* SEVERITY */}
                    <div>
                        {showSeveritySelect ? (
                            <Select
                                options={SEVERITY_OPTIONS}
                                placeholder="Select Severity"
                                className="w-40"
                                enableSearch={false}
                                onChange={setSelectedSeverity}
                            />
                        ) : (
                            <Button variant="outline" onClick={() => setShowSeveritySelect(true)}>
                                <TriangleAlert className="w-4 h-4" />
                                Severity
                            </Button>
                        )}
                    </div>

                    {/* REASON */}
                    <div className="flex items-center gap-2">
                        {showReasonInput ? (
                            <Input
                                placeholder="Enter Reason"
                                className="w-60 h-9"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            />
                        ) : (
                            <Button variant="outline" onClick={() => setShowReasonInput(true)}>
                                <Edit3 className="w-4 h-4" />
                                Reason
                            </Button>
                        )}
                    </div>
                </div>

                {/* DELETE BUTTON */}
                <ButtonWithConfirm
                    disabled={isDeleting}
                    variant="ghost"
                    confirm={true}
                    onConfirm={handleBulkDelete}
                    className="text-destructive hover:text-destructive hover:!bg-red-300/20"
                    confirmButton={<Button variant="primary">Proceed</Button>}
                    cancelButton={<Button variant="outline">Cancel</Button>}
                >
                    <Trash2 size={14} className="text-destructive" />
                </ButtonWithConfirm>
            </div>
        </FloatingCard>
    );
}

export default AsmBulkUpdate;
