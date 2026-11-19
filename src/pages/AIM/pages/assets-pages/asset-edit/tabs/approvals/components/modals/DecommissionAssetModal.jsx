import React, { useState } from 'react';
import { Modal } from '@/components/custom/modal';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

function DecommissionAssetModal({ open, setOpen, onConfirm, isLoading }) {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    if (!reason.trim()) return;
    onConfirm(reason);
  };

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title="Decommission Asset"
      description="Please provide a reason for decommissioning this asset."
    >
      <div className="flex flex-col gap-4 pt-2">
        <div className="space-y-2">
          <Label>
            Reason <span className="text-destructive">*</span>
          </Label>
          <Textarea
            placeholder="Enter reason here..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="min-h-[120px]"
            disabled={isLoading}
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button
            variant="outline"
            disabled={isLoading}
            onClick={() => {
              setOpen(false);
              setReason('');
            }}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={isLoading || !reason.trim()}
            onClick={handleConfirm}
          >
            {isLoading ? 'Decommissioning...' : 'Decommission Asset'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default DecommissionAssetModal;
