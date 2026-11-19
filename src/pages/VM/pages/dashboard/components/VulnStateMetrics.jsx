import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const VulnStateMetrics = ({ data, isLoading }) => {
  const stats = [
    { label: 'Total Vulns', number: data?.totalVulns || 0, skeletonWidth: 'w-16' },
    { label: 'In Review', number: data?.inReview || 0, skeletonWidth: 'w-14' },
    { label: 'Triaged', number: data?.triaged || 0, skeletonWidth: 'w-12' },
    { label: 'Unresolved', number: data?.unResolved || 0, skeletonWidth: 'w-16' },
    { label: 'Duplicate', number: data?.duplicate || 0, skeletonWidth: 'w-14' },
    { label: 'Retest', number: data?.retest || 0, skeletonWidth: 'w-10' },
    { label: 'Fixed In Staging', number: data?.fixedInStaging || 0, skeletonWidth: 'w-22' },
    { label: 'Resolved', number: data?.resolved || 0, skeletonWidth: 'w-14' },
    { label: 'Risk Accepted', number: data?.riskAcceptedVulns || 0, skeletonWidth: 'w-20' },
    { label: 'Rejected', number: data?.rejected || 0, skeletonWidth: 'w-14' },
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

  const renderSkeletonItems = (item, index) => {
    return (
      <React.Fragment key={index}>
        <div className="grid grid-cols-1 place-content-center justify-items-center flex-1 gap-1 text-center">
          <Skeleton className="h-6 w-8 my-0.5" />
          <Skeleton className={`h-3.5 ${item.skeletonWidth || 'w-14'} my-0.5`} />
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
            {stats.map((item, index) => renderSkeletonItems(item, index))}
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

export default VulnStateMetrics;
