import { useMemo } from 'react';
import {
  FileBadge,
  AlertCircle,
  Clock,
  ShieldX,
} from 'lucide-react';
import SmallCards from '../../components/card/card';
import { Skeleton } from '@/components/ui/skeleton';

const StatsCards = ({ statsData, statsLoading }) => {
  const cardItems = useMemo(
    () =>
      statsData
        ? [
          { number: String(statsData?.total || 0), label: 'Total Certificates' },
          { number: String(statsData?.expired || 0), label: 'Expired Certificates' },
          { number: String(statsData?.about_to_expire || 0), label: 'Expiring Soon' },
          { number: String(statsData?.valid || 0), label: 'Valid Certificates' },
        ]
        : [],
    [statsData],
  );
  if (statsLoading) {
    return <Skeleton className="w-full h-[90px]" />
  }
  return <SmallCards items={cardItems} isLoading={statsLoading} />;
};

export default StatsCards;
