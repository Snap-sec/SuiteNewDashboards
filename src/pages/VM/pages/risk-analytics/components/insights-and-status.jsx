import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function InsightsAndStatus({ data, isLoading }) {
    if (isLoading) {
        return <Skeleton className="h-[340px] w-full" />;
    }

    const remStatus = data?.remediationStatus;
    const sla = remStatus?.sla || { compliant: 0, breached: 0, atRisk: 0, noSla: 0 };

    // For SLA Compliance
    const totalSlaItems = sla.compliant + sla.breached + sla.atRisk;
    const compliancePercent = totalSlaItems > 0 ? Math.round((sla.compliant / totalSlaItems) * 100) : 0;
    const breachedPercent = totalSlaItems > 0 ? Math.round(((sla.breached + sla.atRisk) / totalSlaItems) * 100) : 0;

    // For MTTR
    const mttr = remStatus?.mttrDays ? Math.round(remStatus.mttrDays) : 0;

    // For Remediation Velocity
    const velocity = remStatus?.remediationVelocity ?? '0';

    return (
        <Card className="bg-card">
            <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-medium">Remediation Status</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0 flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs mt-2">
                    <span className="font-medium text-muted-foreground uppercase tracking-wider">SLA Compliance</span>
                    <span className="font-medium">{compliancePercent}% Compliant</span>
                </div>
                <div className="w-full h-2 rounded-full bg-secondary flex overflow-hidden mt-1">
                    <div className="bg-blue-500 h-full transition-all" style={{ width: `${compliancePercent}%` }} />
                    <div className="bg-red-400 h-full transition-all" style={{ width: `${breachedPercent}%` }} />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="bg-secondary/50 rounded-lg p-3 flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground">MTTR (Average)</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold">{mttr}</span>
                            <span className="text-xs text-muted-foreground">days</span>
                        </div>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-3 flex flex-col gap-1">
                        <span className="text-xs text-muted-foreground">Remediation Velocity</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold">{velocity}</span>
                            <span className="text-xs text-muted-foreground">vulns/day</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
