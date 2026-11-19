import { useMemo } from 'react';
import DonutChart from '@/components/custom/charts/reui/donut-chart';
import ChartInfoHover from './chart-info-hover';

export default function SubdomainsChart({ apiData, isLoading }) {
  const subdomainData = useMemo(() => {
    return (apiData?.subdomains?.segments || []).map((s) => ({
      name: s.name,
      value: s.value,
      fill: s.name === 'WAF protected' ? '#10b981' : '#ef4444',
    }));
  }, [apiData]);

  return (
    <DonutChart
      title="Subdomains"
      titleBadge={
        <ChartInfoHover text="This graph displays the distribution of organization subdomains by WAF protection status." />
      }
      data={subdomainData}
      colors={['#ef4444', '#10b981']}
      centerLabel="Subdomains"
      centerValue={apiData?.subdomains?.total ?? 0}
      height={260}
      isLoading={isLoading}
    />
  );
}
