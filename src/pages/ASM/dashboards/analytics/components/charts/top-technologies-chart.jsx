import { useMemo } from 'react';
import ReBarChart from '@/components/custom/charts/reui/bar-chart';
import ChartInfoHover from './chart-info-hover';

const countKey = [{ key: 'count', label: 'Count' }];

const TECH_COLORS = [
  '#008FFB',
  '#775DD0',
  '#FEB019',
  '#00E396',
  '#FF4560',
  '#26a69a',
];

export default function TopTechnologiesChart({ apiData, isLoading }) {
  const techBarData = useMemo(() => {
    return (apiData?.technologies || []).map((t) => ({
      name: t.name,
      count: t.value,
    }));
  }, [apiData]);

  return (
    <ReBarChart
      title="Top Technologies"
      titleBadge={
        <ChartInfoHover text="This graph shows the distribution of identified technology stacks across your attack surface." />
      }
      data={techBarData}
      xKey="name"
      keys={countKey}
      colors={TECH_COLORS}
      distributed
      height={260}
      xTickFormatter={(v) => v}
      isLoading={isLoading}
    />
  );
}
