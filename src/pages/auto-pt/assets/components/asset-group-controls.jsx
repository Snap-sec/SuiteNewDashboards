import { useState } from 'react';
import { MoreHorizontal, Plus, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import {
  useInitializeDefaultAssetGroupsMutation,
  useRecomputeAllAssetGroupsMutation,
  useRecomputeAssetGroupMutation,
} from '@/services/asset-inventory/assets/assetGroupsApi';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';

export function AssetGroupActions({ group, onAction }) {
  const [open, setOpen] = useState(false);
  const [recompute, { isLoading }] = useRecomputeAssetGroupMutation();
  const handleRecompute = async () => {
    try {
      await recompute(group._id).unwrap();
      toast.success('Group metrics refreshed');
    } catch (err) {
      toast.error(err?.data?.message || 'Unable to refresh group metrics.');
    }
  };
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0"
          disabled={isLoading}
          aria-label={`Actions for ${group.name}`}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => onAction({ mode: 'members', group })}>
          View Group Assets
        </DropdownMenuItem>
        <AuthorityGuard forbidRoles={['Auditor']}>
          <DropdownMenuItem onSelect={() => onAction({ mode: 'edit', group })}>
            Edit Group
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleRecompute} disabled={isLoading}>
            Refresh Metrics
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive"
            onSelect={() => onAction({ mode: 'delete', group })}
          >
            Delete Group
          </DropdownMenuItem>
        </AuthorityGuard>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AssetGroupToolbar({
  onCreate,
  hideCreateGrp = false, // hides createGroup btn
  hideDefaults = false, // hides Initilize Defaults btn
  hideRefreshMetrics = false, // hides Refresh Metrics btn 
}) {
  const [recompute, { isLoading: refreshing }] =
    useRecomputeAllAssetGroupsMutation();
  const [initialize, { isLoading: initializing }] =
    useInitializeDefaultAssetGroupsMutation();
  const busy = refreshing || initializing;
  const refresh = async () => {
    if (busy) return;
    try {
      await recompute().unwrap();
      toast.success('All group metrics refreshed');
    } catch (err) {
      toast.error(err?.data?.message || 'Unable to refresh group metrics.');
    }
  };
  const initDefaults = async () => {
    if (busy) return;
    try {
      await initialize().unwrap();
      toast.success('Default asset groups initialized');
    } catch (err) {
      toast.error(err?.data?.message || 'Unable to initialize default groups.');
    }
  };
  return (
    <AuthorityGuard forbidRoles={['Auditor']}>
      <div className="flex flex-wrap gap-2">
        {/* {!hideDefaults && (
          <ButtonWithConfirm
            confirm
            variant="outline"
            disabled={busy}
            onConfirm={initDefaults}
            confirmTitle="Initialize Default Groups?"
            dialog="Create and populate default groups for the asset types in your organization."
          >
            {initializing ? 'Initializing…' : 'Initialize Defaults'}
          </ButtonWithConfirm>
        )} */}

        {!hideRefreshMetrics && (
          <Button variant="primary" disabled={busy} onClick={refresh}>
            <RefreshCw className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Refreshing…' : 'Refresh Metrics'}
          </Button>
        )}

        {/* {!hideCreateGrp && (
          <Button onClick={onCreate}>
            <Plus />
            Create Group
          </Button>
        )} */}
      </div>
    </AuthorityGuard>
  );
}
