import React, { useMemo, useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import TableToolbarFilters from '@/components/common/table-toolbar-filters';
import DeleteRepositoryDialog from './actions/delete-repository';
import Table from '@/components/custom/table';
import VulnerabilitiesBadges from '@/components/custom/vulnerabilities-badges';
import { Link } from 'react-router';
import { useAuth } from '@/auth/context/auth-context';



function getColumns(navigate, handleTriggerScan, handleDelete, authUser) {
  const userJSON = localStorage.getItem('user');
  const localUser = userJSON ? JSON.parse(userJSON) : null;
  const currentRole = authUser?.role || localUser?.role;
  const isAuditor = currentRole?.toLowerCase() === 'auditor';

  return [
    {
      id: 'name',
      accessorFn: (row) => row.name,
      header: ({ column }) => (
        <DataGridColumnHeader title="Repository" column={column} />
      ),
      cell: ({ row }) => (
        <Link
          to={`/sca-ui/projects/${row.original.id}`}
          className="cursor-pointer hover:text-primary text-left font-medium"
        >
          {row.original.name}
        </Link>
      ),
      enableSorting: true,
      size: 200,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'branch',
      accessorFn: (row) => row.branch,
      header: ({ column }) => (
        <DataGridColumnHeader title="Branch" column={column} />
      ),
      cell: ({ row }) => <span>{row.original.branch}</span>,
      enableSorting: true,
      size: 130,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'ecosystem',
      accessorFn: (row) => row.ecosystem,
      header: ({ column }) => (
        <DataGridColumnHeader title="Ecosystem" column={column} />
      ),
      cell: ({ row }) => (
        <Badge variant="secondary">{row.original.ecosystem}</Badge>
      ),
      enableSorting: true,
      size: 140,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'dependenciesCount',
      accessorFn: (row) => row.dependenciesCount,
      header: ({ column }) => (
        <DataGridColumnHeader title="Packages" column={column} />
      ),
      cell: ({ row }) => <span>{row.original.dependenciesCount} pkgs</span>,
      enableSorting: true,
      size: 100,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'severityBreakdown',
      header: ({ column }) => (
        <DataGridColumnHeader title="CVE Severity Breakdown" column={column} />
      ),
      cell: ({ row }) => (
        <div className="flex justify-start">
          {row.original.vulnCounts?.critical + row.original.vulnCounts?.high + row.original.vulnCounts?.medium + row.original.vulnCounts?.low > 0 ?
            <VulnerabilitiesBadges
              vulnerabilities={{
                critical: row.original?.vulnCounts?.critical || 0,
                high: row.original?.vulnCounts?.high || 0,
                medium: row.original?.vulnCounts?.medium || 0,
                low: row.original?.vulnCounts?.low || 0,
              }}
              assetName={row.original.name}
            /> : "-"}
        </div>
      ),
      enableSorting: false,
      size: 150,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'lastScan',
      accessorFn: (row) => row.lastScan,
      header: ({ column }) => (
        <DataGridColumnHeader title="Last Scan" column={column} />
      ),
      cell: ({ row }) => (
        <span>
          {row.original?.lastScan?.toLowerCase() === 'pending scan'
            ? '-'
            : row.original.lastScan || "-"}
        </span>
      ),
      enableSorting: true,
      size: 150,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    ...(isAuditor ? [] : [{
      id: 'actions',
      header: ({ column }) => <DataGridColumnHeader title="" column={column} />,
      cell: ({ row }) => (
        <ProjectActionsCell
          row={row}
          handleTriggerScan={handleTriggerScan}
          handleDelete={handleDelete}
        />
      ),
      enableSorting: false,
      size: 60,
      meta: {
        cellClassName: 'text-center',
        skeleton: <Skeleton className="h-7" />,
      },
    }]),
  ];
}

function ProjectActionsCell({ row, handleTriggerScan, handleDelete }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" mode="icon" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuItem
            className="gap-2 cursor-pointer"
            onClick={() => window.open(row.original.repoUrl, '_blank')}
          >
            <span>View GitHub Repository</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="gap-2 cursor-pointer"
            onClick={() => handleTriggerScan(row.original.id, row.original.name)}
          >
            <span>Trigger SCA Scan</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="gap-2 cursor-pointer text-destructive focus:text-destructive"
            onClick={() => setDeleteOpen(true)}
          >
            <span>Delete Repository</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteRepositoryDialog
        open={deleteOpen}
        setOpen={setDeleteOpen}
        repository={row.original}
      />
    </>
  );
}

export function ProjectsTable({
  projectsList = [],
  advancedFilters,
  isLoading,
  searchQuery,
  setSearchQuery,
  filters = {},
  setFilters,
  paginationMeta = {},
  pagination,
  setPagination,
  navigate,
  handleTriggerScan,
  handleDelete,
}) {
  const { user } = useAuth();

  const columns = useMemo(
    () => getColumns(navigate, handleTriggerScan, handleDelete, user),
    [navigate, handleTriggerScan, handleDelete, user],
  );

  const supportedFilters = useMemo(
    () => advancedFilters || [],
    [advancedFilters],
  );

  return (
    <Table
      data={projectsList}
      columns={columns}
      isLoading={isLoading}
      search={searchQuery}
      setSearch={setSearchQuery}
      searchPlaceholder="Search repo or branch..."
      pagination={pagination}
      setPagination={setPagination}
      totalPages={paginationMeta.totalPages}
      totalCount={paginationMeta.total}
      toolbar={
        <TableToolbarFilters
          supportedFilters={supportedFilters}
          filters={filters}
          setFilters={setFilters}
        />
      }
      manualPagination={true}
      enableSorting={true}
      className="mt-4"
    />
  );
}