import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const MetricsCard = ({ metrics, isLoading }) => {
  const stats = [
    { label: 'Total Threats', number: metrics?.total || 0 },
    { label: 'Pending', number: metrics?.state_distribution?.pending || 0 },
    { label: 'Acknowledged', number: metrics?.state_distribution?.acknowledged || 0 },
    { label: 'Risk Accepted', number: metrics?.state_distribution?.risk_accepted || 0 },
    { label: 'Fixed', number: metrics?.state_distribution?.fixed || 0 },
    { label: 'Fix Verified', number: metrics?.state_distribution?.fix_verified || 0 },
    { label: 'In Progress', number: metrics?.state_distribution?.in_progress || 0 },
    { label: 'Need More Info', number: metrics?.state_distribution?.need_more_info || 0 },
    { label: 'Rejected', number: metrics?.state_distribution?.need_more_info || 0 },

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
    return <Skeleton className="w-full h-[100px]" />;
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

export default MetricsCard;
