import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReBarChart from '@/components/custom/charts/reui/bar-chart';
import { Skeleton } from '@/components/ui/skeleton';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AsnDistributionColumnGraph = ({ statsData, statsLoading }) => {
  const chartData = useMemo(() => {
    const distribution = statsData?.asn_distribution || {};

    return Object.entries(distribution)
      .map(([name, value]) => ({
        name: name.length > 20 ? `${name.substring(0, 17)}...` : name,
        fullName: name,
        value
      }))
      .filter(item => item.value > 0)
      .slice(0, 10); // Show top 10 ASNs
  }, [statsData]);

  const hasData = chartData.length > 0;

  return (
    <Card className="flex-1 min-w-[300px]">
      <CardHeader className="pb-2">
        <CardTitle className="font-normal text-sm text-gray-500 flex items-center gap-2">
            ASN Distribution
            <DetailedHoverPopover
                buttonText={
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground">
                    <CircleAlert className="h-4 w-4" />
                  </Button>
                }
                showBadge={false}
                popoverTitle="About this Graph"
                popoverContent={
                  <p className="text-muted-foreground">This graph breaks down the IP addresses by their Autonomous System Number (ASN) allocation.</p>
                }
            />
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[280px] flex items-center justify-center">
        {!hasData && !statsLoading ? (
          <div className="flex flex-col justify-center items-center text-muted-foreground text-sm">
            <p>No data available</p>
          </div>
        ) : (
          <ReBarChart
            data={chartData}
            xKey="name"
            keys={[{ key: 'value', label: 'Count' }]}
            isLoading={statsLoading}
            height={250}
            colors={[
              '#8b5cf6', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', 
              '#ef4444', '#ec4899', '#f97316', '#6366f1', '#14b8a6'
            ]}
            distributed={true}
            noCard={true}
            xTickFormatter={(v) => String(v)}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default AsnDistributionColumnGraph;