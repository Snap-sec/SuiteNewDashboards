import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const formatCostValue = (val) => {
  if (val === undefined || val === null) return '$0';
  if (typeof val === 'string' && val.startsWith('$')) return val;
  const num = Number(val);
  if (isNaN(num) || num === 0) return '$0';
  if (num < 0.01) return `$${num.toFixed(4)}`;
  return `$${num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  })}`;
};

const defaultStats = [
  { label: 'Agents', key: 'totalAgents' },
  { label: 'Workflows', key: 'totalWorkflows', fallbackKey: 'noOfWorkflows' },
  { label: 'Skills', key: 'totalSkills' },
  { label: 'Models', key: 'totalModels', fallbackKey: 'modelsConnected' },
  { label: 'Total Runs', key: 'totalRuns' },
  { label: 'Tokens Used', key: 'totalTokensUsed', format: true },
  { label: 'Cost', key: 'totalCost', fallbackKey: 'cost', formatCost: true },
];

const DashboardMetrics = ({ data, isLoading, stats = defaultStats }) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <div className="flex flex-wrap lg:flex-nowrap lg:px-10 py-1.5 gap-2">
            {stats.map((_, i) => (
              <React.Fragment key={i}>
                <div className="grid grid-cols-1 place-content-center justify-items-center flex-1 min-w-[80px] gap-1 text-center">
                  <Skeleton className="h-6 w-8 my-0.5" />
                  <Skeleton className="h-3.5 w-16 my-0.5" />
                </div>
                <span className="not-last:border-e border-e-input my-1" />
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <div className="flex flex-wrap lg:flex-nowrap lg:px-10 py-1.5 gap-2">
          {stats.map((stat, index) => {
            const rawValue =
              data?.[stat.key] ??
              (stat.fallbackKey ? data?.[stat.fallbackKey] : undefined) ??
              0;
            const displayValue = stat.formatCost
              ? formatCostValue(rawValue)
              : stat.format
                ? Number(rawValue || 0).toLocaleString()
                : rawValue;

            return (
              <React.Fragment key={index}>
                <div className="grid grid-cols-1 place-content-center flex-1 min-w-[80px] gap-1 text-center group">
                  <span className="text-mono text-2xl lg:text-2xl group-hover:text-muted-foreground leading-none font-semibold">
                    {displayValue}
                  </span>
                  <span className="text-secondary-foreground text-sm group-hover:text-muted-foreground">
                    {stat.label}
                  </span>
                </div>
                <span className="not-last:border-e border-e-input my-1" />
              </React.Fragment>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardMetrics;
