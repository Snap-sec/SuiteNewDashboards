import { useMemo } from 'react'
import { Skeleton } from '@/components/ui/skeleton';
import SmallCards from '../../components/card/card';


const StatsCards = ({ statsData, statsLoading }) => {
    const cardItems = useMemo(
        () =>
            statsData
                ? [
                    { number: String(statsData?.total || 0), label: 'Total Repos' },
                    { number: String(statsData?.active || 0), label: 'Active Repos' },
                    { number: String(statsData?.vulnerable || 0), label: 'Vulnerable Repos' },
                    { number: String(statsData?.archived || 0), label: 'Archived Repos' },
                ]
                : [],
        [statsData],
    );
    if (statsLoading) {
        return <Skeleton className="w-full h-[90px]" />
    }
    return (
        <SmallCards items={cardItems} isLoading={statsLoading} />
    )
}

export default StatsCards