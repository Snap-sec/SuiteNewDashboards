import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import ReBarChart from '@/components/custom/charts/reui/bar-chart';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
const ActivityColumnGraph = ({ statsData = {}, statsLoading }) => {
  const { chartData } = useMemo(() => {
    if (!statsData || typeof statsData !== 'object') return { chartData: [] };

    const formatKey = (key) => {
      return key
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    const filtered = Object.entries(statsData)
      .filter(([key, value]) => key !== 'total' && value >= 0)
      .map(([key, value]) => ({
        name: formatKey(key),
        value,
        key,
      }));

    return { chartData: filtered };
  }, [statsData]);

  const isEmpty = chartData?.length === 0;

  return (
    <Card className="flex-1 ">
      <CardHeader className="pb-2">
        <CardTitle className="font-normal text-sm text-gray-500 flex items-center gap-2">
          Repository Activity Overview
          <DetailedHoverPopover
            buttonText={
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground">
                <CircleAlert className="h-4 w-4" />
              </Button>
            }
            showBadge={false}
            popoverTitle="About this Graph"
            popoverContent={
              <p className="text-muted-foreground">This graph provides an overview of various activities happening across the repositories.</p>
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
            colors={['#3b82f6']}
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

export default ActivityColumnGraph;
