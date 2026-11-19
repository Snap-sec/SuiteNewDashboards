import ReAreaChart from '@/components/custom/charts/reui/area-chart';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FindingsTrendChart({ data, isLoading }) {
  const trendData = [
    { month: '', opened: 0, resolved: 0 },
    ...(data || []).map(item => {
      const date = new Date(item.month + "-01");
      return {
        month: date.toLocaleString('default', { month: 'short' }) || item.month,
        opened: item.opened,
        resolved: item.resolved
      };
    }),
  ];

  return (
    <ReAreaChart
      data={trendData}
      xKey="month"
      keys={[
        { key: 'opened', label: 'Opened' },
        { key: 'resolved', label: 'Resolved' },
      ]}
      colors={['#f43f5e', '#22c55e']}
      height={230}
      title="Findings Opened vs. Resolved"
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
              This graph displays the trend of security findings opened versus resolved over time, illustrating overall remediation progress.
            </p>
          }
        />
      }
      stacked={false}
      xTickFormatter={(v) => String(v)}
      isLoading={isLoading}
    />
  );
}

export default FindingsTrendChart;

