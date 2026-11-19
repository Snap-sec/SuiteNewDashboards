import { useMemo, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Globe, Server, Clock, Ellipsis, Trash2 } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { Badge } from '@/components/ui/badge';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import PageHeading from '@/components/custom/page-heading';
import Table from '@/components/custom/table';
import useDebounce from '@/hooks/use-debounce';
import { EmptyScreen } from '@/components/common/empty-screen';
import { useGetAgentsQuery, useDeleteAgentMutation } from '@/services/agent/agentApi';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getStatusVariant = (status) => {
  switch (status?.toLowerCase()) {
    case 'active': return 'success';
    case 'outdated': return 'warning';
    case 'offline': return 'destructive';
    default: return 'secondary';
  }
};

// ─── Agent Action Cell ────────────────────────────────────────────────────────

function AgentActionCell({ row }) {
  const [deleteAgent, { isLoading }] = useDeleteAgentMutation();

  const handleDelete = () => {
    toast.promise(deleteAgent(row._id).unwrap(), {
      loading: 'Deleting agent...',
      success: 'Agent deleted successfully',
      error: 'Failed to delete agent',
    });
  };

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <Ellipsis size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[180px]">
          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer">
              Delete
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Agent</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the agent on host "{row.hostname}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? 'Deleting...' : 'Confirm'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ─── Stats bar (mirrors AIM Cards component) ──────────────────────────────────

function AgentStatsBar({ agents }) {
  const active = agents.filter((a) => a.status?.toLowerCase() === 'active').length;
  const outdated = agents.filter((a) => a.status?.toLowerCase() === 'outdated').length;

  const items = [
    { info: agents.length, desc: 'Total Registered' },
    { info: active, desc: 'Active Agents' },
    { info: outdated, desc: 'Outdated' },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between text-center">
          {items.map((item, index) => (
            <Link
              key={index}
              to="#"
              className="flex flex-col items-center justify-center flex-1 gap-1 text-center border-e border-input last:border-e-0 transition-colors rounded-sm py-1 cursor-pointer"
            >
              <span className="text-mono text-2xl leading-none font-semibold">
                {item.info}
              </span>
              <span className="text-secondary-foreground text-sm font-medium">
                {item.desc}
              </span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const AgentInventory = () => {
  const [search, setSearch] = useState('');
  const [sorting, setSorting] = useState([]);
  const debouncedSearch = useDebounce(search, 400);

  const handleSortingChange = (callback) => {
    setSorting((prev) => {
      const next = callback(prev);
      return next.length ? [next.at(-1)] : [];
    });
  };

  const {
    data: agentsData,
    isLoading,
    isFetching,
  } = useGetAgentsQuery({
    search: debouncedSearch,
    sort: sorting[0]?.id,
    sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
  });

  const agents = agentsData?.data || [];

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
        enableSorting: false,
        meta: { skeleton: <Skeleton className="h-7" /> },
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
        enableSorting: false,
        meta: { skeleton: <Skeleton className="h-7" /> },
      },
      {
        id: 'os',
        accessorFn: (row) => row.os,
        header: ({ column }) => (
          <DataGridColumnHeader title="OS / Platform" column={column} />
        ),
        cell: ({ row }) => (
          <div className="flex flex-col">
            <span className="text-sm">{row.original.os || 'Unknown'}</span>
            <span className="text-xs text-muted-foreground">
              {row.original.platform_arch}
            </span>
          </div>
        ),
        size: 150,
        enableSorting: false,
        meta: { skeleton: <Skeleton className="h-7" /> },
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
        size: 80,
        meta: { skeleton: <Skeleton className="h-7" /> },
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
        size: 90,
        enableSorting: false,
        meta: { skeleton: <Skeleton className="h-7" /> },
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
        size: 120,
        meta: { skeleton: <Skeleton className="h-7" /> },
      },
      {
        id: 'actions',
        header: ({ column }) => (
          <DataGridColumnHeader title="" column={column} />
        ),
        cell: ({ row }) => (
          <AgentActionCell row={row.original} />
        ),
        enableSorting: false,
        size: 70,
        meta: {
          cellClassName: 'text-center',
          skeleton: <Skeleton className="h-7" />,
        },
      },
    ],
    [],
  );

  if (!isLoading && !isFetching && agents.length === 0 && !debouncedSearch) {
    return (
      <div className="p-4">
        <Helmet>
          <title>Agent | Inventory</title>
        </Helmet>
        <EmptyScreen
          title="No Agents Registered"
          subTitle="No agents have been registered yet. Install and connect an agent to start ingesting data."
        />
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <Helmet>
        <title>Agent | Inventory</title>
      </Helmet>

      <PageHeading
        title="Agent Inventory"
        description="View and manage all registered agents across your infrastructure."
      />

      <AgentStatsBar agents={agents} />

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

export default AgentInventory;
