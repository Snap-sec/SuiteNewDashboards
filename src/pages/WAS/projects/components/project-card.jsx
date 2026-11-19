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
import { ProjectActions } from './dropdown-actions';


const CardProject = ({
  name,
  description,
  lastScan,
  team,
  id,
  status,
  isLoading = false,
  latestScan = {},
  configuration = {},
  isConfigured
}) => {
  if (isLoading) {
    return (
      <Card className="p-7.5">
        <div className="flex items-center justify-between mb-3 lg:mb-6">
          <Skeleton className="size-[50px] rounded-lg" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="flex flex-col mb-3 lg:mb-6">
          <Skeleton className="h-5 w-40 mb-2" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="flex items-center gap-5 mb-3.5 lg:mb-7 mt-4 justify-between">
          <Skeleton className="h-4 w-32" />
          <div className="flex -space-x-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Link to={`/was/projects/${id}?tab=${isConfigured ? 'metrics' : 'settings'}`} className="hover:scale-[1.01] transition-all">
      <Card className="p-7.5">
        <div className="flex items-center justify-between mb-3 lg:mb-6">
          <div className="flex items-center justify-center size-[50px] rounded-lg bg-accent/60">
            {configuration?.target_type == "api" ? <Server className="text-xl text-amber-600" /> : <Globe className="text-xl text-blue-500" />}
          </div>
          {status ? (
            <StatusBadge 
              status={status} 
              progress={latestScan?.progress}
              showProgress={true}
            />
          ) : (
            <StatusBadge status="Not Scanned" />
          )}
        </div>
        <div className="flex flex-col mb-3 lg:mb-6">
          <p className="text-lg font-media/brand text-mono hover:text-primary-active mb-px">
            {name}
          </p>
          <span className="text-sm text-secondary-foreground break-all">
            {description}
          </span>
        </div>

        <div className="flex items-center gap-5 mb-3.5 lg:mb-7 mt-4 justify-between">
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
        </div>


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
    </Link>
  );
};

export { CardProject };