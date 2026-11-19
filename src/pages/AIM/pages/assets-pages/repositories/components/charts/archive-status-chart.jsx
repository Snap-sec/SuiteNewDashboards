import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import DonutChart from '@/components/custom/charts/reui/donut-chart';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
const ArchiveStatusChart = ({ statsData, statsLoading }) => {
  const chartData = useMemo(() => {
    const data = statsData || {};
    
    const colorMap = {
      'Active': '#10b981',   // Green
      'Archived': '#64748b', // Gray
    };

    return Object.entries(data)
      .map(([key, value]) => {
        const name = key.charAt(0).toUpperCase() + key.slice(1);
        return {
          name: name == "Unarchived" ? "Active" : name,
          value,
          fill: colorMap[name] || undefined
        };
      })
      .filter(item => item.value > 0);
  }, [statsData]);

  console.log(chartData, "xxxxxxxx");
  

  const isEmpty = chartData.length === 0;

  return (
    <Card className="flex-1 min-w-[300px]">
      <CardHeader className="pb-2">
        <CardTitle className="font-normal text-sm text-gray-500 flex items-center gap-2">
            Active vs Archived Repositories
            <DetailedHoverPopover
                buttonText={
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground">
                    <CircleAlert className="h-4 w-4" />
                  </Button>
                }
                showBadge={false}
                popoverTitle="About this Graph"
                popoverContent={
                  <p className="text-muted-foreground">This graph displays the proportion of active repositories compared to those that have been archived.</p>
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
        <DonutChart
          data={chartData}
          colors={['#3b82f6', '#10b981']}
          isLoading={statsLoading}
          showLegend={true}
          height={260}
          centerLabel="Total"
          className="border-none shadow-none p-0"
          noCard={true}
        />
      )}
      </CardContent>
    </Card>
  );
};

export default ArchiveStatusChart;
