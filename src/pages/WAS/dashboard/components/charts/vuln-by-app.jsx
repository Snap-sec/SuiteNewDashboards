import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { CircleAlert } from 'lucide-react';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import ReBarChart from '@/components/custom/charts/reui/bar-chart';

import { SEVERITY_COLORS as VM_SEVERITY_COLORS } from '@/pages/VM/constants';

const SEVERITY_KEYS = [
    { key: 'Critical', label: 'Critical' },
    { key: 'High', label: 'High' },
    { key: 'Medium', label: 'Medium' },
    { key: 'Low', label: 'Low' },
    { key: 'Info', label: 'Info' },
];

const SEVERITY_COLORS = [
    VM_SEVERITY_COLORS.critical,
    VM_SEVERITY_COLORS.high,
    VM_SEVERITY_COLORS.medium,
    VM_SEVERITY_COLORS.low,
    VM_SEVERITY_COLORS.none
];

function VulnByAppsDistribution({ data = [], isLoading }) {
    const chartData = useMemo(() => {
        if (!data || data.length === 0) return [];
        return data.map(item => ({
            name: item.name,
            Critical: item.critical || 0,
            High: item.high || 0,
            Medium: item.medium || 0,
            Low: item.low || 0,
            Info: item.info || 0,
        }));
    }, [data]);

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-normal text-sm text-gray-500">
                    Vulnerabilities Distribution by App
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
                                This chart displays the number of vulnerabilities
                                found in each application, categorized by severity
                                levels.
                            </p>
                        }
                    />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ReBarChart
                    data={chartData}
                    xKey="name"
                    keys={SEVERITY_KEYS}
                    colors={SEVERITY_COLORS}
                    height={350}
                    isLoading={isLoading}
                    stacked={true}
                    xTickFormatter={(v) => v?.length > 10 ? `${String(v).slice(0, 10)}…` : String(v)}
                    noCard={true}
                />
            </CardContent>
        </Card>
    );
}

export default VulnByAppsDistribution;
