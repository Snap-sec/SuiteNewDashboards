import React, { useMemo } from 'react';
import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RePieChart from '@/components/custom/charts/reui/pie-chart';
import DetailedHoverPopover from '@/components/custom/detailed-popover';

export default function RelevanceStatePieChart({ breakdown, isLoading }) {
  const chartData = useMemo(() => {
    if (!breakdown) return [];
    return Object.entries(breakdown).map(([name, value]) => ({
      name,
      value,
    }));
  }, [breakdown]);

  // Elegant, curated colors for different states
  const COLORS = ['#775DD0', '#008FFB', '#FEB019', '#FF4560', '#00E396'];

  const infoPopover = (
    <DetailedHoverPopover
      buttonText={
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
        >
          <CircleAlert className="h-4 w-4" />
        </Button>
      }
      showBadge={false}
      popoverTitle="State Breakdown"
      popoverContent={
        <p className="text-muted-foreground text-xs">
          Illustrates the distribution of vulnerabilities across their current status states within this relevance group.
        </p>
      }
    />
  );

  return (
    <RePieChart
      title="State Breakdown"
      titleBadge={infoPopover}
      data={chartData}
      colors={COLORS}
      isLoading={isLoading}
      showLegend={true}
      showLabels={true}
      height={250}
    />
  );
}
