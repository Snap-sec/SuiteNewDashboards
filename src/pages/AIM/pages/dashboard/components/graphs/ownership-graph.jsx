import React, { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import DonutChart from '@/components/custom/charts/reui/donut-chart';

const OwnershipPiechart = ({ statsData, statsLoading }) => {
  const ownershipData = useMemo(() => {
    if (!statsData || typeof statsData !== 'object') return [];

    return Object.entries(statsData).map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: value || 0,
    }));
  }, [statsData]);

  if (statsLoading) {
    return <Skeleton className="w-full h-[400px]" />;
  }

  const isEmpty = ownershipData.every(item => item.value === 0);

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="font-normal">Asset Ownership</CardTitle>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className="flex justify-center items-center h-[321px] text-muted-foreground text-sm">
            No ownership data available.
          </div>
        ) : (
          <DonutChart
            data={ownershipData}
            isLoading={statsLoading}
            height={260}
            centerLabel="Total"
            showLegend={true}
            className="border-none shadow-none p-0"
          />
        )}
      </CardContent>
    </Card>
  );
};

export default OwnershipPiechart;
