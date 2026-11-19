import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const VulnStateMetrics = ({ data = {}, isLoading }) => {
  const stats = [
    {
      label: 'Total Projects',
      number: data?.total_pentests ?? data?.total_applications ?? 0,
    },
    {
      label: 'Total Vulnerabilities',
      number: data?.total_vulns ?? 0,
    },
    {
      label: 'Critical',
      number: data?.total_criticals ?? data?.total_critical ?? 0,
    },
    {
      label: 'High',
      number: data?.total_high ?? data?.applications_with_active_scans ?? 0,
    },
  ];

  const renderItems = (item, index) => {
    return (
      <React.Fragment key={index}>
        <div
          className="grid grid-cols-1 place-content-center flex-1 gap-1 text-center cursor-pointer"
        >
          <span className="text-mono text-2xl lg:text-2xl leading-none font-semibold">
            {item.number}
          </span>
          <span className="text-secondary-foreground text-sm">
            {item.label}
          </span>
        </div>
        <span className="not-last:border-e border-e-input my-1"></span>
      </React.Fragment>
    );
  };

  if (isLoading) {
    return <Skeleton className="w-full h-[90px]" />;
  }

  return (
    <Card>
      <CardContent>
        <div className="flex lg:px-10 py-1.5 gap-2">
          {stats.map((item, index) => {
            return renderItems(item, index);
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default VulnStateMetrics;
