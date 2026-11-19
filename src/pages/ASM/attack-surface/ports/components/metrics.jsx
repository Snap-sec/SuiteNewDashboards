import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const Metrics = ({ metrics, isLoading }) => {
  const stats = [
    { label: 'Total Ports', number: metrics?.total || 0 },
    { label: 'Open Ports', number: metrics?.open || 0 },
    { label: 'Total External', number: metrics?.external || 0 },
    { label: 'Top Open Port', number: metrics?.top_open_port || '-' },
    { label: 'Total Signals', number: metrics?.alerts || 0 },
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
    return (
      <Card>
        <CardContent>
          <div className="flex lg:px-10 py-1.5 gap-2">
            {stats.map((_, index) => (
              <React.Fragment key={index}>
                <div className="grid grid-cols-1 place-items-center flex-1 gap-2 text-center py-1">
                  <Skeleton className="h-7 w-16" />
                  <Skeleton className="h-4 w-24" />
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

export default Metrics;
