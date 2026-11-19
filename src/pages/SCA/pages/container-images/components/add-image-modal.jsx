import React, { useState } from 'react';
import { Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/custom/modal';
import { Input } from '@/components/ui/input';
import CustomSelect from '@/components/custom/select';
import { useImportScaContainerImageMutation } from '@/services/sca/containerImagesApi';

export function AddImageModal() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [imageUri, setImageUri] = useState('');
  const [imageTag, setImageTag] = useState('latest');
  const [selectedRegistry, setSelectedRegistry] = useState('Docker Hub');

  const [importContainerImage, { isLoading: isImporting }] = useImportScaContainerImageMutation();

  const handleReset = () => {
    setImageUri('');
    setImageTag('latest');
    setSelectedRegistry('Docker Hub');
  };

  const handleAddImageSubmit = async () => {
    if (!imageUri.trim()) {
      toast.error('Please enter a valid Container Image URI');
      return;
    }

    try {
      await importContainerImage({
        name: imageUri.includes('/') ? imageUri : `library/${imageUri}`,
        tag: imageTag || 'latest',
        registry: selectedRegistry,
      }).unwrap();

      toast.success(`Container image '${imageUri}:${imageTag}' imported and scan queued!`);
      setIsAddModalOpen(false);
      handleReset();
    } catch (err) {
      toast.error(err?.data?.error || 'Failed to import container image.');
    }
  };

  return (
    <Modal
      open={isAddModalOpen}
      setOpen={(open) => {
        setIsAddModalOpen(open);
        if (!open) {
          handleReset();
        }
      }}
      title="Add Container Image"
      description="Register a Docker container image from Docker Hub, GHCR, AWS ECR, or private registries."
      trigger={
        <Button variant="outline" size="md" className="gap-2">
          <Plus className="size-4" />
          <span>Add Image</span>
        </Button>
      }
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddImageSubmit} disabled={isImporting}>
            {isImporting ? <Loader2 className="animate-spin size-4 mr-1" /> : null}
            {isImporting ? 'Adding...' : 'Add & Scan Image'}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-foreground">Container Image Name / URI</label>
          <Input
            placeholder="e.g. nginx, snapsec/api-backend, or gcr.io/org/app"
            value={imageUri}
            onChange={(e) => setImageUri(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-foreground">Image Tag or Digest</label>
          <Input
            placeholder="latest or v1.0.0"
            value={imageTag}
            onChange={(e) => setImageTag(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-foreground">Target Registry</label>
          <CustomSelect
            value={selectedRegistry}
            onChange={(option) => setSelectedRegistry(option?.value)}
            placeholder="Select Registry"
            enableSearch={false}
            options={[
              { value: 'Docker Hub', label: 'Docker Hub (Public/Private)' },
              { value: 'GitHub (GHCR)', label: 'GitHub Container Registry (GHCR)' },
              { value: 'AWS ECR', label: 'AWS Elastic Container Registry (ECR)' },
              { value: 'GitLab Registry', label: 'GitLab Container Registry' },
              { value: 'Private Registry', label: 'Private OCI Registry' },
            ]}
          />
        </div>
      </div>
    </Modal>
  );
}
