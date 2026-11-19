import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import ReBarChart from '@/components/custom/charts/reui/bar-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ActivityDistributionChart = ({ statsData, statsLoading }) => {
    const chartData = useMemo(() => {
        if (!statsData || Object.keys(statsData).length === 0) return [];

        const labelMap = {
            last_week: 'Last Week',
            last_2_weeks: 'Last 2 Weeks',
            last_month: 'Last Month',
            last_6_months: 'Last 6 Months',
        };

        return Object.entries(statsData)
            .map(([key, value]) => ({
                name: labelMap[key] || key.replace(/_/g, ' '),
                value: value || 0,
            }))
            .filter((item) => item.value > 0);
    }, [statsData]);

    const hasData = chartData.length > 0;

    return (
        <Card className="flex-1 min-w-[300px]">
            <CardHeader className="pb-2">
                <CardTitle className="font-normal text-sm text-gray-500 flex items-center gap-2">
                    Activity Distribution
                    <DetailedHoverPopover
                        buttonText={
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground">
                            <CircleAlert className="h-4 w-4" />
                          </Button>
                        }
                        showBadge={false}
                        popoverTitle="About this Graph"
                        popoverContent={
                          <p className="text-muted-foreground">This graph shows the distribution of employee activity over various time periods.</p>
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
                    <ReBarChart
                        data={chartData}
                        xKey="name"
                        keys={[{ key: 'value', label: 'Count' }]}
                        isLoading={statsLoading}
                        height={260}
                        colors={['#8b5cf6']}
                        distributed={true}
                        noCard={true}
                        xTickFormatter={(v) => String(v)}
                    />
                )}
            </CardContent>
        </Card>
    );
};

export default ActivityDistributionChart;
