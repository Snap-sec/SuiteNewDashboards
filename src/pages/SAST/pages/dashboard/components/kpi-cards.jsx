import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function KpiCards({ metrics = {}, isLoading }) {
  const stats = [
    { label: 'Total Repositories', number: metrics?.total_projects || 0 },
    { label: 'Vulnerable Repos', number: metrics?.vulnerable_projects || 0 },
    { label: 'Critical Vulns', number: metrics?.criticals || 0 },
    { label: 'Total Scans', number: metrics?.scans || 0 },
  ];

  const renderItems = (item, index) => {
    return (
      <React.Fragment key={index}>
        <div className="grid grid-cols-1 place-content-center flex-1 gap-1 text-center group py-1 min-w-[90px]">
          <span className="text-mono text-2xl lg:text-2xl group-hover:text-muted-foreground leading-none font-semibold">
            {item.number}
          </span>
          <span className="text-secondary-foreground text-xs lg:text-sm group-hover:text-muted-foreground whitespace-nowrap">
            {item.label}
          </span>
        </div>
        <span className="not-last:border-e border-e-input my-1"></span>
      </React.Fragment>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-3">
          <div className="flex flex-wrap lg:flex-nowrap lg:px-4 py-1.5 gap-2 overflow-x-auto">
            {stats.map((_, index) => (
              <React.Fragment key={index}>
                <div className="grid grid-cols-1 place-content-center flex-1 gap-1.5 text-center py-1 min-w-[90px] justify-items-center">
                  <Skeleton className="h-6 w-8 rounded" />
                  <Skeleton className="h-3.5 w-16 rounded" />
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
          {stats.map((item, index) => renderItems(item, index))}
        </div>
      </CardContent>
    </Card>
  );
}
