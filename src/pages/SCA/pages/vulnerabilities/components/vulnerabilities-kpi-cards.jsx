import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function VulnerabilitiesKpiCards({ stats = {}, isLoading }) {
  const items = [
    { label: 'Total CVEs', number: (stats?.totalVulnerabilities || 0).toLocaleString() },
    { label: 'Critical', number: (stats?.critical || 0).toLocaleString() },
    { label: 'High', number: (stats?.high || 0).toLocaleString() },
    { label: 'Medium', number: (stats?.medium || 0).toLocaleString() },
    { label: 'Low', number: (stats?.low || 0).toLocaleString() },
  ];

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-3">
          <div className="flex flex-wrap lg:flex-nowrap lg:px-4 py-1.5 gap-2 overflow-x-auto">
            {items.map((_, index) => (
              <React.Fragment key={index}>
                <div className="grid grid-cols-1 place-content-center flex-1 gap-1.5 text-center py-1 min-w-[90px] justify-items-center">
                  <Skeleton className="h-6 w-8 rounded" />
                  <Skeleton className="h-3.5 w-20 rounded" />
                </div>
                <span className="not-last:border-e border-e-input my-1"></span>
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex flex-wrap lg:flex-nowrap lg:px-4 py-1.5 gap-2 overflow-x-auto">
          {items.map((item, index) => (
            <React.Fragment key={index}>
              <div className="grid grid-cols-1 place-content-center flex-1 gap-1 text-center py-1 min-w-[90px]">
                <span className="text-mono text-2xl lg:text-2xl leading-none font-semibold text-foreground">
                  {item.number}
                </span>
                <span className="text-secondary-foreground text-xs lg:text-sm whitespace-nowrap font-medium">
                  {item.label}
                </span>
              </div>
              <span className="not-last:border-e border-e-input my-1"></span>
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
