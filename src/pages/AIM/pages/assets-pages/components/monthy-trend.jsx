import React, { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import ReAreaChart from '@/components/custom/charts/reui/area-chart';

const MonthlyTrend = ({ statsData, statsLoading }) => {
    const chartData = useMemo(
        () => (statsData || []).map(item => ({
            name: item.label,
            value: item.count
        })),
        [statsData]
    );

    const hasData = chartData.length > 0 && chartData.some(item => item.value > 0);

    return (
        <Card className="w-full h-full">
            <CardHeader>
                <CardTitle className="font-normal">Monthly Trend</CardTitle>
            </CardHeader>
            <CardContent>
                {!hasData && !statsLoading ? (
                    <div className="flex justify-center items-center h-[321px] text-muted-foreground text-sm">
                        No monthly trend data available.
                    </div>
                ) : (
                    <ReAreaChart
                        data={chartData}
                        xKey="name"
                        keys={[{ key: 'value', label: 'Count' }]}
                        colors={['#008FFB']}
                        isLoading={statsLoading}
                        height={321}
                        noCard={true}
                        stacked={false}
                        xTickFormatter={(v) => String(v).slice(0, 3)}
                    />
                )}
            </CardContent>
        </Card>
    );
};

export default MonthlyTrend;
