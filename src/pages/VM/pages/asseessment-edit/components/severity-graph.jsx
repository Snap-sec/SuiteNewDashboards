import { useMemo } from 'react';
import DonutChart from '@/components/custom/charts/reui/donut-chart';
import { CircleAlert } from 'lucide-react';
import { Button } from "@/components/ui/button";
import DetailedHoverPopover from '@/components/custom/detailed-popover';

const SEVERITY_COLORS = [
  '#ef4444', // Critical — red
  '#f97316', // High     — orange
  '#eab308', // Medium   — yellow
  '#3b82f6', // Low      — blue
];

const SeverityGraph = ({ title, asset, loading }) => {
  const chartData = useMemo(() => [
    { name: 'Critical', value: asset?.critical?.count ?? 0 },
    { name: 'High', value: asset?.high?.count ?? 0 },
    { name: 'Medium', value: asset?.medium?.count ?? 0 },
    { name: 'Low', value: asset?.low?.count ?? 0 },
  ], [asset]);

  return (
    <DonutChart
      data={chartData}
      colors={SEVERITY_COLORS}
      title={title}
      titleBadge={
        <DetailedHoverPopover
          buttonText={
            <Button type="button" variant="ghost" size="sm">
              <CircleAlert className="h-4 w-4" />
            </Button>
          }
          showBadge={false}
          popoverTitle="About this Graph"
          popoverContent={
            <p className="text-muted-foreground">
              This chart shows the breakdown of active vulnerabilities by their severity level (Critical, High, Medium, Low), illustrating the current risk profile.
            </p>
          }
        />
      }
      centerLabel="Total"
      isLoading={loading}
      showLegend={true}
      height={265}
      className="h-full"
    />
  );
};

export { SeverityGraph };

