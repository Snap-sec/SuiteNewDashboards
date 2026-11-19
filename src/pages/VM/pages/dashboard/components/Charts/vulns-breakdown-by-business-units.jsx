import { Skeleton } from '@/components/ui/skeleton';
import RePieChart from '@/components/custom/charts/reui/pie-chart';
import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DetailedHoverPopover from '@/components/custom/detailed-popover';

import { CHART_COLORS as COLORS } from '@/pages/VM/constants';

function VulnsBreakdownByBusinessUnits({ data = [], isLoading }) {
  const chartData = Array.isArray(data)
    ? data.map((item) => ({ name: item.name, value: item.totalTickets }))
    : [];

  return (
    <RePieChart
      data={chartData}
      isLoading={isLoading}
      colors={COLORS.slice(0, chartData.length)}
      title="Vulnerabilities by Business Unit"
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
              This chart shows the distribution of vulnerabilities across different business units, helping to prioritize which areas have the highest security risks.
            </p>
          }
        />
      }
      height={330}
      showLegend={false}
      className="h-full"
      showLabels={true}
      isLoading={isLoading}
    />
  );
}

export default VulnsBreakdownByBusinessUnits;
