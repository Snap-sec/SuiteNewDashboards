import { useMemo } from 'react';
import DonutChart from '@/components/custom/charts/reui/donut-chart';
import ChartInfoHover from './chart-info-hover';

export default function IpAddressesScopeChart({ apiData, isLoading }) {
  const ipData = useMemo(() => {
    return (apiData?.ipsNetworkScope?.segments || []).map((s) => ({
      name: s.name,
      value: s.value,
      fill: s.name === 'Internal' ? '#008FFB' : '#FEB019',
    }));
  }, [apiData]);

  return (
    <DonutChart
      title="IP Network Scope"
      titleBadge={
        <ChartInfoHover text="This graph compares internal versus external IP addresses across your infrastructure." />
      }
      data={ipData}
      colors={['#008FFB', '#FEB019']}
      centerLabel="IPs"
      centerValue={apiData?.ipsNetworkScope?.total ?? 0}
      height={260}
      isLoading={isLoading}
    />
  );
}
