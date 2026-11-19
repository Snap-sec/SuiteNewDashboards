import { Skeleton } from '@/components/ui/skeleton';
import DonutChart from '@/components/custom/charts/reui/donut-chart';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import { Button } from '@/components/ui/button';
import { CircleAlert } from 'lucide-react';

const COLORS = [
  '#FF4560',
  '#00E396',
  '#008FFB',
  '#FEB019',
  '#775DD0',
  '#546E7A',
  '#26a69a',
  '#D10CE8',
];

function ViolationsByBusinessUnit({ data = [], isLoading }) {
  const chartData = data?.map(d => ({ name: d.name, value: d.breached }))

  return (
    <DonutChart
      data={chartData}
      isLoading={isLoading}
      colors={COLORS.slice(0, chartData.length)}
      title="Violations by Business Unit"
      centerLabel="Total"
      height={300}
      showLegend={true}
      className="h-full"
      titleBadge={
        <DetailedHoverPopover
          buttonText={
            <Button variant="ghost" size="sm" className="h-fit w-fit p-0">
              <CircleAlert className="h-4 w-4" />
            </Button>
          }
          showBadge={false}
          popoverTitle="About Violations by Business Unit"
          popoverContent={
            <p className="text-muted-foreground text-xs font-normal">
              This chart shows the number of SLA violations grouped by business unit.
            </p>
          }
        />
      }
    />
  );
}

export default ViolationsByBusinessUnit;
