import React, { useMemo, useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Layers,
  Search,
  ShieldAlert,
  Server,
  Globe,
  Radio,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyScreen } from '@/components/common/empty-screen';
import SeverityLabel from '@/components/custom/severity-label';
import { StateLabels } from '@/components/custom/state-labels';
import GetAssetTypeInfo from '@/components/custom/asset-icons';
import ExposureInfoModal from './modals/exposure-info-modal';
import { formatDateTime, timeAgo } from '@/lib/helpers';

export function ExposureGroups({ data, isLoading, isFetching }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [expandedGroups, setExpandedGroups] = useState({});

  const toggleGroup = (groupId) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const expandAll = () => {
    const all = {};
    groups.forEach((g) => {
      all[g.id] = true;
    });
    setExpandedGroups(all);
  };

  const collapseAll = () => {
    setExpandedGroups({});
  };

  // Group exposures by title / issue
  const groups = useMemo(() => {
    const rawList = data?.data || [];
    if (!rawList.length) return [];

    const map = new Map();

    rawList.forEach((item) => {
      const key = item.title?.trim() || item.universalVulnId || 'Uncategorized Exposure';

      if (!map.has(key)) {
        map.set(key, {
          id: key,
          title: key,
          severity: item.severity || 'medium',
          ruleId: item.ruleId,
          lastDetected: item.createdAt,
          assetTypes: new Set(),
          states: {},
          assets: [],
        });
      }

      const grp = map.get(key);
      const assetType = item.associatedAsset?.type || 'unknown';
      grp.assetTypes.add(assetType);

      const stateKey = item.state || 'In review';
      grp.states[stateKey] = (grp.states[stateKey] || 0) + 1;

      if (new Date(item.createdAt) > new Date(grp.lastDetected)) {
        grp.lastDetected = item.createdAt;
      }

      // Keep the highest severity in the group
      const severityRanks = { critical: 4, high: 3, medium: 2, low: 1, info: 0 };
      if (
        (severityRanks[item.severity?.toLowerCase()] || 0) >
        (severityRanks[grp.severity?.toLowerCase()] || 0)
      ) {
        grp.severity = item.severity;
      }

      grp.assets.push(item);
    });

    return Array.from(map.values()).map((grp) => ({
      ...grp,
      assetTypes: Array.from(grp.assetTypes),
      assetsCount: grp.assets.length,
    }));
  }, [data?.data]);

  // Filter groups by search query and severity
  const filteredGroups = useMemo(() => {
    return groups.filter((grp) => {
      if (selectedSeverity !== 'all' && grp.severity?.toLowerCase() !== selectedSeverity) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = grp.title.toLowerCase().includes(query);
        const matchesAssets = grp.assets.some(
          (a) =>
            a.associatedAsset?.subdomain?.toLowerCase().includes(query) ||
            a.associatedAsset?.value?.toLowerCase().includes(query) ||
            a.value?.toLowerCase().includes(query)
        );
        return matchesTitle || matchesAssets;
      }

      return true;
    });
  }, [groups, searchQuery, selectedSeverity]);

  const totalAffectedAssets = useMemo(() => {
    return groups.reduce((acc, g) => acc + g.assetsCount, 0);
  }, [groups]);

  if (isLoading || isFetching) {
    return (
      <div className="flex flex-col gap-4 mt-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-9 w-48" />
        </div>
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1">
                <Skeleton className="size-10 rounded-lg shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </div>
              <Skeleton className="h-7 w-24" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!groups.length) {
    return (
      <EmptyScreen
        title="No Exposure Groups Found"
        subTitle="There are currently no exposures available to group."
      />
    );
  }

  const severities = ['all', 'critical', 'high', 'medium', 'low'];

  return (
    <div className="flex flex-col gap-4">
      {/* Controls: Search, Severity Filter, Stats, Expand/Collapse */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              placeholder="Search exposure groups or assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ps-9 h-9 text-sm"
            />
          </div>

          <div className="flex items-center gap-1">
            {severities.map((sev) => (
              <Button
                key={sev}
                variant={selectedSeverity === sev ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedSeverity(sev)}
                className="h-8 capitalize text-xs"
              >
                {sev}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-muted-foreground">
          <span>
            <strong className="text-foreground">{filteredGroups.length}</strong>{' '}
            {filteredGroups.length === 1 ? 'group' : 'groups'} ·{' '}
            <strong className="text-foreground">{totalAffectedAssets}</strong> total assets
          </span>
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="sm" onClick={expandAll} className="h-7 text-xs">
              Expand All
            </Button>
            <span className="text-muted-foreground/40">|</span>
            <Button variant="ghost" size="sm" onClick={collapseAll} className="h-7 text-xs">
              Collapse All
            </Button>
          </div>
        </div>
      </div>

      {/* Groups List */}
      <div className="flex flex-col gap-3">
        {filteredGroups.map((group) => {
          const isExpanded = !!expandedGroups[group.id];

          return (
            <Card
              key={group.id}
              className={`transition-colors border ${
                isExpanded ? 'border-primary/40 shadow-xs' : 'border-border hover:border-border/80'
              }`}
            >
              {/* Group Header */}
              <div
                className="p-4 flex items-center justify-between gap-4 cursor-pointer select-none"
                onClick={() => toggleGroup(group.id)}
              >
                <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                  <div className="size-9 rounded-lg bg-muted/60 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                    <ShieldAlert className="size-5 text-muted-foreground" />
                  </div>

                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-sm text-foreground hover:text-primary transition-colors leading-tight">
                        {group.title}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {timeAgo(group.lastDetected)}
                      </span>
                      <span>·</span>
                      <div className="flex items-center gap-1.5">
                        {group.assetTypes.map((type) => (
                          <Badge
                            key={type}
                            variant="secondary"
                            appearance="outline"
                            className="text-[10px] uppercase px-1.5 py-0 font-mono"
                          >
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <SeverityLabel severity={group.severity} />

                  <Badge variant="outline" className="text-xs font-mono font-medium">
                    {group.assetsCount} {group.assetsCount === 1 ? 'asset' : 'assets'}
                  </Badge>

                  <Button variant="ghost" size="icon" className="size-7">
                    {isExpanded ? (
                      <ChevronUp className="size-4" />
                    ) : (
                      <ChevronDown className="size-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Group Expanded Assets Table */}
              {isExpanded && (
                <div className="border-t border-border/60 bg-muted/20 px-4 py-3">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Affected Assets ({group.assets.length})
                  </div>

                  <div className="divide-y divide-border/40 rounded-md border border-border/60 bg-card overflow-hidden">
                    {group.assets.map((asset) => {
                      const host =
                        asset.associatedAsset?.subdomain ||
                        asset.associatedAsset?.value ||
                        asset.value ||
                        'Unknown host';
                      const assetType = asset.associatedAsset?.type || 'asset';

                      return (
                        <div
                          key={asset._id}
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-3.5 py-2.5 hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <GetAssetTypeInfo type={assetType} className="size-4 text-muted-foreground shrink-0" />
                            <div className="flex flex-col min-w-0">
                              <span className="text-sm font-medium text-foreground truncate">
                                {host}
                              </span>
                              {asset.associatedAsset?.type === 'port' && asset.associatedAsset?.value && (
                                <span className="text-[11px] text-muted-foreground font-mono">
                                  Port: {asset.associatedAsset.value}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0 text-xs">
                            <StateLabels state={asset.state || 'In Review'} />
                            <span className="text-muted-foreground text-[11px] min-w-20 text-right">
                              {timeAgo(asset.createdAt)}
                            </span>

                            <ExposureInfoModal
                              row={asset}
                              associatedAsset={asset.associatedAsset}
                              assessmentId={asset.assessmentId}
                              vulnId={asset.universalVulnId}
                              universalVulnId={asset._id}
                              trigger={
                                <Button variant="outline" size="sm" className="h-7 text-xs">
                                  Details
                                </Button>
                              }
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </Card>
          );
        })}

        {filteredGroups.length === 0 && (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No exposure groups match your search and filter criteria.
          </div>
        )}
      </div>
    </div>
  );
}

export default ExposureGroups;

