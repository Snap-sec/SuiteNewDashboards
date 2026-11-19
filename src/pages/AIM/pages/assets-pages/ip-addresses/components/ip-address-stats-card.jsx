import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import SmallCards from '../../components/card/card';

const StatsCards = ({ statsData, statsLoading }) => {
  const cardItems = useMemo(
    () =>
      statsData
        ? [
          { number: String(statsData.total || 0), label: 'Total IPs' },
          {
            number: String(statsData.external || 0),
            label: 'External IPs',
          },
          {
            number: String(statsData.vulnerable || 0),
            label: 'Vulnerable IPs',
          },
          { number: String(statsData.with_criticals || 0), label: 'Critical IPs' },
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
