import { useState, useMemo } from 'react';
import { Monitor, Server, Laptop, MoreVertical } from 'lucide-react';
import { Card, CardHeader, CardHeading } from '@/components/ui/card';
import { Badge, BadgeDot } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import Table from '@/components/custom/table';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';

const getOsIcon = (os = '') => {
  const normalized = os.toLowerCase();
  if (normalized.includes('darwin') || normalized.includes('mac')) return Laptop;
  if (normalized.includes('win')) return Monitor;
  return Server;
};

function AgentStatusBadge({ status }) {
  const isActive = status === 'active';
  return (
    <Badge
      variant={isActive ? 'success' : 'secondary'}
      appearance="outline"
      size="sm"
      className="gap-1.5 uppercase font-mono tracking-wide"
    >
      <BadgeDot className={isActive ? 'bg-green-500' : 'bg-muted-foreground'} />
      {isActive ? 'Active' : 'Offline'}
    </Badge>
  );
}

export function AgentInventory({ agents = [], isLoading }) {
  const [search, setSearch] = useState('');

  const filtered = agents.filter((a) =>
    a.hostname?.toLowerCase().includes(search.toLowerCase()) ||
    a.ipAddress?.includes(search) ||
    a.os?.toLowerCase().includes(search.toLowerCase())
  );

  const columns = useMemo(() => [
    {
      id: 'hostname',
      accessorFn: (row) => row.hostname,
      header: ({ column }) => <DataGridColumnHeader title="Hostname" column={column} />,
      cell: ({ row }) => {
        const agent = row.original;
        const Icon = getOsIcon(agent.os);
        return (
          <div className="flex items-center gap-2.5">
            <Icon size={14} className="text-muted-foreground shrink-0" />
            <span className="font-medium text-foreground">{agent.hostname}</span>
          </div>
        );
      },
      enableSorting: false,
      meta: { skeleton: <Skeleton className="h-5" /> },
    },
    {
      id: 'ipAddress',
      accessorFn: (row) => row.ipAddress,
      header: ({ column }) => <DataGridColumnHeader title="IP Address" column={column} />,
      cell: ({ row }) => (
        <span className="text-muted-foreground font-mono text-xs">{row.original.ipAddress}</span>
      ),
      enableSorting: false,
      meta: { skeleton: <Skeleton className="h-5" /> },
    },
    {
      id: 'os',
      accessorFn: (row) => row.os,
      header: ({ column }) => <DataGridColumnHeader title="OS / Platform" column={column} />,
      cell: ({ row }) => {
        const agent = row.original;
        const osLabel = agent.os ? `${agent.os} ${agent.platform_arch ? `/ ${agent.platform_arch}` : ''}` : 'Unknown';
        return <span className="text-muted-foreground capitalize">{osLabel}</span>;
      },
      enableSorting: false,
      meta: { skeleton: <Skeleton className="h-5" /> },
    },
    {
      id: 'version',
      accessorFn: (row) => row.version,
      header: ({ column }) => <DataGridColumnHeader title="Version" column={column} />,
      cell: ({ row }) => (
        <Badge variant="secondary" appearance="outline" size="sm" className="font-mono">
          {row.original.version}
        </Badge>
      ),
      enableSorting: false,
      meta: { skeleton: <Skeleton className="h-5" /> },
    },
    {
      id: 'status',
      accessorFn: (row) => row.status,
      header: ({ column }) => <DataGridColumnHeader title="Status" column={column} />,
      cell: ({ row }) => <AgentStatusBadge status={row.original.status} />,
      enableSorting: false,
      meta: { skeleton: <Skeleton className="h-5" /> },
    },
    {
      id: 'heartbeat',
      accessorFn: (row) => row.lastHeartbeat || row.lastSync,
      header: ({ column }) => <DataGridColumnHeader title="Heartbeat" column={column} />,
      cell: ({ row }) => {
        const agent = row.original;
        const ts = agent.lastHeartbeat || agent.lastSync;
        const heartbeat = ts ? formatDistanceToNow(new Date(ts), { addSuffix: true }) : 'N/A';
        return <span className="text-muted-foreground text-xs">{heartbeat}</span>;
      },
      enableSorting: false,
      meta: { skeleton: <Skeleton className="h-5" /> },
    },
    // {
    //   id: 'actions',
    //   cell: () => (
    //     <DropdownMenu>
    //       <DropdownMenuTrigger asChild>
    //         <Button variant="ghost" mode="icon" className="h-7 w-7">
    //           <MoreVertical size={14} />
    //         </Button>
    //       </DropdownMenuTrigger>
    //       <DropdownMenuContent align="end">
    //         <DropdownMenuItem>View Details</DropdownMenuItem>
    //         <DropdownMenuItem>Restart Agent</DropdownMenuItem>
    //         <DropdownMenuItem className="text-destructive">Remove</DropdownMenuItem>
    //       </DropdownMenuContent>
    //     </DropdownMenu>
    //   ),
    //   enableSorting: false,
    //   meta: { skeleton: <Skeleton className="h-7 w-7 rounded-md" /> },
    // },
  ], []);

  return (
    <Card>
      <CardHeader>
        <CardHeading>
          <div className="flex items-center gap-2">
            <Server size={16} className="text-muted-foreground" />
            <span className="font-semibold text-sm">Agent Inventory</span>
          </div>
        </CardHeading>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search agents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-48 text-sm h-8"
          />
        </div>
      </CardHeader>

      <Table
        data={filtered}
        columns={columns}
        isLoading={isLoading}
        cardHeading={false}
        enableSorting={true}
        manualSorting={false}
        manualPagination={false}
        showPagination={true}
        className="border-0 shadow-none rounded-none border-t"
      />
    </Card>
  );
}
