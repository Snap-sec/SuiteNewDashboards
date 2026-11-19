import { useMemo } from 'react';
import { CircleAlert } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import ReBarChart from '@/components/custom/charts/reui/bar-chart';

// Palette of 10 unique colors for the distribution graph
const RISK_COLORS = [
  '#3b82f6', // blue
  '#facc15', // yellow
  '#ef4444', // red
  '#10b981', // green
  '#8b5cf6', // purple
  '#f97316', // orange
  '#06b6d4', // cyan
  '#ec4899', // pink
  '#14b8a6', // teal
  '#9CA3AF'  // gray
];

const AssetsDistributionColumnGraph = ({ assetsData, assetsLoading }) => {
  const chartData = useMemo(() => {
    const dist = assetsData?.asset_type_distribution;
    if (!dist) return [];
    return Object.entries(dist)
      .map(([type, count]) => ({
        type: type,
        count,
      }))
      .sort((a, b) => a.type.localeCompare(b.type));
  }, [assetsData?.asset_type_distribution]);

  if (assetsLoading) {
    return <div className="w-full h-[350px] rounded-xl border bg-background p-4 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>

      {/* Bars */}
      <div className="flex items-end justify-between h-[250px] gap-3">
        {[40, 80, 55, 120, 90, 70].map((height, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center flex-1 gap-2"
          >
            <Skeleton
              className="w-full rounded-md"
              style={{ height }}
            />
            <Skeleton className="h-3 w-10" />
          </div>
        ))}
      </div>
    </div>
  }

  const popover = (
    <DetailedHoverPopover
      buttonText={
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          <CircleAlert className="h-4 w-4" />
        </Button>
      }
      showBadge={false}
      popoverTitle="Asset Type Distribution"
      popoverContent={
        <p className="text-muted-foreground">
          Displays the distribution of discovered assets by their respective types, such as subdomains, IPs, certificates, etc.
        </p>
      }
    />
  );

  return (
    <ReBarChart
      data={chartData}
      xKey="type"
      keys={[{ key: 'count', label: 'Count' }]}
      colors={RISK_COLORS}
      distributed={true}
      xTickFormatter={(v) => v}
      title="Asset Type Distribution"
      titleBadge={popover}
      height={250}
      className="flex-1 shadow-xs"
    />
  );
};

export default AssetsDistributionColumnGraph;
