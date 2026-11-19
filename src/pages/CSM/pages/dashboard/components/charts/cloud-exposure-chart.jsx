import DonutChart from '@/components/custom/charts/reui/donut-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DetailedHoverPopover from '@/components/custom/detailed-popover';

export function CloudExposureChart({ data, providerData, isLoading }) {
  const providerColors = {
    'AWS': '#f59e0b',
    'Azure': '#3b82f6',
    'GCP': '#22d3ee',
    'Oracle': '#ef4444' // Red-ish for Oracle
  };

  const providerExposure = (providerData || []).map(p => ({
    name: p.title || p.provider,
    value: p.findings,
    fill: providerColors[p.provider] || '#94a3b8'
  }));

  const totalExposed = providerExposure.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-1.5">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Vulnerabilities by Provider
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
                This chart displays the breakdown of vulnerabilities across connected cloud providers.
              </p>
            }
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center pt-2">
        <DonutChart
          data={providerExposure}
          height={250}
          centerLabel="findings"
          centerValue={`${totalExposed.toLocaleString()}`}
          centerValueClassName="text-xl font-bold text-foreground"
          centerLabelClassName="text-[10px] text-muted-foreground"
          showLegend={true}
          noCard={true}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
}

export default CloudExposureChart;

