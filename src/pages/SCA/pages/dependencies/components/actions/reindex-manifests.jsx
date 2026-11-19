import React from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useScanScaProjectMutation } from '@/services/sca/projectsApi';
import { Button } from '@/components/ui/button';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';

export function ReindexManifestsAction({ refetch, ...props }) {
  const [scanProject, { isLoading: isScanning }] = useScanScaProjectMutation();

  const handleReindex = async () => {
    toast.promise(scanProject('all').unwrap(), {
      loading:
        'Triggering recursive Git Tree manifest re-indexing for all repositories!',
      success: () => {
        refetch?.();
        return 'Triggered recursive Git Tree manifest re-indexing for all repositories!';
      },
      error: (error) => {
        refetch?.();
        return (
          error?.data?.error ||
          'Failed to trigger recursive Git Tree manifest re-indexing for all repositories!'
        );
      },
    });
  };

  return (
    <ButtonWithConfirm
      variant="outline"
      size="md"
      className="gap-2"
      disabled={isScanning}
      confirm={true}
      confirmTitle="Re-index Manifests"
      dialog="Are you sure you want to trigger recursive Git Tree manifest re-indexing for all repositories?"
      confirmVariant="info"
      confirmButton={<Button variant="primary">Proceed</Button>}
      cancelButton={<Button variant="outline">Cancel</Button>}
      onConfirm={handleReindex}
      {...props}
    >
      {isScanning ? (
        <>
          <Loader2 className="animate-spin size-4" />
          <span>Indexing...</span>
        </>
      ) : (
        <>
          <RefreshCw className="size-4" />
          <span>Re-Index Manifests</span>
        </>
      )}
    </ButtonWithConfirm>
  );
}

export default ReindexManifestsAction;
