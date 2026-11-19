import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ColumnGraph from '@/components/custom/charts/column-graph';
import { Skeleton } from '@/components/ui/skeleton';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LanguageDistributionChart = ({ statsData, statsLoading }) => {
    const chartData = useMemo(() => {
        const languages = statsData?.data?.typeSpecificStats?.languages || [];

        return languages
            .map(item => ({
                name: item.name,
                value: item.count
            }))
            .filter(item => item.value > 0)
            .slice(0, 10);
    }, [statsData]);

    const hasData = chartData.length > 0;

    return (
        <Card className="flex-1 min-w-[300px]">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    Top Languages
                    <DetailedHoverPopover
                        buttonText={
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground">
                            <CircleAlert className="h-4 w-4" />
                          </Button>
                        }
                        showBadge={false}
                        popoverTitle="About this Graph"
                        popoverContent={
                          <p className="text-muted-foreground">This graph highlights the top programming languages used across the repositories.</p>
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
                    <ColumnGraph
                        data={chartData}
                        isLoading={statsLoading}
                        height={280}
                        colors={['#f59e0b']}
                    />
                )}
            </CardContent>
        </Card>
    );
};

export default LanguageDistributionChart;
