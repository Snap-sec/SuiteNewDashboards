import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { useGetAutomationRuleMatchesQuery } from '@/services/vm/automationApi';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import { DateFormatter } from '@/components/custom/date-formatter';
import { Profile } from '@/components/custom/profile';
import SeverityLabel from '@/components/custom/severity-label';
import { StateLabels } from '@/components/custom/state-labels';
import Table from '@/components/custom/table';
import { EmptyScreen } from '@/components/common/empty-screen';

export function AutomationDetailsTabContent({ activeRule }) {
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
          <div>
            <Link
              to={`/vm/vulnerability-report?id=${row?.original?._id}&assessmentId=${row?.original?.assessmentId}`}
              className="leading-none flex items-center gap-2 font-medium text-sm hover:text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="truncate" title={row.original.title}>
                {row.original.title}
              </span>
              {row?.original?.blockers?.length > 0 && (
                <Badge size="sm" variant="destructive" appearance="outline" className="shrink-0">Blocked</Badge>
              )}
            </Link>
          </div>
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

  const renderConditions = () => {
    if (!activeRule.conditions?.length) {
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
    <div className="space-y-4">

      <div className=' flex flex-row gap-4'>
        {/* Description */}
        <Card className="border-border/50 shadow-sm w-full">
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
        <Card className="border-border/50 shadow-sm w-full">
          <CardHeader className="pb-3 flex flex-row items-center justify-between bg-muted/20">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              Execution Policy
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
      </div>

      <div className=' flex flex-row gap-4'>

        {/* Conditions */}
        <Card className="border-border/50 shadow-sm w-full">
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
        <Card className="border-border/50 shadow-sm w-full">
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

      </div>

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
    </div>
  );
}
