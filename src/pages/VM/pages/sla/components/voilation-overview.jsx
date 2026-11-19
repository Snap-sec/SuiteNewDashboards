import { useMemo } from 'react';
import ActiveDonutChart from '@/components/custom/charts/reui/active-donut-chart';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import { Button } from '@/components/ui/button';
import { CircleAlert } from 'lucide-react';

const COLORS = ['#00E396', '#FF4560', '#008FFB'];

function SlaComplianceOverview({ data, isLoading }) {
  const chartData = useMemo(() => {
    if (!data) return [];
    return Object.entries(data).map(([key, value]) => ({
      name: key,
      value,
    }));
  }, [data]);

  const total = useMemo(
    () => chartData.reduce((sum, d) => sum + d.value, 0),
    [chartData],
  );

  // Highlight the largest slice (index 1 = unassigned) so the pop is clearly visible
  const activeIndex = 1;

  return (
    <ActiveDonutChart
      data={chartData}
      isLoading={isLoading}
      colors={COLORS}
      title="SLA Compliance Overview"
      centerValue={`${total.toLocaleString()}%`}
      centerLabel="Total"
      activeIndex={activeIndex}
      activeOuterRadius={14}
      valueSuffix="%"
      showLegend={true}
      height={300}
      className="h-full"
      titleBadge={
        <DetailedHoverPopover
          buttonText={
            <Button variant="ghost" size="sm" className="h-fit w-fit p-0">
              <CircleAlert className="h-4 w-4" />
            </Button>
          }
          showBadge={false}
          popoverTitle="About SLA Compliance"
          popoverContent={
            <p className="text-muted-foreground text-xs font-normal">
              This chart shows the percentage distribution of SLA compliance status.
            </p>
          }
        />
      }
    />
  );
}

export default SlaComplianceOverview;
