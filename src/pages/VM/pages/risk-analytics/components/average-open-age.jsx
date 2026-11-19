import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import ActiveDonutChart from '@/components/custom/charts/reui/active-donut-chart';
import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import { formatDaysToHumanReadable } from '@/lib/helpers';

const COLORS = ['#FF4560', '#FEB019', '#008FFB', '#00E396']; // Critical, High, Medium, Low
const SEVERITIES = [
    { key: 'critical', label: 'Critical' },
    { key: 'high', label: 'High' },
    { key: 'medium', label: 'Medium' },
    { key: 'low', label: 'Low' },
];

const AverageOpenAge = ({ data, isLoading }) => {
    // data.remediationStatus.averageOpenAge: { critical, high, medium, low, none }
    const ageData = data?.remediationStatus?.sla?.averageOpenAge || {};

    const chartData = useMemo(() => {
        return SEVERITIES.map(({ key, label }) => ({
            name: label,
            value: ageData[key] || 0,
        }));
    }, [ageData]);

    const averageAge = useMemo(() => {
        const nonZero = chartData.filter(d => d.value > 0);
        if (nonZero.length === 0) return 0;
        const total = nonZero.reduce((sum, d) => sum + d.value, 0);
        return total / nonZero.length;
    }, [chartData]);

    if (isLoading) {
        return <Skeleton className="w-full h-[300px]" />;
    }

    return (
        <div className="relative h-full">
            <ActiveDonutChart
                data={chartData}
                isLoading={isLoading}
                colors={COLORS}
                title="Average Open Age by Severity"
                valueFormatter={(v) => formatDaysToHumanReadable(v, true)}
                titleBadge={
                    <DetailedHoverPopover
                        buttonText={
                            <Button variant="ghost" size="sm">
                                <CircleAlert className="h-4 w-4" />
                            </Button>
                        }
                        showBadge={false}
                        popoverTitle="About this Graph"
                        popoverContent={
                            <p className="text-muted-foreground">
                                This chart shows the average number of days open vulnerabilities have remained unresolved, broken down by severity.
                            </p>
                        }
                    />
                }
                centerValue={formatDaysToHumanReadable(averageAge, true)}
                centerLabel="Avg Open Age"
                height={300}
                className="h-full"
                showLegend={true}
            />
        </div>
    );
};

export default AverageOpenAge;
