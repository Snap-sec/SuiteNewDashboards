import React, { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
// import ColumnGraph from './multi-column-graph';
import ColumnGraph from '../../../../../components/custom/charts/column-graph';


const MethodDistributionGraph = ({ statsData, statsLoading }) => {

  const vulnerabilityData = useMemo(() => {

    const distribution = statsData?.methodDistribution?.[0];

    if (!distribution) return [];

    const categories = ["GET", "POST", "PUT", "PATCH", "DELETE"];
    const series = [{ name: "Total", data: [distribution?.totalGet || 0, distribution?.totalPost || 0, distribution.totalPut || 0, distribution.totalPatch || 0, distribution?.totalDelete || 0] }];

    return { categories, series };
  }, [statsData?.methodDistribution]);

  const hasData = statsData?.methodDistribution?.totalGet || statsData?.methodDistribution?.totalPost || statsData?.methodDistribution?.totalPatch || statsData?.methodDistribution?.totalPut || statsData?.methodDistribution?.totalDelete;

  return (
    <div className="w-full rounded-xl p-4 bg-card border border-border shadow-xs black/5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-medium">Request Method Distribution</h2>
        {/* <div className="flex gap-4 text-xs text-muted-foreground">
          <span>GET: {statsData.methodDistribution[0].totalGet}</span>
          <span>POST: {statsData.methodDistribution[0].totalPost}</span>
          <span>PATCH: {statsData.methodDistribution[0].totalPost}</span>
          <span>DELETE: {statsData.methodDistribution[0].totalPost}</span>
        </div> */}
      </div>

      {!hasData && !statsLoading ? (
        <div className="flex flex-col justify-center items-center h-[300px] text-muted-foreground text-sm">
          <p>No data available</p>
        </div>
      ) : (
        <ColumnGraph series={vulnerabilityData.series} isLoading={statsLoading} xCategories={vulnerabilityData.categories} />
      )}
    </div>
  );
};

export default MethodDistributionGraph;
