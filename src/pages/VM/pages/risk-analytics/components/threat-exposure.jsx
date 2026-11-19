import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CircleAlert } from 'lucide-react';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import { EnhancedGauge } from '../../vulnerability-report/components/graph';

export default function ThreatExposure({ data, isLoading }) {
  if (isLoading) {
    return (
      <Card className="bg-card h-full flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-4 rounded-full" />
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col px-6 pb-4 pt-2">
          <div className="flex w-full mb-8 items-center gap-4">
            <div className="shrink-0 flex items-center justify-center pr-4 border-r border-border/50">
              <div className="relative flex items-center justify-center">
                <Skeleton className="size-[125px] rounded-full" />
                <div className="absolute inset-0 m-auto size-[105px] bg-card rounded-full flex flex-col items-center justify-center gap-1">
                  <Skeleton className="h-6 w-10" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6 flex-1">
              <div className="flex justify-between items-center text-sm">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-8" />
              </div>
              <div className="flex justify-between items-center text-sm">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-8" />
              </div>
              <div className="flex justify-between items-center text-sm">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-8" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-auto">
            <div className="bg-secondary/30 rounded-lg p-3 flex items-center justify-between border border-border/50">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-6 w-10" />
            </div>
            <div className="bg-secondary/30 rounded-lg p-3 flex items-center justify-between border border-border/50">
              <Skeleton className="h-3 w-14" />
              <Skeleton className="h-6 w-10" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

    const kev = data?.threatExposure?.knownExploitedVulnerabilities?.count ?? 0;
    const kevPercent = data?.threatExposure?.knownExploitedVulnerabilities?.percentage ?? null;

    const epss = data?.threatExposure?.highEpss?.count ?? 0;
    const epssPercent = data?.threatExposure?.highEpss?.percentage ?? null;

    const highRisk = data?.threatExposure?.highRiskFindings?.count ?? 0;
    const highRiskPercent = data?.threatExposure?.highRiskFindings?.percentage ?? null;

    const publicExploit = data?.threatExposure?.publicExploitAvailable?.count ?? null;
    const publicExploitPercent = data?.threatExposure?.publicExploitAvailable?.percentage ?? null;

    const uniqueCves = data?.exposureSummary?.uniqueCves ?? 0;
    const uniqueCwes = data?.exposureSummary?.uniqueCwes ?? 0;
    const avgCvss = data?.exposureSummary?.averageCvss ?? 0;

    const formatNumber = (num) => {
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toLocaleString();
    };

    return (
        <Card className="bg-card h-full flex flex-col">
            <CardHeader>
                <CardTitle className="font-normal text-sm text-gray-500 flex items-center gap-2">
                    Threat Exposure
                    <DetailedHoverPopover
                        buttonText={<CircleAlert className="h-4 w-4 text-muted-foreground" />}
                        popoverTitle="Threat Exposure"
                        popoverContent={<p className="text-muted-foreground">An unbounded exposure score calculated from the number and severity of vulnerabilities, using weighted values (Critical × 10, High × 7, Medium × 4, Low × 1).</p>}
                        showBadge={false}
                    />
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col px-6 pb-4 pt-2">

                <div className="flex w-full mb-8 items-center gap-4">
                    {/* Right: Gauge */}
                    <div className="shrink-0 flex items-center justify-center pr-4 border-r border-border/50">
                        <EnhancedGauge
                            value={data?.exposureOverview?.score || 0}
                            max={100}
                            showMax={false}
                            size={125}
                            thickness={10}
                            strokeColor={(data?.exposureOverview?.score || 0) >= 50 ? '#ef4444' : '#f59e0b'}
                            textColor={(data?.exposureOverview?.score || 0) >= 50 ? '#ef4444' : '#f59e0b'}
                        />
                    </div>


                    <div className="flex flex-col gap-6 flex-1">
                        <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-3">
                                <span className="text-muted-foreground">Known Exploited (KEV)</span>
                            </div>
                            <div className="flex gap-2 items-baseline">
                                <span className="text-sm font-medium text-foreground">{formatNumber(kev)}</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-3">
                                <span className="text-muted-foreground">High EPSS Score</span>
                            </div>
                            <div className="flex gap-2 items-baseline">
                                <span className="text-sm font-medium text-foreground">{formatNumber(epss)}</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-3">
                                <span className="text-muted-foreground">High and Critical Findings</span>
                            </div>
                            <div className="flex gap-2 items-baseline">
                                <span className="text-sm font-medium text-foreground">{formatNumber(highRisk)}</span>
                            </div>
                        </div>
                    </div>


                </div>

                <div className="grid grid-cols-2 gap-3 mt-auto">
                    <div className="bg-secondary/30 rounded-lg p-3 flex items-center justify-between border border-border/50">
                        <span className="text-xs uppercase tracking-wider text-muted-foreground">Unique CVEs</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-foreground">{uniqueCves}</span>
                        </div>
                    </div>
                    <div className="bg-secondary/30 rounded-lg p-3 flex items-center justify-between border border-border/50">
                        <span className="text-xs uppercase tracking-wider text-muted-foreground">Avg CVSS</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-foreground">{avgCvss}</span>
                        </div>
                    </div>
                </div>

            </CardContent>
        </Card>
    );
}
