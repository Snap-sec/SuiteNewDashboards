import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import ReBarChart from '@/components/custom/charts/reui/bar-chart';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
const severityColors = {
  critical: '#7f1d1d',
  high: '#ef4444',
  medium: '#f97316',
  low: '#eab308',
  info: '#3b82f6',
};

const SeverityDistributionChart = ({ statsData, statsLoading }) => {
  const { chartData, colors } = useMemo(() => {
    const distribution = statsData?.vuln_distribution || {};

    const filtered = Object.entries(distribution)
      .filter(([key, value]) => key !== 'total' && value > 0)
      .map(([key, value]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value,
        key
      }));

    const dynamicColors = filtered.map(item => severityColors[item.key.toLowerCase()] || '#3b82f6');

    return { chartData: filtered, colors: dynamicColors };
  }, [statsData]);

  const isEmpty = chartData.length === 0;

  return (
    <Card className="flex-1 min-w-[300px]">
      <CardHeader className="pb-2">
        <CardTitle className="font-normal text-sm text-gray-500 flex items-center gap-2">
            Vulnerability Severity Distribution
            <DetailedHoverPopover
                buttonText={
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground">
                    <CircleAlert className="h-4 w-4" />
                  </Button>
                }
                showBadge={false}
                popoverTitle="About this Graph"
                popoverContent={
                  <p className="text-muted-foreground">This graph illustrates the severity distribution of vulnerabilities found in the registries.</p>
                }
            />
        </CardTitle>
      </CardHeader>

      <CardContent className="h-[280px] flex items-center justify-center">
      {isEmpty && !statsLoading ? (
        <div className="flex flex-col justify-center items-center h-full text-muted-foreground text-sm">
          <p>No data available</p>
        </div>
      ) : (
        <ReBarChart
          data={chartData}
          xKey="name"
          keys={[{ key: 'value', label: 'Count' }]}
          isLoading={statsLoading}
          colors={colors}
          distributed={true}
          height={260}
          noCard={true}
          xTickFormatter={(v) => String(v)}
        />
      )}
      </CardContent>
    </Card>
  );
};

export default SeverityDistributionChart;
