import { ExternalLink, Info } from 'lucide-react';
import { timeAgo, formatDateTime } from '@/lib/helpers';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import InfoTable from './InfoTable';
import SectionCard from './SectionCard';
import RelationsSection from './RelationsSection';
import OpenPortsSection from './OpenPortsSection';

const GeneralInfoSection = ({ asset }) => {
  const normalizedType = asset?.type?.toLowerCase()?.replace(/[-_\s]/g, '');
  const isLinkableType = normalizedType === 'subdomain' || normalizedType === 'webserver';

  const rawUrl = asset?.value || asset?.subdomain || asset?.domain || '';
  const linkHref = rawUrl
    ? rawUrl.startsWith('http://') || rawUrl.startsWith('https://')
      ? rawUrl
      : `https://${rawUrl}`
    : null;

  const rows = [
    { label: 'Asset ID', value: asset?._id, highlight: true },
    {
      label: 'Value',
      value: asset?.value,
      highlight: true,
      render: (val) => {
        if (!val) return '—';
        return (
          <div className="flex items-center gap-2">
            <span className="font-medium">{val}</span>
            {isLinkableType && linkHref && (
              <Button
                asChild
                variant="ghost"
                size="xs"
              >
                <a href={linkHref} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="size-3.5" />
                </a>
              </Button>
            )}
          </div>
        );
      },
    },
    {
      label: 'Type',
      value: asset?.type,
      render: (val) =>
        val ? (
          <Badge variant="primary" appearance="outline" size="sm" className="capitalize">
            {val}
          </Badge>
        ) : (
          '—'
        ),
    },
    { label: 'Domain', value: asset?.domain },
    { label: 'Subdomain', value: asset?.subdomain },
    { label: 'IP Address', value: asset?.ip },
    {
      label: 'Network Scope',
      value: asset?.network_scope,
      render: (val) => val ? (
        <Badge variant={val === 'external' ? 'warning' : 'success'} appearance="outline" size="sm" className="capitalize">
          {val}
        </Badge>
      ) : '—'
    },
    { label: 'Is New', value: asset?.isNew ? 'Yes' : 'No' },
    {
      label: 'Created At',
      value: asset?.createdAt ? `${timeAgo(asset.createdAt)} (${formatDateTime(asset.createdAt)})` : '—',
      highlight: true,
    },
    {
      label: 'Last Updated',
      value: asset?.updatedAt ? `${timeAgo(asset.updatedAt)} (${formatDateTime(asset.updatedAt)})` : '—',
      highlight: true,
    },
    {
      label: 'First Found',
      value: asset?.first_found ? `${timeAgo(asset.first_found)} (${formatDateTime(asset.first_found)})` : '—',
      highlight: true,
    },
  ].filter(r => r.value !== undefined && r.value !== null && r.value !== '');

  const patchedAsset = { ...asset };

  // Map associatedAssets to the format expected by RelationsSection
  if (!patchedAsset.relations && patchedAsset.associatedAssets) {
    patchedAsset.relations = patchedAsset.associatedAssets.map(a => {
      let relationStr = 'Related To';
      if (a.type === 'dns') relationStr = 'Has Record';
      else if (a.type === 'ip') relationStr = 'Resolves To';
      else if (a.type === 'port') relationStr = 'Has Port';
      else if (a.type === 'subdomain') relationStr = 'Has Subdomain';

      return {
        relation: relationStr,
        child: a,
        parent: asset
      };
    });
  }

  // Filter associatedAssets for ports for the OpenPortsSection
  if (!patchedAsset.ports && patchedAsset.associatedAssets) {
    patchedAsset.ports = patchedAsset.associatedAssets.filter(a => a.type === 'port');
  }

  return (
    <div className="flex flex-col gap-6">
      <SectionCard
        icon={<Info className="size-4" />}
        iconColor="text-orange-500"
        title="General Information"
      >
        <InfoTable rows={rows} />
      </SectionCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <RelationsSection asset={patchedAsset} />
      {normalizedType !== 'port' && <OpenPortsSection asset={patchedAsset} />}
      </div>
    </div>
  );
};

export default GeneralInfoSection;
