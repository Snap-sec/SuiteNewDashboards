import { useMemo } from 'react';
import DonutChart from '@/components/custom/charts/reui/donut-chart';
import ChartInfoHover from './chart-info-hover';

const PORT_COLORS = ['#ef4444', '#f59e0b', '#008FFB', '#10b981', '#775DD0'];

export default function OpenPortsCountChart({ apiData, isLoading }) {
  const portsData = useMemo(() => {
    return (apiData?.openPortsCount?.segments || []).map((s, i) => ({
      name: s.name,
      value: s.value,
      fill: PORT_COLORS[i % PORT_COLORS.length],
    }));
  }, [apiData]);

  return (
    <DonutChart
      title="Open Ports"
      titleBadge={
        <ChartInfoHover text="This graph displays the distribution of open ports counts across assets." />
      }
      data={portsData}
      colors={PORT_COLORS}
      centerLabel="Ports"
      centerValue={apiData?.openPortsCount?.total ?? 0}
      height={260}
      isLoading={isLoading}
    />
  );
}
