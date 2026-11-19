import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useRefreshAimAdapterByTypeMutation } from '@/services/asset-inventory/adaptersApi';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';

const RefreshVmAdapter = ({ adapterType = 'vm' }) => {
  const [refreshAimAdapterByType, { isLoading }] =
    useRefreshAimAdapterByTypeMutation();

  const handleRefresh = async () => {
    toast.promise(refreshAimAdapterByType({ adapterType }).unwrap(), {
      loading: 'Refreshing VM adapter...',
      success: 'VM adapter refreshed successfully',
      error: (err) => {
        return err?.data?.message || 'Failed to refresh VM adapter';
      },
    });
  };

  return (
    <ButtonWithConfirm
      confirm
      mode="link"
      variant="primary"
      underlined="dashed"
      disabled={isLoading}
      onConfirm={handleRefresh}
      confirmVariant="warning"
      confirmTitle="Refresh Adapter?"
      dialog="This will trigger a full re-sync for this adapter. Existing asset data may be updated or overwritten. Are you sure you want to continue?"
    >
      <RefreshCw className={isLoading ? 'animate-spin' : ''} />
      Refresh Catalog
    </ButtonWithConfirm>
  );
};

export default RefreshVmAdapter;
