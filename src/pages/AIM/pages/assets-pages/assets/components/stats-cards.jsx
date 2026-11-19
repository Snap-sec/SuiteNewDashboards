import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import MetricsCards from '../../../../../../components/custom/cards/metric-cards';

const StatsCards = ({ metrics = {}, assetsLoading }) => {
  const cardItems = useMemo(
    () =>
      metrics
        ? [
          // {
          //   number: String(metrics?.total_records || 0),
          //   label: 'Total Records',
          // },
          {
            number: String(metrics?.subdomains || 0),
            label: 'Subdomains',
          },
          {
            number: String(metrics?.ips || 0),
            label: 'IPs'
          },
          {
            number: String(metrics?.employees || 0),
            label: 'Employees',
          },
          {
            number: String(metrics?.apis || 0),
            label: 'APIs'
          },
          {
            number: String(metrics?.certificates || 0),
            label: 'Certificates',
          },
          {
            number: String(metrics?.dns || 0),
            label: 'DNS'
          },
          {
            number: String(metrics?.applications || 0),
            label: 'Applications',
          },
          // {
          //   number: String(metrics?.others || 0),
          //   label: 'Others',
          // },
        ]
        : [],
    [metrics],
  );
  if (assetsLoading) {
    return <Skeleton className="w-full h-[90px]" />;
  }
  return <MetricsCards items={cardItems} isLoading={assetsLoading} />;
};

export default StatsCards;
