import React, { useMemo } from 'react';
import ReBarChart from '@/components/custom/charts/reui/bar-chart';

export default function SeverityColumnChart({ severityCounts, isLoading }) {
  const chartData = useMemo(() => {
    return [
      { name: 'Critical', count: severityCounts?.critical || 0, fill: '#ef4444' },
      { name: 'High', count: severityCounts?.high || 0, fill: '#fb923c' },
      { name: 'Medium', count: severityCounts?.medium || 0, fill: '#eab308' },
      { name: 'Low', count: severityCounts?.low || 0, fill: '#3b82f6' },
      { name: 'None', count: severityCounts?.none || 0, fill: '#9ca3af' },
    ];
  }, [severityCounts]);

  const keys = useMemo(() => [{ key: 'count', label: 'Vulnerabilities' }], []);

  return (
    <ReBarChart
      title="Severity Distribution"
      data={chartData}
      xKey="name"
      keys={keys}
      distributed={true}
      isLoading={isLoading}
      height={250}
      showGrid={true}
      showYAxis={true}
      showBarLabel={true}
    />
  );
}
