import { useMemo } from 'react';
import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReAreaChart from '@/components/custom/charts/reui/area-chart';
import DetailedHoverPopover from '@/components/custom/detailed-popover';

function VulnTimeline({ data = [], isLoading }) {
  // data = [ { label, count }, ... ]
  const chartData = useMemo(
    () => data.map((item) => ({ name: item.label, value: item.count })),
    [data],
  );

  const hasData =
    chartData.length > 0 && chartData.some((item) => item.value > 0);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-normal text-sm text-gray-500 flex items-center gap-2">
          Asset Trend
          <DetailedHoverPopover
            buttonText={
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
              >
                <CircleAlert className="h-4 w-4" />
              </Button>
            }
            showBadge={false}
            popoverTitle="Asset Trend"
            popoverContent={
              <p className="text-muted-foreground text-xs">
                Trend analysis of assets discovered over time for this Business
                Unit.
              </p>
            }
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <ReAreaChart
            data={chartData}
            xKey="name"
            keys={[{ key: 'value', label: 'Assets' }]}
            isLoading={isLoading}
            height={300}
            colors={['#3B82F6']}
            noCard={true}
            stacked={false}
          />
        ) : isLoading ? (
          <ReAreaChart
            data={chartData}
            xKey="name"
            keys={[{ key: 'value', label: 'Assets' }]}
            isLoading={isLoading}
            height={300}
            colors={['#3B82F6']}
            noCard={true}
            stacked={false}
          />
        ) : (
          <div className="flex justify-center items-center h-[300px] text-muted-foreground text-sm">
            <p>No data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default VulnTimeline;
