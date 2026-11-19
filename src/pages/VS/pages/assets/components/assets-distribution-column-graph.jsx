import React, { useMemo } from 'react'
import ColumnGraph from './graph/columngraph'
import { Skeleton } from '@/components/ui/skeleton';

const AssetsDistributionColumnGraph = ({assetsData, assetsLoading}) => {
    // Transform assets data for the distribution graph
    const assetDistributionData = useMemo(() => {
    if (!assetsData?.assets?.length) return [];
    const distribution = {};
    assetsData.assets.forEach((asset) => {
        const type = asset.type || 'Unknown';
        distribution[type] = (distribution[type] || 0) + 1;
    });
    return Object.entries(distribution).map(([name, value]) => ({
        name,
        value,
    }));
    }, [assetsData?.assets]);
    if(assetsLoading){
        return <Skeleton className="w-full h-[400px] " />
    }
  return (
    <div className="w-full rounded-xl p-4 bg-card border border-border shadow-xs black/5">
          <h2 className="text-sm font-medium">Asset Distribution</h2>
          {assetDistributionData?.length > 0 && (
            <ColumnGraph
              data={assetDistributionData}
              isLoading={assetsLoading}
            />
          ) }
        </div>
  )
}

export default AssetsDistributionColumnGraph
