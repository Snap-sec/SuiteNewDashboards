import { Clock, Zap } from 'lucide-react';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Profile } from '@/components/custom/profile';
import RemediationProgress from '../../../../VM/pages/assets/components/ui/remediation-progress';

function BasicDetails({ data, isLoading }) {
  // Transform API data to component format
  const scanMeta = data?.scan_meta || {};
  const summaryMetrics = data?.summary_metrics || {};
  const charts = data?.charts || {};
  const severityData = charts.severity_distribution?.data || {};

  const basicDetailsData = {
    scanName: scanMeta.assetId?.value || scanMeta.group?.name || 'Unknown Scan',
    groupName: scanMeta.group?.name,
    scanStatus: summaryMetrics.scan_status || scanMeta.state || 'unknown',
    totalVulns: summaryMetrics.total_vulns_found || 0,
    closedVulns: 0, // Not provided in API response
    progress: scanMeta.progress || 0,
    statistics: [
      { label: 'Critical', count: severityData.critical || 0 },
      { label: 'High', count: severityData.high || 0 },
      { label: 'Medium', count: severityData.medium || 0 },
      { label: 'Low', count: severityData.low || 0 },
      { label: 'Info', count: severityData.info || 0 },
    ],
    scannerName:
      summaryMetrics.scanner_name || scanMeta.scannerId?.name || 'Unknown',
    assetCount: summaryMetrics.asset_count || 0,
    schedule: scanMeta.schedule || 'N/A',
    nextScan: scanMeta.nextScan || null,
    triggeredBy: scanMeta.triggeredBy || null,
  };

  const statistics = basicDetailsData.statistics;

  const renderStatItem = (stat, index) => (
    <div
      key={index}
      className="flex flex-col gap-1.5 px-2.75 py-2.25 border border-dashed border-input rounded-md"
    >
      <span className="text-mono text-sm leading-none font-medium">
        {stat.label}
      </span>
      <span className="text-secondary-foreground text-xs">{stat.count}</span>
    </div>
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent className="lg:py-7.5 animate-pulse">
          <div className="flex flex-wrap gap-7.5">
            {/* Logo box skeleton */}
            <div className="flex flex-col gap-3 items-center justify-center size-[140px] rounded-xl ring-1 ring-border bg-secondary-clarity shrink-0">
              <Skeleton className="size-[70px] rounded-xl" />
              <Skeleton className="h-4 w-20 rounded" />
            </div>

            <div className="flex flex-col gap-5 lg:gap-7.5 grow">
              <div className="flex flex-wrap items-center justify-between gap-2">
                {/* Name / description skeleton */}
                <div className="flex flex-col gap-2.5 w-full max-w-2xl">
                  <div className="flex items-center gap-2.5">
                    <Skeleton className="h-7 w-48 rounded" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-80 rounded" />
                </div>
              </div>

              {/* Statistics badges grid skeleton */}
              <div className="flex items-center flex-wrap gap-3 lg:gap-5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-1.5 px-2.75 py-2.25 border border-dashed border-input rounded-md min-w-[80px]"
                  >
                    <Skeleton className="h-3.5 w-12 rounded" />
                    <Skeleton className="h-3 w-6 rounded" />
                  </div>
                ))}
              </div>

              {/* Progress bar and Triggered by skeleton */}
              <div className="flex flex-wrap gap-6 lg:gap-12 items-center">
                <div className="flex flex-col gap-3.5 grow">
                  <Skeleton className="h-4 w-60 rounded" />
                  <Skeleton className="h-2.5 w-full rounded" />
                </div>

                <div className="flex flex-col gap-1 pr-6 shrink-0">
                  <Skeleton className="h-3 w-20 rounded" />
                  <div className="flex items-center gap-2 mt-1">
                    <Skeleton className="size-8 rounded-full" />
                    <div className="flex flex-col gap-1">
                      <Skeleton className="h-3.5 w-24 rounded" />
                      <Skeleton className="h-3 w-16 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="lg:py-7.5">
        <div className="flex flex-wrap gap-7.5">
          <div className="flex flex-col gap-3 items-center justify-center size-[140px] rounded-xl ring-1 ring-border bg-secondary-clarity">
            <img
              src={toAbsoluteUrl('/media/brand-logos/cloud-one.svg')}
              className="size-[70px]"
              alt="scan"
            />
            <span className="text-sm font-semibold text-mono text-center">
              {basicDetailsData.scanName?.length > 10
                ? `${basicDetailsData.scanName.substring(0, 10)}...`
                : basicDetailsData.scanName}
            </span>
          </div>

          <div className="flex flex-col gap-5 lg:gap-7.5 grow">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-2xl font-semibold text-mono">
                    {basicDetailsData.scanName}
                  </h2>
                  {basicDetailsData.groupName && (
                    <div className="mt-2">
                      <Badge variant="secondary">
                        {basicDetailsData.groupName}
                      </Badge>
                    </div>
                  )}
                  <div className="capitalize mt-2">
                    <Badge
                      variant={
                        basicDetailsData.scanStatus === 'completed'
                          ? 'success'
                          : 'warning'
                      }
                      appearance="outline"
                    >
                      {basicDetailsData.scanStatus}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm text-secondary-foreground">
                Comprehensive vulnerability scan overview.
              </p>
              <div className="flex items-center flex-wrap gap-3 lg:gap-5 mt-2">
                {statistics.map((stat, index) => renderStatItem(stat, index))}
              </div>
            </div>

            <div className="flex flex-wrap gap-6 lg:gap-12 items-center">
              <div className="flex flex-col gap-3.5 grow">
                <div className="text-sm text-secondary-foreground">
                  Closed{' '}
                  <span className="text-sm font-medium text-mono">
                    {basicDetailsData.closedVulns}
                  </span>{' '}
                  out of{' '}
                  <span className="text-sm font-medium text-mono">
                    {basicDetailsData.totalVulns}
                  </span>{' '}
                  Identified Vulnerabilities
                </div>
                <RemediationProgress progress={basicDetailsData?.progress} />
              </div>

              {basicDetailsData.triggeredBy && (
                <div className="flex flex-col gap-1 pr-6 border-r border-border last:border-0">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                    Triggered By
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    {basicDetailsData.triggeredBy.user ? (
                      <Profile
                        name={`${basicDetailsData.triggeredBy.user.firstName || ''} ${basicDetailsData.triggeredBy.user.lastName || ''}`.trim()}
                        email={basicDetailsData.triggeredBy.user.email}
                        userId={basicDetailsData.triggeredBy.user._id}
                        size="32px"
                        showEmail={false}
                      />
                    ) : basicDetailsData.triggeredBy.auto_trigger ===
                      'aim_policy' ? (
                      <>
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                          <Zap className="w-4 h-4 text-blue-500" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold">
                            AIM Policy
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {basicDetailsData.triggeredBy.rule_name ||
                              'Trigger VS'}
                          </span>
                        </div>
                      </>
                    ) : basicDetailsData.triggeredBy.auto_trigger ===
                      'periodic' ? (
                      <>
                        <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                          <Clock className="w-4 h-4 text-purple-500" />
                        </div>
                        <span className="text-xs font-semibold text-purple-500">
                          Periodic Schedule
                        </span>
                      </>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default BasicDetails;
