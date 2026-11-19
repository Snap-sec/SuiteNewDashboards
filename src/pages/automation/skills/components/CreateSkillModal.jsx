import React, { useState } from 'react';
import { Modal } from '@/components/custom/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function CreateSkillModal({
  open,
  setOpen,
  onCreateSkill,
  isLoading,
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleReset = () => {
    setName('');
    setDescription('');
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter a skill name');
      return;
    }

    const formattedName = name.trim().toLowerCase().replace(/\s+/g, '-');

    try {
      await onCreateSkill({
        name: formattedName,
        description: description.trim(),
      });
      handleReset();
      setOpen(false);
    } catch (err) {
      // Error handled in parent
    }
  };

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title="Create New Skill Package"
      description="Define a new autonomous skill. The backend will automatically template SKILL.md, resources/, and examples/."
      className="sm:max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        <div className="space-y-1.5">
          <Label className="text-2sm font-medium text-foreground">
            Skill Name <span className="text-destructive">*</span>
          </Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. cloud-iam-policy-validator"
            className="text-sm font-mono"
            autoFocus
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-2sm font-medium text-foreground">Description</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Evaluates cloud IAM policies for excessive privileges and security risks"
            rows={3}
            className="text-sm"
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Skill'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
