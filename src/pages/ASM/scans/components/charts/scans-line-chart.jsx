import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import LineChart from '@/components/custom/charts/line-chart';

const ScansLineChart = ({ scansData = [], isStatsLoading }) => {
  if (isStatsLoading) {
    return <Skeleton className="w-full h-[330px] rounded-2xl" />;
  }

  const formattedData = scansData?.assets?.map((item) => ({
    _id: item.date,
    total: item.count.assetCount,
    date: item.date,
  }));

  return (
    <>
      {formattedData?.length == 0 ? (
        <div className="flex flex-col justify-center items-center h-[200px] lg:h-[250px] text-muted-foreground text-sm bg-card border border-border shadow-xs rounded-xl">
          <p>No data available</p>
        </div>
      ) : (
        <LineChart timeline={formattedData} chartTitle="Assets Detected"/>
      )}
    </>
  );
};

export default ScansLineChart;
