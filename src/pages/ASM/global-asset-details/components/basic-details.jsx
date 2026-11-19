import { AvatarGroup } from '@/partials/common/avatar-group';
import { Link, useNavigate } from 'react-router';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import {Progress} from "@/components/ui/progress"
import { Globe, Settings,MapPin,GitFork,FileBadge2,Users,LayoutPanelLeft,Server,CircleEllipsis } from 'lucide-react';




// Asset Icons
const assetTypeIcons = {
  subdomain: <Globe size={35}/>,
  repo: <GitFork size={35}/>,
  ip: <MapPin size={35}/>,
  employee: <Users size={35}/>,
  certificate: <FileBadge2 size={35}/>,
  dns: <LayoutPanelLeft size={35}/>,
  application: <Server size={35}/>,
  other: <CircleEllipsis size={35}/>,
};


const AssetNames = {
  subdomain: "Subdomain",
  repo: "Repository",
  ip: "IP Address",
  employee: "Employees",
  certificate: "Certificates",
  dns: "DNS Records",
  application: "Applications",
  other: "Others",
}



const BasicDetails = ({asset}) => {
  const navigate = useNavigate();


  const statistics = [
    {
      total: asset?.properties?.vulnerabilityStats?.total || 0,
      description: 'Total Vulnerabilities',
    },
    {
      total: asset?.risk?.autoRiskScore?.score || 0,
      description: 'Risk Score',
    },
    {
      total: asset?.risk?.exposure ? "Exposed" :"Safe",
      description: 'Exposure',
    },
    {
      total: asset?.environment || "Unknown",
      description: 'Environment',
    },
    {
      total: new Date(asset?.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
      description: 'Found on',
    },
  ];

  const renderItem = (statistic, index) => {
    return (
      <div
        key={index}
        className="flex flex-col gap-1.5 px-2.75 py-2.25 border border-dashed border-input rounded-md"
      >
        <span className="text-mono text-sm leading-none font-medium">
          {statistic.total}
        </span>
        <span className="text-secondary-foreground text-xs">
          {statistic.description}
        </span>
      </div>
    );
  };


  return (
    <Card>
      <CardContent className="lg:py-7.5">
        <div className="flex flex-wrap gap-7.5">
          <div className="flex flex-col gap-3 items-center justify-center size-[140px] rounded-xl ring-1 ring-border bg-secondary-clarity">
            <div>
              {assetTypeIcons[asset?.type]}
            </div>
            <span className="text-sm font-semibold text-mono">{AssetNames[asset?.type]}</span>
          </div>
          <div className="flex flex-col gap-5 lg:gap-7.5 grow">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-2xl font-semibold text-mono">
                   {asset?.value}
                  </h2>
                  <Badge size="md" variant={`${asset?.decommissioned === false ? "success" : "destructive"}`} appearance="outline">
                    {asset?.decommissioned === false ? "Active" : "Decommissioned"}
                  </Badge>
                </div>
                <p className="text-sm text-secondary-foreground">
                  {asset?.name}
                </p>
              </div>

            </div>
            <div className="flex items-center flex-wrap gap-3 lg:gap-5">
              {statistics.map((statistic, index) => {
                return renderItem(statistic, index);
              })}
            </div>
            <div className="flex flex-wrap gap-6 lg:gap-12">
              <div className="flex flex-col gap-3.5 grow">
                <div className="text-sm text-secondary-foreground">
                  Total of :{' '}
                  <span className="text-sm font-medium text-mono">
                    {asset?.properties?.closedVulns || 0} closed vulns from {asset?.properties?.openVulns + asset?.properties?.closedVulns || 0}
                  </span>
                </div>
                <Progress value={asset?.properties?.closedVulns !== undefined && asset?.properties?.openVulns !== undefined ? 
                  ((asset?.properties?.closedVulns / (asset?.properties?.openVulns + asset?.properties?.closedVulns)) * 100) : 0}/>
              </div>

            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { BasicDetails };
