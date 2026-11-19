import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ScansKpiCards({ stats = {}, isLoading }) {
  const items = [
    { label: 'Total Scans Executed', number: (stats.totalScans || 0).toLocaleString() },
    { label: 'Successful Scans', number: (stats.completedScans || 0).toLocaleString() },
    { label: 'Packages Inspected', number: (stats.totalPackagesInspected || 0).toLocaleString() },
    { label: 'Engine Status', number: 'Ready' },
  ];

  const renderItem = (item, index) => {
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
          {items.map((item, index) => renderItem(item, index))}
        </div>
      </CardContent>
    </Card>
  );
}
