import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReBarChart from '@/components/custom/charts/reui/bar-chart';
import { Skeleton } from '@/components/ui/skeleton';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CollectionsByWorkspaceChart = ({ statsData, statsLoading }) => {
    const chartData = useMemo(() => {
        const collections = statsData?.collections_by_workspace || {};

        return Object.entries(collections)
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
                <CardTitle className="text-sm font-normal flex items-center gap-2">
                    Collections by Workspace
                    <DetailedHoverPopover
                        buttonText={
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground">
                                <CircleAlert className="h-4 w-4" />
                            </Button>
                        }
                        showBadge={false}
                        popoverTitle="About this Graph"
                        popoverContent={
                            <p className="text-muted-foreground">This graph shows the number of API collections organized by workspace.</p>
                        }
                    />
                </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
                {!hasData && !statsLoading ? (
                    <div className="flex flex-col justify-center items-center text-muted-foreground text-sm h-full">
                        <p>No data available</p>
                    </div>
                ) : (
                    <ReBarChart
                        data={chartData}
                        xKey="name"
                        keys={[{ key: 'value', label: 'Collections' }]}
                        isLoading={statsLoading}
                        height={260}
                        className="shadow-none border-0"
                        noCard
                        distributed={true}
                        colors={[
                            '#008FFB',
                            '#00E396',
                            '#FEB019',
                            '#FF4560',
                            '#775DD0',
                            '#3f51b5',
                            '#546E7A',
                            '#D4526E',
                            '#8D5B4C',
                            '#F86624',
                        ]}
                    />
                )}
            </CardContent>
        </Card>
    );
};

export default CollectionsByWorkspaceChart;
