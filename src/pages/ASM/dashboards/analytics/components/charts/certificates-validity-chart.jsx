import { useMemo } from 'react';
import DonutChart from '@/components/custom/charts/reui/donut-chart';
import ChartInfoHover from './chart-info-hover';

export default function CertificatesValidityChart({ apiData, isLoading }) {
  const certificateData = useMemo(() => {
    return (apiData?.certificatesValidity?.segments || []).map((s) => ({
      name: s.name,
      value: s.value,
      fill: s.name === 'Valid' ? '#10b981' : '#ef4444',
    }));
  }, [apiData]);

  return (
    <DonutChart
      title="SSL Certificates Validity"
      titleBadge={
        <ChartInfoHover text="This graph displays the distribution of valid versus invalid SSL certificates." />
      }
      data={certificateData}
      colors={['#10b981', '#ef4444']}
      centerLabel="Certificates"
      centerValue={apiData?.certificatesValidity?.total ?? 0}
      height={260}
      isLoading={isLoading}
    />
  );
}
