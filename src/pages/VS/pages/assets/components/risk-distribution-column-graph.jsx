import React, { useMemo } from 'react'
import ColumnGraph from './graph/columngraph';
import { Skeleton } from '@/components/ui/skeleton';

const RiskDistributionColumnGraph = ({assetsData, assetsLoading}) => {
    const riskDistributionData = useMemo(() => {
      const severityCounts = assetsData?.riskScore?.components?.severity?.counts || {};
      return [
        { name: 'Critical', value: severityCounts.critical || 0 },
        { name: 'High', value: severityCounts.high || 0 },
        { name: 'Medium', value: severityCounts.medium || 0 },
        { name: 'Low', value: severityCounts.low || 0 }
      ];
    }, [assetsData?.riskScore?.components?.severity?.counts]);
    if(assetsLoading){
        return <Skeleton className="w-full h-[400px] " />
    }
  return (
      <div className="w-full rounded-xl p-4 bg-card border border-border shadow-xs black/5">
          <h2 className="text-sm font-medium">Risk Distribution</h2>
          <ColumnGraph data={riskDistributionData}  isLoading={assetsLoading} />
        </div>
  )
}

export default RiskDistributionColumnGraph
