import { useMemo } from 'react';
import { CircleAlert } from 'lucide-react';
import GetAssetTypeInfo from '@/components/custom/asset-icons';
import ReBarChart from '@/components/custom/charts/reui/bar-chart';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import { Button } from '@/components/ui/button';

const ASSET_COLORS = [
  '#0EA5E9', // sky-500
  '#10B981', // emerald-500
  '#F59E0B', // amber-500
  '#F43F5E', // rose-500
  '#8B5CF6', // violet-500
  '#64748B', // slate-500
  '#14B8A6', // teal-500
  '#D946EF', // fuchsia-500
];

export default function AssetDistributionChart({ data = [], isLoading }) {
  const chartData = useMemo(() => {
    return data.map((item, idx) => ({
      name: GetAssetTypeInfo(item?.type).label || item?.type || 'Unknown',
      count: item?.total || 0,
      fill: ASSET_COLORS[idx % ASSET_COLORS.length],
    }));
  }, [data]);

  return (
    <ReBarChart
      data={chartData}
      xKey="name"
      keys={[{ key: 'count', label: 'Assets' }]}
      distributed={true}
      colors={ASSET_COLORS}
      isLoading={isLoading}
      title="Asset Distribution"
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
              This chart shows the total number of discovered assets grouped by
              type, including subdomains, IPs, ports, certificates, and more.
            </p>
          }
        />
      }
      height={300}
      showYAxis={false}
      showBarLabel={true}
      xTickFormatter={(v) => (v.length > 10 ? `${v.substring(0, 10)}…` : v)}
    />
  );
}
