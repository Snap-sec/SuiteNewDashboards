import React from 'react';
import MetricsCards from '@/components/custom/cards/metric-cards';

const ExecutiveMetricsCards = ({ data = {}, isLoading }) => {
  const nextScanLabel = data?.next_scan
    ? new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(
      new Date(data.next_scan)
    )
    : 'Not Scheduled';

  const stats = [
    { label: 'Total Assets', number: data?.total_assets ?? 0, skeletonWidth: 'w-16' },
    { label: 'Risk Signals', number: data?.total_signals ?? 0, skeletonWidth: 'w-16' },
    { label: 'Exposures', number: data?.total_risks ?? 0, skeletonWidth: 'w-20' },
    { label: 'Next Scan', number: nextScanLabel, skeletonWidth: 'w-16' },
  ];

  return <MetricsCards items={stats} isLoading={isLoading} />;
};

export default ExecutiveMetricsCards;
