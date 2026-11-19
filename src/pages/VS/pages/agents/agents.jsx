import React, { useMemo, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Globe, Server, Clock } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { Badge } from '@/components/ui/badge';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import PageHeading from '@/components/custom/page-heading';
import Table from '@/components/custom/table';
import useDebounce from '@/hooks/use-debounce';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import { useAuth } from '@/auth/context/auth-context';
import { useGetVsAgentsQuery } from '@/services/vs/agentsApi';
import { AgentStatsBar } from './components/agent-stats-bar';
import { AgentStatusBadge } from './components/agent-status-badge';
import { AgentActionCell } from './components/agent-action-cell';
import { EmptyAgents } from './components/empty-agents';

function AgentsPage() {
  const { user } = useAuth();
  const isAuditor = user?.role === 'Auditor';
  const [search, setSearch] = useState('');
  const [sorting, setSorting] = useState([]);
  const debouncedSearch = useDebounce(search, 400);

  const handleSortingChange = (callback) => {
    setSorting((prev) => {
      const newState = callback(prev);
      if (!newState.length) return [];
      return [newState.at(-1)];
    });
  };

  const {
    data: agentsData,
    isLoading,
    isFetching,
  } = useGetVsAgentsQuery({
    search: debouncedSearch,
    sort: sorting[0]?.id,
    sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
  });

  const agents = Array.isArray(agentsData?.data)
    ? agentsData.data
    : (agentsData?.data?.agents || []);
  const metrics = agentsData?.data?.metrics || agentsData?.metrics;

  const columns = useMemo(
    () => [
      {
        id: 'hostname',
        accessorFn: (row) => row.hostname,
        header: ({ column }) => (
          <DataGridColumnHeader title="Hostname" column={column} />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Server className="size-4 text-muted-foreground" />
            <span>{row.original.hostname || '-'}</span>
          </div>
        ),
        size: 150,
        meta: {
          skeleton: <Skeleton className="h-7" />,
        },
      },
      {
        id: 'ipAddress',
        accessorFn: (row) => row.ipAddress,
        header: ({ column }) => (
          <DataGridColumnHeader title="IP Address" column={column} />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2" title={row.original.ipAddress}>
            <Globe className="size-4 text-muted-foreground" />
            <span>{row.original.ipAddress || '-'}</span>
          </div>
        ),
        size: 200,
        meta: {
          skeleton: <Skeleton className="h-7" />,
        },
      },
      {
        id: 'os',
        accessorFn: (row) => row.os?.dist || row.os?.platform || row.os,
        header: ({ column }) => (
          <DataGridColumnHeader title="OS / Platform" column={column} />
        ),
        cell: ({ row }) => {
          const os = row.original.os;
          const osTitle =
            typeof os === 'string'
              ? os
              : row.original?.os?.dist ||
                row.original?.os?.platform ||
                row.original?.platform_arch ||
                'Unknown';

          return (
            <div className="flex flex-col">
              <span className="text-sm">{osTitle}</span>
              {typeof os === 'object' && os && (
                <span className="text-xs text-muted-foreground">
                  {os.arch} {os.release}
                </span>
              )}
              {row.original?.platform_arch && typeof os === 'string' && (
                <span className="text-xs text-muted-foreground">
                  {row.original.platform_arch}
                </span>
              )}
            </div>
          );
        },
        size: 130,
        meta: {
          skeleton: <Skeleton className="h-7" />,
        },
      },
      {
        id: 'version',
        accessorFn: (row) => row.version,
        header: ({ column }) => (
          <DataGridColumnHeader title="Version" column={column} />
        ),
        cell: ({ row }) => (
          <Badge variant="outline" appearance="stroke" size="sm">
            {row.original.version || '-'}
          </Badge>
        ),
        enableSorting: true,
        size: 70,
        meta: {
          skeleton: <Skeleton className="h-7" />,
        },
      },
      {
        id: 'status',
        accessorFn: (row) => row.status,
        header: ({ column }) => (
          <DataGridColumnHeader title="Status" column={column} />
        ),
        cell: ({ row }) => (
          <AgentStatusBadge status={row.original.status} />
        ),
        size: 60,
        meta: {
          skeleton: <Skeleton className="h-7" />,
        },
      },
      {
        id: 'lastHeartbeat',
        accessorFn: (row) => row.lastHeartbeat,
        header: ({ column }) => (
          <DataGridColumnHeader title="Last Heartbeat" column={column} />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="size-4" />
            <span>
              {row.original.lastHeartbeat
                ? formatDistanceToNow(new Date(row.original.lastHeartbeat), {
                    addSuffix: true,
                  })
                : 'Never'}
            </span>
          </div>
        ),
        enableSorting: true,
        size: 100,
        meta: {
          skeleton: <Skeleton className="h-7" />,
        },
      },
      ...(!isAuditor
        ? [
            {
              id: 'actions',
              header: ({ column }) => (
                <DataGridColumnHeader title="" column={column} />
              ),
              cell: ({ row }) => <AgentActionCell row={row} />,
              size: 50,
            },
          ]
        : []),
    ],
    [isAuditor],
  );

  if (!isLoading && !isFetching && agents.length === 0 && !debouncedSearch) {
    return <EmptyAgents />;
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <Helmet>
        <title>VS | Registered Agents</title>
      </Helmet>

      <PageHeading
        title="Registered Agents"
        description="Monitor registered vulnerability scanner agents, activity, and update status across your environment."
      />

      <AgentStatsBar agents={agents} metrics={metrics} isLoading={isLoading} />

      <Table
        data={agents}
        columns={columns}
        isLoading={isLoading || isFetching}
        cardHeading={true}
        search={search}
        setSearch={setSearch}
        sorting={sorting}
        setSorting={handleSortingChange}
        searchPlaceholder="Search agents..."
        enableSearch={true}
        enableSorting={true}
        manualSorting={true}
        manualPagination={false}
      />
    </div>
  );
}

export default AgentsPage;
