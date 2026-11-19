import React from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';

export function RefreshPlanAction({ refetch, isLoading, isFetching, ...props }) {
  const handleRefresh = async () => {
    toast.promise(
      (async () => {
        if (refetch) {
          await refetch();
        }
      })(),
      {
        loading: 'Refreshing remediation action plan...',
        success: 'Remediation action plan refreshed successfully.',
        error: (err) =>
          err?.data?.error || 'Failed to refresh remediation action plan.',
      },
    );
  };

  const loading = isLoading || isFetching;

  return (
    <ButtonWithConfirm
      variant="outline"
      size="md"
      className="gap-2"
      disabled={loading}
      confirm={true}
      confirmTitle="Refresh Action Plan"
      dialog="Are you sure you want to refresh the remediation action plan?"
      confirmVariant="info"
      confirmButton={<Button variant="primary">Proceed</Button>}
      cancelButton={<Button variant="outline">Cancel</Button>}
      onConfirm={handleRefresh}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin size-4" />
          <span>Refreshing...</span>
        </>
      ) : (
        <>
          <RefreshCw className="size-4" />
          <span>Refresh Plan</span>
        </>
      )}
    </ButtonWithConfirm>
  );
}

export default RefreshPlanAction;
