import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function ImportRepoModal({
  isOpen,
  onOpenChange,
  handleImportSubmit,
  isImporting,
}) {
  const [importUrl, setImportUrl] = useState('');
  const [importBranch, setImportBranch] = useState('main');
  const [importEcosystem, setImportEcosystem] = useState('Node.js (npm)');

  useEffect(() => {
    if (!isOpen) {
      setImportUrl('');
      setImportBranch('main');
      setImportEcosystem('Node.js (npm)');
    }
  }, [isOpen]);

  const onSubmit = async () => {
    if (!importUrl?.trim()) {
      toast.error('Please enter a valid Git Repository URL');
      return;
    }

    await handleImportSubmit({
      importUrl: importUrl.trim(),
      importBranch: importBranch.trim() || 'main',
      importEcosystem,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[485px]">
        <DialogHeader>
          <DialogTitle className="text-mono font-medium">Import Repository for SCA Scanning</DialogTitle>
          <DialogDescription>
            Connect a Git repository or package registry to monitor open-source dependencies.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-foreground">Repository URL <span className="text-red-500">*</span></label>
            <Input
              placeholder="https://github.com/org/repository-name"
              value={importUrl}
              onChange={(e) => setImportUrl(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-foreground">Default Branch <span className="text-red-500">*</span></label>
            <Input
              placeholder="main"
              value={importBranch}
              onChange={(e) => setImportBranch(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-foreground">Package Ecosystem <span className="text-red-500">*</span></label>
            <Select value={importEcosystem} onValueChange={setImportEcosystem}>
              <SelectTrigger>
                <SelectValue placeholder="Select Ecosystem" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Node.js (npm)">Node.js (npm/yarn)</SelectItem>
                <SelectItem value="Python (PyPI)">Python (PyPI/pip)</SelectItem>
                <SelectItem value="Java (Maven)">Java (Maven/Gradle)</SelectItem>
                <SelectItem value="Go Modules">Go Modules</SelectItem>
                <SelectItem value="Rust (Cargo)">Rust (Cargo)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={onSubmit} disabled={isImporting}>
            {isImporting ? <Loader2 className="animate-spin size-4 mr-1" /> : 'Start Scanning'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
