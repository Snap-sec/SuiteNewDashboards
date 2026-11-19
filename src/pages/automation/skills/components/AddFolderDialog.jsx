import React, { useState } from 'react';
import { Modal } from '@/components/custom/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function AddFolderDialog({
  open,
  setOpen,
  onAddFolder,
}) {
  const [folderName, setFolderName] = useState('');

  const handleSave = () => {
    if (!folderName.trim()) {
      toast.error('Please enter a folder name');
      return;
    }

    const trimmed = folderName.trim().replace(/[^a-zA-Z0-9_-]/g, '_');
    onAddFolder(trimmed);
    toast.success(`Folder "${trimmed}" created`);
    setFolderName('');
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title="Create New Folder"
      description="Add a directory to organize examples, resources, or tests."
      className="sm:max-w-md"
    >
      <div className="space-y-4 py-2">
        <div className="space-y-1.5">
          <Label className="text-2sm font-medium text-foreground">Folder Name</Label>
          <Input
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="e.g. schemas, tests, templates"
            className="text-sm font-mono"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSave();
              }
            }}
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave}>
            Create Folder
          </Button>
        </div>
      </div>
    </Modal>
  );
}
