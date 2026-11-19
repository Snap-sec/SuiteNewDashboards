import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const DashboardStatsCards = ({ data, isLoading }) => {
  const stats = [
    { label: 'Total Escalations', number: data?.totalEscalation || 0 },
    { label: 'Pending Requests', number: data?.pendingRequests || 0 },
    { label: 'Approved Requests', number: data?.approvedRequests || 0 },
    { label: 'Rejected Requests', number: data?.rejectedRequests || 0 },
  ];

  const renderItems = (item, index) => {
    return (
      <React.Fragment key={index}>
        <div className="grid grid-cols-1 place-content-center flex-1 gap-1 text-center group">
          <span className="text-mono text-2xl lg:text-2xl group-hover:text-muted-foreground leading-none font-semibold">
            {item.number}
          </span>
          <span className="text-secondary-foreground text-sm group-hover:text-muted-foreground ">
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
            {[...Array(4)].map((_, i) => (
              <div key={i} className="grid grid-cols-1 place-content-center flex-1 gap-1 text-center group">
                <Skeleton className="h-6 w-16 mx-auto" />
                <Skeleton className="h-4 w-24 mx-auto" />
              </div>
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

export default DashboardStatsCards;
