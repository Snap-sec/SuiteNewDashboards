import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import SmallCards from '../../components/card/card';

const StatsCards = ({ statsData, statsLoading }) => {
  const cardItems = useMemo(
    () =>
      statsData
        ? [
          { number: String(statsData?.total || 0), label: 'Total APIs' },
          {
            number: String(statsData?.no_auth_endpoints || 0),
            label: 'No Auth APIs',
          },
          { number: String(statsData?.vulnerable || 0), label: 'Vulnerable APIs' },
          { number: String(statsData.with_criticals || 0), label: 'Critical APIs' },
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
