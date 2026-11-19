import { useEffect, useMemo, useState } from 'react';
import { Ellipsis, Play, Plus, Search, Zap } from 'lucide-react';
import { toast } from 'sonner';
import useDebounce from '@/hooks/use-debounce';
import {
  useDeleteAutomationRuleMutation,
  useExecuteAutomationRuleMutation,
  useGetAutomationRulesQuery,
  useToggleAutomationRuleMutation,
} from '@/services/vm/automationApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { SearchInput } from '@/components/custom/search';
import { CustomTooltip } from '@/components/custom/tooltip';
import { NoSearchResultsFound } from '../../../../../components/common/no-search-found';
import AuthorityGuard from '../../../../../components/custom/authority-guard/AuthorityGuard';
import useAutomationStore from '../store';
import CreateAutomationRuleModal from './create-automation-rule-modal';
import EditAutomationRuleModal from './edit-automation-rule-modal';

// ─── Skeleton ────────────────────────────────────────────────────────────────

function SidebarRuleCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-3.5 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-6 w-6 rounded-md" />
      </div>
      <div className="flex items-center gap-4">
        <div className="space-y-1">
          <Skeleton className="h-2.5 w-10" />
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="space-y-1">
          <Skeleton className="h-2.5 w-10" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  );
}

// ─── Rule Card ───────────────────────────────────────────────────────────────

function SidebarRuleCard({
  rule,
  isActive,
  onClick,
  onToggle,
  onExecute,
  onDelete,
}) {
  return (
    <Card
      className={`cursor-pointer transition-all relative border overflow-hidden ${isActive
          ? 'border-l-[3px] border-l-primary shadow-sm'
          : 'hover:shadow-sm'
        }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-foreground leading-tight line-clamp-2">
              {rule.name}
            </h4>
            <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1">
              {rule.description || 'No description'}
            </p>
          </div>

          <AuthorityGuard forbidRoles={['Auditor']}>
            <div
              className="flex items-center gap-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 shrink-0"
                  >
                    <Ellipsis className="size-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-[160px]">
                  <ButtonWithConfirm
                    variant="ghost"
                    confirm={true}
                    onConfirm={() => onToggle(rule, !rule.enabled)}
                    confirmButton={
                      <Button variant="primary">
                        {rule.enabled ? 'Disable' : 'Enable'}
                      </Button>
                    }
                    cancelButton={<Button variant="outline">Cancel</Button>}
                    className="w-full justify-start h-8 px-2 text-sm font-normal"
                  >
                    {rule.enabled ? 'Disable' : 'Enable'}
                  </ButtonWithConfirm>

                  {/* <DropdownMenuSeparator /> */}

                  <ButtonWithConfirm
                    variant="ghost"
                    confirm={true}
                    onConfirm={() => onExecute(rule._id)}
                    confirmButton={<Button variant="primary">Execute</Button>}
                    cancelButton={<Button variant="outline">Cancel</Button>}
                    className="w-full justify-start h-8 px-2 text-sm font-normal hover:pointer-cursor"
                  >
                    Execute Now
                  </ButtonWithConfirm>
                  {/* <DropdownMenuSeparator /> */}

                  <EditAutomationRuleModal
                    rule={rule}
                    trigger={
                      <DropdownMenuItem className="hover:cursor-pointer hover:bg-gray-100" onSelect={(e) => e.preventDefault()}>
                        Edit
                      </DropdownMenuItem>
                    }
                  />
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" asChild>
                    <ButtonWithConfirm
                      variant="ghost"
                      confirm={true}
                      onConfirm={() => onDelete(rule._id)}
                      confirmButton={<Button variant="destructive">Delete</Button>}
                      cancelButton={<Button variant="outline">Cancel</Button>}
                      className="w-full justify-start hover:cursor-pointer h-8 px-2 text-destructive hover:text-destructive font-normal"
                    >
                      Delete
                    </ButtonWithConfirm>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </AuthorityGuard>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-7 justify-between mt-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              Execution
            </span>
            <span className="text-xs font-medium text-foreground">
              {rule.execution_policy?.type === 'event'
                ? 'Event Based'
                : rule.execution_policy?.type === 'scheduled'
                ? 'Scheduled'
                : '—'}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              Status
            </span>
            <span
              className={`text-xs font-medium ${rule.enabled ? 'text-green-600' : 'text-orange-600'
                }`}
            >
              {rule.enabled ? 'Active' : 'Disabled'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

export function AutomationSidebar({ onActiveRuleChange, onRulesStateChange, origin }) {
  const ruleSearch = useAutomationStore((s) => s.ruleSearch);
  const setRuleSearch = useAutomationStore((s) => s.setRuleSearch);
  const activeRuleId = useAutomationStore((s) => s.activeRuleId);
  const setActiveRuleId = useAutomationStore((s) => s.setActiveRuleId);

  const [page, setPage] = useState(1);
  const limit = 20;

  const debouncedSearch = useDebounce(ruleSearch, 400);

  // Reset page when search or origin changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, origin]);

  const queryParams = useMemo(() => {
    return {
      page,
      limit,
      search: debouncedSearch || undefined,
      origin,
    };
  }, [page, limit, debouncedSearch, origin]);

  const { data, isFetching, isLoading, isError, error } = useGetAutomationRulesQuery(queryParams);

  const [deleteRule] = useDeleteAutomationRuleMutation();
  const [toggleRule] = useToggleAutomationRuleMutation();
  const [executeRule] = useExecuteAutomationRuleMutation();

  const [allRules, setAllRules] = useState([]);

  useEffect(() => {
    if (data?.data) {
      const fetched = data.data.rules || (Array.isArray(data.data) ? data.data : []);
      if (page === 1) {
        setAllRules(fetched);
      } else {
        setAllRules((prev) => {
          const existingIds = new Set(prev.map((r) => r._id));
          const newRules = fetched.filter((r) => !existingIds.has(r._id));
          return [...prev, ...newRules];
        });
      }
    }
  }, [data?.data, page]);

  const fetched = data?.data?.rules || (Array.isArray(data?.data) ? data.data : []);
  const totalCount = data?.data?.total || data?.data?.totalItems || data?.data?.pagination?.total;
  const hasMore = totalCount ? allRules.length < totalCount : fetched.length >= limit;

  const filteredRules = useMemo(() => {
    if (!debouncedSearch) return allRules;
    const q = debouncedSearch.toLowerCase();
    return allRules.filter(
      (r) =>
        r.name?.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q)
    );
  }, [allRules, debouncedSearch]);

  const loadingInitial = (isLoading || isFetching) && page === 1 && allRules.length === 0;
  const loadingMore = isFetching && page > 1;

  // Keep active selection in sync
  useEffect(() => {
    if (filteredRules.length > 0) {
      const current = filteredRules.find((r) => r._id === activeRuleId);
      if (!current) {
        const first = filteredRules[0];
        setActiveRuleId(first._id);
        onActiveRuleChange?.(first);
      } else {
        onActiveRuleChange?.(current);
      }
    } else if (!loadingInitial && !isFetching) {
      onActiveRuleChange?.(null);
    }
  }, [filteredRules, activeRuleId, setActiveRuleId, onActiveRuleChange, loadingInitial, isFetching]);

  useEffect(() => {
    onRulesStateChange?.({
      isLoading: loadingInitial,
      isEmpty: !loadingInitial && !isFetching && allRules.length === 0 && !ruleSearch && !debouncedSearch,
      isError,
      error,
    });
  }, [loadingInitial, isFetching, allRules.length, ruleSearch, debouncedSearch, onRulesStateChange]);

  const handleRuleClick = (rule) => {
    setActiveRuleId(rule._id);
    onActiveRuleChange?.(rule);
  };

  const handleToggle = (rule, enabled) => {
    toast.promise(toggleRule({ id: rule._id, enabled }).unwrap(), {
      loading: 'Updating status…',
      success: 'Status updated',
      error: 'Failed to update status',
    });
  };

  const handleDelete = (id) => {
    toast.promise(deleteRule(id).unwrap(), {
      loading: 'Deleting rule…',
      success: 'Rule deleted',
      error: 'Failed to delete rule',
    });
  };

  const handleExecute = (id) => {
    toast.promise(executeRule(id).unwrap(), {
      loading: 'Executing rule…',
      success: 'Rule execution enqueued',
      error: 'Failed to execute rule',
    });
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (isFetching || isLoading || !hasMore) return;
    if (scrollTop + clientHeight >= scrollHeight - 60) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <aside className="w-[380px] shrink-0 border-r border-border flex flex-col bg-background h-full">
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between h-8">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
            <Zap className="size-4 text-primary" />
            Automation Rules
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <SearchInput
            value={ruleSearch || ''}
            placeholder="Search rules..."
            onChange={(e) => setRuleSearch(e.target.value)}
            className="w-full"
          />
          <AuthorityGuard forbidRoles={['Auditor']}>
            <CustomTooltip text="Create New Rule">
              <CreateAutomationRuleModal
                origin={origin}
                trigger={
                  <Button
                    className="h-8.5 w-8.5 shrink-0"
                    title="Create New Rule"
                  >
                    <Plus className="size-4" />
                  </Button>
                }
              />
            </CustomTooltip>
          </AuthorityGuard>
        </div>
      </div>

      <div
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 pb-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border"
      >
        <div className="flex flex-col gap-2.5">
          {loadingInitial &&
            Array.from({ length: 4 }).map((_, i) => (
              <SidebarRuleCardSkeleton key={i} />
            ))}

          {!loadingInitial &&
            filteredRules.map((rule) => (
              <SidebarRuleCard
                key={rule._id}
                rule={rule}
                isActive={activeRuleId === rule._id}
                onClick={() => handleRuleClick(rule)}
                onToggle={handleToggle}
                onExecute={handleExecute}
                onDelete={handleDelete}
              />
            ))}

          {loadingMore && (
            <div className="py-2 space-y-2.5">
              <SidebarRuleCardSkeleton />
            </div>
          )}

          {!loadingInitial && !isFetching && filteredRules.length === 0 && (
            <NoSearchResultsFound
              title={
                ruleSearch ? `Rules matching "${ruleSearch}"` : 'No Rules Found'
              }
              subTitle={
                ruleSearch
                  ? 'No rules found matching your search query. Try adjusting your search or create a new rule.'
                  : 'No rules found. Create your first automation rule to get started.'
              }
            />
          )}
        </div>
      </div>
    </aside>
  );
}
