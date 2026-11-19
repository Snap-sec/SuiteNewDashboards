import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import ActiveDonutChart from '@/components/custom/charts/reui/active-donut-chart';
import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DetailedHoverPopover from '@/components/custom/detailed-popover';

import { STATUS_COLORS, CHART_COLORS } from '@/pages/VM/constants';
const COLORS = [STATUS_COLORS.resolved, STATUS_COLORS.open, CHART_COLORS[1]];

function SlaOverview({ data, isLoading }) {
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
              This chart provides an overview of SLA compliance, showing the proportion of vulnerabilities that are within or outside their defined SLA timeframes.
            </p>
          }
        />
      }
      centerValue={`${total.toLocaleString()}%`}
      centerLabel="Total"
      activeIndex={activeIndex}
      activeOuterRadius={14}
      showLegend={true}
      height={300}
      className="h-full"
    />
  );
}

export default SlaOverview;
