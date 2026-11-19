import React from 'react';
import { Cloud } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DateFormatter } from '@/components/custom/date-formatter';
import { StatusBadge } from '@/components/custom/status-badge';
import { CustomTooltip } from '@/components/custom/tooltip';
import { ProjectActions } from '@/pages/auto-pt/pentest/components/dropdown-actions';

const PROVIDER_LOGOS = {
  aws: {
    src: '/new-adapter-logos/aws.svg',
    darkSrc: '/new-adapter-logos/aws-dark.svg',
    label: 'AWS',
  },
  azure: { src: '/new-adapter-logos/azure.svg', label: 'Azure' },
  gcp: { src: '/new-adapter-logos/gcp.svg', label: 'Google Cloud' },
  oracle: { src: '/new-adapter-logos/oracle.svg', label: 'Oracle Cloud' },
  oci: { src: '/new-adapter-logos/oracle.svg', label: 'Oracle Cloud' },
};

const SEVERITY_SEGMENTS = [
  { key: 'critical', color: 'bg-red-600', label: 'Critical' },
  { key: 'high', color: 'bg-orange-500', label: 'High' },
  { key: 'medium', color: 'bg-yellow-400', label: 'Medium' },
  { key: 'low', color: 'bg-blue-500', label: 'Low' },
  { key: 'info', color: 'bg-slate-400', label: 'Info' },
];

function MultiProgressBar({ vulnCounts }) {
  const counts = SEVERITY_SEGMENTS.map((s) => ({
    ...s,
    count: Number(vulnCounts?.[s.key] ?? 0),
  }));

  const activeSegments = counts.filter((s) => s.count > 0);
  const total = Number(vulnCounts?.total) || activeSegments.reduce((sum, s) => sum + s.count, 0);

  if (total === 0) {
    return (
      <div className="w-full">
        <CustomTooltip text="No misconfigurations">
          <div className="w-full h-1.5 rounded-full bg-muted/60 dark:bg-muted/40 cursor-default" />
        </CustomTooltip>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex w-full h-1.5 rounded-full overflow-hidden gap-0.5 bg-muted/30">
        {activeSegments.map((s) => (
          <CustomTooltip key={s.key} text={`${s.label}: ${s.count}`}>
            <div
              className={`h-full ${s.color} transition-all duration-500 cursor-pointer`}
              style={{ width: `${(s.count / total) * 100}%` }}
            />
          </CustomTooltip>
        ))}
      </div>
    </div>
  );
}

export function CloudCard({ item, isLoading }) {
  if (isLoading) {
    return (
      <Card className="p-6 h-full flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="size-11 rounded-lg" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <Skeleton className="h-5 w-40 mb-2" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="mt-6">
          <Skeleton className="h-4 w-28 mb-3" />
          <Skeleton className="w-full h-1.5 rounded-full" />
        </div>
      </Card>
    );
  }

  const id = item?._id || item?.id;
  const name = item?.name || 'Untitled Cloud Audit';
  const description = item?.description;
  const provider = String(
    item?.project_config?.cloud_config?.provider ||
    item?.cloud_config?.provider ||
    item?.provider ||
    '',
  ).trim().toLowerCase();
  const providerLogo = PROVIDER_LOGOS[provider];
  const status = item?.last_scan_status || item?.status;
  const lastScan =
    item?.last_scan?.createdAt ||
    item?.last_scan?.updatedAt ||
    (typeof item?.last_scan === 'string' ? item?.last_scan : null) ||
    item?.updatedAt ||
    item?.createdAt;
  const vulnCounts = item?.vuln_counts || item?.vulnerabilities;

  return (
    <Link
      to={`/apt/pentests/${id}?type=cloud`}
      state={{ projectName: name, name, type: 'cloud', from: '/apt/cloud-security/projects?type=cloud' }}
      className="h-full flex flex-col hover:scale-[1.01] transition-all"
    >
      <Card className="p-7 h-full flex flex-col justify-between bg-card border border-border/80 shadow-xs">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-center size-11 rounded-lg bg-accent/60 shrink-0 text-foreground">
              {providerLogo ? (
                providerLogo.darkSrc ? (
                  <>
                    <img
                      src={providerLogo.src}
                      alt={providerLogo.label}
                      title={providerLogo.label}
                      className="size-6 object-contain dark:hidden"
                    />
                    <img
                      src={providerLogo.darkSrc}
                      alt={providerLogo.label}
                      title={providerLogo.label}
                      className="size-6 object-contain hidden dark:block"
                    />
                  </>
                ) : (
                  <img
                    src={providerLogo.src}
                    alt={providerLogo.label}
                    title={providerLogo.label}
                    className="size-6 object-contain"
                  />
                )
              ) : (
                <Cloud className="size-5 text-foreground" />
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {status ? (
                <StatusBadge status={status} />
              ) : (
                <StatusBadge status="Not Scanned" />
              )}
              {/* <ProjectActions projectId={id} /> */}
            </div>
          </div>

          <div className="flex flex-col mb-3">
            <p title={name} className="text-base font-semibold truncate text-mono hover:text-primary mb-1">
              {name}
            </p>
            <span title={description} className="truncate text-xs text-muted-foreground min-h-[18px] block">
              {description || <span className="opacity-0">&nbsp;</span>}
            </span>
          </div>
        </div>

        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
            <span>
              Last Scan :{' '}
              {lastScan ? (
                <span className="font-medium text-foreground">
                  <DateFormatter date={lastScan} />
                </span>
              ) : (
                <span className="font-medium text-foreground">Never Scanned</span>
              )}
            </span>
          </div>

          <MultiProgressBar vulnCounts={vulnCounts} />
        </div>
      </Card>
    </Link>
  );
}

export default CloudCard;
