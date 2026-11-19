import React, { useMemo } from 'react';
import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReAreaChart from '@/components/custom/charts/reui/area-chart';
import DetailedHoverPopover from '@/components/custom/detailed-popover';

export default function RelevanceResolutionsTimelineChart({ timeline, isLoading }) {
  const chartData = useMemo(() => {
    const apiTimeline = timeline || [];

    if (apiTimeline && Array.isArray(apiTimeline) && apiTimeline.length > 0) {
      return apiTimeline.map((item) => {
        let displayName = '';
        if (item.day) {
          displayName = item.day.split(',')[0];
        } else {
          displayName = item.month || item.date || item.label || '';
        }

        return {
          name: displayName,
          closed: item.closed !== undefined ? item.closed : item.resolved || 0,
        };
      });
    }

    return [];
  }, [timeline]);

  const keys = useMemo(() => [{ key: 'closed', label: 'Closed' }], []);

  // Semantic Colors: Emerald Green for Closed
  const colors = useMemo(() => ['#00E396'], []);

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
      popoverTitle="Resolutions Timeline"
      popoverContent={
        <p className="text-muted-foreground text-xs">
          This chart displays the number of closed vulnerabilities in this
          relevance group over time, helping track the progress and efficiency of
          remediation efforts.
        </p>
      }
    />
  );

  const hasData = useMemo(() => {
    return chartData.some((item) => Number(item.closed) > 0);
  }, [chartData]);

  return (
    <ReAreaChart
      title="Resolutions Timeline"
      titleBadge={infoPopover}
      data={hasData ? chartData : []}
      xKey="name"
      keys={keys}
      colors={colors}
      isLoading={isLoading}
      height={300}
      showGrid={true}
      xTickFormatter={(v) => String(v)}
    />
  );
}
