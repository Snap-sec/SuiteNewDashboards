import { useState, useEffect, useMemo } from "react";
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import {
  useGetAutomationRuleMatchesQuery,
  useExecuteAutomationRuleMutation,
  useToggleAutomationRuleMutation,
} from '@/services/vm/automationApi';
import { NoSearchResultsFound } from '@/components/common/no-search-found';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { JobsTab } from './jobs-tab';
import { DetailsSkeleton } from './details-skeleton';
import { AutomationDetailsHeader } from './details-header';
import { AutomationDetailsTabContent } from './details-tab-content';
import { Skeleton } from "@/components/ui/skeleton";

export function AutomationDetailsView({
  activeRule,
  setActiveRule,
  isLoading,
  origin,
}) {
  const [executeRule, { isLoading: isExecuting }] =
    useExecuteAutomationRuleMutation();
  const [toggleRule] = useToggleAutomationRuleMutation();

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  useEffect(() => {
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  }, [activeRule?._id]);

  const {
    data: matchesData,
    isLoading: matchesLoading,
    isFetching: matchesFetching,
  } = useGetAutomationRuleMatchesQuery(
    {
      id: activeRule?._id,
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    },
    { skip: !activeRule?._id },
  );

  const columns = useMemo(
    () => [
      {
        id: 'title',
        accessorFn: (row) => row.title,
        header: ({ column }) => (
          <DataGridColumnHeader title="Title" column={column} />
        ),
        cell: ({ row }) => (
          <Link
            to={`/vm/vulnerability-report?id=${row?.original?._id}&assessmentId=${row?.original?.assessmentId}`}
            className="leading-none text-mono flex gap-1 font-medium text-sm hover:text-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p title={row.original.title} className="truncate">{row.original.title}</p>
            {row?.original?.blockers?.length > 0 && (
              <Badge size="sm" variant="destructive" appearance="outline">Blocked</Badge>
            )}
          </Link>
        ),
        size: 250,
        enableSorting: false,
        meta: { skeleton: <Skeleton className="h-7" /> },
      },
      {
        id: 'owner',
        accessorFn: (row) => row.assignee?.name,
        header: ({ column }) => (
          <DataGridColumnHeader title="Owner" column={column} />
        ),
        cell: ({ row }) =>
          row.original.assignee?.name ? (
            <Profile
              name={row.original.assignee.name}
              role={row.original.assignee.role}
              email={row.original.assignee.email}
            />
          ) : (
            <span className="text-muted-foreground text-sm font-medium pl-1">
              No Owner
            </span>
          ),
        size: 150,
        enableSorting: false,
        meta: { skeleton: <Skeleton className="h-7" /> },
      },
      {
        id: 'state',
        accessorFn: (row) => row.state,
        header: ({ column }) => (
          <DataGridColumnHeader title="State" column={column} />
        ),
        cell: ({ row }) => <StateLabels state={row.original.state} />,
        size: 120,
        enableSorting: false,
        meta: { skeleton: <Skeleton className="h-7" /> },
      },
      {
        id: 'severity',
        accessorFn: (row) => row.severity,
        header: ({ column }) => (
          <DataGridColumnHeader title="Severity" column={column} />
        ),
        cell: ({ row }) => <SeverityLabel severity={row.original.severity} />,
        size: 100,
        enableSorting: false,
        meta: { skeleton: <Skeleton className="h-7" /> },
      },
      {
        id: 'reportedOn',
        accessorFn: (row) => row.createdAt,
        header: ({ column }) => (
          <DataGridColumnHeader title="Reported On" column={column} />
        ),
        cell: ({ row }) => <DateFormatter date={row.original.createdAt} />,
        size: 100,
        meta: { skeleton: <Skeleton className="h-7" /> },
      },
    ],
    [],
  );

  const handleExecuteRule = (id) => {
    toast.promise(executeRule(id).unwrap(), {
      loading: 'Executing rule…',
      success: (res) =>
        `Dispatched ${res?.data?.dispatched ?? 0} of ${res?.data?.matched ?? 0} matches`,
      error: 'Failed to execute rule',
    });
  };

  const handleToggle = (rule, enabled) => {
    toast.promise(toggleRule({ id: rule._id, enabled }).unwrap(), {
      loading: 'Updating status…',
      success: () => {
        setActiveRule({ ...rule, enabled });
        return 'Status updated';
      },
      error: 'Failed to update status',
    });
  };

  if (isLoading) return <DetailsSkeleton />;

  if (!activeRule) {
    return (
      <main className="flex-1 bg-background flex flex-col justify-center items-center h-full">
        <NoSearchResultsFound
          title="No Automation Rules Found"
          subTitle="No rules found matching your search query. Try adjusting your search query or create a new rule."
        />
      </main>
    );
  }

  // ─── Condition pill builder ────────────────────────────────────────────────
  const renderConditions = () => {
    const rawConditions = activeRule.conditions;
    let condList = [];
    let logicalOp = 'AND';

    if (Array.isArray(rawConditions)) {
      condList = rawConditions;
    } else if (rawConditions && typeof rawConditions === 'object') {
      logicalOp = rawConditions.logicalOp || 'AND';
      if (Array.isArray(rawConditions.children)) {
        const traverse = (node) => {
          if (!node) return;
          if (Array.isArray(node)) node.forEach(traverse);
          else if (node.type === 'condition' || node.field) condList.push(node);
          else if (node.children) traverse(node.children);
        };
        traverse(rawConditions.children);
      } else if (rawConditions.field) {
        condList.push(rawConditions);
      }
    }

    if (!condList.length) {
      return (
        <span className="text-xs text-muted-foreground italic">
          No conditions defined
        </span>
      );
    }

    return condList.map((cond, idx) => (
      <div key={idx} className="flex flex-wrap items-center gap-1.5">
        {idx > 0 && (
          <span className="text-xs text-muted-foreground font-bold px-1">
            {logicalOp}
          </span>
        )}
        <Badge
          variant="secondary"
          appearance="outline"
          className="text-xs bg-muted border-border/40 py-1"
        >
          {cond.field}
        </Badge>
        <span className="text-[11px] font-mono text-muted-foreground lowercase px-1">
          {cond.operator}
        </span>
        <Badge
          variant="secondary"
          appearance="outline"
          className="text-xs bg-muted border-border/40 py-1"
        >
          {typeof cond.value === 'string'
            ? `"${cond.value}"`
            : String(cond.value ?? '')}
        </Badge>
      </div>
    ));
  };

  return (
    <main className="flex-1 bg-background overflow-hidden flex flex-col">
      <ScrollArea className="flex-1">
        <div className="p-5">
          <AutomationDetailsHeader
            activeRule={activeRule}
            origin={origin}
            isExecuting={isExecuting}
            onExecute={handleExecuteRule}
          />

          <Tabs defaultValue="details" className="w-full">
            <TabsList variant="line" className="mb-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="jobs">Runs</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="m-0 space-y-4">
              <AutomationDetailsTabContent activeRule={activeRule} />
            </TabsContent>

            <TabsContent value="jobs" className="m-0">
              <JobsTab ruleId={activeRule._id} />
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </main>
  );
}
