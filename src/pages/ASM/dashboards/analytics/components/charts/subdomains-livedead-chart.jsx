import { useMemo } from 'react';
import DonutChart from '@/components/custom/charts/reui/donut-chart';
import ChartInfoHover from './chart-info-hover';

export default function SubdomainsLiveDeadChart({ apiData, isLoading }) {
  const subdomainData = useMemo(() => {
    return (apiData?.subdomainsLiveDead?.segments || []).map((s) => ({
      name: s.name,
      value: s.value,
      fill: s.name === 'Live' ? '#10b981' : '#ef4444',
    }));
  }, [apiData]);

  return (
    <DonutChart
      title="Subdomains"
      titleBadge={
        <ChartInfoHover text="This graph displays the status of subdomains categorized as Dead or Live." />
      }
      data={subdomainData}
      colors={['#10b981', '#ef4444']}
      centerLabel="Subdomains"
      centerValue={apiData?.subdomainsLiveDead?.total ?? 0}
      height={260}
      isLoading={isLoading}
    />
  );
}
