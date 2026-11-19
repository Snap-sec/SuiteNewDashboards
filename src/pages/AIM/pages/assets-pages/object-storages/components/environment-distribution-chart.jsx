import { useMemo } from 'react';
import ColumnGraph from '@/components/custom/charts/column-graph';
import { Skeleton } from '@/components/ui/skeleton';

const EnvionmentDistributionColumnGraph = ({ statsData, statsLoading }) => {
    const chartData = useMemo(() => {
        const distribution = statsData?.environment_distribution || {};

        return Object.entries(distribution)
            .map(([key, value]) => ({
                name: key.charAt(0).toUpperCase() + key.slice(1),
                value
            }))
            .filter(item => item.value > 0);
    }, [statsData]);

    const isEmpty = chartData.length === 0;

    return (
        <div className="w-full rounded-xl p-4 bg-card border border-border shadow-xs black/5">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-medium">Environment Distribution</h2>
            </div>

            {isEmpty && !statsLoading ? (
                <div className="flex justify-center items-center h-[300px] text-muted-foreground text-sm">
                    <p>No data available</p>
                </div>
            ) : (
                <div className="flex justify-center items-center h-full">
                    <ColumnGraph data={chartData} isLoading={statsLoading} colors={['#0ea5e9']} />
                </div>
            )}
        </div>
    );
};

export default EnvionmentDistributionColumnGraph;
