import { useMemo } from 'react';
import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import ReBarChart from '@/components/custom/charts/reui/bar-chart';
import DetailedHoverPopover from '@/components/custom/detailed-popover';


const ValidityDistributionColumnGraph = ({ statsData, statsLoading }) => {
  const expiryData = useMemo(() => {
    const distribution = statsData?.expiry_distribution || {};

    const colorMap = {
      'Expired': '#ef4444',
      '< 1 Month': '#f59e0b',
      '1-3 Months': '#10b981',
      '3-6 Months': '#10b981',
      '> 6 Months': '#10b981',
    };

    return Object.entries(distribution)
      .map(([key, value]) => ({
        name: key,
        value: value || 0,
        fill: colorMap[key] || '#10b981',
      }))
      .filter(item => item.value >= 0);
  }, [statsData]);

  const isEmpty = expiryData.length === 0;

  return (
    <Card className="flex-1 min-w-[300px]">
      <CardHeader className="pb-2">
        <CardTitle className="font-normal text-sm text-gray-500 flex items-center gap-2">
          Certificate Expiration Timeline
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
            popoverTitle="About this Graph"
            popoverContent={
              <p className="text-muted-foreground">
                This graph shows the timeline of when certificates are set to
                expire.
              </p>
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
            data={expiryData}
            xKey="name"
            keys={[{ key: 'value', label: 'Count' }]}
            isLoading={statsLoading}
            distributed={true}
            height={260}
            noCard={true}
            xTickFormatter={(v) => String(v)}
          />
        )}
      </CardContent>
    </Card>
  );
}

export default ValidityDistributionColumnGraph