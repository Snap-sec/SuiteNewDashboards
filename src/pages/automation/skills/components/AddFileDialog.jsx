import React, { useState } from 'react';
import { Modal } from '@/components/custom/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileCode, FolderPlus, FilePlus } from 'lucide-react';
import { toast } from 'sonner';

export default function AddFileDialog({
  open,
  setOpen,
  onAddFile,
  folders = [],
}) {
  const [fileName, setFileName] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState(folders[0]?.id || 'root');
  const [content, setContent] = useState('');

  const handleSave = () => {
    if (!fileName.trim()) {
      toast.error('Please enter a file name');
      return;
    }

    const trimmedName = fileName.trim();
    const isJson = trimmedName.endsWith('.json');
    const isMd = trimmedName.endsWith('.md');
    const language = isJson ? 'json' : isMd ? 'markdown' : 'text';

    onAddFile({
      name: trimmedName,
      folderId: selectedFolderId,
      content: content.trim() || (isJson ? '{\n  \n}' : ''),
      language,
      size: `${Math.max(12, content.length)} B`,
    });

    toast.success(`File "${trimmedName}" created`);
    setFileName('');
    setContent('');
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title="Add New File"
      description="Create a new payload, example, or resource file inside this skill package."
      className="sm:max-w-md"
    >
      <div className="space-y-4 py-2">
        <div className="space-y-1.5">
          <Label className="text-2sm font-medium text-foreground">File Name</Label>
          <Input
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="e.g. test_case.json or guide.md"
            className="text-sm"
          />
        </div>

        {folders.length > 0 && (
          <div className="space-y-1.5">
            <Label className="text-2sm font-medium text-foreground">Destination Folder</Label>
            <select
              value={selectedFolderId}
              onChange={(e) => setSelectedFolderId(e.target.value)}
              className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm text-foreground shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="root">Root (cloud_iam_policy_validator)</option>
              {folders.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="space-y-1.5">
          <Label className="text-2sm font-medium text-foreground">Initial Content (optional)</Label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter file contents..."
            rows={5}
            className="text-sm font-mono"
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave}>
            Create File
          </Button>
        </div>
      </div>
    </Modal>
  );
}
