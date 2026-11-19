import DonutChart from '@/components/custom/charts/reui/donut-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DetailedHoverPopover from '@/components/custom/detailed-popover';

export function CloudSecurityScoreChart({ data, stats, isLoading }) {
  const chartData = [
    { name: 'Critical', value: stats?.critical || 0, fill: '#e11d48' },
    { name: 'High', value: stats?.high || 0, fill: '#f97316' },
    { name: 'Medium', value: stats?.medium || 0, fill: '#eab308' },
    { name: 'Low', value: stats?.low || 0, fill: '#22c55e' },
  ].filter(item => item.value > 0);

  if (chartData.length === 0) {
    chartData.push({ name: 'No Findings', value: 1, fill: '#26262a' });
  }

  const total = stats?.totalFindings || 0;

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-1.5">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Severity Distribution
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
                This chart displays the breakdown of findings across different severity levels: Critical, High, Medium, and Low.
              </p>
            }
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-between pt-2">
        <div className="w-full flex-1 flex items-center justify-center">
          <DonutChart
            data={chartData}
            height={240}
            centerLabel="Findings"
            centerValue={`${total}`}
            centerValueClassName="text-3xl font-bold text-foreground"
            centerLabelClassName="text-xs text-muted-foreground"
            showLegend={true}
            noCard={true}
            isLoading={isLoading}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default CloudSecurityScoreChart;

