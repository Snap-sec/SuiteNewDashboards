import { useMemo } from 'react';
import ReBarChart from '@/components/custom/charts/reui/bar-chart';
import { Skeleton } from '@/components/ui/skeleton';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
const EnvionmentDistributionColumnGraph = ({ statsData, statsLoading }) => {
    const chartData = useMemo(() => {
        const distribution = statsData?.os_distribution || {};

        return Object.entries(distribution)
            .map(([name, value]) => ({
                name,
                value
            }))
            .filter(item => item.value > 0)
            .sort((a, b) => b.value - a.value);
    }, [statsData]);

    const isEmpty = chartData.length === 0;

    return (
        <div className="w-full rounded-xl p-4 bg-card border border-border shadow-xs black/5">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-medium flex items-center gap-2">
                    OS Distribution
                    <DetailedHoverPopover
                        buttonText={
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground">
                            <CircleAlert className="h-4 w-4" />
                          </Button>
                        }
                        showBadge={false}
                        popoverTitle="About this Graph"
                        popoverContent={
                          <p className="text-muted-foreground">This graph displays the distribution of operating systems running on the workstations.</p>
                        }
                    />
                </h2>
            </div>

            {isEmpty && !statsLoading ? (
                <div className="flex justify-center items-center h-[300px] text-muted-foreground text-sm">
                    <p>No data available</p>
                </div>
            ) : (
                <ReBarChart
                    data={chartData}
                    xKey="name"
                    keys={[{ key: 'value', label: 'Count' }]}
                    isLoading={statsLoading}
                    colors={['#0ea5e9']}
                    distributed={true}
                    height={300}
                    noCard={true}
                    xTickFormatter={(v) => String(v)}
                />
            )}
        </div>
    );
};

export default EnvionmentDistributionColumnGraph;
