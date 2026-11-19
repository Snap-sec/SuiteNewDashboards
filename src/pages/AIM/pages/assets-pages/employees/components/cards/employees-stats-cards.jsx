import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import SmallCards from '../../../components/card/card';

const StatsCards = ({ statsData, statsLoading }) => {
  const cardItems = useMemo(
    () =>
      statsData
        ? [
          { number: String(statsData?.total || 0), label: 'Total Employees' },
          { number: String(statsData?.external_employees || 0), label: 'External Employees' },
          { number: String(statsData?.active || 0), label: 'Active Employees' },
          { number: String(statsData?.not_active || 0), label: 'Inactive Employees' },
        ]
        : [],
    [statsData],
  );

  if (statsLoading) {
    return <Skeleton className="w-full h-[90px]" />;
  }

  return <SmallCards items={cardItems} isLoading={statsLoading} />;
};

export default StatsCards;
