import React, { useMemo } from 'react';
import RePieChart from '@/components/custom/charts/reui/pie-chart';

export default function StatePieChart({ stateBreakdown, isLoading }) {
  const chartData = useMemo(() => {
    if (!stateBreakdown) return [];
    return Object.entries(stateBreakdown).map(([name, value]) => ({
      name,
      value,
    }));
  }, [stateBreakdown]);

  // Elegant, curated colors for different states
  const COLORS = ['#775DD0', '#008FFB', '#FEB019', '#FF4560', '#00E396'];

  return (
    <RePieChart
      title="State Breakdown"
      data={chartData}
      colors={COLORS}
      isLoading={isLoading}
      showLegend={true}
      showLabels={true}
      height={250}
    />
  );
}
