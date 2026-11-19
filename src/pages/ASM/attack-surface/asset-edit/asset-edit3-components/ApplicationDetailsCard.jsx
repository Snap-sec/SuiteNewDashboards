import { Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import InfoTable from './InfoTable';
import SectionCard from './SectionCard';

const ApplicationDetails = ({
  asset,
}) => {
  const application = asset?.application;

  if (!application) return null;

  const rows = [
    { label: 'Name', value: application.name, highlight: true },
    { label: 'App ID', value: application.appId, highlight: true },
    { label: 'Domain', value: application.domain, highlight: true },
    { label: 'App Type', value: application.appType, highlight: true },
    {
      label: 'Status',
      value: application.status,
      render: (val) =>
        val ? (
          <Badge
            variant={val === 'active' ? 'success' : 'secondary'}
            appearance="outline"
            size="sm"
          >
            {val}
          </Badge>
        ) : (
          '—'
        ),
    },
    { label: 'Source', value: application.source, highlight: true },
    {
      label: 'Allowed IDPs',
      value: application.allowedIdps?.length || 0,
    },
    {
      label: 'Policies',
      value: application.policies?.length || 0,
    },
    {
      label: 'Identity Providers',
      value: application.identityProviders?.length || 0,
    },
  ];

  return (
    <SectionCard
      icon={<Info className="size-4" />}
      iconColor="text-orange-500"
      title="Application Information"
    >
      <InfoTable rows={rows} />
    </SectionCard>
  );
};

export default ApplicationDetails;

