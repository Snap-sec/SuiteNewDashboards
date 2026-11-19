import React, { useState } from 'react';
import { Layers, GitBranch, Box, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Modal } from '@/components/custom/modal';
import CustomSelect from '@/components/custom/select';
import TimePicker from '@/components/custom/time-picker';

import { useGetScaProjectsQuery } from '@/services/sca/projectsApi';
import { useGetScaContainerImagesQuery } from '@/services/sca/containerImagesApi';
import { useCreateScaScanConfigMutation } from '@/services/sca/scansApi';

export function CreateScaScanModal({ onScanTriggered }) {
  const [isOpen, setIsOpen] = useState(false);
  const [targetType, setTargetType] = useState('all');
  const [selectedRepo, setSelectedRepo] = useState('');
  const [selectedImage, setSelectedImage] = useState('');

  // Scheduling state
  const [schedule, setSchedule] = useState('immediate');
  const [scanTime, setScanTime] = useState(null);
  const [weekDay, setWeekDay] = useState('monday');

  const { data: projectsData, isFetching: isFetchingRepos } = useGetScaProjectsQuery(
    { limit: 1000 },
    { skip: targetType !== 'repo' }
  );

  const { data: imagesData, isFetching: isFetchingImages } = useGetScaContainerImagesQuery(
    { limit: 1000 },
    { skip: targetType !== 'image' }
  );

  const [createScanConfig, { isLoading: isCreating }] = useCreateScaScanConfigMutation();

  const handleScan = async () => {
    if (targetType === 'repo' && !selectedRepo) {
      return toast.error('Please select a repository to scan.');
    }
    if (targetType === 'image' && !selectedImage) {
      return toast.error('Please select a container image to scan.');
    }

    try {
      let computedNextScan = new Date().toISOString();
      if (schedule === 'daily' && scanTime) {
        const scanTimeDate = new Date(scanTime);
        const nextRun = new Date();
        nextRun.setHours(scanTimeDate.getHours(), scanTimeDate.getMinutes(), 0, 0);

        if (nextRun <= new Date()) {
          nextRun.setDate(nextRun.getDate() + 1);
        }
        computedNextScan = nextRun.toISOString();
      }

      const payload = {
        name: `Scan ${targetType === 'all' ? 'Everything' : targetType === 'repo' ? 'Repository' : 'Image'}`,
        type: targetType,
        schedule: schedule,
        nextScan: computedNextScan,
      };

      if (schedule === 'daily') {
        payload.scanTime = scanTime;
      } else if (schedule === 'weekly') {
        payload.weekDay = weekDay;
      }

      if (targetType === 'repo') {
        payload.repos = [selectedRepo];
      } else if (targetType === 'image') {
        payload.images = [selectedImage];
      }

      await createScanConfig(payload).unwrap();
      toast.success('Scan initiated successfully.');

      if (onScanTriggered) onScanTriggered();
      setIsOpen(false);
    } catch (err) {
      toast.error(err?.data?.error || err?.data?.message || 'Failed to initiate scan.');
    }
  };

  const isScanning = isCreating;

  const reposOptions = (projectsData?.data?.projects || []).map((p) => ({
    label: p.repoName || p.name,
    value: p.id || p._id,
  }));

  const imagesOptions = (imagesData?.data?.images || []).map((img) => ({
    label: `${img.name}:${img.tag}`,
    value: img.id || img._id,
  }));

  return (
    <Modal
      open={isOpen}
      setOpen={(open) => {
        setIsOpen(open);
        if (!open) {
          setTargetType('all');
          setSelectedRepo('');
          setSelectedImage('');
          setSchedule('immediate');
          setScanTime(null);
          setWeekDay('monday');
        }
      }}
      title="Create Scan"
      description="Select what you want to scan for vulnerabilities and compliance issues."
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
      className="sm:max-w-[600px]"
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <Label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            Target Type
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              <CardTitle className="text-sm font-bold mb-1">Scan Everything</CardTitle>
              <CardDescription className="text-[11px] leading-relaxed text-muted-foreground/80">
                Run a full scan across all repositories and container images.
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
              <CardTitle className="text-sm font-bold mb-1">Scan Repository</CardTitle>
              <CardDescription className="text-[11px] leading-relaxed text-muted-foreground/80">
                Select a specific Git repository to scan for dependencies.
              </CardDescription>
            </Card>

            <Card
              className={`p-4 cursor-pointer transition-all duration-200 hover:bg-accent/50 ${targetType === 'image' ? 'border-primary ring-1 ring-primary/20 bg-accent/30' : 'border-border'
                }`}
              onClick={() => setTargetType('image')}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${targetType === 'image' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                  }`}
              >
                <Box className="w-5 h-5" />
              </div>
              <CardTitle className="text-sm font-bold mb-1">Scan Image</CardTitle>
              <CardDescription className="text-[11px] leading-relaxed text-muted-foreground/80">
                Select a specific container image to scan for vulnerabilities.
              </CardDescription>
            </Card>
          </div>
        </div>

        {targetType === 'repo' && (
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">Select Repository <span className="text-red-500">*</span></Label>
            <CustomSelect
              value={selectedRepo}
              onChange={(option) => setSelectedRepo(option?.value)}
              options={reposOptions}
              placeholder="Search and select a repository..."
              isSearching={isFetchingRepos}
            />
          </div>
        )}

        {targetType === 'image' && (
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-medium">Select Container Image <span className="text-red-500">*</span></Label>
            <CustomSelect
              value={selectedImage}
              onChange={(option) => setSelectedImage(option?.value)}
              options={imagesOptions}
              placeholder="Search and select an image..."
              isSearching={isFetchingImages}
            />
          </div>
        )}

        {targetType !== 'all' && (
          <Card className="p-4">
            {/* <CardTitle className="mb-4">Schedule Configuration</CardTitle> */}

            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Frequency <span className="text-red-500">*</span></Label>
              <CustomSelect
                placeholder="Select Frequency"
                options={[
                  { label: 'Immediate', value: 'immediate' },
                  { label: 'Daily', value: 'daily' },
                  { label: 'Weekly', value: 'weekly' },
                ]}
                value={schedule}
                onChange={(selected) => setSchedule(selected.value)}
              />
            </div>

            {schedule === 'daily' && (
              <div className="flex flex-col gap-2 mt-4">
                <Label className="text-sm text-muted-foreground">Time <span className="text-red-500">*</span></Label>
                <TimePicker
                  value={scanTime}
                  onChange={setScanTime}
                />
              </div>
            )}

            {schedule === 'weekly' && (
              <div className="flex flex-col gap-2 mt-4">
                <Label className="text-sm text-muted-foreground">Day of Week <span className="text-red-500">*</span></Label>
                <CustomSelect
                  placeholder="Select day"
                  value={weekDay}
                  options={[
                    { label: 'Monday', value: 'monday' },
                    { label: 'Tuesday', value: 'tuesday' },
                    { label: 'Wednesday', value: 'wednesday' },
                    { label: 'Thursday', value: 'thursday' },
                    { label: 'Friday', value: 'friday' },
                    { label: 'Saturday', value: 'saturday' },
                    { label: 'Sunday', value: 'sunday' },
                  ]}
                  onChange={(selected) => setWeekDay(selected.value)}
                />
              </div>
            )}
          </Card>
        )}
      </div>
    </Modal>
  );
}
