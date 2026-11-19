import React from 'react';
import { SEVERITY_COLORS } from '@/pages/VM/constants';
import { CircleAlert } from 'lucide-react';
import { PolarAngleAxis, RadialBar, RadialBarChart } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import DetailedHoverPopover from '@/components/custom/detailed-popover';

const RINGS = [
  {
    id: 'critical',
    label: 'Critical',
    shortLabel: 'Critical',
    color: SEVERITY_COLORS.critical,
  },
  {
    id: 'high',
    label: 'High',
    shortLabel: 'High',
    color: SEVERITY_COLORS.high,
  },
  {
    id: 'medium',
    label: 'Medium',
    shortLabel: 'Medium',
    color: SEVERITY_COLORS.medium,
  },
  {
    id: 'low',
    label: 'Low',
    shortLabel: 'Low',
    color: SEVERITY_COLORS.low,
  },
];

const EMPTY_ROW = { web: 0, mobile: 0, cloud: 0, code: 0, infra: 0, total: 0 };
const EMPTY_MATRIX = {
  critical: { ...EMPTY_ROW },
  high: { ...EMPTY_ROW },
  medium: { ...EMPTY_ROW },
  low: { ...EMPTY_ROW },
};

const chartConfig = {
  critical: { label: 'Critical', color: SEVERITY_COLORS.critical },
  high: { label: 'High', color: SEVERITY_COLORS.high },
  medium: { label: 'Medium', color: SEVERITY_COLORS.medium },
  low: { label: 'Low', color: SEVERITY_COLORS.low },
};

function OrganizationRiskCardSkeleton() {
  return (
    <Card className="w-full">
      {/* Top Header Skeleton */}
      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-44" />
          <Skeleton className="size-4 rounded-full" />
        </div>
      </CardHeader>

      {/* Main Content Area Skeleton */}
      <CardContent className="p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row items-center lg:items-stretch gap-6 lg:gap-8">
          {/* Left Column: Concentric Radial Gauge Skeleton */}
          <div className="w-full lg:w-[290px] xl:w-[320px] shrink-0 flex flex-col items-center justify-center">
            <div className="relative w-full aspect-square max-w-[240px] flex items-center justify-center">
              {/* Concentric rings skeleton matching Recharts RadialBarChart */}
              <div className="relative size-[220px] rounded-full border-[10px] border-muted/50 animate-pulse flex items-center justify-center">
                <div className="size-[176px] rounded-full border-[10px] border-muted/40 flex items-center justify-center">
                  <div className="size-[132px] rounded-full border-[10px] border-muted/30 flex items-center justify-center">
                    <div className="size-[88px] rounded-full border-[10px] border-muted/20 flex items-center justify-center">
                      <div className="flex flex-col items-center justify-center text-center">
                        <Skeleton className="h-7 w-12 mb-1" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Legend Skeleton below chart */}
            <div className="flex items-center justify-center gap-3.5 mt-2 flex-wrap">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <Skeleton className="size-2 rounded-full shrink-0" />
                  <Skeleton className="h-3 w-12" />
                </div>
              ))}
            </div>
          </div>

          {/* Vertical Separator for Desktop */}
          <div className="hidden lg:block w-px bg-border self-stretch my-1" />

          {/* Right Column: Table Rows Skeleton matching the 4 severity rows */}
          <div className="flex-1 min-w-0 w-full flex flex-col justify-center overflow-hidden">
            <div className="w-full divide-y divide-border">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="py-3.5 px-3 flex items-center gap-4 justify-between"
                >
                  {/* Severity: dot + label */}
                  <div className="flex items-center gap-2 w-[110px] shrink-0">
                    <Skeleton className="size-2 rounded-full shrink-0" />
                    <Skeleton className="h-4 w-14" />
                  </div>

                  {/* Asset Counts (4 asset types) */}
                  <div className="flex items-center justify-end gap-6 flex-1 max-w-[280px]">
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-8" />
                  </div>

                  {/* Remediation Progress Bar + Percentage in Row */}
                  <div className="flex items-center gap-2.5 flex-1 pl-4 pr-1">
                    <Skeleton className="h-2 grow rounded-full min-w-[40px]" />
                    <Skeleton className="h-4 w-9 shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ReUI c-chart-25: Glowing RadialBarChart for Severity Index & Total Vulns
function RiskScoreRadialChart({
  matrix = EMPTY_MATRIX,
  data = {},
  totalVulns = null,
}) {
  const grandTotal =
    (matrix?.critical?.total || 0) +
    (matrix?.high?.total || 0) +
    (matrix?.medium?.total || 0) +
    (matrix?.low?.total || 0);

  const displayTotal =
    totalVulns !== null && totalVulns !== undefined
      ? totalVulns
      : (data?.total_vulns ?? data?.metrics?.total_vulns ?? grandTotal);

  const getRingScore = (key) => {
    if (data?.[`${key}_score`] !== undefined)
      return Number(data[`${key}_score`]);
    if (grandTotal > 0) {
      const count = matrix?.[key]?.total || 0;
      return Math.round((count / grandTotal) * 100);
    }
    return 0;
  };

  const chartData = [
    { name: 'low', score: getRingScore('low'), fill: 'url(#cchart25-low)' },
    {
      name: 'medium',
      score: getRingScore('medium'),
      fill: 'url(#cchart25-medium)',
    },
    { name: 'high', score: getRingScore('high'), fill: 'url(#cchart25-high)' },
    {
      name: 'critical',
      score: getRingScore('critical'),
      fill: 'url(#cchart25-critical)',
    },
  ];

  return (
    <div className="relative w-full max-w-[280px] flex flex-col items-center justify-center">
      {/* Chart container with absolute centered score badge */}
      <div className="relative w-full aspect-square max-w-[240px] flex items-center justify-center">
        <ChartContainer
          config={chartConfig}
          className="aspect-square w-full h-full"
        >
          <RadialBarChart
            data={chartData}
            innerRadius={50}
            outerRadius={110}
            barSize={10}
            startAngle={90}
            endAngle={-270}
          >
            <defs>
              {['low', 'medium', 'high', 'critical'].map((key) => (
                <linearGradient
                  key={key}
                  id={`cchart25-${key}`}
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="0"
                >
                  <stop
                    offset="0%"
                    stopColor={chartConfig[key]?.color}
                    stopOpacity={0.7}
                  />
                  <stop
                    offset="100%"
                    stopColor={chartConfig[key]?.color}
                    stopOpacity={1}
                  />
                </linearGradient>
              ))}
              <filter
                id="cchart25-glow"
                x="-15%"
                y="-15%"
                width="130%"
                height="130%"
              >
                {/* <feGaussianBlur stdDeviation="2" result="blur" /> */}
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <ChartTooltip
              cursor={false}
              wrapperStyle={{ zIndex: 50 }}
              content={
                <ChartTooltipContent
                  hideLabel
                  indicator="dot"
                  nameKey="name"
                  className="min-w-28 gap-1.5 bg-popover text-popover-foreground border border-border shadow-md"
                  formatter={(value, name, item) => {
                    const severityKey = item?.payload?.name || name;
                    const count = matrix?.[severityKey]?.total ?? 0;
                    const configItem = chartConfig[severityKey] || {};
                    return (
                      <div className="flex w-full items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-1.5">
                          <div
                            className="size-2 shrink-0 rounded-full"
                            style={{ backgroundColor: configItem.color }}
                          />
                          <span className="text-muted-foreground capitalize font-medium">
                            {configItem.label || severityKey}
                          </span>
                        </div>
                        <span className="text-foreground font-semibold tabular-nums">
                          {count} ({Number(value)}%)
                        </span>
                      </div>
                    );
                  }}
                />
              }
            />
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              angleAxisId={0}
              tick={false}
            />
            <RadialBar
              dataKey="score"
              nameKey="name"
              background
              cornerRadius={10}
              filter="url(#cchart25-glow)"
            />
          </RadialBarChart>
        </ChartContainer>

        {/* Center Total Vulns Badge - mathematically centered */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex flex-col items-center justify-center text-center select-none">
            <span className="text-3xl font-bold tracking-tight text-foreground leading-none mb-1">
              {displayTotal}
            </span>
            <span className="text-xs font-medium text-muted-foreground leading-none">
              Total Vulns
            </span>
          </div>
        </div>
      </div>

      {/* Legend cleanly positioned below chart container - eliminates ring overlap */}
      <div className="flex items-center justify-center gap-3.5 mt-2 flex-wrap">
        {RINGS.map((ring) => (
          <div
            key={ring.id}
            className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium"
          >
            <span
              className="size-2 rounded-full shrink-0"
              style={{ backgroundColor: ring.color }}
            />
            <span>{ring.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OrganizationRiskCard({ data = {}, isLoading = false }) {
  // Extract distribution_by_vuln_type from response
  const distByVulnType = React.useMemo(
    () =>
      data?.distribution_by_vuln_type ||
      data?.data?.distribution_by_vuln_type ||
      data?.data?.data?.distribution_by_vuln_type ||
      data?.vuln_count_by_vuln_type ||
      {},
    [data],
  );

  const severityDist = React.useMemo(
    () =>
      data?.distribution_by_severity ||
      data?.data?.distribution_by_severity ||
      data?.data?.data?.distribution_by_severity ||
      {},
    [data],
  );

  const remediationBySeverity = data?.remediation_progress?.by_severity || {};

  // Derive dynamic asset columns directly from keys of distribution_by_vuln_type
  const assetColumns = React.useMemo(() => {
    const keys = Object.keys(distByVulnType);
    if (keys.length > 0) {
      return keys.map((key) => ({
        key,
        label: key
          .split(/[-_]/)
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' '),
      }));
    }
    return [
      { key: 'web', label: 'Web' },
      { key: 'network', label: 'Network' },
      { key: 'cloud', label: 'Cloud' },
      { key: 'mobile', label: 'Mobile' },
    ];
  }, [distByVulnType]);

  // Compile severity vs asset type matrix directly from distribution_by_vuln_type
  const matrix = React.useMemo(() => {
    const getRow = (severity, fallbackTotalKeys = []) => {
      let total = severityDist?.[severity];
      if (total === undefined) {
        for (const k of fallbackTotalKeys) {
          if (data?.[k] !== undefined) {
            total = Number(data[k]);
            break;
          }
        }
      }
      if (total === undefined) {
        total = assetColumns.reduce(
          (sum, col) =>
            sum + Number(distByVulnType?.[col.key]?.[severity] || 0),
          0,
        );
      }

      return {
        total: Number(total),
      };
    };

    return {
      critical: getRow('critical', ['total_criticals', 'criticals']),
      high: getRow('high', ['total_high', 'highs']),
      medium: getRow('medium', ['total_medium', 'mediums']),
      low: getRow('low', ['total_low', 'lows']),
    };
  }, [assetColumns, distByVulnType, severityDist, data]);

  const grandTotal =
    matrix.critical.total +
    matrix.high.total +
    matrix.medium.total +
    matrix.low.total;

  const totalVulns =
    data?.total_vulns ?? data?.metrics?.total_vulns ?? grandTotal;

  // Compute dynamic risk score (0-100) from vulnerabilities if not provided by API
  const riskScore = React.useMemo(() => {
    if (
      data?.organization_risk_score !== undefined &&
      data?.organization_risk_score !== null
    ) {
      return Number(data.organization_risk_score);
    }
    if (data?.risk_score !== undefined && data?.risk_score !== null) {
      return Number(data.risk_score);
    }
    if (grandTotal === 0) return 0;
    // Weighted risk formula: Critical: 20, High: 7, Medium: 2, Low: 0.5
    const weightedPoints =
      matrix.critical.total * 20 +
      matrix.high.total * 7 +
      matrix.medium.total * 2 +
      matrix.low.total * 0.5;
    return Math.min(100, Math.round(weightedPoints));
  }, [data, grandTotal, matrix]);

  if (isLoading) return <OrganizationRiskCardSkeleton />;

  return (
    <Card className="w-full">
      {/* Top Header: Styled to match dashboard chart cards */}
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-normal text-sm text-gray-500">
          Overall Organization Risk
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
                Vulnerability exposure and remediation progress across asset
                categories, rolling 28 days.
              </p>
            }
          />
        </CardTitle>
      </CardHeader>

      {/* Main Content Area: Left Concentric Gauge + Right Severity vs Asset Matrix */}
      <CardContent className="p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row items-center lg:items-stretch gap-6 lg:gap-8">
          {/* Left Column: ReUI c-chart-25 Radial Glowing Chart */}
          <div className="w-full lg:w-[290px] xl:w-[320px] shrink-0 flex items-center justify-center">
            <RiskScoreRadialChart
              score={riskScore}
              matrix={matrix}
              data={data}
              totalVulns={totalVulns}
            />
          </div>

          {/* Vertical Separator for Desktop */}
          <div className="hidden lg:block w-px bg-border self-stretch my-1" />

          {/* Right Column: Severity vs Asset Type Table */}
          <div className="flex-1 min-w-0 w-full flex flex-col justify-center overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="pb-3 text-left font-medium text-xs w-[85px] sm:w-[95px] pr-2 shrink-0">
                    Severity
                  </th>
                  {assetColumns.map((col) => (
                    <th
                      key={col.key}
                      className="pb-3 font-medium text-xs px-1.5 sm:px-2 text-center"
                    >
                      {col.label}
                    </th>
                  ))}
                  <th className="pb-3 text-left pl-3 sm:pl-4 pr-1 font-medium text-xs min-w-[100px]">
                    Remediation Progress
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {RINGS.map((ring) => {
                  const percentage = Number(
                    remediationBySeverity[ring.id]?.percentage ?? 0,
                  );
                  const remediationPct = Number.isFinite(percentage)
                    ? Math.min(Math.max(percentage, 0), 100)
                    : 0;

                  return (
                    <tr
                      key={ring.id}
                      className="hover:bg-muted/40 transition-colors group"
                    >
                      {/* Severity with colored indicator dot */}
                      <td className="py-3 pr-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="size-2 rounded-full shrink-0"
                            style={{ backgroundColor: ring.color }}
                          />
                          <span className="text-xs sm:text-sm font-medium text-foreground">
                            {ring.label}
                          </span>
                        </div>
                      </td>

                      {/* Asset Counts dynamically rendered from distribution_by_vuln_type */}
                      {assetColumns.map((col) => (
                        <td
                          key={col.key}
                          className="py-3 px-1.5 sm:px-2 text-foreground text-xs sm:text-sm font-normal text-center"
                        >
                          {Number(distByVulnType?.[col.key]?.[ring.id] || 0)}
                        </td>
                      ))}

                      {/* Remediation Progress: Bar and Percentage in a single row */}
                      <td className="py-3 pl-3 sm:pl-4 pr-1">
                        <div className="flex items-center gap-2.5 w-full">
                           <span className="font-medium text-xs sm:text-sm text-foreground tabular-nums whitespace-nowrap shrink-0 w-9 text-right">
                            {remediationPct}%
                          </span>
                          <div className="grow h-2 bg-muted rounded-full overflow-hidden min-w-[36px]">
                            <div
                              className="h-full rounded-full transition-all duration-500 ease-out"
                              style={{
                                width: `${remediationPct}%`,
                                backgroundColor: ring.color,
                              }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
