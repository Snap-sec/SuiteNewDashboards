import { Skeleton } from '@/components/ui/skeleton';
import DonutChart from '@/components/custom/charts/donut-chart';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
function convertVulnDistributionData(data) {
  const order = ['critical', 'high', 'low', 'medium'];

  const values = order.map((key) => data[key]?.total || 0);
  const names = order.map((key) => key.toUpperCase());

  return { values, names };
}

const SecurityDistributionChart = ({
  vulnDistributionData = {},
  statsLoading,
}) => {
  const formattedData = convertVulnDistributionData(vulnDistributionData);

  const isEmpty = formattedData?.values?.every((value) => value === 0);

  return (
    <div className="w-full rounded-xl p-4 bg-card border border-border shadow-xs">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-medium flex items-center gap-2">
            Security Status Distribution
            <DetailedHoverPopover
                buttonText={
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground">
                    <CircleAlert className="h-4 w-4" />
                  </Button>
                }
                showBadge={false}
                popoverTitle="About this Graph"
                popoverContent={
                  <p className="text-muted-foreground">This graph illustrates the distribution of employees' security statuses across different severity levels.</p>
                }
            />
        </h2>
        {/* <div className="text-xs text-muted-foreground">Total: {totalVulns}</div> */}
      </div>

      {isEmpty && !statsLoading ? (
        <div className="flex flex-col justify-center items-center h-[300px] text-muted-foreground text-sm">
          <p>No data available</p>
        </div>
      ) : (
        <div className="flex justify-center items-center h-full">
          <DonutChart
            series={formattedData.values}
            labels={formattedData.names}
            colors={['#ff5724', '#ff8a66', '#ff9800', '#0ea5e9']}
            isLoading={statsLoading}
          />
        </div>
      )}
    </div>
  );
};

export default SecurityDistributionChart;
