import React, { useMemo } from 'react'
import PieChart from '@/components/custom/charts/pie-chart'
import { Skeleton } from '@/components/ui/skeleton'

const ExposureDistributionPiechart = ({ statsData, statsLoading }) => {
  const exposureData = useMemo(
    () => {
      const overview = statsData?.overview;
      if (!overview) return [];

      return [
        { 
          name: 'Internal', 
          value: overview.internalTechnologies || 0
        },
        { 
          name: 'External', 
          value: overview.exposedTechnologies || 0
        }
      ];
    },
    [statsData?.overview]
  );

  if (statsLoading) {
    return <Skeleton className="w-full h-[400px]" />
  }


  return (
    <div className="w-full rounded-xl p-4 bg-card border border-border shadow-xs black/5">
        <h2 className="text-sm font-medium">Technology Exposure Distribution</h2>
        
        <PieChart 
          data={exposureData} 
          isLoading={statsLoading}
          colors={['#64748B', '#0EA5E9']} // slate-500, sky-500
        />

    </div>
  )
}

export default ExposureDistributionPiechart