import { useMemo } from 'react';
import DonutChart from '@/components/custom/charts/reui/donut-chart';
import ChartInfoHover from './chart-info-hover';

export default function CertificatesChart({ apiData, isLoading }) {
  const certificateData = useMemo(() => {
    return (apiData?.certificates?.segments || []).map((s) => ({
      name: s.name,
      value: s.value,
      fill:
        s.name === 'Expired'
          ? '#ef4444'
          : s.name === 'Expiring < 30d'
            ? '#f59e0b'
            : '#10b981',
    }));
  }, [apiData]);

  return (
    <DonutChart
      title="SSL Certificates"
      titleBadge={
        <ChartInfoHover text="This graph displays the status of SSL/TLS certificates such as valid, expiring soon, or expired." />
      }
      data={certificateData}
      colors={['#ef4444', '#f59e0b', '#10b981']}
      centerLabel="Certificates"
      centerValue={apiData?.certificates?.total ?? 0}
      height={260}
      isLoading={isLoading}
    />
  );
}
