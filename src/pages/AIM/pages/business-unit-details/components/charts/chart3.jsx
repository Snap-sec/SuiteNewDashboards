import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DonutChart from '@/components/custom/charts/reui/donut-chart';
import DetailedHoverPopover from '@/components/custom/detailed-popover';

const colorMap = {
  critical: '#FF4560',
  high: '#FEB019',
  medium: '#FFCF00',
  low: '#008FFB',
  none: '#775DD0',
};

function Chart3({ data = {}, isLoading }) {
  const { chartData, colors } = useMemo(() => {
    const entries = Object.entries(data).filter(([, v]) => v > 0);

    const chartData = entries.map(([key, value]) => ({
      name: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      value,
    }));

    const colors = entries.map(([key]) => colorMap[key.toLowerCase()] || '#999');

    return { chartData, colors };
  }, [data]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-normal text-sm text-gray-500 flex items-center gap-2">
          Vulnerability Distribution
          <DetailedHoverPopover
            buttonText={
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground">
                <CircleAlert className="h-4 w-4" />
              </Button>
            }
            showBadge={false}
            popoverTitle="Vulnerability Distribution"
            popoverContent={
              <p className="text-muted-foreground text-xs">Breakdown of all vulnerabilities by their severity level (Critical, High, Medium, Low).</p>
            }
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <DonutChart
          data={chartData}
          colors={colors}
          height={250}
          showLegend={true}
          centerLabel="Total"
          className="border-none shadow-none p-0"
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
}

export default Chart3;
