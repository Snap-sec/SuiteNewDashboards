import { useMemo } from 'react'
import Cards from './card/card';
import { Skeleton } from '@/components/ui/skeleton';

const StatsCards = ({statsData, statsLoading}) => {
    const cardItems = useMemo(
        () =>
          statsData
            ? [
                { number: String(statsData?.totalAssets || 0), label: 'Total Assets' },
                { number: String(statsData?.vulnerableAssets || 0), label: 'Vulnerable Assets' },
                { number: String(statsData?.safeAssets || 0), label: 'Safe Assets' },
                {
                  number: String(statsData?.scanCoveragePercent + "%" || 0),
                  label: 'Scan Coverage',
                },
              ]
            : [],
        [statsData],
    );
    if(statsLoading){
        return <Skeleton className="w-full h-[90px]" />
    }
  return (
    <Cards items={cardItems} isLoading={statsLoading} />
  )
}

export default StatsCards
