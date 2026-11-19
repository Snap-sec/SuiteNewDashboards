import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import DonutChart from '@/components/custom/charts/reui/donut-chart';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
const EnvironmentDistributionChart = ({ statsData, statsLoading }) => {
  const chartData = useMemo(() => {
    const distribution = statsData?.environment_distribution || {};

    return Object.entries(distribution)
      .map(([key, value]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value
      }))
      .filter(item => item.value > 0);
  }, [statsData]);

  const isEmpty = chartData.length === 0;

  return (
    <div className="w-full rounded-xl p-4 bg-card border border-border shadow-xs">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-medium flex items-center gap-2">
            Environment Distribution
            <DetailedHoverPopover
                buttonText={
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground">
                    <CircleAlert className="h-4 w-4" />
                  </Button>
                }
                showBadge={false}
                popoverTitle="About this Graph"
                popoverContent={
                  <p className="text-muted-foreground">This graph breaks down the deployment environments where the assets reside.</p>
                }
            />
        </h2>
      </div>

      {isEmpty && !statsLoading ? (
        <div className="flex flex-col justify-center items-center h-[300px] text-muted-foreground text-sm">
          <p>No data available</p>
        </div>
      ) : (
        <DonutChart
          data={chartData}
          colors={['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6']}
          isLoading={statsLoading}
          showLegend={true}
          height={300}
          centerLabel="Total"
          className="border-none shadow-none p-0"
        />
      )}
    </div>
  );
};

export default EnvironmentDistributionChart;
