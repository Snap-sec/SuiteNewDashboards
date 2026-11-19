import React, { useMemo, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import TableToolbarFilters from '@/components/common/table-toolbar-filters';
import { ConfirmDialog } from '@/components/custom/button-with-confirmation';
import { StatusBadge } from '@/components/custom/status-badge';
import Table from '@/components/custom/table';
import { Profile } from '../../../../../components/custom/profile';
import VulnerabilitiesBadges from '../../../../../components/custom/vulnerabilities-badges';
import { useAuth } from '@/auth/context/auth-context';

export const formatScanTime = (dateStr) => {
  if (!dateStr) return 'Just now';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Just now';
    const diffInSeconds = Math.abs((new Date() - date) / 1000);
    if (diffInSeconds < 45) return 'Just now';
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return 'Just now';
  }
};

function getColumns(handleRescan, handleDeleteScan, isAuditor = false) {
  return [
    {
      id: 'name',
      accessorFn: (row) => row.name || row.projectName,
      header: ({ column }) => (
        <DataGridColumnHeader title="Scan Name" column={column} />
      ),
      cell: ({ row }) => (
        <span className="font-medium text-foreground">
          {row.original.name || row.original.projectName || '-'}
        </span>
      ),
      enableSorting: false,
      size: 220,
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'vulnCounts',
      accessorFn: (row) => row.branch,
      header: ({ column }) => (
        <DataGridColumnHeader title="Vulnerabilities" column={column} />
      ),
      cell: ({ row }) => (
        <div className="flex justify-left items-center">
          {row.original.vulnCounts?.critical +
            row.original.vulnCounts?.high +
            row.original.vulnCounts?.medium +
            row.original.vulnCounts?.low >
          0 ? (
            <VulnerabilitiesBadges vulnerabilities={row.original.vulnCounts} />
          ) : (
            '-'
          )}
        </div>
      ),
      enableSorting: false,
      size: 140,
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },

    {
      id: 'initiatedBy',
      accessorFn: (row) => row.initiatedBy,
      header: ({ column }) => (
        <DataGridColumnHeader title="Initiated By" column={column} />
      ),
      cell: ({ row }) => (
        // <span>
        //   {row.original.initiatedBy === 'Webhook' ? 'Webhook' : 'Manual Scan'}
        // </span>
        <Profile
          userId={row.original.initiatedBy?.id}
          name={row.original.initiatedBy?.name}
          email={row.original.initiatedBy?.email}
          showEmail={false}
        />
      ),
      enableSorting: false,
      size: 140,
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'scannedAt',
      accessorFn: (row) => row.scannedAt,
      header: ({ column }) => (
        <DataGridColumnHeader title="Last Scan" column={column} />
      ),
      cell: ({ row }) => <span>{formatScanTime(row.original.scannedAt)}</span>,
      enableSorting: false,
      size: 140,
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
        <StatusBadge
          variant="outline"
          status={row.original.status}
          showFound={false}
          showErrors={false}
        />
      ),
      enableSorting: false,
      size: 140,
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
            cell: ({ row }) => (
              <ScanActionsCell row={row} handleDeleteScan={handleDeleteScan} />
            ),
            enableSorting: false,
            size: 60,
            meta: {
              cellClassName: 'text-center',
              skeleton: <Skeleton className="h-7" />,
            },
          },
        ]
      : []),
  ];
}

function ScanActionsCell({ row, handleDeleteScan }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const scan = row.original;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            mode="icon"
            size="sm"
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {/* <DropdownMenuItem
            className="gap-2 cursor-pointer"
            onClick={() => handleRescan(scan.projectName)}
          >
            <span>Re-run Scan</span>
          </DropdownMenuItem> */}
          <DropdownMenuItem
            className="gap-2 cursor-pointer text-rose-600 dark:text-rose-400 hover:bg-rose-50 hover:text-rose-600 focus:bg-rose-50 focus:text-rose-600 dark:hover:bg-rose-950/50 dark:hover:text-rose-400 dark:focus:bg-rose-950/50 dark:focus:text-rose-400"
            onClick={() => setDeleteOpen(true)}
          >
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={deleteOpen}
        setOpen={setDeleteOpen}
        variant="destructive"
        title="Delete Scan Log?"
        dialog="This will permanently remove this scan log. This action cannot be undone."
        onConfirm={() => handleDeleteScan(scan.id)}
      />
    </>
  );
}

export function ScansTable({
  scansList = [],
  advancedFilters,
  isLoading,
  searchQuery,
  setSearchQuery,
  filters = {},
  setFilters,
  handleRescan,
  handleDeleteScan,
}) {
  const { user } = useAuth();
  const isAuditor = user?.role === 'Auditor';

  const columns = useMemo(
    () => getColumns(handleRescan, handleDeleteScan, isAuditor),
    [handleRescan, handleDeleteScan, isAuditor],
  );

  const supportedFilters = useMemo(
    () => advancedFilters || [],
    [advancedFilters],
  );

  return (
    <Table
      data={scansList}
      columns={columns}
      isLoading={isLoading}
      search={searchQuery}
      setSearch={setSearchQuery}
      searchPlaceholder="Search repository or branch..."
      toolbar={
        <TableToolbarFilters
          supportedFilters={supportedFilters}
          filters={filters}
          setFilters={setFilters}
        />
      }
      manualPagination={false}
      enableSorting={true}
    />
  );
}
