import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReBarChart from '@/components/custom/charts/reui/bar-chart';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import { Button } from '@/components/ui/button';
import { CircleAlert } from 'lucide-react';

const COLORS = [
  '#008FFB', '#00E396', '#FEB019', '#FF4560',
  '#775DD0', '#546E7A', '#26a69a', '#D10CE8',
];

const VoilationByDepartment = ({ data, isLoading }) => {
  const chartData = Array.isArray(data)
    ? data.map((item) => ({ department: item.name, Breached: item.breached }))
    : [];

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="font-normal text-sm text-gray-500">Violations By Department</CardTitle>
          <DetailedHoverPopover
            buttonText={
              <Button variant="ghost" size="sm" className="h-fit w-fit p-0">
                <CircleAlert className="h-4 w-4" />
              </Button>
            }
            showBadge={false}
            popoverTitle="About Violations by Department"
            popoverContent={
              <p className="text-muted-foreground text-xs font-normal">
                This chart shows the count of SLA violations associated with each department.
              </p>
            }
          />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col justify-end items-stretch grow px-3 py-1">
        <ReBarChart
          data={chartData}
          xKey="department"
          keys={[{ key: 'Breached', label: 'Breached' }]}
          colors={COLORS}
          height={330}
          isLoading={isLoading}
          // wrapXAxisTicks={true}
          distributed={true}
          noCard={true}
        />
      </CardContent>
    </Card>
  );
};

export default VoilationByDepartment;
