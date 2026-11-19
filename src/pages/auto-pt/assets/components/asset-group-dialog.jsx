import { useState } from 'react';
import { toast } from 'sonner';
import {
  useCreateAssetGroupMutation,
  useDeleteAssetGroupMutation,
  useGetAssetGroupQuery,
  useUpdateAssetGroupMutation,
} from '@/services/asset-inventory/assets/assetGroupsApi';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import AssetGroupAssetPicker from './asset-group-asset-picker';
import AssetGroupMembers from './asset-group-members';

function GroupForm({ group, onClose }) {
  const [selection, setSelection] = useState({});
  const [showAssets, setShowAssets] = useState(false);
  const assetIds = Object.keys(selection).filter((id) => selection[id]);
  const [name, setName] = useState(group?.name ?? '');
  const [description, setDescription] = useState(group?.description ?? '');
  const [icon, setIcon] = useState(group?.icon ?? '');
  const [create, { isLoading: creating }] = useCreateAssetGroupMutation();
  const [update, { isLoading: updating }] = useUpdateAssetGroupMutation();
  const [error, setError] = useState('');
  const busy = creating || updating;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (busy) return;
    if (name.trim().length < 2) {
      setError('Enter a group name with at least 2 characters.');
      return;
    }
    setError('');
    const body = {
      name: name.trim(),
      description: description.trim(),
      icon: icon.trim(),
    };
    try {
      if (group) await update({ id: group._id, body }).unwrap();
      else await create({ ...body, type: 'static', assetIds }).unwrap();
      toast.success(group ? 'Asset group updated' : 'Asset group created');
      onClose();
    } catch (err) {
      setError(err?.data?.message || 'Unable to save the asset group.');
    }
  };

  return (
    <div className="space-y-4">
      <form id="asset-group-form" onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="group-name">Group name</Label>
          <Input
            id="group-name"
            required
            minLength={2}
            maxLength={100}
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={busy}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="group-description">Description</Label>
          <Textarea
            id="group-description"
            maxLength={500}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            disabled={busy}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="group-icon">Icon URL (optional)</Label>
          <Input
            id="group-icon"
            placeholder="/icons/web.svg"
            value={icon}
            onChange={(event) => setIcon(event.target.value)}
            disabled={busy}
          />
        </div>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
      </form>
      {!group && (
        <section className="space-y-3" aria-label="Initial group assets">
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={() => setShowAssets(!showAssets)}
            aria-expanded={showAssets}
            aria-controls="initial-group-assets"
          >
            {showAssets ? 'Hide Asset Selection' : 'Add Assets (optional)'}
            {assetIds.length ? ` · ${assetIds.length} selected` : ''}
          </Button>
          {showAssets && (
            <div id="initial-group-assets">
              <AssetGroupAssetPicker
                selection={selection}
                setSelection={setSelection}
                disabled={busy}
              />
            </div>
          )}
        </section>
      )}
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={busy}
        >
          Cancel
        </Button>
        <Button type="submit" form="asset-group-form" disabled={busy}>
          {busy ? 'Saving…' : 'Save Group'}
        </Button>
      </div>
    </div>
  );
}

function DeleteGroup({ group, onClose }) {
  const [remove, { isLoading }] = useDeleteAssetGroupMutation();
  const [error, setError] = useState('');
  const handleDelete = async () => {
    if (isLoading) return;
    try {
      await remove(group._id).unwrap();
      toast.success('Asset group deleted');
      onClose();
    } catch (err) {
      setError(err?.data?.message || 'Unable to delete the asset group.');
    }
  };
  return (
    <div className="space-y-4">
      <p className="text-sm">
        Delete “{group.name}”? Its assets will remain in the catalog.
      </p>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isLoading}
        >
          {isLoading ? 'Deleting…' : 'Delete Group'}
        </Button>
      </div>
    </div>
  );
}

export default function AssetGroupDialog({ mode, group, onClose }) {
  const { currentData, isFetching, error, refetch } = useGetAssetGroupQuery(
    group?._id,
    { skip: mode === 'create' },
  );
  const detail = currentData?.data;
  const titles = {
    create: 'Create Asset Group',
    edit: 'Edit Asset Group',
    delete: 'Delete Asset Group',
    members: group?.name || 'Asset Group',
  };
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        className={
          mode === 'members' || mode === 'create'
            ? 'sm:max-w-4xl max-h-[90vh] overflow-y-auto'
            : 'sm:max-w-lg max-h-[90vh] overflow-y-auto'
        }
      >
        <DialogHeader>
          <DialogTitle>{titles[mode]}</DialogTitle>
          <DialogDescription>
            {mode === 'members'
              ? 'View group details and manage member assets.'
              : 'Organize assets and track their security posture.'}
          </DialogDescription>
        </DialogHeader>
        {mode !== 'create' && !detail ? (
          error ? (
            <div role="alert" className="space-y-3">
              <p>{error?.data?.message || 'Unable to load this group.'}</p>
              <Button variant="outline" onClick={refetch}>
                Retry
              </Button>
            </div>
          ) : (
            <Skeleton className="h-40 w-full" />
          )
        ) : mode === 'delete' ? (
          <DeleteGroup group={detail} onClose={onClose} />
        ) : mode === 'members' ? (
          <div className="space-y-4">
            {detail.description && (
              <p className="text-sm text-muted-foreground">
                {detail.description}
              </p>
            )}
            <div className="flex flex-wrap gap-4 text-sm">
              <span>{detail.asset_count ?? 0} assets</span>
              <span>{detail.vuln_counts?.total ?? 0} vulnerabilities</span>
              <span>{detail.remediation_progress ?? 0}% remediated</span>
              {isFetching && (
                <span className="text-muted-foreground">Updating…</span>
              )}
            </div>
            <AssetGroupMembers id={detail._id} />
          </div>
        ) : (
          <GroupForm
            group={mode === 'create' ? null : detail}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
