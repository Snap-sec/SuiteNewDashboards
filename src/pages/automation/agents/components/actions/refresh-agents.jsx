import { useCallback, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useRefreshAutomationAgentsMutation } from '@/services/automation/agentsApi';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/custom/button-with-confirmation';

const RefreshAgents = () => {
  const [refreshSkills, { isLoading: isSyncing }] =
    useRefreshAutomationAgentsMutation();

  const [isSyncConfirmOpen, setIsSyncConfirmOpen] = useState(false);

  const handleSyncSkills = useCallback(async () => {
    try {
      await refreshSkills().unwrap();
      toast.success('Skills synced successfully');
    } catch (err) {
      toast.error(
        err?.data?.message || err?.message || 'Failed to sync skills',
      );
    } finally {
      setIsSyncConfirmOpen(false);
    }
  }, [refreshSkills]);

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsSyncConfirmOpen(true)}
        disabled={isSyncing}
        className="gap-2"
      >
        <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
        {isSyncing ? 'Syncing...' : 'Sync Agents'}
      </Button>

      <ConfirmDialog
        open={isSyncConfirmOpen}
        setOpen={setIsSyncConfirmOpen}
        onConfirm={handleSyncSkills}
        variant="warning"
        title="Sync Agents"
        dialog="Are you sure you want to sync Agents? This will refresh all skills from the server."
        confirmButton={
          <Button disabled={isSyncing} className="gap-2">
            <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
            {isSyncing ? 'Syncing...' : 'Sync Agents'}
          </Button>
        }
      />
    </>
  );
};

export default RefreshAgents;
