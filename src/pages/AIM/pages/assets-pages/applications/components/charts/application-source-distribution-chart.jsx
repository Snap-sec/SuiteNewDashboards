import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DonutChart from '@/components/custom/charts/reui/donut-chart';
import { Skeleton } from '@/components/ui/skeleton';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
const ApplicationSourceDistributionChart = ({ statsData, statsLoading }) => {
    const chartData = useMemo(() => {
        const distribution = statsData?.application_source_distribution || {};

        return Object.entries(distribution)
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
                <CardTitle className="font-normal text-sm text-gray-500 flex items-center gap-2">
                Application Source Distribution
                <DetailedHoverPopover
                    buttonText={
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground">
                        <CircleAlert className="h-4 w-4" />
                      </Button>
                    }
                    showBadge={false}
                    popoverTitle="About this Graph"
                    popoverContent={
                      <p className="text-muted-foreground">This graph illustrates the distribution of applications by their original source or vendor.</p>
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
                    <DonutChart
                        data={chartData}
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

export default ApplicationSourceDistributionChart;
