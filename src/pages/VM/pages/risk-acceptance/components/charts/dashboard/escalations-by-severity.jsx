import { useMemo } from 'react';
import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReBarChart from '@/components/custom/charts/reui/bar-chart';
import DetailedHoverPopover from '@/components/custom/detailed-popover';

// Fixed severity order + per-severity colors
const SEVERITY_CONFIG = [
  { key: 'Critical', label: 'Critical', color: '#EF4444' },
  { key: 'High', label: 'High', color: '#F97316' },
  { key: 'Medium', label: 'Medium', color: '#EAB308' },
  { key: 'Low', label: 'Low', color: '#3B82F6' },
  { key: 'Info', label: 'Info', color: '#9CA3AF' },
];

const EscalationsBySeverity = ({ data = {}, isLoading }) => {
  // Transform { Critical: 5, High: 3, ... } → [{ severity, count }]
  const chartData = useMemo(
    () =>
      SEVERITY_CONFIG.map(({ key }) => ({
        severity: key,
        count: data?.[key] ?? 0,
      })),
    [data],
  );

  const hasData = chartData.some((d) => d.count > 0);

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="font-normal text-sm text-gray-500">
            Escalations By Severity
          </CardTitle>
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
                This chart shows the number of escalations by severity.
              </p>
            }
          />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col justify-end grow px-3 py-1">
        {hasData ? (
          <ReBarChart
            noCard
            distributed
            data={chartData}
            xKey="severity"
            keys={[{ key: 'count', label: 'Count' }]}
            colors={SEVERITY_CONFIG.map((s) => s.color)}
            xTickFormatter={(v) => v}
            height={330}
            isLoading={isLoading}
          />
        ) : isLoading ? (
          <ReBarChart
            noCard
            distributed
            data={chartData}
            xKey="severity"
            keys={[{ key: 'count', label: 'Count' }]}
            colors={SEVERITY_CONFIG.map((s) => s.color)}
            xTickFormatter={(v) => v}
            height={330}
            isLoading={isLoading}
          />
        ) : (
          <div className="flex flex-col justify-center items-center h-[300px] text-muted-foreground text-sm">
            <p>No data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EscalationsBySeverity;
