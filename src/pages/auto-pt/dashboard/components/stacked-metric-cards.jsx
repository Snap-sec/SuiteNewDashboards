import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function StackedMetricCards({ data = {}, isLoading = false }) {
  // Top Card: Number of vulnerabilities by severity (Total, Critical, High, Medium, Low)
  const vulnerabilityStats = [
    {
      label: 'Total Vulns',
      number: data?.total_vulns ?? 0,
    },
    {
      label: 'Critical',
      number: data?.total_criticals ?? data?.total_critical ?? 0,
    },
    {
      label: 'High',
      number: data?.total_high ?? 0,
    },
    {
      label: 'Medium',
      number: data?.total_medium ?? data?.distribution_by_severity?.medium ?? 0,
    },
    {
      label: 'Low',
      number: data?.total_low ?? data?.distribution_by_severity?.low ?? 0,
    },
  ];

  // Lower Card: Asset counts by risk category (Total Assets, Critical Assets, High Risk, Medium, Low)
  const assetStats = [
    {
      label: 'Total Assets',
      number: data?.total_assets ?? 142,
    },
    {
      label: 'Critical Assets',
      number: data?.assets_critical ?? 8,
    },
    {
      label: 'High Risk Assets',
      number: data?.assets_high ?? 24,
    },
    {
      label: 'Medium Risk',
      number: data?.assets_medium ?? 56,
    },
    {
      label: 'Low Risk',
      number: data?.assets_low ?? 48,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 h-full justify-between">
        <Skeleton className="w-full h-[85px] rounded-xl" />
        <Skeleton className="w-full h-[85px] rounded-xl" />
      </div>
    );
  }

  const renderStatGroup = (stats) => (
    <div className="flex lg:px-8 py-1.5 gap-2">
      {stats.map((item, index) => (
        <React.Fragment key={index}>
          <div className="grid grid-cols-1 place-content-center flex-1 gap-1 text-center cursor-pointer">
            <span className="text-mono text-2xl lg:text-2xl leading-none font-semibold text-foreground">
              {item.number}
            </span>
            <span className="text-secondary-foreground text-sm font-normal truncate">
              {item.label}
            </span>
          </div>
          <span className="not-last:border-e border-e-input my-1" />
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col gap-4 h-full justify-between">
      {/* Top Stacked Card: Vulnerabilities Severity Counts */}
      <Card className="flex-1 flex flex-col justify-center shadow-xs">
        <CardContent>
          {renderStatGroup(vulnerabilityStats)}
        </CardContent>
      </Card>

      {/* Lower Stacked Card: Asset Counts by Severity/Risk */}
      <Card className="flex-1 flex flex-col justify-center shadow-xs">
        <CardContent>
          {renderStatGroup(assetStats)}
        </CardContent>
      </Card>
    </div>
  );
}
