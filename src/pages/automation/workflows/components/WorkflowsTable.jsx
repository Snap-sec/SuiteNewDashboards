import React, { useMemo, useState } from 'react';
import Table from '@/components/custom/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DateFormatter } from '@/components/custom/date-formatter';
import { StatusBadge } from '@/components/custom/status-badge';
import { Plus, Pencil, Trash2, MoreHorizontal, GitBranch, Play } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { ConfirmDialog } from '@/components/custom/button-with-confirmation';
import { EmptyScreen } from '@/components/common/empty-screen';

function getColumns({ onEditWorkflow, setWorkflowToDelete, setWorkflowToExecute }) {
  return [
    {
      id: 'name',
      accessorFn: (row) => row.name,
      header: ({ column }) => (
        <DataGridColumnHeader title="Workflow Name" column={column} />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="flex flex-col min-w-0">
            <span
              className="text-sm font-medium text-foreground truncate cursor-pointer hover:text-primary"
              onClick={() => onEditWorkflow(row.original)}
            >
              {row.original.name || 'Untitled Workflow'}
            </span>
          </div>
        </div>
      ),
      enableSorting: true,
      size: 150,
      meta: {
        skeleton: <Skeleton className="h-7 w-full" />,
      },
    },
    {
      id: 'status',
      accessorFn: (row) => row.latestRun?.status || 'never',
      header: ({ column }) => (
        <DataGridColumnHeader title="Last Run Status" column={column} />
      ),
      cell: ({ row }) => {
        const runStatus = row.original.latestRun?.status || 'not configured';
        return (
          <StatusBadge 
            status={runStatus} 
            label={!row.original.latestRun?.status ? 'Not Run' : undefined} 
          />
        );
      },
      enableSorting: true,
      size: 100,
      meta: {
        skeleton: <Skeleton className="h-7 w-full" />,
      },
    },
    {
      id: 'lastRunDate',
      accessorFn: (row) => row.latestRun?.startedAt || row.latestRun?.createdAt || null,
      header: ({ column }) => (
        <DataGridColumnHeader title="Last Run Date" column={column} />
      ),
      cell: ({ row }) => {
        const dateVal = row.original.latestRun?.startedAt || row.original.latestRun?.createdAt;
        return (
          <div className="text-xs font-medium text-muted-foreground">
            {dateVal ? <DateFormatter date={dateVal} /> : '-'}
          </div>
        );
      },
      enableSorting: true,
      size: 100,
      meta: {
        skeleton: <Skeleton className="h-7 w-full" />,
      },
    },
    {
      id: 'updatedAt',
      accessorFn: (row) => row.updatedAt || row.createdAt,
      header: ({ column }) => (
        <DataGridColumnHeader title="Last Updated" column={column} />
      ),
      cell: ({ row }) => {
        const dateVal = row.original.updatedAt || row.original.createdAt;
        return (
          <div className=" text-muted-foreground">
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
      header: ({ column }) => <DataGridColumnHeader title="" column={column} />,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <MoreHorizontal size={14} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem
              className="gap-2 cursor-pointer"
              onClick={() => onEditWorkflow(row.original)}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2 cursor-pointer"
              disabled={['pending', 'running'].includes(row.original.latestRun?.status)}
              onClick={() => setWorkflowToExecute(row.original)}
            >
              {['pending', 'running'].includes(row.original.latestRun?.status) ? 'Executing...' : 'Execute'}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2 cursor-pointer text-destructive focus:text-destructive"
              onClick={() => setWorkflowToDelete(row.original)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      enableSorting: false,
      size: 40,
      meta: {
        skeleton: <Skeleton className="h-7 w-7" />,
      },
    },
  ];
}

export default function WorkflowsTable({
  workflows = [],
  isLoading,
  onCreateNew,
  onEditWorkflow,
  onDeleteWorkflow,
  onExecuteWorkflow,
  search,
  setSearch,
  pagination,
  setPagination,
  totalCount,
  totalPages,
}) {
  const [workflowToDelete, setWorkflowToDelete] = useState(null);
  const [workflowToExecute, setWorkflowToExecute] = useState(null);

  const columns = useMemo(
    () => getColumns({ onEditWorkflow, setWorkflowToDelete, setWorkflowToExecute }),
    [onEditWorkflow, setWorkflowToDelete, setWorkflowToExecute],
  );

  return (
    <div className="space-y-4">

      <Table
        data={workflows}
        columns={columns}
        isLoading={isLoading}
        search={search}
        setSearch={setSearch}
        searchPlaceholder="Search workflows by name..."
        pagination={pagination}
        setPagination={setPagination}
        showPagination={true}
        manualPagination={true}
        totalCount={totalCount}
        totalPages={totalPages}
        cardHeading={true}
        searchWidth="64"
      />

      <ConfirmDialog
        open={Boolean(workflowToExecute)}
        setOpen={(open) => !open && setWorkflowToExecute(null)}
        onConfirm={() => {
          if (workflowToExecute) {
            onExecuteWorkflow(workflowToExecute.id || workflowToExecute._id);
            setWorkflowToExecute(null);
          }
        }}
        variant="info"
        title="Execute Workflow"
        dialog={`Are you sure you want to execute "${workflowToExecute?.name || 'this workflow'}"?`}
      />

      <ConfirmDialog
        open={Boolean(workflowToDelete)}
        setOpen={(open) => !open && setWorkflowToDelete(null)}
        onConfirm={() => {
          if (workflowToDelete) {
            onDeleteWorkflow(workflowToDelete.id || workflowToDelete._id);
            setWorkflowToDelete(null);
          }
        }}
        variant="destructive"
        title="Delete Workflow"
        dialog={`Are you sure you want to delete "${workflowToDelete?.name || 'this workflow'}"? This action cannot be undone.`}
      />
    </div>
  );
}

