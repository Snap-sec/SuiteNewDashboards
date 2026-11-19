import React, { useMemo } from 'react'
import PieChart from './graph/pie-chart';
import { Skeleton } from '@/components/ui/skeleton';

const VulnerabilitiesAssetsPiechart = ({statsData, statsLoading}) => {
  const vulnerabilityData = useMemo(
      () => [
        { name: 'Vulnerable', value: statsData?.tested || 0 },
        { name: 'Safe', value: statsData?.untested || 0 },
      ],
      [statsData?.tested, statsData?.untested],
    );
    if(statsLoading){
        return <Skeleton className="w-full h-[400px] " />
    }
  return (
    <div className="w-full rounded-xl p-4 bg-card border border-border shadow-xs black/5">
          <h2 className="text-sm font-medium">Vulnerable Assets</h2>
          <div className="flex justify-center items-center h-full">
              <PieChart data={vulnerabilityData} isLoading={statsLoading} />
          </div>
        </div>
  )
}

export default VulnerabilitiesAssetsPiechart
