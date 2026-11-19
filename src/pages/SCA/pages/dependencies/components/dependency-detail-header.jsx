import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, ExternalLink, ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';

export function DependencyDetailHeader({
  dependency,
  id,
  stats,
  affectedProjectsCount,
  vulnerabilitiesCount,
  isLoading,
}) {
  const navigate = useNavigate();

  const getRegistryUrl = (name, ecosystem) => {
    const eco = (ecosystem || '').toLowerCase();
    if (eco.includes('python') || eco.includes('pypi')) {
      return `https://pypi.org/project/${name}/`;
    }
    if (eco.includes('go')) {
      return `https://pkg.go.dev/${name}`;
    }
    return `https://www.npmjs.com/package/${name}`;
  };

  const statisticsPills = [
    {
      label: 'Installed Version',
      value: `v${dependency?.installedVersion || '1.0.0'}`,
      color: 'text-foreground',
    },
    {
      label: 'Dependency Type',
      value: dependency?.type || 'Direct',
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      label: 'Ecosystem',
      value: dependency?.ecosystem || 'npm',
      color: 'text-foreground',
    },
    {
      label: 'License',
      value: dependency?.license || 'MIT',
      color: 'text-foreground',
    },
    {
      label: 'Importing Repos',
      value: affectedProjectsCount || 0,
      color: 'text-foreground',
    },
    {
      label: 'CVE Advisories',
      value: vulnerabilitiesCount || 0,
      color: (vulnerabilitiesCount || 0) > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400',
    },
  ];

  if (isLoading) {
    return (
      <Card className="border border-border/80 shadow-sm">
        <CardContent className="p-5 lg:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="size-11 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <Skeleton className="h-9 w-36" />
          </div>
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
            {statisticsPills.map((_, i) => (
              <Skeleton key={i} className="h-7 w-28 rounded-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground hover:text-foreground"
          onClick={() => navigate('/sca-ui/dependencies')}
        >
          <ArrowLeft className="size-4" />
          <span>Back to Dependencies</span>
        </Button>
      </div>

      <Card className="border border-border/80 shadow-sm">
        <CardContent className="p-5 lg:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="size-11 rounded-xl border border-blue-500/20 bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5">
                <Package className="size-6 text-blue-500" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center flex-wrap gap-2.5">
                  <h1 className="text-xl font-bold text-foreground tracking-tight">
                    {dependency?.name || id}
                  </h1>
                  <Badge variant="outline" className="text-xs bg-muted/30">
                    v{dependency?.installedVersion || '1.0.0'}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      dependency?.type === 'Direct'
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
                        : 'bg-muted/30 text-muted-foreground'
                    }`}
                  >
                    {dependency?.type || 'Direct'} Dependency
                  </Badge>
                  <Badge variant="outline" className="text-xs bg-muted/30">
                    {dependency?.ecosystem || 'npm'}
                  </Badge>
                  <Badge variant="outline" className="text-xs bg-muted/30">
                    License: {dependency?.license || 'MIT'}
                  </Badge>
                </div>
                <p className="text-xs text-secondary-foreground">
                  Package Registry: <span className="text-foreground">{dependency?.ecosystem || 'npm'}</span> &bull; Status: <span className="text-foreground">{dependency?.status || 'Clean'}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <Button
                variant="outline"
                size="md"
                className="gap-2"
                onClick={() => window.open(getRegistryUrl(dependency?.name || id, dependency?.ecosystem), '_blank')}
              >
                <ExternalLink className="size-4" />
                <span>Package Registry Page</span>
              </Button>
            </div>
          </div>

          {/* Statistics Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-border/60">
            {statisticsPills.map((pill, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/60 bg-muted/20 text-xs"
              >
                <span className="text-muted-foreground">{pill.label}:</span>
                <span className={`font-semibold ${pill.color}`}>{pill.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
