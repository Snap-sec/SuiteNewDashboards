import { useMemo } from 'react';
import DonutChart from '@/components/custom/charts/reui/donut-chart';
import ChartInfoHover from './chart-info-hover';

export default function AssetsWithWithoutSignalsChart({ apiData, isLoading }) {
  const chartData = useMemo(() => {
    return (apiData?.assetsWithWithoutSignals?.segments || []).map((s) => ({
      name: s.name,
      value: s.value,
      fill: s.name === 'With signals' ? '#ef4444' : '#10b981',
    }));
  }, [apiData]);

  return (
    <DonutChart
      title="All Assets"
      titleBadge={
        <ChartInfoHover text="This graph displays the breakdown of total assets with or without security signals." />
      }
      data={chartData}
      colors={['#ef4444', '#10b981']}
      centerLabel="All Assets"
      centerValue={apiData?.assetsWithWithoutSignals?.total ?? apiData?.totalAssets ?? 0}
      height={260}
      isLoading={isLoading}
    />
  );
}
