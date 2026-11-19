import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function AgentStatsBar({ agents = [], metrics, isLoading }) {
  const stats = useMemo(() => {
    if (metrics) {
      return [
        { info: metrics.totalRegistered ?? metrics.total ?? agents.length, desc: 'Total Registered' },
        { info: metrics.activeAgents ?? metrics.active ?? 0, desc: 'Active Agents' },
        { info: metrics.outdated ?? 0, desc: 'Outdated' },
      ];
    }

    const active = agents.filter(
      (a) => a.status?.toLowerCase() === 'active',
    ).length;
    const outdated = agents.filter(
      (a) => a.status?.toLowerCase() === 'outdated',
    ).length;

    return [
      { info: agents.length, desc: 'Total Registered' },
      { info: active, desc: 'Active Agents' },
      { info: outdated, desc: 'Outdated' },
    ];
  }, [agents, metrics]);

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-6">
          <div className="flex items-center justify-between text-center">
            {stats.map((_, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center flex-1 gap-2.5 border-e border-input last:border-e-0 py-1"
              >
                <Skeleton className="h-6 w-10 rounded" />
                <Skeleton className="h-4.5 w-20 rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between text-center">
          {stats.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center flex-1 gap-1 text-center border-e border-input last:border-e-0 transition-colors rounded-sm py-1"
            >
              <span className="text-mono text-2xl leading-none font-semibold">
                {item.info}
              </span>
              <span className="text-secondary-foreground text-sm font-medium">
                {item.desc}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default AgentStatsBar;
