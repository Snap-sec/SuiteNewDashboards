import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Plus, RotateCcw, Play, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { Tabs, TabsTrigger, TabsList } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RuleCard, RuleCardSkeleton } from './rule-card';

import { toast } from 'sonner';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  useGetAsmRulesQuery,
  useExecuteAsmRuleMutation,
  useToggleAsmRuleStatusMutation,
  useDeleteAsmRuleMutation,
  useRunActiveAsmRulesMutation,
  useSyncAsmRuleMutation,
} from '@/services/asm/ruleApi';
import useAsmStore from '@/pages/ASM/store';
import useRuleStore from '@/pages/ASM/rules/store';
import useStore2 from '../store';
import useExposureStore from '@/pages/ASM/exposures/store';
import useDebounce from '@/hooks/use-debounce';
import { CustomTooltip } from '@/components/custom/tooltip';
import AuthorityGuard from '../../../../components/custom/authority-guard/AuthorityGuard';

const PAGE_SIZE = 10;

export function SignalsSidebar({ onActiveRuleChange, onRulesStateChange, singleRule }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const ruleIdParam = searchParams.get('ruleId');

  const currentTab = useStore2((state) => state.currentTab);
  const setCurrentTab = useStore2((state) => state.setCurrentTab);
  const ruleSearch = useStore2((state) => state.ruleSearch);
  const setRuleSearch = useStore2((state) => state.setRuleSearch);
  const activeRuleId = useStore2((state) => state.activeRuleId);
  const setActiveRuleId = useStore2((state) => state.setActiveRuleId);
  const setRowSelection = useExposureStore((state) => state.setRowSelection);

  const [page, setPage] = useState(1);
  const [allRules, setAllRules] = useState([]);
  const sentinelRef = useRef(null);

  const debouncedSearch = useDebounce(ruleSearch, 400);

  const { data: rulesData, isFetching, isLoading } = useGetAsmRulesQuery({
    product: 'asm',
    limit: PAGE_SIZE,
    page,
    search: debouncedSearch,
  }, { refetchOnMountOrArgChange: true });

  // Force strict reset on every visit
  useEffect(() => {
    setPage(1);
  }, []);

  useEffect(() => {
    if (!rulesData?.results) return;
    setAllRules((prev) => {
      if (page === 1) return rulesData.results;

      // Upsert: replace existing rules by id + append truly new ones.
      const nextById = new Map(prev.map((r) => [r._id, r]));
      rulesData.results.forEach((r) => nextById.set(r._id, r));

      const next = prev.map((r) => nextById.get(r._id));
      const prevIds = new Set(prev.map((r) => r._id));
      const fresh = rulesData.results.filter((r) => !prevIds.has(r._id));
      return [...next, ...fresh];
    });
  }, [rulesData, page]);

  useEffect(() => {
    if (singleRule) {
      const ruleObj = singleRule.data || singleRule;
      if (!ruleObj?._id) return;
      setAllRules((prev) => {
        const exists = prev.some((r) => r._id === ruleObj._id);
        if (!exists) {
          return [ruleObj, ...prev];
        }
        return prev.map((r) => (r._id === ruleObj._id ? ruleObj : r));
      });
      const targetTab = ruleObj.enabled === false ? 'custom' : 'built-in';
      setCurrentTab(targetTab);
      setActiveRuleId(ruleObj._id);
      onActiveRuleChange?.(ruleObj);
    }
  }, [singleRule, setCurrentTab, setActiveRuleId, onActiveRuleChange]);

  const hasMore = rulesData?.results?.length === PAGE_SIZE && (rulesData?.totalResults == null || (page * PAGE_SIZE) < rulesData.totalResults);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, currentTab]);

  const displayRules = useMemo(() => {
    if (currentTab === 'built-in') return allRules.filter((r) => r.enabled !== false);
    if (currentTab === 'custom') return allRules.filter((r) => r.enabled === false);
    return allRules;
  }, [allRules, currentTab]);

  useEffect(() => {
    if (displayRules.length > 0) {
      if (ruleIdParam) {
        const requestedRule = displayRules.find((r) => r._id === ruleIdParam);
        if (requestedRule) {
          if (activeRuleId !== requestedRule._id) {
            setActiveRuleId(requestedRule._id);
            onActiveRuleChange?.(requestedRule);
          }
          return;
        }
        // If singleRule is still pending, don't overwrite with displayRules[0]
        if (!singleRule || (singleRule.data || singleRule)?._id !== ruleIdParam) {
          return;
        }
      }

      const current = displayRules.find(r => r._id === activeRuleId);
      if (!current) {
        const first = displayRules[0];
        setActiveRuleId(first._id);
        onActiveRuleChange?.(first);
      } else {
        onActiveRuleChange?.(current);
      }
    } else {
      if (!ruleIdParam) {
        onActiveRuleChange?.(null);
      }
    }
  }, [displayRules, activeRuleId, setActiveRuleId, onActiveRuleChange, ruleIdParam, singleRule]);

  useEffect(() => {
    if (onRulesStateChange) {
      onRulesStateChange({
        isLoading: (isLoading || isFetching) && page === 1,
        isEmpty: !isLoading && !isFetching && displayRules.length === 0,
        totalResults: rulesData?.totalResults,
        rulesCount: displayRules.length,
      });
    }
  }, [isLoading, isFetching, displayRules.length, page, onRulesStateChange, rulesData?.totalResults]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isFetching]);

  const [runRule] = useExecuteAsmRuleMutation();
  const [toggleRule] = useToggleAsmRuleStatusMutation();
  const [deleteRule] = useDeleteAsmRuleMutation();
  const [runActiveRules, { isLoading: isRunningActive }] = useRunActiveAsmRulesMutation();
  const [syncRules, { isLoading: isSyncing }] = useSyncAsmRuleMutation();

  const setGlobalSelectedRule = useAsmStore((state) => state.setSelectedRule);
  const setIsEditingRule = useAsmStore((state) => state.setIsEditingRule);
  const setSelectedRuleInStore = useRuleStore((state) => state.setSelectedRule);
  const setRuleMode = useRuleStore((state) => state.setMode);
  const setRuleShowModal = useRuleStore((state) => state.setShowModal);

  const handleRuleClick = (rule) => {
    setActiveRuleId(rule._id);
    onActiveRuleChange?.(rule);
    setRowSelection(() => ({}));
    navigate(`/casm/signals?ruleId=${rule._id}`, { replace: true });
  };

  const handleRunRule = (id) => {
    toast.promise(runRule(id).unwrap(), {
      loading: 'Executing Rule...',
      success: 'Signal execution started',
      error: 'Failed to execute Signal',
    });
  };

  const handleToggle = (rule, checked) => {
    toast.promise(toggleRule({ ruleId: rule._id, enabled: checked }).unwrap(), {
      loading: 'Updating Status...',
      success: () => {
        setCurrentTab(checked ? 'built-in' : 'custom');
        setAllRules((prev) =>
          prev.map((r) => (r._id === rule._id ? { ...r, enabled: checked } : r))
        );
        onActiveRuleChange?.({ ...rule, enabled: checked });
        return 'Status Updated';
      },
      error: 'Failed to update status',
    });
  };

  const handleDeleteRule = (id) => {
    toast.promise(
      deleteRule(id)
        .unwrap()
        .then(() => {
          setAllRules((prev) => prev.filter((r) => r._id !== id));
          setRowSelection(() => ({}));

          if (activeRuleId === id) {
            setActiveRuleId(null);
            onActiveRuleChange?.(null);
          }
        }),
      {
        loading: 'Deleting Signal...',
        success: 'Signal Deleted',
        error: 'Failed to delete Signal',
      }
    );
  };

  const handleEditRule = (rule) => {
    setSelectedRuleInStore(rule);
    setRuleMode('update');
    setRuleShowModal(true);
    setGlobalSelectedRule(rule);
    setIsEditingRule(true);
    navigate('/casm/rules/guided-editor');
  };

  const handleRunActive = () => {
    toast.promise(runActiveRules().unwrap(), {
      loading: 'Running Active Rules...',
      success: 'Execution Started',
      error: 'Failed to start execution',
    });
  };

  const handleSyncAllRules = () => {
    toast.promise(syncRules().unwrap(), {
      loading: 'Syncing Rules...',
      success: 'Rules Synced',
      error: 'Failed to sync Signal',
    });
  };

  const onNewRule = () => navigate('/casm/rules/guided-editor');

  return (
    <aside className="w-[380px] shrink-0 border-r border-border flex flex-col bg-background h-full">
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="flex-1">
            <TabsList className="w-full bg-muted/50 p-1" variant="default" size="sm">
              <TabsTrigger value="built-in" className="flex-1">Active Rules</TabsTrigger>
              <TabsTrigger value="custom" className="flex-1">Disabled Rules</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-1 ml-2">
            {/* <AuthorityGuard forbidRoles={['Auditor']}>
              <CustomTooltip text="Sync Signal">
                <ButtonWithConfirm
                  variant="ghost"
                  className="h-8 w-8"
                  confirm
                  onConfirm={handleSyncAllRules}
                  disabled={isSyncing}
                  title="Sync Signal"
                  dialog="This will sync all signal rules. Are you sure you want to proceed?"
                >
                  <RotateCcw className={`size-4 ${isSyncing ? 'animate-spin' : ''}`} />
                </ButtonWithConfirm>
              </CustomTooltip>
            </AuthorityGuard> */}
            {/* <Button
              variant="ghost"
              className="h-8 w-8"
              onClick={handleRunActive}
              disabled={isRunningActive}
              title="Execute Active Rules"
            >
              <Play className="size-4" />
            </Button> */}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              placeholder="Search Signal..."
              value={ruleSearch}
              onChange={(e) => setRuleSearch(e.target.value)}
              className="pl-8 pr-8 h-8 text-xs"
            />
            {ruleSearch?.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-transparent"
                onClick={() => setRuleSearch('')}
              >
                <X className="size-3.5" />
              </Button>
            )}
          </div>

          <AuthorityGuard forbidRoles={['Auditor']}>
            <CustomTooltip text="Create New Signal">
              <Button className="h-8 w-8 shrink-0" title="Create New Signal" onClick={onNewRule}>
                <Plus className="size-4" />
              </Button>
            </CustomTooltip>
          </AuthorityGuard>
        </div>
      </div>

      <ScrollArea className="flex-1 px-4 pb-4">
        <div className="flex flex-col gap-2.5">
          {/* Initial skeletons */}
          {isLoading && displayRules.length === 0 && (
            Array.from({ length: 4 }).map((_, i) => <RuleCardSkeleton key={i} />)
          )}

          {displayRules.map((rule) => (
            <RuleCard
              key={rule._id}
              rule={rule}
              isActive={activeRuleId === rule._id}
              onClick={() => handleRuleClick(rule)}
              onToggle={handleToggle}
              onExecute={handleRunRule}
              onDelete={handleDeleteRule}
              onEdit={handleEditRule}
            />
          ))}

          {/* Sentinel: triggers next page when it enters the viewport */}
          <div ref={sentinelRef} className="h-2" />

          {/* Skeleton for subsequent pages */}
          {isFetching && displayRules.length > 0 && (
            <RuleCardSkeleton />
          )}

          {/* No results */}
          {!isLoading && displayRules.length === 0 && (
            <div className="p-8 text-center text-xs text-muted-foreground">
              No {currentTab === 'custom' ? 'disabled' : 'active'} Signal found
              {ruleSearch && ` matching "${ruleSearch}"`}
            </div>
          )}

          {/* End of list */}
          {!hasMore && displayRules.length > 0 && (
            <p className="text-center text-[10px] text-muted-foreground/50 py-2">
              All {displayRules.length} Signal loaded
            </p>
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}
