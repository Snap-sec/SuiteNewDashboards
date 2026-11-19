import React, { useMemo } from 'react';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Copy,
  Check,
  MoreHorizontal,
} from 'lucide-react';
import Table from '@/components/custom/table';
import TableToolbarFilters from '@/components/common/table-toolbar-filters';



function getColumns(navigate, handleCopyCommand, copiedId) {
  return [
    {
      id: 'pkgName',
      accessorFn: (row) => row.pkgName,
      header: ({ column }) => (
        <DataGridColumnHeader title="Component / Upgrade Target" column={column} />
      ),
      cell: ({ row }) => {
        const item = row.original;
        return (
          <button
            className="text-left font-medium truncate max-w-full block"
            title={item.pkgName}
          >
            <span className="truncate">{item.pkgName}</span>
          </button>
        );
      },
      enableSorting: false,
      size: 220,
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'projectName',
      accessorFn: (row) => row.projectName,
      header: ({ column }) => (
        <DataGridColumnHeader title="Target Project" column={column} />
      ),
      cell: ({ row }) => (
        <span className="truncate block max-w-full" title={row.original.projectName}>
          {row.original.projectName}
        </span>
      ),
      enableSorting: false,
      size: 150,
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'projectType',
      accessorFn: (row) => row.projectType,
      header: ({ column }) => (
        <DataGridColumnHeader title="Project Type" column={column} />
      ),
      cell: ({ row }) => {
        const item = row.original;
        return (
          <span>
            {item.projectType === 'Container Image' || item.projectName.includes(':') ? 'Container Image' : 'Code Repo'}
          </span>
        );
      },
      enableSorting: false,
      size: 140,
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'totalResolved',
      accessorFn: (row) => row.totalResolved,
      header: ({ column }) => (
        <DataGridColumnHeader title="Vulnerabilities Fixed" column={column} />
      ),
      cell: ({ row }) => (
        <span>+{row.original.totalResolved} Fixed</span>
      ),
      enableSorting: true,
      size: 160,
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'severities',
      header: ({ column }) => (
        <DataGridColumnHeader title="CVE Breakdown" column={column} />
      ),
      cell: ({ row }) => {
        const item = row.original;
        const parts = [];
        if (item.severities.critical > 0) parts.push(`${item.severities.critical} Critical`);
        if (item.severities.high > 0) parts.push(`${item.severities.high} High`);
        if (item.severities.medium > 0) parts.push(`${item.severities.medium} Medium`);
        if (item.severities.low > 0) parts.push(`${item.severities.low} Low`);
        return <span>{parts.join(' ') || '0 CVEs'}</span>;
      },
      enableSorting: false,
      size: 180,
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'upgradeCmd',
      accessorFn: (row) => row.upgradeCmd,
      header: ({ column }) => (
        <DataGridColumnHeader title="CLI Command" column={column} />
      ),
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center justify-between gap-2 bg-slate-50 dark:bg-slate-900/60 border border-border/60 rounded px-2 py-1 text-[11px] max-w-[250px]">
            <span className="truncate text-foreground" title={item.upgradeCmd}>
              {item.upgradeCmd}
            </span>
            <button
              onClick={() => handleCopyCommand(item.upgradeCmd, item.id)}
              className="text-muted-foreground hover:text-foreground transition-colors shrink-0 p-0.5 cursor-pointer"
              title="Copy CLI command"
            >
              {copiedId === item.id ? (
                <Check className="size-3.5 text-emerald-500" />
              ) : (
                <Copy className="size-3.5" />
              )}
            </button>
          </div>
        );
      },
      enableSorting: false,
      size: 240,
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },
  ];
}

export function ActionPlanTable({
  actionPlanList = [],
  advancedFilters,
  isLoading,
  isFetching,
  searchQuery,
  setSearchQuery,
  filters = {},
  setFilters,
  paginationMeta = {},
  pagination,
  setPagination,
  navigate,
  handleCopyCommand,
  copiedId,
  sorting,
  setSorting,
}) {
  const columns = useMemo(
    () => getColumns(navigate, handleCopyCommand, copiedId),
    [navigate, handleCopyCommand, copiedId],
  );

  const supportedFilters = useMemo(
    () => advancedFilters || [],
    [advancedFilters],
  );

  return (
    <Table
      data={actionPlanList}
      columns={columns}
      isLoading={isLoading || isFetching}
      search={searchQuery}
      setSearch={setSearchQuery}
      searchPlaceholder="Search package or repo..."
      pagination={pagination}
      setPagination={setPagination}
      totalPages={paginationMeta.totalPages}
      totalCount={paginationMeta.total}
      toolbar={
        <TableToolbarFilters
          supportedFilters={supportedFilters}
          filters={filters}
          setFilters={setFilters}
          isLoadingFilters={isLoading}
        />
      }
      manualPagination={true}
      sorting={sorting}
      setSorting={setSorting}
      enableSorting={true}
      manualSorting={true}
      className="mt-4"
    />
  );
}
