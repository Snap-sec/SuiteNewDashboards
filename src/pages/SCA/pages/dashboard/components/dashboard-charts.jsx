import React, { useMemo } from 'react';
import DonutChart from '@/components/custom/charts/reui/donut-chart';
import ReBarChart from '@/components/custom/charts/reui/bar-chart';

export function DashboardCharts({ data = {}, isLoading }) {
  const metrics = data.metrics || {};
  const ecosystemBreakdown = data.ecosystemBreakdown || [];
  const outdatedEcosystemBreakdown = data.outdatedEcosystemBreakdown || [];

  const severityChartData = useMemo(() => {
    return [
      { name: 'Critical', value: metrics.criticalCount || 0, fill: '#ef4444' },
      { name: 'High', value: metrics.highCount || 0, fill: '#f97316' },
      { name: 'Medium', value: metrics.mediumCount || 0, fill: '#eab308' },
      { name: 'Low', value: metrics.lowCount || 0, fill: '#3b82f6' },
    ];
  }, [metrics]);

  const ecosystemChartData = useMemo(() => {
    return ecosystemBreakdown.map((item) => ({
      name: item.ecosystem || 'Other',
      count: item.count || 0,
    }));
  }, [ecosystemBreakdown]);

  const outdatedEcosystemChartData = useMemo(() => {
    return outdatedEcosystemBreakdown.map((item) => ({
      name: item.ecosystem || 'Other',
      count: item.count || 0,
    }));
  }, [outdatedEcosystemBreakdown]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
      <DonutChart
        title="CVE Severity Distribution"
        data={severityChartData}
        colors={['#ef4444', '#f97316', '#eab308', '#3b82f6']}
        height={260}
        centerLabel="Total CVEs"
        isLoading={isLoading}
      />
      <ReBarChart
        title="Ecosystem Packages Distribution"
        data={ecosystemChartData}
        xKey="name"
        keys={[{ key: 'count', label: 'Packages' }]}
        height={260}
        colors={['#1379f0']}
        distributed
        isLoading={isLoading}
      />
      <ReBarChart
        title="Outdated Dependencies by Ecosystem"
        data={outdatedEcosystemChartData}
        xKey="name"
        keys={[{ key: 'count', label: 'Outdated' }]}
        height={260}
        colors={['#f59e0b']}
        distributed
        isLoading={isLoading}
      />
    </div>
  );
}
