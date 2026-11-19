import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReAreaChart from '@/components/custom/charts/reui/area-chart';
import { CircleAlert } from 'lucide-react';
import { Button } from "@/components/ui/button";
import DetailedHoverPopover from '@/components/custom/detailed-popover';

const KEYS = [
  { key: 'open', label: 'Open' },
  { key: 'closed', label: 'Closed' },
];

const COLORS = ['#FF4560', '#00E396'];

const VulnerabilityTrendGraph = ({ asset, loading }) => {
  const chartData = useMemo(() => {
    if (!asset || !Array.isArray(asset)) return [];
    return asset.map((item) => {
      const raw = item.date || item.day;
      let label = raw ?? '';
      if (raw) {
        const d = new Date(raw);
        if (!isNaN(d.getTime())) {
          label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
      }
      return {
        date: label,
        open: item.open ?? 0,
        closed: item.closed ?? 0,
      };
    });
  }, [asset]);

  const hasData = chartData.some((r) => r.open > 0 || r.closed > 0);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-normal text-sm text-gray-500">
          Vulnerability Trends
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
                This graph tracks the trend of open vs. closed vulnerabilities over time, helping monitor remediation progress and overall security posture.
              </p>
            }
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-end items-stretch grow px-3 py-1">
        {loading || hasData ? (
          <ReAreaChart
            noCard
            data={chartData}
            xKey="date"
            keys={KEYS}
            colors={COLORS}
            stacked={false}
            curveType="monotone"
            isLoading={loading}
            xTickFormatter={(v) => v}
            height={250}
          />
        ) : (
          <div className="flex justify-center h-[165px] text-muted-foreground">
            <p className="text-sm text-muted-foreground mt-8">No Vulnerability Data Available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export { VulnerabilityTrendGraph };
