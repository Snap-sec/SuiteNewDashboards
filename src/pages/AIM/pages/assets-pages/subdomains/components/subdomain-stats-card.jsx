import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import SmallCards from '../../components/card/card';

const StatsCards = ({ statsData, statsLoading }) => {
  const cardItems = useMemo(
    () =>
      statsData
        ? [
          {
            number: String(statsData?.total || 0),
            label: 'Total Subdomains',
          },
          {
            number: String(statsData.live || 0),
            label: 'Live Subdomains',
          },
          {
            number: String(statsData.vulnerable || 0),
            label: 'Vulnerable Subdomains',
          },
          { number: String(statsData.with_criticals || 0), label: 'Critical Subdomains' },
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
