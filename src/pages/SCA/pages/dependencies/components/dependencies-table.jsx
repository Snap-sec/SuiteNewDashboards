import React, { useMemo } from 'react';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import Table from '@/components/custom/table';
import TableToolbarFilters from '@/components/common/table-toolbar-filters';
import VulnerabilitiesBadges from '@/components/custom/vulnerabilities-badges';



export const formatVersion = (verStr) => {
  if (!verStr || typeof verStr !== 'string') return 'v1.0.0';
  let str = verStr.trim().replace(/^v+/i, '');
  if (str.length > 10) {
    str = str.slice(0, 10) + '...';
  }
  return `v${str}`;
};

export const getParentType = (dep) => {
  if (dep?.parentType) {
    const isImage = dep.parentType === 'Container Image';
    return { label: dep.parentType, isImage };
  }
  const firstProj = (dep?.projects?.[0] || dep?.parentPackage || '').toLowerCase();
  const ecosystem = (dep?.ecosystem || '').toLowerCase();
  const type = (dep?.type || '').toLowerCase();

  const isImage =
    ecosystem === 'container' ||
    type.includes('container') ||
    firstProj.includes(':') ||
    firstProj.startsWith('ghcr.io') ||
    firstProj.includes('/');

  return isImage ? { label: 'Container Image', isImage: true } : { label: 'Code Repo', isImage: false };
};

function getColumns(navigate) {
  return [
    {
      id: 'name',
      accessorFn: (row) => row.name,
      header: ({ column }) => (
        <DataGridColumnHeader title="Component Name" column={column} />
      ),
      cell: ({ row }) => {
        const dep = row.original;
        return (
          <button
            className="text-left font-medium truncate max-w-full block"
            title={dep.name}
          >
            <span className="truncate">{dep.name}</span>
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
      id: 'type',
      accessorFn: (row) => row.type,
      header: ({ column }) => (
        <DataGridColumnHeader title="Type" column={column} />
      ),
      cell: ({ row }) => (
        <Badge variant="secondary">
          {row.original.type === 'Direct' ? 'Direct' : 'In review'}
        </Badge>
      ),
      enableSorting: false,
      size: 110,
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'installedVersion',
      accessorFn: (row) => row.installedVersion,
      header: ({ column }) => (
        <DataGridColumnHeader title="Installed Version" column={column} />
      ),
      cell: ({ row }) => (
        <span title={row.original.installedVersion ? `v${String(row.original.installedVersion).replace(/^v+/i, '')}` : ''}>
          {formatVersion(row.original.installedVersion)}
        </span>
      ),
      enableSorting: true,
      size: 140,
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'latestVersion',
      accessorFn: (row) => row.latestVersion,
      header: ({ column }) => (
        <DataGridColumnHeader title="Latest Release" column={column} />
      ),
      cell: ({ row }) => (
        <span>{formatVersion(row.original.latestVersion)}</span>
      ),
      enableSorting: false,
      size: 130,
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'isOutdated',
      accessorFn: (row) => row.isOutdated,
      header: ({ column }) => (
        <DataGridColumnHeader title="Outdated Status" column={column} />
      ),
      cell: ({ row }) => (
        <Badge variant="secondary">
          {row.original.isOutdated ? 'Outdated' : 'Up to date'}
        </Badge>
      ),
      enableSorting: false,
      size: 140,
      meta: {
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
        <Badge variant="secondary">
          {row.original.ecosystem}
        </Badge>
      ),
      enableSorting: false,
      size: 130,
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'projects',
      header: ({ column }) => (
        <DataGridColumnHeader title="Projects Using" column={column} />
      ),
      cell: ({ row }) => {
        const dep = row.original;
        return (
          <div className="flex items-center gap-1 max-w-full min-w-0">
            <span className="truncate" title={dep.projects?.[0]}>{dep.projects?.[0]}</span>
            {dep.projectsCount > 1 && (
              <span className="text-muted-foreground text-xs shrink-0">
                +{dep.projectsCount - 1}
              </span>
            )}
          </div>
        );
      },
      enableSorting: false,
      size: 160,
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'cveCount',
      accessorFn: (row) => row.cveCount,
      header: ({ column }) => (
        <DataGridColumnHeader title="Vulnerabilities" column={column} />
      ),
      cell: ({ row }) => (
        <div className='flex justify-left'>
          {row.original.vulnCounts?.critical + row.original.vulnCounts?.high + row.original.vulnCounts?.medium + row.original.vulnCounts?.low > 0 ?
            <VulnerabilitiesBadges vulnerabilities={row.original.vulnCounts} />
            : "-"}
        </div>
      ),
      enableSorting: true,
      size: 160,
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },
  ];
}

export function DependenciesTable({
  dependenciesList = [],
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
}) {
  const columns = useMemo(() => getColumns(navigate), [navigate]);

  const supportedFilters = useMemo(
    () => advancedFilters || [],
    [advancedFilters],
  );

  return (
    <Table
      data={dependenciesList}
      columns={columns}
      isLoading={isLoading}
      search={searchQuery}
      setSearch={setSearchQuery}
      searchPlaceholder="Search component, project..."
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
