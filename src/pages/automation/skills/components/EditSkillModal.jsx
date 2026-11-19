import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/custom/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function EditSkillModal({
  open,
  setOpen,
  skill,
  onUpdateSkill,
  isLoading,
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (open && skill) {
      setName(skill.name || '');
      setDescription(skill.description || '');
    }
  }, [open, skill]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter a skill name');
      return;
    }

    const formattedName = name.trim().toLowerCase().replace(/\s+/g, '-');

    try {
      await onUpdateSkill({
        skillId: skill?._id || skill?.id,
        name: formattedName,
        description: description.trim(),
      });
      setOpen(false);
    } catch (err) {
      // Error handled in caller or mutation toast
    }
  };

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title="Edit Skill"
      description="Update the name and description of this skill package."
      className="sm:max-w-xl"
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
            autoFocus
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-2sm font-medium text-foreground">Description</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Evaluates cloud IAM policies for excessive privileges and security risks"
            rows={6}
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
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
