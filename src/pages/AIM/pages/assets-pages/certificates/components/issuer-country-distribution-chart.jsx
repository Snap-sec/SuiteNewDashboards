import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReBarChart from '@/components/custom/charts/reui/bar-chart';
import { Skeleton } from '@/components/ui/skeleton';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

const IssuerCountryDistributionChart = ({ statsData, statsLoading }) => {
  const chartData = useMemo(() => {
    const distribution = statsData?.issuer_country_distribution || {};

    return Object.entries(distribution)
      .map(([name, value]) => ({
        name: name.length > 20 ? `${name.substring(0, 17)}...` : name,
        fullName: name,
        value
      }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [statsData]);

  const hasData = chartData.length > 0;

  return (
    <Card className="flex-1 min-w-[300px]">
      <CardHeader className="pb-2">
        <CardTitle className="font-normal text-sm text-gray-500 flex items-center gap-2">
          Issuer Country
          <DetailedHoverPopover
            buttonText={
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground">
                <CircleAlert className="h-4 w-4" />
              </Button>
            }
            showBadge={false}
            popoverTitle="About this Graph"
            popoverContent={
              <p className="text-muted-foreground">This graph displays the distribution of certificates by their issuing country.</p>
            }
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[280px] flex items-center justify-center ">
        {!hasData && !statsLoading ? (
          <div className="flex flex-col justify-center items-center text-muted-foreground text-sm">
            <p>No data available</p>
          </div>
        ) : (
          <ReBarChart
            data={chartData}
            xKey="name"
            keys={[{ key: 'value', label: 'Certificates' }]}
            isLoading={statsLoading}
            height={250}
            colors={['#0ea5e9']}
            distributed={true}
            noCard={true}
            xTickFormatter={(v) => String(v)}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default IssuerCountryDistributionChart;
