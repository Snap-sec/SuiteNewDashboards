import React from 'react';
import MetricsCards from '@/components/custom/cards/metric-cards';
import { Building } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function VendorStats({ summary, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  const statsItems = [
    {
      label: 'Total Service Vendors',
      number: summary?.total || 0,
    },
    {
      label: 'Active Service Vendors',
      number: summary?.active || 0,
    },
    {
      label: 'Inactive Service Vendors',
      number: summary?.inactive || 0,
    },
  ];

  return <MetricsCards items={statsItems} />;
}
