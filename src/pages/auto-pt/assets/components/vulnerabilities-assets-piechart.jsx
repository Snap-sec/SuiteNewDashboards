import { useMemo } from 'react';
import { CircleAlert } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import DonutChart from '@/components/custom/charts/reui/donut-chart';

const COLORS = ['#FF4560', '#00E396'];

const VulnerabilitiesAssetsPiechart = ({ statsData, statsLoading }) => {
  const chartData = useMemo(() => [
    { name: 'Vulnerable', value: statsData?.vulnerable || 0 },
    { name: 'Safe', value: (statsData?.total - statsData?.vulnerable) || 0 },
  ], [statsData?.vulnerable, statsData?.total]);

  if (statsLoading) {
    return <div className="w-full h-[350px] rounded-xl border bg-background p-4 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>

      {/* Donut + Legend */}
      <div className="flex items-center justify-between flex-col h-[250px] gap-6">
        {/* Donut Skeleton */}
        <div className="relative flex items-center justify-center">
          <Skeleton className="h-36 w-36 rounded-full" />

          {/* Inner hole */}
          <div className="absolute h-16 w-16 rounded-full bg-background border" />

          {/* Center text */}
          <div className="absolute flex flex-col items-center gap-1">
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-4 w-8" />
          </div>
        </div>

        {/* Legend Skeleton */}
        <div className="flex flex-col gap-4 flex-1">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>

              <Skeleton className="h-4 w-10" />
            </div>
          ))}
        </div>
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
      popoverTitle="Vulnerable Assets"
      popoverContent={
        <p className="text-muted-foreground">
          Shows the percentage of assets that are safe versus those with
          vulnerabilities, giving a quick view of security posture.
        </p>
      }
    />
  );

  return (
    <DonutChart
      data={chartData}
      isLoading={statsLoading}
      colors={COLORS}
      title="Vulnerable Assets"
      titleBadge={popover}
      centerLabel="Total"
      showLegend={true}
      height={250}
      className="flex-1"
    />
  );
};

export default VulnerabilitiesAssetsPiechart;
