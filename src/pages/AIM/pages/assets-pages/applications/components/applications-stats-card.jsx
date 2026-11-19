import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import SmallCards from '../../components/card/card';

const StatsCards = ({ statsData, statsLoading }) => {
    const cardItems = useMemo(
        () =>
            statsData
                ? [
                    { number: String(statsData?.total || 0), label: 'Total Applications' },
                    { number: String(statsData?.live || 0), label: 'Live Applications' },
                    { number: String(statsData?.vulnerable || 0), label: 'Vulnerable Applications' },
                    { number: String(statsData?.with_criticals || 0), label: 'Critical Applications' },
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