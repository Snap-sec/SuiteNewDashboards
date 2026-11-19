import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReBarChart from '@/components/custom/charts/reui/bar-chart';
import { CircleAlert } from 'lucide-react';
import { Button } from "@/components/ui/button";
import DetailedHoverPopover from '@/components/custom/detailed-popover';

const SEVERITIES = ['Low', 'Medium', 'High', 'Critical', 'None'];
const KEY_MAP = ['low', 'med', 'high', 'critical', 'none'];

const KEYS = [
  { key: 'open', label: 'Open' },
  { key: 'closed', label: 'Closed' },
];

const COLORS = ['#FF4560', '#00E396'];

const SeverityOpenCloseDistribution = ({ Data, loading }) => {
  const chartData = useMemo(() => (
    SEVERITIES.map((severity, i) => {
      const k = KEY_MAP[i];
      return {
        severity,
        open: Data?.[`${k}Open`] ?? 0,
        closed: Data?.[`${k}Closed`] ?? 0,
      };
    })
  ), [Data]);

  const isAllZero = chartData.every((r) => r.open === 0 && r.closed === 0);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-normal text-sm text-gray-500">
          Open/Close Severity Distribution
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
                This graph breaks down open and closed vulnerabilities by severity level, highlighting the distribution of risks across different categories.
              </p>
            }
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading || !isAllZero ? (
          <ReBarChart
            noCard
            data={chartData}
            xKey="severity"
            keys={KEYS}
            isLoading={loading}
            colors={COLORS}
            xTickFormatter={(v) => v}
            height={240}
          />
        ) : (
          <div className="flex justify-center items-center h-full text-muted-foreground">
            <p className="text-sm text-muted-foreground mt-8">No data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SeverityOpenCloseDistribution;
