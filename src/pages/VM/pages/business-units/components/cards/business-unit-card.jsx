import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import ProfileImage from '@/components/common/profile-image';
import { VulnerabilityLables } from '@/components/custom/vulnerability-labels';
import { Profile } from '@/components/custom/profile';
import { DateFormatter } from '@/components/custom/date-formatter';
import RemediationProgress from '@/pages/VM/pages/assets/components/ui/remediation-progress';
import SeverityLabel from '@/components/custom/severity-label';
import { LayoutGrid } from 'lucide-react';


export function BusinessUnitCardSkeleton() {
  return (
    <Card className="h-[250px]">
      <CardContent className="p-5 flex flex-col justify-between h-full">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-lg shrink-0" />
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
          <Skeleton className="h-6 w-20 shrink-0" />
        </div>

        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-2 w-full rounded" />
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>

        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-7 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}

export function BusinessUnitCard({ unit }) {


  const ownerName =
    unit?.owner?.firstName
      ? `${unit.owner.firstName}${unit.owner.lastName ? ' ' + unit.owner.lastName : ''}`
      : unit?.owner?.name || null;

  const ownerEmail = unit?.owner?.email || null;

  return (
    <Link to={`/vm/business-units/${unit?._id}`} className="block group">
      <Card className="h-full">
        <CardContent className="p-5 flex flex-col gap-4">
          {/* Top row: avatar + name/desc + badge */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col items-start gap-3 min-w-0">
              <div className="p-2 bg-accent rounded-lg shrink-0">
                {/* <Profile
                  src={unit?.logo}
                  fallbackAvatarText={unit?.name}
                  size="28px"
                /> */}

                <LayoutGrid className='text-secondary-foreground' size={22} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-mono hover:text-primary truncate">
                  {unit?.name}
                </p>
                {unit?.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5 leading-relaxed">
                    {unit?.description}
                  </p>
                )}
              </div>
            </div>
            <SeverityLabel score={unit?.riskScore ?? 0} />
          </div>

          {(() => {
            const total = unit?.risk?.total || 0;
            const closed = unit?.risk?.closed || 0;
            const percent = total > 0 ? Math.round((closed / total) * 100) : 0;
            return (
              <div className="flex flex-col gap-1.5">
                <RemediationProgress progress={percent} />
              </div>
            );
          })()}

          <div className='py-4'>
            {((unit?.risk?.critical || 0) + (unit?.risk?.high || 0) + (unit?.risk?.medium || 0) + (unit?.risk?.low || 0)) > 0 ? (
              <VulnerabilityLables
                items={[
                  { label: 'CRITICAL', number: unit?.risk?.critical || 0 },
                  { label: 'HIGH', number: unit?.risk?.high || 0 },
                  { label: 'MEDIUM', number: unit?.risk?.medium || 0 },
                  { label: 'LOW', number: unit?.risk?.low || 0 },
                ]}
              />
            ) : (
              <span className="text-muted-foreground text-sm">No active vulnerabilities</span>
            )}
          </div>

          <div className="flex items-center justify-between">
            {(ownerName || ownerEmail) && (
              <Profile
                email={ownerEmail}
                size="30px"
              />
            )}


            {/* <div className="flex items-center gap-1.5 text-sm">
              <span className="">{unit?.assetsCount ?? 0}</span> assets
            </div>

            <div className="flex items-center gap-1.5 text-sm">
              {vulnItems.length > 0 ? (
                <VulnerabilityLables items={vulnItems} />
              ) : (
                <span>No open vulns</span>
              )}
            </div> */}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
