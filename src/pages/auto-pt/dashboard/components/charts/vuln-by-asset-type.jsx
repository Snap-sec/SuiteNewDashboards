import React, { useMemo } from 'react';
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { CircleAlert } from 'lucide-react';
import DetailedHoverPopover from '@/components/custom/detailed-popover';

function formatAssetName(key) {
  const map = {
    web: 'Web',
    network: 'Network',
    cloud: 'Cloud',
    mobile: 'Mobile',
    'code-sast': 'Code SAST',
    'code-sca': 'Code SCA',
    'host-agent': 'Host Agent',
    code: 'Code',
    infra: 'Infra',
  };
  if (map[key?.toLowerCase()]) return map[key?.toLowerCase()];
  return key
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const chartConfig = {
  vulns: {
    label: 'Vulnerabilities',
    color: 'var(--primary, #1379f0)',
  },
};

function VulnByAssetType({ data, isLoading }) {
  const chartData = useMemo(() => {
    // Array format: [{ asset: 'Web', vulns: 6, ... }]
    if (Array.isArray(data) && data.length > 0) {
      return data.map((item) => {
        const rawName =
          item.asset || item.name || item.type || item.asset_type || item.vuln_type || 'Unknown';
        const sumVulns =
          Number(item.vulns ?? item.total ?? item.count) ||
          (Number(item.critical || 0) +
            Number(item.high || 0) +
            Number(item.medium || 0) +
            Number(item.low || 0) +
            Number(item.info || 0));
        return {
          asset: formatAssetName(rawName),
          vulns: sumVulns || 0,
          critical: Number(item.critical || 0),
          high: Number(item.high || 0),
          medium: Number(item.medium || 0),
          low: Number(item.low || 0),
          info: Number(item.info || 0),
        };
      });
    }

    // Object format (vuln_counts_by_type): { web: { total: 6, critical: 0, high: 0, medium: 0, low: 5, info: 1 }, ... }
    if (data && typeof data === 'object' && Object.keys(data).length > 0) {
      return Object.entries(data).map(([name, val]) => {
        const sumVulns =
          typeof val === 'number'
            ? val
            : Number(val?.total ?? val?.vulns ?? val?.count) ||
            (Number(val?.critical || 0) +
              Number(val?.high || 0) +
              Number(val?.medium || 0) +
              Number(val?.low || 0) +
              Number(val?.info || 0));

        return {
          asset: formatAssetName(name),
          vulns: sumVulns || 0,
          critical: Number(val?.critical || 0),
          high: Number(val?.high || 0),
          medium: Number(val?.medium || 0),
          low: Number(val?.low || 0),
          info: Number(val?.info || 0),
        };
      });
    }

    return [];
  }, [data]);

  const topAsset = useMemo(() => {
    if (!chartData.length) return null;
    return [...chartData].sort((a, b) => b.vulns - a.vulns)[0];
  }, [chartData]);

  return (
    <Card className="h-full flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 font-normal text-sm text-gray-500">
          Vulnerabilities by Asset Type
          <DetailedHoverPopover
            buttonText={
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <CircleAlert className="h-4 w-4" />
              </Button>
            }
            showBadge={false}
            popoverTitle="About this Graph"
            popoverContent={
              <p className="text-muted-foreground text-xs leading-relaxed">
                Gradient Radar chart displaying vulnerability exposure and attack surface density across each asset type
                (Web Apps, APIs, Cloud Resources, Repositories, Network Hosts, and Mobile Apps).
              </p>
            }
          />
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col items-center justify-center pt-2 pb-2">
        {isLoading ? (
          <div className="w-full h-[280px] flex items-center justify-center">
            <Skeleton className="size-56 rounded-full" />
          </div>
        ) : chartData.length === 0 ? (
          <div className="w-full h-[280px] flex items-center justify-center text-xs text-muted-foreground">
            No vulnerability data by asset type
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square w-full max-h-[300px]"
          >
            <RadarChart accessibilityLayer data={chartData}>
              <defs>
                <linearGradient id="vulnAssetRadarFill" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--color-vulns, #1379f0)"
                    stopOpacity={0.5}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--color-vulns, #1379f0)"
                    stopOpacity={0.08}
                  />
                </linearGradient>
                <filter
                  id="vulnAssetRadarGlow"
                  x="-20%"
                  y="-20%"
                  width="140%"
                  height="140%"
                >
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="line"
                    formatter={(value, name, item) => (
                      <div className="flex flex-col gap-1 text-xs">
                        <div className="flex items-center justify-between gap-4 font-semibold text-foreground">
                          <span>{item?.payload?.asset}</span>
                          <span>{value} vulns</span>
                        </div>
                        {(item?.payload?.critical > 0 ||
                          item?.payload?.high > 0 ||
                          item?.payload?.medium > 0 ||
                          item?.payload?.low > 0) && (
                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground pt-1 border-t border-border/50">
                              {item.payload.critical > 0 && (
                                <span className="text-rose-500 font-medium">
                                  {item.payload.critical} Crit
                                </span>
                              )}
                              {item.payload.high > 0 && (
                                <span className="text-orange-500 font-medium">
                                  {item.payload.high} High
                                </span>
                              )}
                              {item.payload.medium > 0 && (
                                <span className="text-amber-500 font-medium">
                                  {item.payload.medium} Med
                                </span>
                              )}
                              {item.payload.low > 0 && (
                                <span className="text-blue-500 font-medium">
                                  {item.payload.low} Low
                                </span>
                              )}
                            </div>
                          )}
                      </div>
                    )}
                  />
                }
              />
              <PolarAngleAxis
                dataKey="asset"
                tick={{
                  fontSize: 11,
                  fill: 'var(--color-secondary-foreground, #71717a)',
                  fontWeight: 500,
                }}
              />
              <PolarGrid strokeDasharray="3 3" className="stroke-border/70" />
              <Radar
                dataKey="vulns"
                fill="url(#vulnAssetRadarFill)"
                stroke="var(--color-vulns, #1379f0)"
                strokeWidth={2}
                filter="url(#vulnAssetRadarGlow)"
                dot={{
                  r: 4,
                  fill: 'var(--color-vulns, #1379f0)',
                  strokeWidth: 0,
                }}
              />
            </RadarChart>
          </ChartContainer>
        )}
      </CardContent>

      {/* <CardFooter className="flex-col gap-1 text-xs pt-0 pb-4 text-center border-t border-border/40 mt-auto">
        <div className="flex items-center justify-between w-full pt-3 px-1 text-secondary-foreground text-[11px]">
          <span>
            Tracked Assets:{' '}
            <strong className="text-mono font-medium">{chartData.length}</strong>
          </span>
          {topAsset && topAsset.vulns > 0 && (
            <span>
              Highest Exposure:{' '}
              <strong className="text-mono font-medium text-destructive">
                {topAsset.asset} ({topAsset.vulns})
              </strong>
            </span>
          )}
        </div>
      </CardFooter> */}
    </Card>
  );
}

export default VulnByAssetType;
