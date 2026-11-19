import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Modal } from '@/components/custom/modal';
import { toast } from 'sonner';

export default function EditAgentInfoModal({
  open,
  setOpen,
  agent,
  agentName: propAgentName,
  setAgentName: propSetAgentName,
  agentDescription: propAgentDescription,
  setAgentDescription: propSetAgentDescription,
  onSave,
  isSaving,
}) {
  const [localName, setLocalName] = useState(agent?.name || '');
  const [localDescription, setLocalDescription] = useState(agent?.description || '');

  const name = propAgentName !== undefined ? propAgentName : localName;
  const setName = propSetAgentName || setLocalName;

  const description = propAgentDescription !== undefined ? propAgentDescription : localDescription;
  const setDescription = propSetAgentDescription || setLocalDescription;

  useEffect(() => {
    if (open) {
      setName(agent?.name || propAgentName || '');
      setDescription(agent?.description || propAgentDescription || '');
    }
  }, [open, agent]);

  const handleDone = () => {
    if (!name?.trim()) {
      toast.error('Agent name cannot be empty');
      return;
    }
    if (onSave) {
      onSave({ name: name.trim(), description: description?.trim() || '' });
    } else {
      setOpen(false);
      toast.success('Agent details updated');
    }
  };

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title="Edit Agent Details"
      description="Update the name and public description for this logical agent."
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setOpen(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleDone}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      }
    >
      <div className="space-y-3.5 py-1">
        <div className="space-y-1.5">
          <Label className="text-2sm font-medium">Agent Name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Vulnerability Triage Agent"
            className="text-sm h-8.5"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-2sm font-medium">Description</Label>
          <Textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the agent's responsibilities and workflows..."
            className="text-sm resize-none"
          />
        </div>
      </div>
    </Modal>
  );
}
