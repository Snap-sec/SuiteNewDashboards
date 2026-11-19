import { useMemo } from 'react';
import DonutChart from '@/components/custom/charts/reui/donut-chart';
import ChartInfoHover from './chart-info-hover';

export default function IpAddressesChart({ apiData, isLoading }) {
  const ipData = useMemo(() => {
    return (apiData?.ips?.segments || []).map((s) => ({
      name: s.name,
      value: s.value,
      fill: s.name === 'Live' ? '#008FFB' : '#546E7A',
    }));
  }, [apiData]);

  return (
    <DonutChart
      title="IP Addresses"
      titleBadge={
        <ChartInfoHover text="This graph compares active (live) versus dormant IP addresses across your infrastructure." />
      }
      data={ipData}
      colors={['#008FFB', '#546E7A']}
      centerLabel="IPs"
      centerValue={apiData?.ips?.total ?? 0}
      height={260}
      isLoading={isLoading}
    />
  );
}
