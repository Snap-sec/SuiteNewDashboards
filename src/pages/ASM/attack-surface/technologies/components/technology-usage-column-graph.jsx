import  { useMemo } from 'react'
import ColumnGraph from '@/components/custom/charts/column-graph'
import { Skeleton } from '@/components/ui/skeleton'

const TechnologyUsageColumnGraph = ({ statsData, statsLoading }) => {
  const technologyData = useMemo(
    () => {
      const distribution = statsData?.technologyUsage;
      if (!distribution) return [];

      return Object.entries(distribution)
        .map(([name, data]) => ({
          name: name,
          value: data.assets
        }))
        .sort((a, b) => b.value - a.value); // sort by usage count desc
    },
    [statsData?.technologyUsage]
  );

  if (statsLoading) {
    return <Skeleton className="w-full h-[400px]" />
  }


  return (
    <div className="w-full rounded-xl p-4 bg-card border border-border shadow-xs black/5">
        <h2 className="text-sm font-medium">Technology Usage Distribution</h2>
        <ColumnGraph 
          data={technologyData} 
          isLoading={statsLoading} 
          colors={[
            '#0EA5E9', // sky-500
            '#10B981', // emerald-500
            '#F59E0B', // amber-500
            '#F43F5E', // rose-500
            '#8B5CF6', // violet-500
            '#64748B', // slate-500
            '#14B8A6', // teal-500
            '#D946EF', // fuchsia-500
          ]}
        />
    </div>
  )
}

export default TechnologyUsageColumnGraph