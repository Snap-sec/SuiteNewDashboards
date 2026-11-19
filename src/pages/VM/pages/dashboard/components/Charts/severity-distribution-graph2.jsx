import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import ReBarChart from '@/components/custom/charts/reui/bar-chart';
import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DetailedHoverPopover from '@/components/custom/detailed-popover';

const SEVERITIES = ['Low', 'Medium', 'High', 'Critical', 'None'];

const KEYS = [
  { key: 'open', label: 'Open' },
  { key: 'closed', label: 'Closed' },
];

import { STATUS_COLORS } from '@/pages/VM/constants';
// Muted red for Open, muted green for Closed
const COLORS = [STATUS_COLORS.open, STATUS_COLORS.closed];

const SeverityOpenCloseDistribution = ({ Data, assetsLoading }) => {
  // Transform indexed arrays → row objects that ReBarChart needs
  const chartData = useMemo(() => {
    return SEVERITIES.map((severity, i) => {
      const keyMap = ['low', 'med', 'high', 'critical', 'none'];
      const k = keyMap[i];
      return {
        severity,
        open: Data?.[`${k}Open`] ?? 0,
        closed: Data?.[`${k}Closed`] ?? 0,
      };
    });
  }, [Data]);

  return (
    <ReBarChart
      data={chartData}
      xKey="severity"
      keys={KEYS}
      colors={COLORS}
      title="Total Open & Closed Vulns By Severity"
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
              This graph displays the total number of open and closed vulnerabilities, broken down by their severity levels. It provides a visual comparison to help prioritize remediation efforts.
            </p>
          }
        />
      }
      xTickFormatter={(v) => v}   // Full label — e.g. "Critical"
      height={310}
      className="h-full"
      showYAxis={true}
      showBarLabel={true}
      isLoading={assetsLoading}
    />
  );
};

export default SeverityOpenCloseDistribution;
