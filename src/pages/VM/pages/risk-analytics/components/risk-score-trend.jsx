import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import ReAreaChart from '@/components/custom/charts/reui/area-chart';

export default function RiskScoreTrend({ data, isLoading }) {
    if (isLoading) {
        return <Skeleton className="h-[340px] w-full lg:col-span-2" />;
    }

    const apiTrendData = data?.riskTrend || [];
    const trendData = apiTrendData.map(item => ({
        name: item.month,
        score: item.riskScore
    }));

    return (
        <Card className="bg-card lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-medium">Risk Score Trend</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[250px] w-full pt-4">
                    {trendData.length > 0 ? (
                        <ReAreaChart
                            noCard={true}
                            data={trendData}
                            keys={[{ key: 'score', label: 'Score' }]}
                            colors={['#3b82f6']}
                            height={250}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">No data available</div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
