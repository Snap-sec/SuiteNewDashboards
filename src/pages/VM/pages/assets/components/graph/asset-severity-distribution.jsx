import { useMemo } from 'react';
import { CircleAlert } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import ReBarChart from '@/components/custom/charts/reui/bar-chart';

// Low → blue, Medium → yellow, High → red
const RISK_COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6'];

const AssetSeverityDistribution = ({ statsData, statsLoading }) => {
  const chartData = useMemo(() => {
    if (!statsData) return [];
    return [
      { type: 'Critical', count: statsData.critical || 0 },
      { type: 'High', count: statsData.high || 0 },
      { type: 'Medium', count: statsData.medium || 0 },
      { type: 'Low', count: statsData.low || 0 },
    ];
  }, [statsData]);

  if (statsLoading) {
    return <div className="w-full h-[350px] rounded-xl border bg-background p-4 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>

      {/* Chart Area */}
      <div className="flex items-end justify-between h-[250px] gap-4">
        {[
          { height: 140, width: 'w-14' }, // Critical
          { height: 110, width: 'w-14' }, // High
          { height: 80, width: 'w-14' },  // Medium
          { height: 50, width: 'w-14' },  // Low
        ].map((bar, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-end gap-2 flex-1"
          >
            {/* Bar */}
            <Skeleton
              className={`${bar.width} rounded-md`}
              style={{ height: `${bar.height}px` }}
            />

            {/* Label */}
            <Skeleton className="h-3 w-12" />
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
      popoverTitle="Asset Severity Distribution"
      popoverContent={
        <p className="text-muted-foreground">
          Shows the distribution of assets based on their severity levels, helping to identify high-risk assets.
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
      title="Asset Severity Distribution"
      titleBadge={popover}
      height={250}
      className="flex-1 shadow-xs"
    />
  );
};

export default AssetSeverityDistribution;
