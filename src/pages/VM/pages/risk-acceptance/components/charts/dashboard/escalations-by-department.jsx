import { Skeleton } from '@/components/ui/skeleton';
import DonutChart from '@/components/custom/charts/reui/donut-chart';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import { Button } from '@/components/ui/button';
import { CircleAlert } from 'lucide-react';

const COLORS = ['#FF4560', '#00E396', '#008FFB', '#FEB019', '#775DD0', '#546E7A', '#26a69a', '#D10CE8'];

function EscalationsByDepartment({ data, isLoading }) {
  const chartData = data?.map((d) => ({
    name: d?.name,
    value: d?.count,
  })) ?? [];

  return (
    <DonutChart
      data={chartData}
      isLoading={isLoading}
      colors={COLORS}
      title="Escalations By Department"
      centerLabel="Total"
      showLegend={true}
      height={300}
      className="h-full"
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
              This chart shows the number of escalations by department.
            </p>
          }
        />
      }
    />
  );
}

export default EscalationsByDepartment;
