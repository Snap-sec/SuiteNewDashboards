import RePieChart from '@/components/custom/charts/reui/pie-chart';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CategoryDistributionChart({ data, isLoading }) {
  const categoryData = (data || []).map(item => ({
    name: item.category,
    value: item.percentage
  }));

  const colors = [
    '#f43f5e', // red
    '#f59e0b', // orange
    '#3b82f6', // blue
    '#a78bfa', // purple
    '#22d3ee', // cyan
    '#22c55e', // green
  ];

  return (
    <RePieChart
      data={categoryData}
      colors={colors}
      height={230}
      title="Findings by Category"
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
              This chart displays the percentage distribution of findings across different security categories, helping identify primary risk domains.
            </p>
          }
        />
      }
      showLegend={true}
      showLabels={true}
      isLoading={isLoading}
    />
  );
}

export default CategoryDistributionChart;

