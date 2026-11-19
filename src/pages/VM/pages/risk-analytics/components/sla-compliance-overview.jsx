import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CircleAlert } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import DetailedHoverPopover from '@/components/custom/detailed-popover';

export default function SlaComplianceOverview({ data, isLoading }) {
  if (isLoading) {
    return (
      <Card className="bg-card h-full flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-4 w-4 rounded-full" />
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-between pt-2 px-4 pb-4">
          <div className="flex flex-col gap-3.5 w-full mb-6 px-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-2.5 w-2.5 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-4 w-10" />
              </div>
            ))}
            <div className="flex justify-between items-center text-xs mt-3 pt-3 border-t border-border/30">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-3.5 w-8" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-auto px-2">
            <div className="bg-secondary/30 rounded-lg p-3 flex items-center justify-between border border-border/50">
              <Skeleton className="h-3 w-10" />
              <Skeleton className="h-6 w-12" />
            </div>
            <div className="bg-secondary/30 rounded-lg p-3 flex items-center justify-between border border-border/50">
              <Skeleton className="h-3 w-14" />
              <Skeleton className="h-6 w-12" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

    const remStatus = data?.remediationStatus;
    const sla = remStatus?.sla || { compliant: 0, atRisk: 0, breached: 0, noSla: 0 };

    const totalSlaItems = sla.compliant + sla.breached + sla.atRisk;
    const compliancePercent = totalSlaItems > 0 ? Math.round((sla.compliant / totalSlaItems) * 100) : 0;

    const pieData = [
        { name: 'Compliant', value: sla.compliant || 0, color: '#10b981' }, // green-500
        { name: 'At Risk', value: sla.atRisk || 0, color: '#f59e0b' }, // amber-500
        { name: 'Breached', value: sla.breached || 0, color: '#ef4444' }, // red-500
    ];

    const mttr = remStatus?.mttrDays ? parseFloat(remStatus.mttrDays).toFixed(1) : '0';
    const velocity = remStatus?.remediationVelocity ? parseFloat(remStatus.remediationVelocity).toFixed(1) : '0';
    const uniqueCves = data?.exposureSummary?.uniqueCves || 0;
    const avgCvss = data?.exposureSummary?.avgCvss || 0;

    return (
        <Card className="bg-card h-full flex flex-col">
            <CardHeader>
                <CardTitle className="font-normal text-sm text-gray-500 flex items-center gap-2">
                    SLA Compliance Overview
                    <DetailedHoverPopover
                        buttonText={<CircleAlert className="h-4 w-4 text-muted-foreground" />}
                        popoverTitle="SLA Compliance Overview"
                        popoverContent={<p className="text-muted-foreground">An overview of SLA compliance, showing the number of compliant, at-risk, and breached vulnerabilities.</p>}
                        showBadge={false}
                    />
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col pt-2 px-4 pb-4">
                <div className="flex gap-4 items-center mb-6 px-2">


                    <div className="flex flex-col gap-2 w-full">
                        {pieData.map((item) => (
                            <div key={item.name} className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">{item.name}</span>
                                </div>
                                <span className="text-sm">{item.value.toLocaleString()}</span>
                            </div>
                        ))}
                        <div className="flex justify-between items-center text-xs mt-3 pt-3 border-t border-border/30">
                            <span className="text-muted-foreground/70">No SLA assigned</span>
                            <span className="text-muted-foreground/70">{(sla.noSla || 0).toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-auto px-2">
                    <div className="bg-secondary/30 rounded-lg p-3 flex items-center justify-between border border-border/50">
                        <span className="text-xs uppercase tracking-wider text-muted-foreground">MTTR</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-foreground">{mttr}d</span>
                        </div>
                    </div>
                    <div className="bg-secondary/30 rounded-lg p-3 flex items-center justify-between border border-border/50">
                        <span className="text-xs uppercase tracking-wider text-muted-foreground">Velocity</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-foreground">{velocity}</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
