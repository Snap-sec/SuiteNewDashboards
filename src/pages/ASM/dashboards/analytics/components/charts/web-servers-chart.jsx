import { useMemo } from 'react';
import DonutChart from '@/components/custom/charts/reui/donut-chart';
import ChartInfoHover from './chart-info-hover';

const SERVER_COLORS = ['#008FFB', '#775DD0', '#FEB019', '#546E7A'];

export default function WebServersChart({ apiData, isLoading }) {
  const webServersData = useMemo(() => {
    return (apiData?.webServers?.segments || []).map((s, i) => ({
      name: s.name,
      value: s.value,
      fill:
        s.name === 'Unidentified'
          ? '#546E7A'
          : SERVER_COLORS[i % SERVER_COLORS.length],
    }));
  }, [apiData]);

  return (
    <DonutChart
      title="Web Servers"
      titleBadge={
        <ChartInfoHover text="This graph displays the breakdown of identified web servers and unidentified services." />
      }
      data={webServersData}
      colors={SERVER_COLORS}
      centerLabel="Servers"
      centerValue={apiData?.webServers?.total ?? 0}
      height={260}
      isLoading={isLoading}
    />
  );
}
