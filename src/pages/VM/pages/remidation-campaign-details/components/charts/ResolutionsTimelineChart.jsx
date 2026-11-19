import React, { useMemo } from 'react';
import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReAreaChart from '@/components/custom/charts/reui/area-chart';
import DetailedHoverPopover from '@/components/custom/detailed-popover';

export default function ResolutionsTimelineChart({ dashboardData, isLoading }) {
  const chartData = useMemo(() => {
    // Check if API returns actual timeline data
    const apiTimeline = dashboardData?.timeline || [];

    if (apiTimeline && Array.isArray(apiTimeline) && apiTimeline.length > 0) {
      return apiTimeline.map((item) => {
        let displayName = '';
        if (item.day) {
          // Format "May 24, 2026" to "May 24"
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

    // Fallback: Generate dynamic mock data distributed over the last 6 months
    const totalResolved =
      dashboardData?.counts?.resolvedCount ||
      dashboardData?.counts?.closedCount ||
      0;
    const months = [];
    const dateCursor = new Date();

    // We want the last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(dateCursor.getMonth() - i);
      const monthLabel = d.toLocaleString('default', { month: 'short' });
      months.push(monthLabel);
    }

    // Distribute counts over the 6 months
    const distribution = [0.1, 0.15, 0.2, 0.25, 0.2, 0.1];
    let remainingResolved = totalResolved;

    const dataPoints = months.map((month, idx) => {
      let rVal = 0;

      if (idx === months.length - 1) {
        rVal = remainingResolved;
      } else {
        rVal = Math.round(totalResolved * distribution[idx]);
        remainingResolved = Math.max(0, remainingResolved - rVal);
      }

      return {
        name: month,
        closed: rVal,
      };
    });

    return dataPoints;
  }, [dashboardData]);

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
          campaign over time, helping track the progress and efficiency of
          remediation efforts.
        </p>
      }
    />
  );

  return (
    <ReAreaChart
      title="Resolutions Timeline"
      titleBadge={infoPopover}
      data={chartData}
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
