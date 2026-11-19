import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReBarChart from '@/components/custom/charts/reui/bar-chart';
import { Skeleton } from '@/components/ui/skeleton';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EnvironmentTypeDistributionChart = ({ statsData, statsLoading }) => {
    const chartData = useMemo(() => {
        const distribution = statsData?.environment_distribution || {};

        return Object.entries(distribution)
            .map(([key, value]) => ({
                name: key.charAt(0).toUpperCase() + key.slice(1),
                value: value || 0,
            }))
            .filter((item) => item.value > 0);
    }, [statsData]);

    const hasData = chartData.length > 0;

    return (
        <Card className="flex-1 min-w-[300px]">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 font-normal text-sm text-gray-500">
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
                            <p className="text-muted-foreground">This graph shows how subdomains are distributed across different environments (e.g., Production, Staging).</p>
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
                        colors={['#10b981', '#0ea5e9', '#f59e0b', '#f43f5e']}
                        distributed={true}
                        noCard={true}
                        xTickFormatter={(v) => String(v)}
                    />
                )}
            </CardContent>
        </Card>
    );
};

export default EnvironmentTypeDistributionChart;
