import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ShieldCheck, AlertTriangle, Layers, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ExecutiveKpiRibbon({
  metrics = {},
  isLoading = false,
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
    );
  }

  const criticals = Number(metrics?.total_criticals ?? 6);
  const highs = Number(metrics?.total_high ?? 18);
  const totalAssets = Number(metrics?.total_assets ?? 1280);
  const riskScore = Number(metrics?.organization_risk_score ?? 68);

  const kpis = [
    {
      title: 'Security Posture Index',
      value: `${riskScore}/100`,
      statusText: 'Controlled Posture',
      change: '+3.2%',
      isPositive: true,
      context: 'vs last 30 days',
      icon: ShieldCheck,
      iconColor: 'text-emerald-500',
      iconBg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'Critical & High Risks',
      value: (criticals + highs).toLocaleString(),
      statusText: `${criticals} Critical · ${highs} High`,
      change: '-4',
      isPositive: true,
      context: 'decreased this month',
      icon: AlertTriangle,
      iconColor: 'text-rose-500',
      iconBg: 'bg-rose-500/10 border-rose-500/20',
    },
    {
      title: 'Attack Surface Coverage',
      value: totalAssets.toLocaleString(),
      statusText: '96.8% Audited',
      change: '96.8%',
      isPositive: true,
      context: 'monitored assets',
      icon: Layers,
      iconColor: 'text-primary',
      iconBg: 'bg-primary/10 border-primary/20',
    },
    {
      title: 'Mean Time to Remediate',
      value: '4.8 Days',
      statusText: 'Target: < 7 Days',
      change: '-1.4d',
      isPositive: true,
      context: 'under SLA threshold',
      icon: Clock,
      iconColor: 'text-amber-500',
      iconBg: 'bg-amber-500/10 border-amber-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
      {kpis.map((kpi, idx) => {
        const IconComponent = kpi.icon;
        return (
          <Card
            key={idx}
            className="hover:border-border/80 transition-all duration-200"
          >
            <CardContent className="p-5 flex flex-col justify-between h-full">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    {kpi.title}
                  </p>
                  <p className="text-2xl font-bold tracking-tight text-foreground leading-tight">
                    {kpi.value}
                  </p>
                </div>
                <div
                  className={cn(
                    'size-9 rounded-lg border flex items-center justify-center shrink-0',
                    kpi.iconBg,
                  )}
                >
                  <IconComponent className={cn('size-4.5', kpi.iconColor)} />
                </div>
              </div>

              <div className="mt-3.5 pt-3 border-t border-border/50 flex items-center justify-between text-xs">
                <span className="font-medium text-foreground truncate">
                  {kpi.statusText}
                </span>
                <div className="flex items-center gap-1 shrink-0 font-medium text-emerald-600 dark:text-emerald-400">
                  {kpi.isPositive ? (
                    <TrendingUp className="size-3.5" />
                  ) : (
                    <TrendingDown className="size-3.5" />
                  )}
                  <span>{kpi.change}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

