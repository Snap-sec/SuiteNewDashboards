import React, { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import ColumnGraph from '@/components/custom/charts/column-graph';

const VulnsTimelineChart = ({ data, tagsLoading = false }) => {
  const vulnTimelineData = useMemo(() => {
    // If data is already in the correct array format
    if (Array.isArray(data)) {
      return data.map((item) => ({
        name: item.date, // x-axis label
        value: item.count, // y-axis value
      }));
    }

    // If data might be an object (fallback)
    if (data && typeof data === 'object' && !Array.isArray(data.assets)) {
      return Object.entries(data).map(([name, value]) => ({
        name,
        value,
      }));
    }

    return [];
  }, [data]);

  if (tagsLoading) {
    return <Skeleton className="w-full h-[400px]" />;
  }

  return (
    <div className="w-full rounded-xl p-4 bg-card border border-border shadow-xs black/5 mt-5">
      <h2 className="text-sm font-medium">Vulnerabilities Over Time</h2>
      {vulnTimelineData.length > 0 ? (
        <ColumnGraph data={vulnTimelineData} isLoading={tagsLoading} />
      ) : (
        <p className="text-sm text-muted-foreground mt-4">No data available</p>
      )}
    </div>
  );
};

export default VulnsTimelineChart;
