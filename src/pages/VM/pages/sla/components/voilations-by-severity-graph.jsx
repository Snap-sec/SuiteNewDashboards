import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReBarChart from '@/components/custom/charts/reui/bar-chart';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import { Button } from '@/components/ui/button';
import { CircleAlert } from 'lucide-react';

const VoilationBySeverity = ({ data, isLoading }) => {

  // Severity → Color mapping
  const colorMap = {
    critical: '#FF4560', // red
    high: '#fe7519ff', // orange
    medium: '#FFCF00', // yellow
    low: '#008FFB', // blue
    none: '#775DD0', // purple
  };

  const chartData = [
    { severity: 'Critical', Count: data?.critical },
    { severity: 'High', Count: data?.high },
    { severity: 'Medium', Count: data?.medium },
    { severity: 'Low', Count: data?.low },
  ];

  const colors = ['#FF4560', '#fe7519ff', '#FFCF00', '#008FFB'];

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="font-normal text-sm text-gray-500">Violations By Severity</CardTitle>
          <DetailedHoverPopover
            buttonText={
              <Button variant="ghost" size="sm" className="h-fit w-fit p-0">
                <CircleAlert className="h-4 w-4" />
              </Button>
            }
            showBadge={false}
            popoverTitle="About Violations by Severity"
            popoverContent={
              <p className="text-muted-foreground text-xs font-normal">
                This chart shows the number of SLA violations categorized by severity level.
              </p>
            }
          />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col justify-end items-stretch grow px-3 py-1">
        <ReBarChart
          data={chartData}
          xKey="severity"
          keys={[{ key: 'Count', label: 'Count' }]}
          colors={colors}
          height={330}
          isLoading={isLoading}
          distributed={true}
          xTickFormatter={(v) => String(v)}
          noCard={true}
        />
      </CardContent>
    </Card>
  );
};

export default VoilationBySeverity;
