import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PieChart from '@/components/custom/charts/pie-chart';
import { Skeleton } from '@/components/ui/skeleton';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
const SslStatusDistributionChart = ({ statsData, statsLoading }) => {
    const chartData = useMemo(() => {
        const distribution = statsData?.application_source_distribution || {};

        return Object.entries(distribution)
            .map(([name, value]) => ({
                name: name.charAt(0).toUpperCase() + name.slice(1),
                value
            }))
            .filter(item => item.value > 0);
    }, [statsData]);

    const hasData = chartData.length > 0;

    return (
        <Card className="flex-1 min-w-[300px]">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    Environment Distribution
                    <DetailedHoverPopover
                        buttonText={
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground">
                            <CircleAlert className="h-4 w-4" />
                          </Button>
                        }
                        showBadge={false}
                        popoverTitle="About this Graph"
                        popoverContent={
                          <p className="text-muted-foreground">This graph illustrates how the applications' SSL statuses are distributed across different environments.</p>
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
                    <PieChart
                        data={chartData}
                        isLoading={statsLoading}
                        height={280}
                        colors={['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6']}
                        showLegend={false}
                    />
                )}
            </CardContent>
        </Card>
    );
};

export default SslStatusDistributionChart;
