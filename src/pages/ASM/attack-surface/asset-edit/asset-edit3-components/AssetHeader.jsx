import { Globe, Monitor, Server, Wifi } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CreateExposureModal } from './modals/CreateExposureModal';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';

const AssetHeader = ({ asset }) => {
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

  const subdomainStatus = asset?.properties?.subdomain_status;
  const portStatus = asset?.properties?.port_status;

  const isPort = asset?.type === 'port';
  const displayValue = isPort
    ? `${asset?.ip || asset?.subdomain}:${asset?.value}`
    : (asset?.value || asset?.ip || asset?.domain || 'Unknown Asset');

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center size-12 rounded-lg bg-muted text-foreground shrink-0">
          {getIcon()}
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-foreground leading-tight">
              {displayValue}
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
            <Badge variant="secondary" appearance="outline" className="capitalize">
              {asset?.type}
            </Badge>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <AuthorityGuard forbidRoles={['Auditor']}>
          <CreateExposureModal asset={asset} />
        </AuthorityGuard>
      </div>
    </div>
  );
};

export default AssetHeader;
