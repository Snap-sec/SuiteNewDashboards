import { useMemo } from 'react';
import DonutChart from '@/components/custom/charts/reui/donut-chart';
import ChartInfoHover from './chart-info-hover';

export default function PortsChart({ apiData, isLoading }) {
  const portsData = useMemo(() => {
    return (apiData?.ports?.segments || []).map((s) => ({
      name: s.name,
      value: s.value,
      fill:
        s.name === 'Open'
          ? '#ef4444'
          : s.name === 'Filtered'
            ? '#f59e0b'
            : '#10b981',
    }));
  }, [apiData]);

  return (
    <DonutChart
      title="Ports"
      titleBadge={
        <ChartInfoHover text="This graph displays the distribution of open, filtered, and closed ports across external assets." />
      }
      data={portsData}
      colors={['#ef4444', '#f59e0b', '#10b981']}
      centerLabel="Ports"
      centerValue={apiData?.ports?.total ?? 0}
      height={260}
      isLoading={isLoading}
    />
  );
}
