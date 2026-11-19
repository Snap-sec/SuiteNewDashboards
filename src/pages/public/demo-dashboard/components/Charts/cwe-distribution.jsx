import React, { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import ColumnGraph from '@/components/custom/charts/column-graph';

const DistributionChart = ({ data = [], isLoading }) => {
  // Transform assets data for the distribution graph
  const formattedCveDisrtibutionData = data?.slice(0, 10)?.map((item) => ({
    name: item?.cwe?.toUpperCase(),
    value: item?.count,
  }));

  if (isLoading) {
    return <Skeleton className="w-full h-[400px]" />;
  }

  return (
    <div className="w-full h-full rounded-xl p-4 bg-card border border-border shadow-xs black/5">
      <h2 className="text-sm font-medium">Cwe Distribution</h2>
      {formattedCveDisrtibutionData?.length > 0 ? (
        <div className=" flex justify-center items-center h-full">
          <ColumnGraph
            data={formattedCveDisrtibutionData}
            isLoading={isLoading}
          />
        </div>
      ) : (
        <div className="w-full h-[200px] flex items-center justify-center text-muted-foreground text-sm">
          <span>No Data Available</span>
        </div>
      )}
    </div>
  );
};

export default DistributionChart;
