import React, { useState } from 'react';
import { Layers, GitBranch, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Modal } from '@/components/custom/modal';
import CustomSelect from '@/components/custom/select';

import { useGetSastProjectsQuery } from '@/services/sast/projectsApi';
import { useCreateSastScanMutation } from '@/services/sast/scansApi';

export function CreateScaScanModal({ onScanTriggered }) {
  const [isOpen, setIsOpen] = useState(false);
  const [targetType, setTargetType] = useState('all');
  const [selectedRepo, setSelectedRepo] = useState('');

  const { data: projectsData, isFetching: isFetchingRepos } = useGetSastProjectsQuery(
    { limit: 1000 },
    { skip: targetType !== 'repo' }
  );

  const [createSastScan, { isLoading: isCreating }] = useCreateSastScanMutation();

  const handleScan = async () => {
    if (targetType === 'repo' && !selectedRepo) {
      return toast.error('Please select a project repository to scan.');
    }

    try {
      const payload = {
        targetType: targetType === 'repo' ? 'repository' : targetType,
        targetIds: targetType === 'all' ? [] : [selectedRepo],
      };

      await createSastScan(payload).unwrap();
      toast.success('SAST scan initiated successfully.');

      if (onScanTriggered) onScanTriggered();
      setIsOpen(false);
    } catch (err) {
      toast.error(err?.data?.error || err?.data?.message || 'Failed to initiate SAST scan.');
    }
  };

  const isScanning = isCreating;

  const rawProjects = projectsData?.data?.projects || projectsData?.data?.data || projectsData?.data || projectsData?.projects || [];
  const reposOptions = (Array.isArray(rawProjects) ? rawProjects : []).map((p) => ({
    label: p.repoName || p.name || p.title || p.id,
    value: p.id || p._id,
  }));

  return (
    <Modal
      open={isOpen}
      setOpen={(open) => {
        setIsOpen(open);
        if (!open) {
          setTargetType('all');
          setSelectedRepo('');
        }
      }}
      title="Create SAST Scan"
      description="Select what you want to scan for static code vulnerabilities."
      trigger={
        <Button variant="outline" size="md" className="gap-2">
          <Plus className="size-4" />
          <span>Create Scan</span>
        </Button>
      }
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleScan} disabled={isScanning}>
            {isScanning ? <Loader2 className="size-4 animate-spin mr-1" /> : <Plus className="size-4 mr-1" />}
            {isScanning ? 'Initiating...' : 'Run Scan'}
          </Button>
        </div>
      }
      className="sm:max-w-[500px]"
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Target Scope
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card
              className={`p-4 cursor-pointer transition-all duration-200 hover:bg-accent/50 ${targetType === 'all' ? 'border-primary ring-1 ring-primary/20 bg-accent/30' : 'border-border'
                }`}
              onClick={() => setTargetType('all')}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${targetType === 'all' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                  }`}
              >
                <Layers className="w-5 h-5" />
              </div>
              <CardTitle className="text-sm font-bold mb-1">Scan All</CardTitle>
              <CardDescription className="text-[11px] leading-relaxed text-muted-foreground/80">
                Run a SAST scan across all code projects and repositories.
              </CardDescription>
            </Card>

            <Card
              className={`p-4 cursor-pointer transition-all duration-200 hover:bg-accent/50 ${targetType === 'repo' ? 'border-primary ring-1 ring-primary/20 bg-accent/30' : 'border-border'
                }`}
              onClick={() => setTargetType('repo')}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${targetType === 'repo' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                  }`}
              >
                <GitBranch className="w-5 h-5" />
              </div>
              <CardTitle className="text-sm font-bold mb-1">Select Project</CardTitle>
              <CardDescription className="text-[11px] leading-relaxed text-muted-foreground/80">
                Select a specific target project to run SAST code scanning.
              </CardDescription>
            </Card>
          </div>
        </div>

        {targetType === 'repo' && (
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">Select Project <span className="text-red-500">*</span></Label>
            <CustomSelect
              value={selectedRepo}
              onChange={(option) => setSelectedRepo(option?.value)}
              options={reposOptions}
              placeholder="Search and select a project..."
              isSearching={isFetchingRepos}
            />
          </div>
        )}
      </div>
    </Modal>
  );
}
