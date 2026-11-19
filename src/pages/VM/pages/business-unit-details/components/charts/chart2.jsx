import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReBarChart from '@/components/custom/charts/reui/bar-chart';
import DetailedHoverPopover from '@/components/custom/detailed-popover';

function Chart2({ data = [], isLoading }) {
  // data = [ { label, count }, ... ]
  const chartData = useMemo(() =>
    data.map((item) => ({ name: item.label, value: item.count })),
    [data]
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-normal text-sm text-gray-500 flex items-center gap-2">
          Asset Distribution by Type
          <DetailedHoverPopover
            buttonText={
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground">
                <CircleAlert className="h-4 w-4" />
              </Button>
            }
            showBadge={false}
            popoverTitle="Asset Distribution by Type"
            popoverContent={
              <p className="text-muted-foreground text-xs">Distribution of assets by their classification (e.g., Domain, IP, Web App).</p>
            }
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ReBarChart
          data={chartData}
          xKey="name"
          keys={[{ key: 'value', label: 'Assets' }]}
          isLoading={isLoading}
          height={300}
          colors={['#8B5CF6']}
          distributed={true}
          noCard={true}
          xTickFormatter={(v) => String(v)}
        />
      </CardContent>
    </Card>
  );
}

export default Chart2;
