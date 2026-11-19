import { useState } from 'react';
import {
  Archive,
  ArchiveRestore,
  Copy,
  ExternalLink,
  Globe,
  Monitor,
  MoreHorizontal,
  Server,
  Trash,
  Wifi,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  useUpdateAimAssetMutation,
} from '@/services/asset-inventory/assets/assetsApi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Modal } from '@/components/custom/modal';
import { ConfirmDialog } from '@/components/custom/button-with-confirmation';

import Select from '@/components/custom/select';
import AuthorityGuard from '../../../../../../components/custom/authority-guard/AuthorityGuard';

const AssetHeader = ({ asset, isGlobal }) => {
  const workstation = asset?.workstation;

  const navigate = useNavigate();
  const [updateAsset, { isLoading: isUpdating }] = useUpdateAimAssetMutation();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [reason, setReason] = useState('');
  const [nextState, setNextState] = useState(null);


  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleUpdateAsset = (newState, reason = '') => {
    toast.promise(
      updateAsset({ id: asset?._id, body: { state: newState, reason: reason } })
        .unwrap()
        .then(() => navigate(-1)),
      {
        loading: 'Updating asset state...',
        success: 'Asset state updated successfully.',
        error: (err) => err?.data?.message || 'Failed to update asset state.',
      },
    );
  };

  const getIcon = () => {
    switch (asset?.type) {
      case 'subdomain':
        return <Globe className="size-6" />;
      case 'ip':
        return <Wifi className="size-6" />;
      case 'workstation':
        return <Monitor className="size-6" />;
      default:
        return <Server className="size-6" />;
    }
  };

  const stats = [];
  if (workstation) {
    stats.push(
      { label: 'PACKAGES', value: workstation?.packages?.length || 0 },
      { label: 'SERVICES', value: workstation?.services?.length || 0 },
      { label: 'PROCESSES', value: workstation?.processes?.length || 0 },
      { label: 'USERS', value: workstation?.users?.length || 0 },
    );
  } else {
    if (asset?.ports) stats.push({ label: 'PORTS', value: asset.ports.length });
    if (asset?.ips) stats.push({ label: 'IPs', value: asset.ips.length });
    if (asset?.dns) stats.push({ label: 'DNS', value: asset.dns.length });
    if (asset?.certificates)
      stats.push({ label: 'CERTS', value: asset.certificates.length });
    if (asset?.relations)
      stats.push({ label: 'RELATIONS', value: asset.relations.length });
  }

  const resolvedIp = asset?.ips?.[0]?.value;
  const osVersion = workstation?.os?.distribution
    ? `${workstation.os.distribution} ${workstation.os.version || ''}`
    : workstation?.os?.version || '';
  const subdomainStatus = asset?.subdomain?.status;

  const assetType = asset?.type?.toLowerCase()?.replace(/[-_\s]/g, '');
  const isLinkableType = assetType === 'subdomain' || assetType === 'webserver';
  const targetValue = asset?.value || asset?.name;
  const linkHref = targetValue
    ? targetValue.startsWith('http://') || targetValue.startsWith('https://')
      ? targetValue
      : `https://${targetValue}`
    : null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center size-12 rounded-lg bg-muted text-foreground shrink-0">
          {getIcon()}
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-foreground leading-tight">
              {asset?.name || asset?.value || 'Unknown Asset'}
            </h1>
            {isLinkableType && linkHref && (
              <a
                href={linkHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center p-1 rounded hover:bg-muted"
                title={`Open ${linkHref}`}
              >
                <ExternalLink className="size-4" />
              </a>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
            <Badge variant="secondary" appearance="outline">
              {asset?.type}
            </Badge>
            <span className="text-border">·</span>
            <span>ID: {asset?._id}</span>
          </div>

          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {/* {resolvedIp && (
              <Badge
                variant="primary"
                appearance="outline"
                size="sm"
                onClick={() => copyToClipboard(resolvedIp)}
              >
                <Copy className="size-2.5" />
                {resolvedIp}
              </Badge>
            )} */}
            {osVersion && (
              <Badge variant="success" appearance="outline" size="sm">
                {osVersion}
              </Badge>
            )}
            {subdomainStatus && (
              <Badge
                variant={subdomainStatus === 'active' ? 'success' : 'destructive'}
                appearance="outline"
                size="sm"
              >
                {subdomainStatus}
              </Badge>
            )}
            {asset?.subdomain?.has_waf && (
              <Badge variant="info" appearance="outline" size="sm">
                WAF Detected
              </Badge>
            )}
          </div>
        </div>
      </div>
      <AuthorityGuard forbidRoles={['Auditor']}>
        {!isGlobal && asset?.state !== 'decommissioned' && (
          <div className="w-[180px]">
            <Select
              value={asset?.state || 'pending'}
              options={[
                { label: 'Active', value: 'active' },
                { label: 'Pending', value: 'pending' },
                { label: 'Staged', value: 'staged' },
                // { label: 'Decommissioned', value: 'decommissioned' },
              ]}
              enableSearch={false}
              placeholder="Change State"
              onChange={(selected) => {
                if (selected.value === asset?.state) return;
                setNextState(selected.value);
                if (selected.value === 'staged') {
                  setShowReasonModal(true);
                } else {
                  setShowConfirm(true);
                }
              }}

            />
          </div>
        )}
      </AuthorityGuard>
      <ConfirmDialog
        open={showConfirm}
        setOpen={setShowConfirm}
        onConfirm={() => {
          if (nextState) handleUpdateAsset(nextState);
          setShowConfirm(false);
        }}
        title="Change Asset State"
        dialog={`Are you sure you want to change the state of this asset to ${nextState}?`}
        variant="warning"
      />

      <Modal

        open={showReasonModal}
        setOpen={setShowReasonModal}
        title="Stage Asset for Decommission"
        description="Please provide a reason for staging this asset for decommissioning. This will initiate an approval workflow."
      >
        <div className="flex flex-col gap-4 pt-2">
          <div className="space-y-2">
            <Label>Reason <span className="text-destructive">*</span></Label>
            <Textarea
              placeholder="Provide a justification for decommissioning..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[120px]"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowReasonModal(false);
                setReason('');
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={isUpdating || !reason.trim()}
              onClick={() => {
                handleUpdateAsset('staged', reason);
                setShowReasonModal(false);
                setReason('');
              }}
              appearance="primary"
            >
              {isUpdating ? 'Processing...' : 'Stage for Approval'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};


export default AssetHeader;
