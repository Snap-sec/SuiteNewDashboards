import { useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  ChevronRight,
  Loader2,
  Play,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router';
import { toast } from 'sonner';
import {
  useExecuteAutomationRuleMutation,
  useGetAutomationRuleMatchesQuery,
  useToggleAutomationRuleMutation,
} from '@/services/vm/automationApi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { DateFormatter } from '@/components/custom/date-formatter';
import { Profile } from '@/components/custom/profile';
import SeverityLabel from '@/components/custom/severity-label';
import { StateLabels } from '@/components/custom/state-labels';
import Table from '@/components/custom/table';
import { EmptyScreen } from '@/components/common/empty-screen';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import EditAutomationRuleModal from '@/pages/VM/pages/automation-engine/components/edit-automation-rule-modal';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { JobsTab } from '@/pages/VM/pages/automation-engine/components/jobs-tab';
import { Sheet, SheetContent } from '@/components/ui/sheet';

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function DetailsSkeleton() {
  return (
    <main className="flex-1 bg-background overflow-hidden">
      <div className="p-6">
        <header className="mb-4">
          <div className="flex items-start justify-between w-full">
            <div className="pl-3 space-y-2">
              <Skeleton className="h-6 w-64" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-3.5 w-32" />
              </div>
            </div>
          </div>
        </header>
        <div className="space-y-4">
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-5/6" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-36" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 flex-wrap p-3 bg-muted/30 rounded-lg border border-border/40 min-h-[50px]">
                <Skeleton className="h-6 w-14 rounded-md" />
                <Skeleton className="h-6 w-24 rounded-md" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function RuleDetailsDrawer({ rule: activeRule, open, onClose, onRuleUpdate: setActiveRule }) {
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
          >
            {row.original.title}
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

  // ─── Condition pill builder ────────────────────────────────────────────────

  const renderConditions = () => {
    if (!activeRule?.conditions?.length) {
      return (
        <span className="text-xs text-muted-foreground italic">
          No conditions defined
        </span>
      );
    }
    return activeRule.conditions.map((cond, idx) => (
      <div key={idx} className="flex flex-wrap items-center gap-1.5">
        {idx > 0 && (
          <span className="text-xs text-muted-foreground font-bold px-1">
            AND
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
    <Sheet open={open} onOpenChange={(val) => !val && onClose?.()}>
      <SheetContent
        side="right"
        className="h-[calc(100vh-40px)] m-5 rounded-lg border flex flex-col bg-background p-0 shadow-xl sm:max-w-none fixed top-0 right-0 w-[90vw] md:w-[800px]"
      >
        {!activeRule ? (
          <DetailsSkeleton />
        ) : (
          <div className="pt-8 flex-1 overflow-hidden flex flex-col">
            <main className="flex-1 bg-background overflow-hidden flex flex-col">
              <ScrollArea className="flex-1">
                <div className="p-5">
                  {/* Header */}
                  <header className="mb-4 flex items-start gap-3">
                    <div className="flex items-start justify-between w-full">
                      <div>
                        <div className="relative pl-3">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.3)]" />
                          <h1 className="text-2xl font-semibold text-foreground leading-tight">
                            {activeRule.name}
                          </h1>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-3 pl-3">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="size-3.5" />
                            Created:{' '}
                            <span className="text-foreground/80">
                              <DateFormatter date={activeRule.createdAt} mode="long" />
                            </span>
                          </span>
                          <span>•</span>
                          <AuthorityGuard forbidRoles={['Auditor']}>
                            <EditAutomationRuleModal
                              rule={activeRule}
                              trigger={
                                <button className="text-primary font-medium hover:underline flex items-center gap-0.5 group">
                                  Edit rule{' '}
                                  <ChevronRight className="size-3 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                              }
                            />
                          </AuthorityGuard>
                        </div>
                      </div>

                      <AuthorityGuard forbidRoles={['Auditor']}>
                        <ButtonWithConfirm
                          variant="outline"
                          confirm={true}
                          onConfirm={() => handleExecuteRule(activeRule._id)}
                          confirmButton={<Button variant="primary">Execute</Button>}
                          cancelButton={<Button variant="outline">Cancel</Button>}
                          className="w-full justify-start h-8 px-2 font-normal"
                        >
                          {isExecuting ? (
                            <Loader2 className="size-4 animate-spin mr-2" />
                          ) : (
                            <Play className="size-4 mr-2" />
                          )}
                          Execute Now{' '}
                        </ButtonWithConfirm>
                      </AuthorityGuard>
                    </div>
                  </header>

                  <Tabs defaultValue="details" className="w-full">
                    <TabsList variant="line" className="mb-4">
                      <TabsTrigger value="details">Details</TabsTrigger>
                      <TabsTrigger value="jobs">Jobs</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="space-y-4 m-0">
                      {/* Description */}
                      <Card className="border-border/50 shadow-sm">
                        <CardHeader className="pb-3 flex flex-row items-center justify-between bg-muted/20">
                          <CardTitle className="text-sm font-semibold">
                            Description
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {activeRule.description ||
                              'No description provided for this rule.'}
                          </p>
                        </CardContent>
                      </Card>

                      {/* Trigger / Execution Policy */}
                      <Card className="border-border/50 shadow-sm">
                        <CardHeader className="pb-3 flex flex-row items-center justify-between bg-muted/20">
                          <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <Zap className="size-4 text-primary" /> Execution Policy
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                          {activeRule.execution_policy ? (
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground font-medium uppercase">Type:</span>
                                <Badge variant="secondary" appearance="outline" className="text-xs bg-muted border-border/40 py-1 capitalize">
                                  {activeRule.execution_policy.type || '—'}
                                </Badge>
                              </div>
                              {activeRule.execution_policy.type === 'event' ? (
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-xs text-muted-foreground font-medium uppercase">Events:</span>
                                  {activeRule.execution_policy.events?.length ? (
                                    activeRule.execution_policy.events.map((ev) => (
                                      <Badge
                                        key={ev}
                                        variant="secondary"
                                        appearance="outline"
                                        className="text-xs bg-muted border-border/40 py-1"
                                      >
                                        {ev}
                                      </Badge>
                                    ))
                                  ) : (
                                    <span className="text-xs text-muted-foreground italic">No trigger events</span>
                                  )}
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-muted-foreground font-medium uppercase">Frequency:</span>
                                  <Badge variant="secondary" appearance="outline" className="text-xs bg-muted border-border/40 py-1 capitalize">
                                    {activeRule.execution_policy.frequency || '—'}
                                  </Badge>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 flex-wrap">
                              {activeRule.trigger?.events?.length ? (
                                activeRule.trigger.events.map((ev) => (
                                  <Badge
                                    key={ev}
                                    variant="secondary"
                                    appearance="outline"
                                    className="text-xs bg-muted border-border/40 py-1"
                                  >
                                    {ev}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-xs text-muted-foreground italic">
                                  No trigger events
                                </span>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Conditions */}
                      <Card className="border-border/50 shadow-sm">
                        <CardHeader className="pb-3 flex flex-row items-center justify-between bg-muted/20">
                          <CardTitle className="text-sm font-semibold">
                            Conditions
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="flex items-center gap-2 flex-wrap p-4 bg-muted/30 rounded-lg border border-border/40 min-h-[60px]">
                            <Badge
                              variant="secondary"
                              appearance="outline"
                              size="md"
                              className="text-xs font-medium bg-muted border-border/40"
                            >
                              Vulnerability
                            </Badge>
                            <span className="text-xs text-muted-foreground font-medium px-1">
                              WHERE
                            </span>
                            {renderConditions()}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Action */}
                      <Card className="border-border/50 shadow-sm">
                        <CardHeader className="pb-3 flex flex-row items-center justify-between bg-muted/20">
                          <CardTitle className="text-sm font-semibold">Action</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="flex flex-wrap gap-3">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                                Type
                              </span>
                              <Badge
                                variant="secondary"
                                appearance="outline"
                                className="text-xs bg-muted border-border/40 py-1"
                              >
                                {activeRule.actions?.[0]?.type || '—'}
                              </Badge>
                            </div>
                            {activeRule.actions?.[0]?.config &&
                              Object.keys(activeRule.actions[0].config).map((k) => (
                                <div key={k} className="flex flex-col gap-0.5">
                                  <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                                    {k}
                                  </span>
                                  <Badge
                                    variant="secondary"
                                    appearance="outline"
                                    className="text-xs bg-muted border-border/40 py-1"
                                  >
                                    {typeof activeRule.actions[0].config[k] === 'object'
                                      ? activeRule.actions[0].config[k]?.name || activeRule.actions[0].config[k]?.label || JSON.stringify(activeRule.actions[0].config[k])
                                      : String(activeRule.actions[0].config[k])}
                                  </Badge>
                                </div>
                              ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* Matched Vulnerabilities table */}
                      <div className="mt-8">
                        <header className="mb-4">
                          <h2 className="text-lg font-semibold text-foreground">
                            Matched Vulnerabilities
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            Vulnerabilities currently matching this rule's conditions.
                          </p>
                        </header>
                        {!matchesLoading && !matchesFetching && (!matchesData?.data?.matchedVulnerabilities?.length && !matchesData?.data?.length) ? (
                          <div className="py-8 bg-card rounded-xl border border-border/50">
                            <EmptyScreen
                              title="No Matched Vulnerabilities"
                              subTitle="No vulnerabilities currently match this rule's conditions."
                            />
                          </div>
                        ) : (
                          <Table
                            data={
                              matchesData?.data?.matchedVulnerabilities ||
                              matchesData?.data ||
                              []
                            }
                            columns={columns}
                            isLoading={matchesLoading || matchesFetching}
                            totalCount={
                              matchesData?.data?.pagination?.total ||
                              matchesData?.data?.count ||
                              0
                            }
                            totalPages={matchesData?.data?.pagination?.totalPages || 0}
                            pagination={pagination}
                            setPagination={setPagination}
                            cardHeading={false}
                            enableSorting={true}
                          />
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="jobs" className="m-0">
                      <JobsTab ruleId={activeRule._id} />
                    </TabsContent>
                  </Tabs>
                </div>
              </ScrollArea>
            </main>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
