import { useMemo } from 'react';
import { CircleAlert } from 'lucide-react';
import GetAssetTypeInfo from '@/components/custom/asset-icons';
import DonutChart from '@/components/custom/charts/reui/donut-chart';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import { Button } from '@/components/ui/button';

const RISK_COLORS = [
  '#F43F5E', // rose-500
  '#F97316', // orange-500
  '#F59E0B', // amber-500
  '#8B5CF6', // violet-500
  '#0EA5E9', // sky-500
  '#10B981', // emerald-500
  '#64748B', // slate-500
  '#D946EF', // fuchsia-500
];

export default function PortDistribution({ data = [], isLoading }) {
  const chartData = useMemo(() => {
    return data
      .filter((item) => item?.total_signals > 0)
      .map((item, idx) => ({
        name: GetAssetTypeInfo(item?.type).label || item?.type || 'Unknown',
        value: item.total_signals,
        fill: RISK_COLORS[idx % RISK_COLORS.length],
      }));
  }, [data]);

  const totalSignals = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.value, 0);
  }, [chartData]);

  return (
    <DonutChart
      data={chartData}
      isLoading={isLoading}
      title="Exposure Signals"
      titleBadge={
        <DetailedHoverPopover
          buttonText={
            <Button variant="ghost" size="sm">
              <CircleAlert className="h-4 w-4" />
            </Button>
          }
          showBadge={false}
          popoverTitle="About this Graph"
          popoverContent={
            <p className="text-muted-foreground">
              This chart shows the distribution of signals across asset types.
              Signals represent potential security concerns detected by your
              configured rules.
            </p>
          }
        />
      }
      centerLabel="Signals"
      centerValue={String(totalSignals)}
      showLegend={true}
      height={300}
    />
  );
}
