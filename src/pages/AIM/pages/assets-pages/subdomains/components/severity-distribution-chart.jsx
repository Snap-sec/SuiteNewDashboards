import { useMemo } from 'react';
import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import DonutChart from '@/components/custom/charts/reui/donut-chart';
import DetailedHoverPopover from '@/components/custom/detailed-popover';

const severityColors = {
     critical: '#FF4560',
    high: '#FF8C00',
    medium: '#FEB019',
    low: '#3B82F6',
    info: '#9CA3AF',
};

const SeverityDistributionChart = ({ statsData, statsLoading }) => {
    const { chartData, colors } = useMemo(() => {
        const distribution = statsData?.vuln_distribution || {};

        const filtered = Object.entries(distribution)
            .filter(([key, value]) => key !== 'total' && key !== '_id' && value > 0)
            .map(([key, value]) => ({
                name: key.charAt(0).toUpperCase() + key.slice(1),
                value,
                key
            }));

        const dynamicColors = filtered.map(item => severityColors[item.key.toLowerCase()] || '#3b82f6');

        return { chartData: filtered, colors: dynamicColors };
    }, [statsData]);

    const hasData = chartData.length > 0;

    return (
        <Card className="flex-1 min-w-[300px]">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-normal flex items-center gap-2 text-sm text-gray-500">
                    Vulnerability Distribution
                    <DetailedHoverPopover
                        buttonText={
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground">
                            <CircleAlert className="h-4 w-4" />
                          </Button>
                        }
                        showBadge={false}
                        popoverTitle="About this Graph"
                        popoverContent={
                          <p className="text-muted-foreground">This graph shows the breakdown of discovered vulnerabilities by severity level for subdomains.</p>
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
                        colors={colors}
                        height={270}
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

export default SeverityDistributionChart;