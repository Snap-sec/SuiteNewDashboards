import { EllipsisVertical, Globe, Layers, Server, Webhook } from 'lucide-react';
import { Link } from 'react-router';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { AvatarGroup } from '@/components/common/avatar-group';
import { CustomAvatarGroup } from '@/components/custom/avatar-group';
import { DateFormatter } from '@/components/custom/date-formatter';
import { StatusBadge } from '@/components/custom/status-badge';
import { VulnerabilityLables } from '@/components/custom/vulnerability-labels';
import { AccountActions } from './dropdown-actions';
import VulnerabilitiesBadges from '@/components/custom/vulnerabilities-badges';


const CardProject = ({
  name,
  description,
  lastScan,
  team,
  id,
  status,
  isLoading = false,
  latestScan = {},
  logo,
  configuration = {},
  isConfigured,
  vulnerabilities
}) => {
  if (isLoading) {
    return (
      <Card className="p-7.5">
        <div className="flex items-center justify-between mb-3 lg:mb-6">
          <Skeleton className="size-[50px] rounded-lg" />
        </div>
        <div className="flex flex-col mb-3 lg:mb-6">
          <Skeleton className="h-5 w-40 mb-2" />
          <Skeleton className="h-4 w-3/4 mb-4" />
          <div className="flex items-center gap-1.5 mt-2">
            <Skeleton className="h-5 w-12 rounded-md" />
            <Skeleton className="h-5 w-12 rounded-md" />
            <Skeleton className="h-5 w-12 rounded-md" />
            <Skeleton className="h-5 w-12 rounded-md" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-7.5 hover:scale-[1.01] transition-all">
      <div className="flex items-center justify-between mb-3 lg:mb-6">
        <div className="flex items-center justify-center size-[50px] rounded-lg bg-accent/60 p-2">
          {logo ? (
            <img src={logo} alt={name} className="w-full h-full object-contain" />
          ) : (
            <Globe className="text-xl text-blue-500" />
          )}
        </div>
        {/* {status ? (
          <StatusBadge
            status={status}
            progress={latestScan?.progress}
            showProgress={true}
          />
        ) : (
          <StatusBadge status="Not Scanned" />
        )} */}
      </div>
      <div className="flex flex-col mb-3 lg:mb-6">
        <p className="font-medium mb-px">
          {name}
        </p>
        <span className="text-sm l">
          {description}
        </span>
        {vulnerabilities && (
          <div className="mt-4 flex justify-start">
            <VulnerabilitiesBadges vulnerabilities={vulnerabilities} assetName={name} />
          </div>
        )}
      </div>

      {/* <div className="flex items-center gap-5 mb-3.5 lg:mb-7 mt-4 justify-between">
        <span className="text-sm text-secondary-foreground">
          Last Scan :{' '}
          {lastScan ? (
            <span className="text-sm font-medium text-foreground">
              <DateFormatter date={lastScan} />
            </span>
          ) : (
            <span className="text-sm font-medium text-foreground">
              Never Scanned
            </span>
          )}
        </span>
        <CustomAvatarGroup
          emails={team?.map((member) => member.email)}
          size={4}
        />
      </div> */}


      {/* {(latestScan?.metrics?.total_critical_vulns ||
        latestScan?.metrics?.total_high_vulns ||
        latestScan?.metrics?.total_medium_vulns ||
        latestScan?.metrics?.total_low_vulns ||
        latestScan?.metrics?.total_info_vulns) ? (
        <div className="flex flex-col ">
          Vulnerabilities:
          <VulnerabilityLables items={[
            { number: latestScan?.metrics?.total_critical_vulns, label: 'C' },
            { number: latestScan?.metrics?.total_high_vulns, label: 'H' },
            { number: latestScan?.metrics?.total_medium_vulns, label: 'M' },
            { number: latestScan?.metrics?.total_low_vulns, label: 'L' },
            { number: latestScan?.metrics?.total_info_vulns, label: 'I' },
          ].filter(item => item.number > 0)} />
        </div>
      ) : null} */}
    </Card>
  );
};

export { CardProject };