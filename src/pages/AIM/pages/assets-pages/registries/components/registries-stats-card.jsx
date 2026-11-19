import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import SmallCards from '../../components/card/card';

const StatsCards = ({ statsData, statsLoading }) => {
  const cardItems = useMemo(
    () =>
      statsData
        ? [
          { number: String(statsData?.total || 0), label: 'Total Registries' },
          { number: String(statsData?.vulnerable || 0), label: 'Vulnerable Registries' },
          { number: String(statsData?.critical || 0), label: 'Critical Registries' },
          { number: String(statsData?.archived || 0), label: 'Archived Registries' },
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
