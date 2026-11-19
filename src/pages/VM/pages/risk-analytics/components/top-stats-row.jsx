import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function TopStatsRow({ data, isLoading }) {
  const navigate = useNavigate();
  const exposure = data?.exposureSummary || {};

  const stats = [
    {
      label: 'Total Open',
      number: exposure.totalOpenVulnerabilities ?? 0,
      skeletonWidth: 'w-16',
    },
    {
      label: 'Critical',
      number: exposure.critical ?? 0,
      filter: 'severity:Critical',
      skeletonWidth: 'w-12',
    },
    {
      label: 'High',
      number: exposure.high ?? 0,
      filter: 'severity:High',
      skeletonWidth: 'w-10',
    },
    {
      label: 'Medium',
      number: exposure.medium ?? 0,
      filter: 'severity:Medium',
      skeletonWidth: 'w-12',
    },
    {
      label: 'Unique CVEs',
      number: exposure.uniqueCves ?? 0,
      skeletonWidth: 'w-18',
    },
    {
      label: 'Unique CWEs',
      number: exposure.uniqueCwes ?? 0,
      skeletonWidth: 'w-18',
    },
    {
      label: 'KEV',
      number: exposure.totalKev ?? 0,
      filter: 'isKev:true',
      skeletonWidth: 'w-8',
    },
    {
      label: 'Avg CVSS',
      number: exposure.averageCvss ?? 0,
      skeletonWidth: 'w-14',
    },
  ];

  const handleNavigation = (filter) => {
    if (filter) {
      navigate(`/vm/vulnerabilities?filters=${encodeURIComponent(filter)}`);
    }
  };

  const renderItems = (item, index) => {
    return (
      <React.Fragment key={index}>
        <div
          className={`flex flex-col items-center justify-center flex-1 gap-1 text-center min-w-0 py-1 ${item.filter ? ' rounded-md transition-colors group' : ''}`}
        >
          <span className="text-mono text-2xl lg:text-2xl leading-none font-semibold">
            {item.number}
          </span>
          <div className="relative inline-flex items-center justify-center gap-1 cursor-pointer max-w-full px-1">
            <span className="text-secondary-foreground text-sm truncate">
              {item.label}
            </span>
            {item.filter && (
              <span className="text-secondary-foreground text-sm truncate"
                onClick={() => handleNavigation(item.filter)}
              >
                Open
              </span>
            )}
          </div>
        </div>
        {index < stats.length - 1 && (
          <span className="border-e border-e-input my-1 shrink-0"></span>
        )}
      </React.Fragment>
    );
  };

  const renderSkeletonItems = (item, index) => {
    return (
      <React.Fragment key={index}>
        <div className="flex flex-col items-center justify-center flex-1 gap-1 text-center min-w-0 py-1">
          <Skeleton className="h-6 w-8 my-0.5" />
          <Skeleton
            className={`h-3.5 ${item.skeletonWidth || 'w-14'} my-0.5`}
          />
          {item.filter && <Skeleton className="h-3 w-8 my-0.5" />}
        </div>
        {index < stats.length - 1 && (
          <span className="border-e border-e-input my-1 shrink-0"></span>
        )}
      </React.Fragment>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <div className="flex lg:px-10 py-1.5 gap-2 overflow-x-auto no-scrollbar items-center">
            {stats.map((item, index) => renderSkeletonItems(item, index))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <div className="flex lg:px-10 py-1.5 gap-2 overflow-x-auto no-scrollbar items-center">
          {stats.map((item, index) => {
            return renderItems(item, index);
          })}
        </div>
      </CardContent>
    </Card>
  );
}
