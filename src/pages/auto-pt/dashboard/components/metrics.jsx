import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const Metrics = ({ data, isLoading, onItemClick, alwaysShowInfo = false, className = '' }) => {
  const navigate = useNavigate();

  const rawData = data?.data?.data || data?.data || data || {};
  const severityDist =
    rawData?.distribution_by_severity ||
    rawData?.distributionBySeverity ||
    {};

  const critical = Number(
    rawData?.total_criticals ??
    rawData?.metrics?.total_critical ??
    severityDist?.critical ??
    0
  );

  const high = Number(
    rawData?.total_high ??
    rawData?.metrics?.total_high ??
    severityDist?.high ??
    0
  );

  const medium = Number(
    rawData?.total_medium ??
    rawData?.metrics?.total_medium ??
    severityDist?.medium ??
    0
  );

  const low = Number(
    rawData?.total_low ??
    rawData?.metrics?.total_low ??
    severityDist?.low ??
    0
  );

  const info = Number(
    rawData?.total_info ??
    rawData?.metrics?.total_info ??
    severityDist?.info ??
    severityDist?.none ??
    0
  );

  const calculatedTotal = critical + high + medium + low + info;
  const total = Number(
    rawData?.total_vulns ??
    rawData?.metrics?.total_vulns ??
    (calculatedTotal > 0 ? calculatedTotal : 0)
  );

  const stats = [
    {
      label: 'Total Vulns',
      number: total,
      dotColor: null,
      skeletonWidth: 'w-16',
      path: '/apt/vulnerabilities',
    },
    {
      label: 'Critical',
      number: critical,
      dotColor: '#E11D48',
      skeletonWidth: 'w-14',
      path: '/apt/vulnerabilities',
    },
    {
      label: 'High',
      number: high,
      dotColor: '#EA580C',
      skeletonWidth: 'w-12',
      path: '/apt/vulnerabilities',
    },
    {
      label: 'Medium',
      number: medium,
      dotColor: '#F59E0B',
      skeletonWidth: 'w-14',
      path: '/apt/vulnerabilities',
    },
    {
      label: 'Low',
      number: low,
      dotColor: '#3B82F6',
      skeletonWidth: 'w-12',
      path: '/apt/vulnerabilities',
    },
  ];

  if (info > 0 || alwaysShowInfo) {
    stats.push({
      label: 'Info',
      number: info,
      dotColor: '#94A3B8',
      skeletonWidth: 'w-10',
      path: '/apt/vulnerabilities',
    });
  }

  const renderItems = (item, index) => {
    return (
      <React.Fragment key={index}>
        <div
          onClick={() => (onItemClick ? onItemClick(item) : item.path && navigate(item.path))}
          className="grid grid-cols-1 place-content-center flex-1 gap-1 text-center group cursor-pointer transition-colors"
        >
          <span className="text-mono text-2xl lg:text-2xl group-hover:text-muted-foreground leading-none font-semibold">
            {item.number}
          </span>
          <span className="text-secondary-foreground text-sm group-hover:text-muted-foreground flex items-center justify-center gap-1.5">
            {/* {item.dotColor && (
              <span
                className="size-2 rounded-full shrink-0"
                style={{ backgroundColor: item.dotColor }}
              />
            )} */}
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
      <Card className={className}>
        <CardContent>
          <div className="flex lg:px-10 py-1.5 gap-2">
            {stats.map((item, index) => renderSkeletonItems(item, index))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardContent>
        <div className="flex lg:px-10 py-1.5 gap-2">
          {stats.map((item, index) => renderItems(item, index))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Metrics;
