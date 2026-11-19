import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import SmallCards from './card/card';

const StatsCards = ({ statsData, statsLoading }) => {
  const cardItems = useMemo(
    () =>
      statsData
        ? [
            {
              number: String(statsData.overview.totalTechnologies || 0),
              label: 'Total Technologies',
            },
            {
              number: String(statsData?.overview.totalAssets || 0),
              label: 'Total Assets',
            },
            {
              number: String(statsData.overview.internalTechnologies || 0),
              label: 'Internal Technologies',
            },
            {
              number: String(statsData.overview.exposedTechnologies || 0),
              label: 'External Technologies',
            },
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
