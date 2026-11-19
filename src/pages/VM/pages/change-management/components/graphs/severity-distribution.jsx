import { useMemo } from 'react';
import ReBarChart from '@/components/custom/charts/reui/bar-chart';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import { Button } from '@/components/ui/button';
import { CircleAlert } from 'lucide-react';

// Critical → red, High → orange, Medium → yellow, Low → blue (open / closed pair)
const LEVELS = ['Critical', 'High', 'Medium', 'Low'];

const KEYS = [
  { key: 'open', label: 'Open' },
  { key: 'closed', label: 'Closed' },
];

const COLORS = ['#FF4560', '#00E396'];

const SeverityOpenCloseDistribution = ({ statsData = {}, assetsLoading }) => {
  const chartData = useMemo(() => (
    LEVELS.map((name) => ({
      severity: name,
      open: statsData?.[name]?.open ?? 0,
      closed: statsData?.[name]?.closed ?? 0,
    }))
  ), [statsData]);

  return (
    <ReBarChart
      data={chartData}
      xKey="severity"
      keys={KEYS}
      colors={COLORS}
      isLoading={assetsLoading}
      xTickFormatter={(v) => v}
      title="Open/Closed Vulns By Severity"
      height={300}
      className="h-full"
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
              This chart displays the distribution of open and closed vulnerabilities across different severity levels.
            </p>
          }
        />
      }
    />
  );
};

export default SeverityOpenCloseDistribution;
