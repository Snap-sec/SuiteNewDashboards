import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import Table from '@/components/custom/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Check, X, Loader, Play, Terminal, Clock, MoreHorizontal, AlertTriangle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EmptyScreen } from '@/components/common/empty-screen';
import RunsDropdown from './dropdowns/runs-dropdown';
import { DateFormatter } from '@/components/custom/date-formatter';
import { Skeleton } from '@/components/ui/skeleton';

function getColumns() {
  return [
    {
      id: 'workflow',
      accessorFn: (row) => row.workflow?.name || row.workflowName || row.workflowId || 'Workflow Execution',
      header: ({ column }) => (
        <DataGridColumnHeader title="Workflow Name" column={column} />
      ),
      cell: ({ row }) => {
        const wfName = row.original.workflow?.name || row.original.workflowName || row.original.name || 'CVE Triage Workflow';
        const runId = row.original._id || row.original.id || '';

        return (
          <div className="flex items-center gap-3">
            <Link
              to={`/ai-agent-builder/run-details/${runId}`}
              className="text-sm font-medium hover:text-primary truncate"
            >
              {wfName}
            </Link>
          </div>
        );
      },
      enableSorting: true,
      size: 240,
      meta: {
        skeleton: <Skeleton className="h-7 w-full" />,
      },
    },
    {
      id: 'status',
      accessorFn: (row) => row.status,
      header: ({ column }) => (
        <DataGridColumnHeader title="Status" column={column} />
      ),
      cell: ({ row }) => {
        const status = (row.original.status || 'pending').toLowerCase();
        let variant = 'outline';
        let Icon = Clock;

        if (status === 'completed' || status === 'success') {
          variant = 'success';
          Icon = Check;
        } else if (status === 'running' || status === 'in_progress' || status === 'pending') {
          variant = 'warning';
          Icon = Loader;
        } else if (status === 'partially_failed') {
          variant = 'warning';
          Icon = AlertTriangle;
        } else if (status === 'failed' || status === 'error') {
          variant = 'destructive';
          Icon = X;
        } else if (status === 'cancelled' || status === 'canceled') {
          variant = 'secondary';
          Icon = X;
        }

        return (
          <Badge variant={variant} appearance="outline" className="gap-1.5 capitalize">
            <Icon size={12} className={status === 'running' || status === 'pending' ? 'animate-spin' : ''} />
            {status.replace('_', ' ')}
          </Badge>
        );
      },
      enableSorting: true,
      size: 130,
      meta: {
        skeleton: <Skeleton className="h-7 w-full" />,
      },
    },
    {
      id: 'message',
      accessorFn: (row) => row.errorDetails?.message || row.message || '',
      header: ({ column }) => (
        <DataGridColumnHeader title="Message" column={column} />
      ),
      cell: ({ row }) => {
        const msg = row.original.errorDetails?.message || row.original.message || row.original.error || '-';

        return (
          <div
            title={typeof msg === 'string' ? msg : JSON.stringify(msg)}
            className={`truncate text-muted-foreground`}
          >
            {msg}
          </div>
        );
      },
      enableSorting: false,
      size: 220,
      meta: {
        skeleton: <Skeleton className="h-7 w-full" />,
      },
    },
    {
      id: 'trigger',
      accessorFn: (row) => row.trigger || 'manual',
      header: ({ column }) => (
        <DataGridColumnHeader title="Trigger" column={column} />
      ),
      cell: ({ row }) => {
        const trigger = row.original.trigger || row.original.type || 'Manual Execution';
        return (
          <span className="text-muted-foreground capitalize">
            {trigger}
          </span>
        );
      },
      enableSorting: true,
      size: 140,
      meta: {
        skeleton: <Skeleton className="h-7 w-full" />,
      },
    },
    {
      id: 'startedAt',
      accessorFn: (row) => row.startedAt || row.createdAt,
      header: ({ column }) => (
        <DataGridColumnHeader title="Started At" column={column} />
      ),
      cell: ({ row }) => {
        const dateVal = row.original.startedAt || row.original.createdAt;
        return (
          <div className="text-muted-foreground">
            {dateVal ? <DateFormatter date={dateVal} /> : '-'}
          </div>
        );
      },
      enableSorting: true,
      size: 160,
      meta: {
        skeleton: <Skeleton className="h-7 w-full" />,
      },
    },
    {
      id: 'completedAt',
      accessorFn: (row) => row.completedAt || row.finishedAt,
      header: ({ column }) => (
        <DataGridColumnHeader title="Completed At" column={column} />
      ),
      cell: ({ row }) => {
        const dateVal = row.original.completedAt || row.original.finishedAt;
        return (
          <div className="text-muted-foreground">
            {dateVal ? <DateFormatter date={dateVal} /> : '-'}
          </div>
        );
      },
      enableSorting: true,
      size: 160,
      meta: {
        skeleton: <Skeleton className="h-7 w-full" />,
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => <RunsDropdown row={row} />,
      size: 50,
      meta: {
        skeleton: <Skeleton className="h-7 w-full" />,
      },
    }
  ];
}

export default function RunsTable({
  runs = [],
  isLoading,
  pagination,
  setPagination,
  totalCount,
  totalPages,
  search,
  setSearch,
}) {
  const columns = useMemo(() => getColumns(), []);

  return (
    <div className="">
      {!isLoading && runs.length === 0 && !search ? (
        <EmptyScreen
          title="No runs found"
          subTitle="No workflow runs matched your search criteria."
        />
      ) : (
        <Table
          data={runs}
          columns={columns}
          isLoading={isLoading}
          search={search}
          setSearch={setSearch}
          searchPlaceholder="Search runs by workflow name..."
          pagination={pagination}
          setPagination={setPagination}
          totalCount={totalCount}
          totalPages={totalPages}
          showPagination={true}
          manualPagination={true}
          cardHeading={true}
          searchWidth="64"
        />
      )}
    </div>
  );
}
