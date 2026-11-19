import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import ReBarChart from '@/components/custom/charts/reui/bar-chart';
import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import { formatDaysToHumanReadable } from '@/lib/helpers';

const SEVERITIES = ['Low', 'Medium', 'High', 'Critical'];
const KEYS = [{ key: 'days', label: 'Mean Time to Close' }];
import { SEVERITY_COLORS } from '@/pages/VM/constants';
const COLORS = [SEVERITY_COLORS.low, SEVERITY_COLORS.medium, SEVERITY_COLORS.high, SEVERITY_COLORS.critical, SEVERITY_COLORS.none];

const MeanTimeToClose = ({ data, isLoading }) => {
  const chartData = useMemo(() => {
    const meanData = data?.meanDaysToCloseVuln || {};

    return SEVERITIES.map((severity) => {
      const k = severity.toLowerCase();
      const value = meanData[k] || 0;
      return {
        severity,
        days: value,
      };
    });
  }, [data]);

  return (
    <ReBarChart
      data={chartData}
      xKey="severity"
      keys={KEYS}
      colors={COLORS}
      title="Mean Time to Close by Severity"
      valueFormatter={(v) => formatDaysToHumanReadable(v, true)}
      distributed
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
              This graph shows the average time it takes to close vulnerabilities, categorized by their severity level.
            </p>
          }
        />
      }
      height={300}
      className="h-full"
      showYAxis={true}
      showBarLabel={true}
      isLoading={isLoading}
    />
  );
};

export default MeanTimeToClose;
