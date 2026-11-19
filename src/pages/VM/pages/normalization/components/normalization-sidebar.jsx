import { useEffect, useMemo, useRef, useState } from 'react';
import { Ellipsis, Play, Plus, RotateCcw, Search, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import useDebounce from '@/hooks/use-debounce';
import {
  useDeleteNormalizationMutation,
  useExecuteNormalizationAllMutation,
  useExecuteNormalizationMutation,
  useGetNormalizationQuery,
  useUpdateNormalizationMutation,
} from '@/services/vm/normalizationApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { CustomTooltip } from '@/components/custom/tooltip';
import AuthorityGuard from '../../../../../components/custom/authority-guard/AuthorityGuard';
import useNormalizationStore from '../store';
import CreateRuleModel from './create-rule-model';

function SidebarRuleCard({
  rule,
  isActive,
  onClick,
  onToggle,
  onExecute,
  onDelete,
  onEdit,
}) {
  return (
    <Card
      className={`cursor-pointer transition-all relative border overflow-hidden ${
        isActive
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

                  <ButtonWithConfirm
                    variant="ghost"
                    confirm={true}
                    disabled={!rule.enabled}
                    onConfirm={() => onExecute(rule._id)}
                    confirmButton={
                      <Button variant="primary">Execute Now</Button>
                    }
                    cancelButton={<Button variant="outline">Cancel</Button>}
                    className="w-full justify-start h-8 px-2 text-sm font-normal"
                  >
                    Execute Now
                  </ButtonWithConfirm>
                  <DropdownMenuItem onClick={() => onEdit(rule)}>
                    Edit Rule
                  </DropdownMenuItem>

                  <DropdownMenuItem variant="destructive" asChild>
                    <ButtonWithConfirm
                      variant="ghost"
                      confirm={true}
                      onConfirm={() => onDelete(rule._id)}
                      confirmButton={<Button variant="primary">Delete</Button>}
                      cancelButton={<Button variant="outline">Cancel</Button>}
                      className="w-full justify-start h-8 px-2 text-destructive hover:text-destructive font-normal"
                    >
                      Delete
                    </ButtonWithConfirm>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </AuthorityGuard>
        </div>

        <div className="flex items-start gap-2 mt-3">
          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              Vuln Count
            </span>
            <span className="text-xs font-medium text-foreground">
              {rule?.matchingVulnsCount}
            </span>
          </div>
          <div className="flex flex-col gap-0.5 flex-[2] min-w-0">
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              Action
            </span>
            <span className="text-xs font-medium text-foreground capitalize truncate">
              {rule.action?.type === 'setSeverity'
                ? `Set Severity: ${rule.action?.severity}`
                : rule.action?.operation
                  ? `${rule.action.operation}: ${rule.action.operand ?? rule.action.value}`
                  : 'No action defined'}
            </span>
          </div>
          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              Status
            </span>
            <span
              className={`text-xs font-medium ${rule.enabled ? 'text-green-600' : 'text-orange-600'}`}
            >
              {rule.enabled ? 'Active' : 'Disabled'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

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

export function NormalizationSidebar({
  onActiveRuleChange,
  onRulesStateChange,
}) {
  const [editingRule, setEditingRule] = useState(null);
  const ruleSearch = useNormalizationStore((state) => state.ruleSearch);
  const setRuleSearch = useNormalizationStore((state) => state.setRuleSearch);
  const activeRuleId = useNormalizationStore((state) => state.activeRuleId);
  const setActiveRuleId = useNormalizationStore(
    (state) => state.setActiveRuleId,
  );

  const debouncedSearch = useDebounce(ruleSearch, 400);

  const { data, isFetching, isLoading } = useGetNormalizationQuery({
    search: debouncedSearch,
  });

  const [deleteRule] = useDeleteNormalizationMutation();
  const [updateRule, { isLoading: isUpdtingRule }] =
    useUpdateNormalizationMutation();
  const [executeRule] = useExecuteNormalizationMutation();
  const [executeAllNormalization, { isLoading: isExecutingAll }] =
    useExecuteNormalizationAllMutation();

  const rules = data?.data?.rules || [];

  const displayRules = rules;

  useEffect(() => {
    if (displayRules.length > 0) {
      const current = displayRules.find((r) => r._id === activeRuleId);
      if (!current) {
        const first = displayRules[0];
        setActiveRuleId(first._id);
        onActiveRuleChange?.(first);
      } else {
        onActiveRuleChange?.(current);
      }
    } else {
      onActiveRuleChange?.(null);
    }
  }, [displayRules, activeRuleId, setActiveRuleId, onActiveRuleChange]);

  useEffect(() => {
    onRulesStateChange?.({
      isLoading: isLoading && rules.length === 0,
      isEmpty: !isLoading && !isFetching && rules.length === 0 && !ruleSearch,
    });
  }, [isLoading, isFetching, rules.length, ruleSearch, onRulesStateChange]);

  const handleRuleClick = (rule) => {
    setActiveRuleId(rule._id);
    onActiveRuleChange?.(rule);
  };

  const handleToggle = (rule, checked) => {
    toast.promise(updateRule({ ruleId: rule._id, enabled: checked }).unwrap(), {
      loading: 'Updating Status...',
      success: 'Status Updated',
      error: 'Failed to update status',
    });
  };

  const handleDeleteRule = (id) => {
    toast.promise(deleteRule(id).unwrap(), {
      loading: 'Deleting Rule...',
      success: 'Rule Deleted',
      error: 'Failed to delete rule',
    });
  };

  const handleExecuteRule = (id) => {
    toast.promise(executeRule(id).unwrap(), {
      loading: 'Executing Rule...',
      success: 'Rule execution started',
      error: 'Failed to execute rule',
    });
  };

  const handleExecuteAll = () => {
    toast.promise(executeAllNormalization().unwrap(), {
      loading: 'Executing all rules...',
      success: 'Normalization started',
      error: 'Failed to start normalization',
    });
  };

  return (
    <aside className="w-[380px] shrink-0 border-r border-border flex flex-col bg-background h-full">
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between h-8">
          <h2 className="text-sm font-semibold text-foreground">
            Normalization Rules
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
            <Input
              placeholder="Search Rules..."
              value={ruleSearch}
              onChange={(e) => setRuleSearch(e.target.value)}
              className="pl-8 h-9 text-xs"
            />
          </div>
          <AuthorityGuard forbidRoles={['Auditor']}>
            <CustomTooltip text="Create New Rule">
              <CreateRuleModel
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

      <ScrollArea className="flex-1 px-4 pb-4">
        <div className="flex flex-col gap-2.5">
          {(isLoading || isFetching) &&
            Array.from({ length: 4 }).map((_, i) => (
              <SidebarRuleCardSkeleton key={i} />
            ))}

          {!isLoading &&
            !isFetching &&
            displayRules.map((rule) => (
              <SidebarRuleCard
                key={rule._id}
                rule={rule}
                isActive={activeRuleId === rule._id}
                onClick={() => handleRuleClick(rule)}
                onToggle={handleToggle}
                onExecute={handleExecuteRule}
                onDelete={handleDeleteRule}
              />
            ))}

          {!isLoading && displayRules.length === 0 && (
            <div className="p-8 text-center text-xs text-muted-foreground">
              No rules found
              {ruleSearch && ` matching "${ruleSearch}"`}
            </div>
          )}
        </div>
      </ScrollArea>
      {editingRule && (
        <CreateRuleModel
          rule={editingRule}
          open={!!editingRule}
          setOpen={(v) => {
            if (!v) setEditingRule(null);
          }}
          trigger={<span className="hidden"></span>}
        />
      )}
    </aside>
  );
}
