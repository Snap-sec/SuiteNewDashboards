import React from 'react';
import { RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useSyncAsmRuleMutation } from '@/services/asm/ruleApi';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { Spinner } from '@/components/ui/spinners';

function SyncRules() {
  const [syncRules, { isLoading: isSyncing }] = useSyncAsmRuleMutation();

  const handleSyncRules = () => {
    toast.promise(syncRules().unwrap(), {
      loading: 'Syncing rules...',
      success: 'Rules synced successfully',
      error: 'Failed to sync rules',
    });
  };

  return (
    <ButtonWithConfirm
      disabled={isSyncing}
      onConfirm={handleSyncRules}
      variant="outline"
      confirm
      dialog={
        <p>
          Are you sure you want to sync rules? This will update the rule set
          from the server.
        </p>
      }
    >
      {isSyncing ? (
        <Spinner className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <RefreshCcw className="w-4 h-4 mr-2" />
      )}
      {isSyncing ? 'Syncing...' : 'Sync'}
    </ButtonWithConfirm>
  );
}

export default SyncRules;
