import { useState } from 'react';
import { ChevronRight, Play, Loader2, Info, Eye, ArrowRightFromLine, RefreshCcw, LogOut, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { timeAgo } from '@/lib/helpers';
import ExposureTableV2 from './exposure-table-v2';

import useExposureStore from '@/pages/ASM/exposures/store';

import { toast } from 'sonner';
import { useNavigate, Link } from 'react-router';
import {
  useExecuteAsmRuleMutation,
  useToggleAsmRuleStatusMutation,
} from '@/services/asm/ruleApi';
import {
  useSyncAsmVulnsMutation,
  useDeleteAsmExposureMutation,
  useLazyExportAsmExposuresQuery,
} from '@/services/asm/exposureApi';
import useAsmStore from '@/pages/ASM/store';
import useRuleStore from '@/pages/ASM/rules/store';
import useStore2 from '../store';
import { NoSearchResultsFound } from '@/components/common/no-search-found';
import AuthorityGuard from '../../../../components/custom/authority-guard/AuthorityGuard';

export function RuleDetailsView({
  displayRules,
  activeRule,
  setActiveRule,
  exposuresData,
  exposuresLoading,
  exposuresFetching,
  rulesLoading,
}) {
  const [showMatchRule, setShowMatchRule] = useState(false);
  const navigate = useNavigate();
  const setCurrentTab = useStore2((state) => state.setCurrentTab);
  const assetSearch = useStore2((state) => state.assetSearch);
  const setAssetSearch = useStore2((state) => state.setAssetSearch);
  const pagination = useExposureStore((state) => state.pagination);
  const setPagination = useExposureStore((state) => state.setPagination);
  const sorting = useExposureStore((state) => state.sorting);
  const setSorting = useExposureStore((state) => state.setSorting);
  const rowSelection = useExposureStore((state) => state.rowSelection);
  const setRowSelection = useExposureStore((state) => state.setRowSelection);
  const setSelectedExposure = useExposureStore((state) => state.setSelectedExposure);
  const setShowEditExposure = useExposureStore((state) => state.setShowEdit);

  // Rule Mutations
  const [runRule, { isLoading: isExecuting }] = useExecuteAsmRuleMutation();
  const [toggleRule, { isLoading: isToggling }] = useToggleAsmRuleStatusMutation();

  // Exposure Mutations
  const [syncVulns] = useSyncAsmVulnsMutation();
  const [deleteExposure] = useDeleteAsmExposureMutation();
  const [triggerExport, { isFetching: isExporting }] = useLazyExportAsmExposuresQuery();

  // Rule Stores for editing
  const setGlobalSelectedRule = useAsmStore((state) => state.setSelectedRule);
  const setIsEditingRule = useAsmStore((state) => state.setIsEditingRule);
  const setSelectedRuleInStore = useRuleStore((state) => state.setSelectedRule);
  const setRuleMode = useRuleStore((state) => state.setMode);
  const setRuleShowModal = useRuleStore((state) => state.setShowModal);

  // Handlers
  const handleRunRule = (id) => {
    toast.promise(runRule(id).unwrap(), {
      loading: 'Executing Signal...',
      success: 'Signal execution started',
      error: 'Failed to execute rule',
    });
  };

  const handleToggle = (rule, checked) => {
    toast.promise(toggleRule({ ruleId: rule._id, enabled: checked }).unwrap(), {
      loading: 'Updating Status...',
      success: () => {
        setCurrentTab(checked ? 'built-in' : 'custom');
        setActiveRule({ ...rule, enabled: checked });
        return 'Status Updated';
      },
      error: 'Failed to update status',
    });
  };

  const handleEditRule = (rule) => {
    setSelectedRuleInStore(rule);
    setRuleMode('update');
    setRuleShowModal(true);
    setGlobalSelectedRule(rule);
    setIsEditingRule(true);
    navigate(`/casm/rules/guided-editor`);
  };

  const handleEditExposure = (exposure) => {
    setSelectedExposure(exposure);
    setShowEditExposure(true);
  };

  const handleSyncExposure = (exposureId) => {
    toast.promise(syncVulns(exposureId).unwrap(), {
      loading: 'Sending to VM...',
      success: 'Sent successfully',
      error: 'Failed to send to VM',
    });
  };

  const handleDeleteExposure = (exposureId) => {
    toast.promise(deleteExposure(exposureId).unwrap(), {
      loading: 'Deleting exposure...',
      success: 'Exposure deleted',
      error: 'Failed to delete exposure',
    });
  };

  const handleExport = async () => {
    if (!activeRule?._id) return;
    try {
      const blob = await triggerExport({ ruleId: activeRule._id, search: assetSearch || undefined }).unwrap();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeRule.name || 'impacted-assets'}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      toast.error('Failed to export assets');
    }
  };

  if (rulesLoading || exposuresLoading || exposuresFetching) {
    return (
      <main className="flex-1 kt-scrollable-x-auto bg-background">
        <div className="p-6">
          {/* Header skeleton */}
          <header className="mb-4">
            <div className="flex items-start justify-between w-full">
              <div className="pl-3 space-y-2">
                <Skeleton className="h-6 w-64" />
                <div className="flex items-center gap-3">
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton className="h-3.5 w-16" />
                </div>
              </div>
              <div className="flex items-center gap-2 pr-4">
                <Skeleton className="h-3 w-10" />
                <Skeleton className="h-5 w-9 rounded-full" />
              </div>
            </div>
          </header>

          <div className="space-y-4">
            {/* Description card skeleton */}
            <Card className="mb-4">
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-5/6" />
                <Skeleton className="h-3.5 w-4/6" />
              </CardContent>
            </Card>

            {/* Associated Query card skeleton */}
            <Card className="mb-4">
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-36" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 flex-wrap p-3 bg-muted/30 rounded-lg border border-border/40 min-h-[50px]">
                  <Skeleton className="h-6 w-14 rounded-md" />
                  <Skeleton className="h-3 w-10" />
                  <Skeleton className="h-6 w-24 rounded-md" />
                  <Skeleton className="h-3 w-6" />
                  <Skeleton className="h-6 w-20 rounded-md" />
                </div>
              </CardContent>
            </Card>

            <ExposureTableV2
              data={exposuresData}
              isLoading={exposuresLoading}
              isFetching={exposuresFetching}
              pagination={pagination}
              setPagination={setPagination}
              sorting={sorting}
              setSorting={setSorting}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
              onEdit={handleEditExposure}
              onSync={handleSyncExposure}
              onDelete={handleDeleteExposure}
              assetSearch={assetSearch}
              setAssetSearch={setAssetSearch}
              activeRule={activeRule}
              ruleConditions={activeRule?.match?.conditions || []}
            />
          </div>
        </div>
      </main>
    );
  }

  if (!activeRule) {
    return (
      <main className="flex-1 bg-background flex flex-col justify-center items-center h-full">
        <NoSearchResultsFound
          title="No Results Found"
          subTitle="No matching rules found. Try adjusting your search query."
        />
      </main>
    );
  }

  return (
    <main className="flex-1 kt-scrollable-x-auto bg-background">
      <div className="p-6">
        <header className="mb-4 flex items-start gap-3">
          <div className="flex items-start justify-between w-full">
            <div>
              <div className="relative pl-3">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]" />
                <h1 className="text-xl font-semibold text-foreground leading-tight">
                  {activeRule.name}
                </h1>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2 pl-3">
                <span className="flex items-center gap-1.5">
                  Last Run: <span className="text-foreground/80">{(activeRule.last_executed || activeRule.lastRun) ? timeAgo(activeRule.last_executed || activeRule.lastRun) : 'Not run recently'}</span>
                </span>
                <span>•</span>
                <span>Signal Author: {activeRule?.owner?.name || activeRule?.owner?.email || '-'}</span>
                <span>•</span>

                <AuthorityGuard forbidRoles={['Auditor']}>
                  <button
                    className="text-primary cursor-pointer font-medium hover:underline flex items-center gap-0.5 group"
                    onClick={() => handleEditRule(activeRule)}
                  >
                    Edit rule <ChevronRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </AuthorityGuard>
              </div>
            </div>

            <Link to="/casm/signal-library" className="text-primary font-medium hover:underline flex items-center gap-1 group text-sm mt-1 pr-2">
              Explore signal library <ChevronRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            {/* <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs font-medium"
                  onClick={() => handleRunRule(activeRule._id)}
                  disabled={isExecuting}
                >
                  {isExecuting ? <Loader2 className="size-3.5 animate-spin mr-2" /> : <Play className="size-3.5 mr-2" />}
                  Execute Now
                </Button> */}
          </div>
        </header>

        <div className="space-y-4">
          {/* Description */}
          <Card className="mb-4">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {activeRule.description || "This rule analyzes asset properties to identify potential security exposures based on predefined criteria."}
              </p>
            </CardContent>
          </Card>

          <Card className="mb-4 overflow-hidden transition-all duration-200">
            <CardHeader
              className={`flex flex-row items-center justify-between cursor-pointer select-none ${showMatchRule ? 'pb-2' : ''}`}
              onClick={() => setShowMatchRule(!showMatchRule)}
            >
              <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                Match Rule
              </CardTitle>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                {showMatchRule ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CardHeader>
            {showMatchRule && (
              <CardContent>
                <div className="flex items-center gap-1 flex-wrap p-3 bg-muted/30 rounded-lg border border-border/40 min-h-[50px]">

                  {activeRule.match?.conditions ? (
                    activeRule.match.conditions.map((condition, idx) => (
                      <div key={idx} className="flex flex-wrap items-center gap-1 min-w-0">
                        {idx > 0 && <span className="text-xs text-muted-foreground font-bold px-1">AND</span>}
                        <Badge variant="secondary" appearance="outline" size="md" className="text-[12px] font-medium bg-muted border-border/40 max-w-full whitespace-normal break-all h-auto py-1 leading-relaxed">
                          {condition.field}
                        </Badge>
                        <span className="text-[10px] font-mono text-muted-foreground px-0.5">{condition.operator}</span>
                        <Badge variant="secondary" appearance="outline" size="md" className="text-[12px] font-medium bg-muted border-border/40 max-w-full whitespace-normal break-all h-auto py-1 leading-relaxed">
                          {typeof condition.value === 'string' ? `"${condition.value}"` : String(condition.value)}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <Badge variant="secondary" appearance="outline" size="md" className="text-[12px] font-medium bg-muted border-border/40">
                      {activeRule.name}
                    </Badge>
                  )}
                </div>
                <div className="mt-4 flex items-center gap-4">
                  {/* <button
                  className="text-primary text-xs font-medium hover:underline flex items-center gap-1 group"
                  onClick={() => {
                    const assetType = activeRule.match?.conditions?.[0]?.field?.split('.')?.[0]
                      || activeRule.asset_type
                      || 'subdomains';
                    const routeMap = {
                      subdomain: 'subdomains',
                      subdomains: 'subdomains',
                      ip: 'ips',
                      port: 'ports',
                      service: 'services',
                      certificate: 'certificates',
                      technology: 'technologies',
                      dns: 'dns',
                      repository: 'repositories',
                    };
                    const route = routeMap[assetType] || 'subdomains';
                    window.location.href = `/casm/assets/${route}?id=${encodeURIComponent(activeRule._id)}`;
                  }}
                >
                  <Eye className="size-3 transition-transform group-hover:scale-110" />
                  See Results in Inventory
                </button> */}
                </div>
              </CardContent>
            )}
          </Card>

          {/* Standardized Table View */}
          <section className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-foreground">Impacted Assets</h2>
              <Button
                appearance="light"
                variant="outline"
                onClick={handleExport}
                disabled={isExporting || !activeRule?._id}>
                {isExporting
                  ? <><RefreshCcw className="animate-spin" /> Exporting...</>
                  : <><LogOut className='rotate-270' /> Export List</>
                }
              </Button>
            </div>
            <ExposureTableV2
              data={exposuresData}
              isLoading={exposuresLoading}
              isFetching={exposuresFetching}
              pagination={pagination}
              setPagination={setPagination}
              sorting={sorting}
              setSorting={setSorting}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
              onEdit={handleEditExposure}
              onSync={handleSyncExposure}
              onDelete={handleDeleteExposure}
              assetSearch={assetSearch}
              setAssetSearch={setAssetSearch}
              activeRule={activeRule}
              ruleConditions={activeRule?.match?.conditions || []}
            />
          </section>
        </div>
      </div>
    </main>
  );
}
