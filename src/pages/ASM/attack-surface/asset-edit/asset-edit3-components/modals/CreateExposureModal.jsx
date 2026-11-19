import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/custom/modal';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useCreateAsmExposureMutation } from '@/services/asm/exposureApi';
import { Plus } from 'lucide-react';

export function CreateExposureModal({ asset }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [severity, setSeverity] = useState('high');
  const [state, setState] = useState('In Review');

  const [createExposure, { isLoading }] = useCreateAsmExposureMutation();

  const handleReset = () => {
    setReason('');
    setSeverity('high');
    setState('In Review');
  };

  const handleSubmit = async () => {
    if (!reason.trim()) {
      return toast.error('Please provide a reason');
    }

    const payload = {
      associatedAsset: {
        type: asset.type,
        value: asset.value || asset.subdomain || asset.domain,
        subdomain: asset.subdomain || asset.value
      },
      reason,
      severity,
      state,
      marked_by: 'human'
    };

    toast.promise(createExposure(payload).unwrap(), {
      loading: 'Creating exposure...',
      success: () => {
        setIsModalOpen(false);
        handleReset();
        return 'Exposure created successfully';
      },
      error: (err) => err?.data?.message || 'Failed to create exposure',
    });
  };

  return (
    <Modal
      open={isModalOpen}
      setOpen={(open) => {
        setIsModalOpen(open);
        if (!open) handleReset();
      }}
      title="Create Manual Exposure"
      description="Manually create a new exposure record for this asset."
      trigger={
        <Button variant="outline" className="gap-2">
          <Plus className="w-4 h-4" /> Create Exposure
        </Button>
      }
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button
            variant="outline"
            onClick={() => {
              setIsModalOpen(false);
              handleReset();
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Exposure'}
          </Button>
        </div>
      }
      className="sm:max-w-md"
    >
      <div className="flex flex-col gap-4 py-4">
        <div className="flex flex-col gap-2">
          <Label>Reason</Label>
          <Textarea
            placeholder="e.g. Manual penetration testing revealed..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Severity</Label>
          <Select value={severity} onValueChange={setSeverity}>
            <SelectTrigger>
              <SelectValue placeholder="Select severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="info">Info</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label>State</Label>
          <Select value={state} onValueChange={setState}>
            <SelectTrigger>
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="In Review">In Review</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Modal>
  );
}
