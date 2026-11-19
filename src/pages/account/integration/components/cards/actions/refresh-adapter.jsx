import { RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useRefreshApisecIntegrationMutation } from '@/services/apisec/integrationApi';

function RefreshActvAdapter({ adapterId }) {
  const [refreshIntegration, { isLoading: isRefreshing }] =
    useRefreshApisecIntegrationMutation();

  const refreshActvAdapter = () => {
    const integrationId = adapterId;
    toast.promise(refreshIntegration({ integrationId }).unwrap(), {
      loading: 'Refreshing Adapter',
      success: 'Adapter Refreshed Successfully',
      error: 'Failed to Refresh an Adapter',
    });
  };

  return (
    <Button
      onClick={refreshActvAdapter}
      disabled={isRefreshing}
      variant="outline"
    >
      <RefreshCcw /> Refresh
    </Button>
  );
}

export default RefreshActvAdapter;
