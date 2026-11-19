import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DonutChart from '@/components/custom/charts/reui/donut-chart';
import { Skeleton } from '@/components/ui/skeleton';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AuthDistributionChart = ({ statsData, statsLoading }) => {
    const chartData = useMemo(() => {
        const envDist = statsData?.auth_distribution || {};

        const colorMap = {
            'No Auth': '#ef4444',
            'API Key': '#f59e0b',
            'Bearer Token': '#3b82f6',
        };

        return Object.entries(envDist)
            .map(([key, value]) => {
                const name = key.split(/_|\s/).map(word => 
                    word.toLowerCase() === 'api' ? 'API' : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                ).join(' ');
                
                return {
                    name,
                    value,
                    fill: colorMap[name] || undefined
                };
            })
            .filter(item => item.value > 0);
    }, [statsData]);

    const hasData = chartData.length > 0;

    return (
        <Card className="flex-1 min-w-[300px]">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-normal flex items-center gap-2">
                    Auth Distribution
                    <DetailedHoverPopover
                        buttonText={
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground">
                                <CircleAlert className="h-4 w-4" />
                            </Button>
                        }
                        showBadge={false}
                        popoverTitle="About this Graph"
                        popoverContent={
                            <p className="text-muted-foreground">This graph displays the distribution of authentication methods used across the discovered APIs.</p>
                        }
                    />
                </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center p-4">
                {!hasData && !statsLoading ? (
                    <div className="flex flex-col justify-center items-center text-muted-foreground text-sm">
                        <p>No data available</p>
                    </div>
                ) : (
                    <DonutChart
                        data={chartData}
                        isLoading={statsLoading}
                        height={270}
                        colors={['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b']}
                        showLegend={true}
                        centerLabel="Total"
                        className="border-none shadow-none p-0"
                        noCard={true}
                    />
                )}
            </CardContent>
        </Card>
    );
};

export default AuthDistributionChart;
