import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const EndpointMetrics = ({ metrics, isLoading, totalCertificates }) => {
  const stats = [
    { label: 'Total Endpoints', number: metrics?.endpointStats?.[0]?.totalEndpoints || 0 },
    { label: 'Endpoints With Open Threats', number: metrics?.endpointStats?.[0]?.endpointsWithOpenThreats || 0 },
    { label: 'Endpoints With No Threats', number: metrics?.endpointStats?.[0]?.endpointsWithNoThreats || 0 },
  ];

  const renderItems = (item, index) => {
    return (
      <React.Fragment key={index}>
        <div className="grid grid-cols-1 place-content-center flex-1 gap-1 text-center">
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

export default EndpointMetrics;
