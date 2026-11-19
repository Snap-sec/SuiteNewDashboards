import React from 'react';
import { toast } from 'sonner';
import { useDeleteScaProjectMutation } from '@/services/sca/projectsApi';
import { ConfirmDialogWithInput } from '@/components/custom/button-with-confirmation';

export default function DeleteRepositoryDialog({
  open,
  setOpen,
  repository,
  onSuccess,
}) {
  const [deleteScaProject] = useDeleteScaProjectMutation();

  const repoName = repository?.name || repository?.repoName || '';
  const repoId = repository?.id || repository?._id;

  if (!repository && !open) return null;

  const handleDeleteRepository = async () => {
    if (!repoId) {
      toast.error('Repository ID not found.');
      return;
    }
    toast.promise(deleteScaProject(repoId).unwrap(), {
      loading: `Removing repository '${repoName}'...`,
      success: () => {
        onSuccess?.();
        return `Repository '${repoName}' removed from SCA inventory.`;
      },
      error: (err) =>
        err?.data?.error || `Failed to delete repository '${repoName}'.`,
    });
  };

  return (
    <ConfirmDialogWithInput
      open={open}
      setOpen={setOpen}
      variant="destructive"
      title="Delete Repository?"
      confirmInput={repoName}
      onConfirm={handleDeleteRepository}
      dialog={`This will permanently remove "${repoName}" and all its scan data. This action cannot be undone.`}
    />
  );
}

export { DeleteRepositoryDialog };
