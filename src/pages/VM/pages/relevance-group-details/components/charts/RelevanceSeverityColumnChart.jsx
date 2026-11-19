import React, { useMemo } from 'react';
import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReBarChart from '@/components/custom/charts/reui/bar-chart';
import DetailedHoverPopover from '@/components/custom/detailed-popover';

export default function RelevanceSeverityColumnChart({ breakdown, isLoading }) {
  const chartData = useMemo(() => {
    return [
      { name: 'Critical', count: breakdown?.critical || 0, fill: '#ef4444' },
      { name: 'High', count: breakdown?.high || 0, fill: '#fb923c' },
      { name: 'Medium', count: breakdown?.medium || 0, fill: '#eab308' },
      { name: 'Low', count: breakdown?.low || 0, fill: '#3b82f6' },
      { name: 'None', count: breakdown?.none || 0, fill: '#9ca3af' },
    ];
  }, [breakdown]);

  const keys = useMemo(() => [{ key: 'count', label: 'Vulnerabilities' }], []);

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
      popoverTitle="Severity Distribution"
      popoverContent={
        <p className="text-muted-foreground text-xs">
          Shows the distribution of vulnerabilities categorized by severity levels within this relevance group.
        </p>
      }
    />
  );

  return (
    <ReBarChart
      title="Severity Distribution"
      titleBadge={infoPopover}
      data={chartData}
      xKey="name"
      keys={keys}
      distributed={true}
      isLoading={isLoading}
      height={250}
      showGrid={true}
      showYAxis={true}
      showBarLabel={true}
    />
  );
}
