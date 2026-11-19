import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ColumnGraph from '@/components/custom/charts/column-graph';
import { Skeleton } from '@/components/ui/skeleton';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
const HttpStatusDistributionChart = ({ statsData, statsLoading }) => {
    const chartData = useMemo(() => {
        const httpStatus = statsData?.http_status_distribution || {};

        return Object.entries(httpStatus)
            .map(([name, value]) => ({
                name,
                value
            }))
            .filter(item => item.value > 0);
    }, [statsData]);

    const hasData = chartData.length > 0;

    return (
        <Card className="flex-1 min-w-[300px]">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    HTTP Status Distribution
                    <DetailedHoverPopover
                        buttonText={
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground">
                            <CircleAlert className="h-4 w-4" />
                          </Button>
                        }
                        showBadge={false}
                        popoverTitle="About this Graph"
                        popoverContent={
                          <p className="text-muted-foreground">This graph displays the distribution of HTTP response codes returned by the applications.</p>
                        }
                    />
                </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
                {!hasData && !statsLoading ? (
                    <div className="flex flex-col justify-center items-center text-muted-foreground text-sm">
                        <p>No data available</p>
                    </div>
                ) : (
                    <ColumnGraph
                        data={chartData}
                        isLoading={statsLoading}
                        height={300}
                        colors={['#0ea5e9']}
                    />
                )}
            </CardContent>
        </Card>
    );
};

export default HttpStatusDistributionChart;
