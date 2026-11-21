import { useMemo, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Globe, Server, Clock } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useGetAimAgentsQuery } from '@/services/asset-inventory/agentsApi';
import { Badge } from '@/components/ui/badge';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyScreen } from '@/components/common/empty-screen';
import RegisteredAgentsDropdown from './dropdowns/registered-agents-dropdown';
import PageHeading from '@/components/custom/page-heading';
import Table from '@/components/custom/table';
import useDebounce from '../../../../../hooks/use-debounce';
import Cards from '../../dashboard/components/cards';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import ApiErrorHandler from '../../../../../components/common/api-error-handler';

const RegisteredAgents = ({ hideHeading = false }) => {
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
    isError,
    error
  } = useGetAimAgentsQuery({
    search: debouncedSearch,
    sort: sorting[0]?.id,
    sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
  });
  const agents = useMemo(() => {
    if (Array.isArray(agentsData?.data)) return agentsData.data;
    if (agentsData?.data?.agents && Array.isArray(agentsData.data.agents)) return agentsData.data.agents;
    return [];
  }, [agentsData]);
  const metrics = agentsData?.data?.metrics || agentsData?.metrics;

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'success';
      case 'outdated':
        return 'warning';
      case 'offline':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const agentStats = useMemo(() => {
    if (metrics) {
      return [
        { info: metrics.totalRegistered ?? metrics.total ?? agents.length, desc: 'Total Registered' },
        { info: metrics.activeAgents ?? metrics.active ?? 0, desc: 'Active Agents' },
        { info: metrics.outdated ?? 0, desc: 'Outdated' },
      ];
    }

    const active = agents.filter(
      (a) => a.status?.toLowerCase() === 'active',
    ).length;
    const outdated = agents.filter(
      (a) => a.status?.toLowerCase() === 'outdated',
    ).length;

    return [
      { info: agents.length, desc: 'Total Registered' },
      { info: active, desc: 'Active Agents' },
      { info: outdated, desc: 'Outdated' },
    ];
  }, [agents, metrics]);

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
            {row.original.hostname}
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
            {row.original.ipAddress || '-'}
          </div>
        ),
        size: 200,
        meta: {
          skeleton: <Skeleton className="h-7" />,
        },
      },
      {
        id: 'os',
        accessorFn: (row) => row.os?.dist || row.os?.platform,
        header: ({ column }) => (
          <DataGridColumnHeader title="OS / Platform" column={column} />
        ),
        cell: ({ row }) => {
          const os = row.original.os;
          return (
            <div className="flex flex-col">
              <span className="text-sm">
                {' '}
                {row.original?.os || row.original?.platform_arch || 'Unknown'}
              </span>
              <span className="text-xs text-muted-foreground">
                {os?.arch} {os?.release}
              </span>
            </div>
          );
        },
        size: 110,
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
            {row.original.version}
          </Badge>
        ),
        enableSorting: true,
        size: 60,
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
          <Badge
            variant={getStatusVariant(row.original.status)}
            appearance="light"
            className="capitalize"
          >
            {row.original.status}
          </Badge>
        ),
        size: 50,
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
            {row.original.lastHeartbeat
              ? formatDistanceToNow(new Date(row.original.lastHeartbeat), {
                addSuffix: true,
              })
              : 'Never'}
          </div>
        ),
        enableSorting: true,
        size: 90,
        meta: {
          skeleton: <Skeleton className="h-7" />,
        },
      },
      {
        id: 'actions',
        header: ({ column }) => (
          <AuthorityGuard forbidRoles={['Auditor']}><DataGridColumnHeader title="" column={column} /></AuthorityGuard>
        ),
        cell: ({ row }) => <AuthorityGuard forbidRoles={['Auditor']}><RegisteredAgentsDropdown row={row} /></AuthorityGuard>,
        size: 50,
      },
    ],
    [],
  );

  if (!isError && !isLoading && !isFetching && agents.length === 0 && !debouncedSearch) {
    return (
      <div className={hideHeading ? '' : 'p-4'}>
        {!hideHeading && (
          <>
            <Helmet>
              <title>AssetIQ | Registered Agents</title>
            </Helmet>
            <PageHeading
              title="Registered Agents"
              description="View and manage registered agents reporting assets to your inventory."
            />
          </>
        )}
        <EmptyScreen
          title="No Agents Registered"
          subTitle="No agents have been registered yet. Install and connect an agent to start ingesting asset data."
        />
      </div>
    );
  }

  if (isError && !isLoading) {
    return <ApiErrorHandler error={error} />;
  }

  return (
    <div className={hideHeading ? '' : 'p-4'}>
      {!hideHeading && (
        <>
          <Helmet>
            <title>AssetIQ | Registered Agents</title>
          </Helmet>

          <PageHeading
            title="Registered Agents"
            description="View and manage registered agents reporting assets to your inventory."
          />
        </>
      )}
      <div className="mb-4">
        <Cards customItems={agentStats} isLoading={isLoading} />
      </div>

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
};

export default RegisteredAgents;
