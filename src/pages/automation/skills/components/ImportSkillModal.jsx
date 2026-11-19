import React, { useState, useRef } from 'react';
import { Modal } from '@/components/custom/modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Upload, FileArchive, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useImportSkillZipMutation } from '@/services/automation/skillsApi';

function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default function ImportSkillModal({ open, setOpen, onSuccess }) {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const [importSkillZip, { isLoading }] = useImportSkillZipMutation();

  const handleReset = () => {
    setFile(null);
    setName('');
    setDescription('');
    setIsDragging(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSelectFile = (selectedFile) => {
    if (!selectedFile) return;

    if (!selectedFile.name.toLowerCase().endsWith('.zip')) {
      toast.error('Only .zip archive packages are supported');
      return;
    }

    setFile(selectedFile);

    // Auto-suggest skill name from zip filename if not already set
    if (!name) {
      const suggestedName = selectedFile.name
        .replace(/\.zip$/i, '')
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, '-');
      setName(suggestedName);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      handleSelectFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target?.files && e.target.files.length > 0) {
      handleSelectFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!file) {
      toast.error('Please select a skill .zip archive to upload');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    if (name.trim()) {
      formData.append('name', name.trim());
    }
    if (description.trim()) {
      formData.append('description', description.trim());
    }

    try {
      const res = await importSkillZip(formData).unwrap();
      const skillName = res?.data?.name || name || file.name;
      toast.success(`Skill "${skillName}" uploaded and queued for processing!`);
      handleReset();
      setOpen(false);
      if (onSuccess) {
        onSuccess(res?.data || res);
      }
    } catch (err) {
      toast.error(err?.data?.message || err?.message || 'Failed to import skill zip package');
    }
  };

  return (
    <Modal
      open={open}
      setOpen={(val) => {
        if (!isLoading) {
          if (!val) handleReset();
          setOpen(val);
        }
      }}
      title="Import Skill Package"
      description="Upload a .zip archive containing your skill bundle. The package must contain a SKILL.md file and will be unzipped automatically."
      className="sm:max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        <input
          ref={fileInputRef}
          type="file"
          accept=".zip,application/zip,application/x-zip-compressed"
          onChange={handleFileInputChange}
          className="hidden"
        />

        {/* File Dropzone Area */}
        {!file ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'flex flex-col items-center justify-center border-2 border-dashed rounded-xl py-8 px-6 text-center cursor-pointer transition-all duration-200 select-none',
              isDragging
                ? 'border-primary bg-primary/5 scale-[0.99]'
                : 'border-border/70 hover:border-primary/50 hover:bg-muted/10 bg-card/40'
            )}
          >
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3">
              <Upload className="w-5 h-5" />
            </div>

            <p className="text-sm font-medium text-foreground">
              Drop skill .zip archive here or{' '}
              <span className="text-primary hover:underline font-medium">browse</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Supports .zip archives up to 50MB with root SKILL.md
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-card/60 text-sm gap-3">
            <div className="flex items-center gap-3 truncate">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <FileArchive className="w-5 h-5" />
              </div>
              <div className="flex flex-col truncate text-left">
                <span className="truncate font-medium text-foreground text-sm">
                  {file.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </span>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isLoading}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive shrink-0"
              onClick={handleRemoveFile}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Optional Name Override */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label className="text-2sm font-medium text-foreground">
              Skill Name <span className="text-muted-foreground text-xs font-normal">(Optional Override)</span>
            </Label>
          </div>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. cloud-iam-policy-validator"
            className="text-sm font-mono"
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground">
            Defaults to the name in SKILL.md frontmatter or the zip filename.
          </p>
        </div>

        {/* Optional Description Override */}
        <div className="space-y-1.5">
          <Label className="text-2sm font-medium text-foreground">
            Description <span className="text-muted-foreground text-xs font-normal">(Optional)</span>
          </Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Autonomous skill for analyzing security vulnerabilities"
            rows={2}
            className="text-sm"
            disabled={isLoading}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              handleReset();
              setOpen(false);
            }}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={!file || isLoading} className="gap-2">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Importing...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Import Skill</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
