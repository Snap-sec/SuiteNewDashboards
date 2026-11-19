import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ActiveDonutChart from '@/components/custom/charts/reui/active-donut-chart';
import { Button } from '@/components/ui/button';
import { CircleAlert } from 'lucide-react';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import { SEVERITY_COLORS as VM_SEVERITY_COLORS } from '@/pages/VM/constants';

const SEVERITY_COLORS = [
  VM_SEVERITY_COLORS.critical,
  VM_SEVERITY_COLORS.high,
  VM_SEVERITY_COLORS.medium,
  VM_SEVERITY_COLORS.low,
  VM_SEVERITY_COLORS.none,
];

export default function CloudVulnDistribution({ data = {}, isLoading }) {
  const chartData = Object.entries(data).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: value,
  }));

  const criticalIndex = chartData.findIndex((item) => item.name === 'Critical');
  const activeIndex = criticalIndex !== -1 ? criticalIndex : 0;
  const allZero =
    !chartData.length || chartData.every((item) => Number(item.value || 0) === 0);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-normal text-sm text-gray-500">
          Vulnerabilities Distribution
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
                This chart shows the distribution of vulnerabilities across
                different severity levels: Critical, High, Medium, Low, and Info.
              </p>
            }
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ActiveDonutChart
          data={allZero ? [] : chartData}
          colors={SEVERITY_COLORS}
          height={320}
          isLoading={isLoading}
          noCard={true}
          activeIndex={activeIndex}
          centerLabel="Vulnerabilities"
        />
      </CardContent>
    </Card>
  );
}
