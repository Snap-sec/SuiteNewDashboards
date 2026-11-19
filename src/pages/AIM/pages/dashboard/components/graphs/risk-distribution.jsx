import React, { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import DonutChart from "@/components/custom/charts/donut-chart";

const RiskDistribution = ({ statsData, statsLoading }) => {
    const chartData = useMemo(() => {
        if (!statsData) return [];
        return [
            { name: 'Critical', value: statsData.critical || 0 },
            { name: 'High', value: statsData.high || 0 },
            { name: 'Medium', value: statsData.medium || 0 },
            { name: 'Low', value: statsData.low || 0 },
            { name: 'Info', value: statsData.info || 0 },
            { name: 'Unknown', value: statsData.unknown || 0 },
        ];
    }, [statsData]);

    const riskColors = [
        '#ef4444', // Critical - Red
        '#f97316', // High - Orange
        '#eab308', // Medium - Yellow
        '#3222c5ff', // Low - Green
        '#94a3b8', // Info - Blue
        '#b129b1ff', // Unknown - Slate
    ];

    if (statsLoading) {
        return <Skeleton className="w-full h-[400px]" />;
    }

    const hasData = chartData.length > 0 && chartData.some(item => item.value > 0);

    return (
        <Card className="w-full h-full">
            <CardHeader>
                <CardTitle className="font-normal">Risk Distribution</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex justify-center items-center h-[321px]">
                    {!hasData ? (
                        <div className="text-muted-foreground text-sm">
                            No risk distribution data available.
                        </div>
                    ) : (
                        <DonutChart
                            data={chartData}
                            isLoading={statsLoading}
                            height={500}
                            colors={riskColors}
                            legendPosition="right"
                            width={350}
                        />
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default RiskDistribution;