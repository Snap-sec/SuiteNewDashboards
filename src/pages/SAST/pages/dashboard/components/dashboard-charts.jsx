import React, { useMemo } from 'react';
import DonutChart from '@/components/custom/charts/reui/donut-chart';
import ReBarChart from '@/components/custom/charts/reui/bar-chart';
import ReAreaChart from '@/components/custom/charts/reui/area-chart';

export function DashboardCharts({ data = {}, isLoading }) {
  const projectChartData = data.charts?.projects?.length > 0 ? data.charts.projects.map((item) => ({
    name: item.name || item.project || 'Unknown',
    count: item.count || item.vulnerabilities || item.value || 0,
  })) : [];

  const timelineChartData = data.charts?.vuln_timeline?.length > 0 ? data.charts.vuln_timeline.map((item) => ({
    date: item.date || item.name || 'Unknown',
    count: item.count || item.value || 0,
  })) : [];

  const severityChartData = useMemo(() => {
    const sev = data.charts?.severity || {};
    const total = (sev.critical || 0) + (sev.high || 0) + (sev.medium || 0) + (sev.low || 0) + (sev.info || 0);

    if (total === 0) return [];

    return [
      { name: 'Critical', value: sev.critical || 0, fill: '#ef4444' },
      { name: 'High', value: sev.high || 0, fill: '#f97316' },
      { name: 'Medium', value: sev.medium || 0, fill: '#eab308' },
      { name: 'Low', value: sev.low || 0, fill: '#3b82f6' },
      { name: 'Info', value: sev.info || 0, fill: '#64748b' },
    ];
  }, [data.charts]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DonutChart
        title="Severity Distribution"
        data={severityChartData}
        colors={['#ef4444', '#f97316', '#eab308', '#3b82f6', '#64748b']}
        height={260}
        centerLabel="Total CVEs"
        isLoading={isLoading}
      />
      <ReBarChart
        title="Project Distribution"
        data={projectChartData}
        xKey="name"
        keys={[{ key: 'count', label: 'Vulnerabilities' }]}
        height={260}
        colors={['#1379f0']}
        distributed
        isLoading={isLoading}
      />
      <ReAreaChart
        title="Vulnerability Timeline"
        data={timelineChartData}
        xKey="date"
        keys={[{ key: 'count', label: 'Vulnerabilities' }]}
        height={260}
        colors={['#f59e0b']}
        isLoading={isLoading}
      />
    </div>
  );
}
