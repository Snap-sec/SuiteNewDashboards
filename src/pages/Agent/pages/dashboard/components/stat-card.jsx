import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

export function AgentStatsCard({ data, isLoading }) {

  const metrics = data || {
    totalRegistered: 0,
    activeAgents: 0,
    outdatedOffline: 0,
    recentActivity: null,
  };

  const formattedRecentActivity = metrics.recentActivity
    ? formatDistanceToNow(new Date(metrics.recentActivity), { addSuffix: true })
    : '0';

  const STATS = [
    { label: 'Total Registered', value: metrics.totalRegistered },
    { label: 'Active Agents', value: metrics.activeAgents },
    { label: 'Outdated / Offline', value: metrics.outdatedOffline },
    // { label: 'Recent Activity', value: formattedRecentActivity },
  ];

  return (
    <Card>
      <CardContent>
        <div className="flex lg:px-10 py-1.5 gap-2">
          {STATS.map((item, index) => (
            <React.Fragment key={index}>
              <div className="grid grid-cols-1 place-content-center flex-1 cursor-pointer gap-1 text-center group h-[52px]">
                {isLoading ? (
                  <Skeleton className="h-8 w-16 mx-auto" />
                ) : (
                  <span className="text-mono text-2xl lg:text-2xl leading-none font-semibold">
                    {item.value}
                  </span>
                )}
                <span className="text-secondary-foreground text-sm  mt-1">
                  {item.label}
                </span>
              </div>
              {index < STATS.length - 1 && <span className="border-e border-e-input my-1" />}
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
