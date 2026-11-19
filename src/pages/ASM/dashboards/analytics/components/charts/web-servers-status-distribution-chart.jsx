import { useMemo } from 'react';
import ReBarChart from '@/components/custom/charts/reui/bar-chart';
import ChartInfoHover from './chart-info-hover';

const valueKey = [{ key: 'value', label: 'Web Servers' }];

const SERVER_COLORS = ['#008FFB', '#775DD0', '#FEB019', '#00E396', '#FF4560', '#546E7A'];

export default function WebServersStatusDistributionChart({ apiData, isLoading }) {
  const webServersData = useMemo(() => {
    return (apiData?.webServersStatusDistribution?.segments || []).map((s) => ({
      name: s.name,
      value: s.value,
    }));
  }, [apiData]);

  return (
    <ReBarChart
      title="Web Servers Status Distribution"
      titleBadge={
        <ChartInfoHover text="This graph displays the HTTP status code distribution across web servers." />
      }
      data={webServersData}
      xKey="name"
      keys={valueKey}
      colors={SERVER_COLORS}
      distributed
      height={260}
      isLoading={isLoading}
    />
  );
}
