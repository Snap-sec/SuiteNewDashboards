import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DonutChart from '@/components/custom/charts/reui/donut-chart';
import { Skeleton } from '@/components/ui/skeleton';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

const InternalExternalApiChart = ({ statsData, statsLoading }) => {
    const chartData = useMemo(() => {
        const data = statsData?.internal_external_distribution;
        if (!data) return [];

        const colorMap = {
            'Internal': '#10b981', // Green
            'External': '#3b82f6', // Blue
        };

        return [
            { name: 'Internal', value: data.internal || 0, fill: colorMap['Internal'] },
            { name: 'External', value: data.external || 0, fill: colorMap['External'] },
        ].filter(item => item.value > 0);
    }, [statsData]);

    const hasData = chartData.length > 0;

    return (
        <Card className="flex-1 min-w-[300px]">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-normal flex items-center gap-2">
                    Internal vs External APIs
                    <DetailedHoverPopover
                        buttonText={
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground">
                                <CircleAlert className="h-4 w-4" />
                            </Button>
                        }
                        showBadge={false}
                        popoverTitle="About this Graph"
                        popoverContent={
                            <p className="text-muted-foreground">This graph displays the distribution of identified APIs, categorized as internal or external.</p>
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
                    <DonutChart
                        data={chartData}
                        isLoading={statsLoading}
                        height={270}
                        colors={['#0ea5e9', '#f43f5e']}
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

export default InternalExternalApiChart;
