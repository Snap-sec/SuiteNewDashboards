import React, { useMemo } from 'react';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import Table from '@/components/custom/table';

const formatVersion = (verStr) => {
  if (!verStr || typeof verStr !== 'string') return 'v1.0.0';
  let str = verStr.trim().replace(/^v+/i, '');
  if (str.length > 12) {
    str = str.slice(0, 12) + '...';
  }
  return `v${str}`;
};

function getDepColumns(navigate, projectData) {
  return [
    {
      id: 'name',
      accessorFn: (row) => row.name,
      header: ({ column }) => (
        <DataGridColumnHeader title="Package Name" column={column} />
      ),
      cell: ({ row }) => (
        <p
          className="text-left font-medium"
        >
          {row.original.name}
        </p>
      ),
      enableSorting: true,
      size: 220,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'version',
      accessorFn: (row) => row.installedVersion || row.version,
      header: ({ column }) => (
        <DataGridColumnHeader title="Version" column={column} />
      ),
      cell: ({ row }) => (
        <span>
          {formatVersion(row.original.installedVersion || row.original.version)}
        </span>
      ),
      enableSorting: true,
      size: 110,
      meta: {
        cellClassName: '',
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
          {row.original.type || 'Direct'}
        </Badge>
      ),
      enableSorting: true,
      size: 110,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'ecosystem',
      accessorFn: (row) => row.ecosystem || projectData?.ecosystem || 'npm',
      header: ({ column }) => (
        <DataGridColumnHeader title="Ecosystem" column={column} />
      ),
      cell: ({ row }) => (
        <Badge variant="secondary">
          {row.original.ecosystem || projectData?.ecosystem || 'npm'}
        </Badge>
      ),
      enableSorting: true,
      size: 130,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'license',
      accessorFn: (row) => row.license || 'MIT',
      header: ({ column }) => (
        <DataGridColumnHeader title="License" column={column} />
      ),
      cell: ({ row }) => (
        <Badge variant="secondary">
          {row.original.license || 'MIT'}
        </Badge>
      ),
      enableSorting: true,
      size: 130,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'status',
      header: ({ column }) => (
        <DataGridColumnHeader title="Status" column={column} />
      ),
      cell: ({ row }) => (
        <Badge variant="secondary">
          {row.original.cveCount > 0 ? `${row.original.cveCount} CVEs` : (row.original.status || 'Clean')}
        </Badge>
      ),
      enableSorting: false,
      size: 130,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
  ];
}

export function ProjectDependenciesTab({
  filteredDependencies = [],
  searchQuery,
  handleSearchChange,
  depPagination = {},
  depPage,
  setDepPage,
  navigate,
  projectData,
  isLoading,
}) {
  const columns = useMemo(() => getDepColumns(navigate, projectData), [navigate, projectData]);

  return (
    <Table
      data={filteredDependencies}
      columns={columns}
      isLoading={isLoading}
      search={searchQuery}
      setSearch={(val) => handleSearchChange({ target: { value: val } })}
      searchPlaceholder="Search packages..."
      pagination={{ pageIndex: depPage - 1, pageSize: depPagination.limit || 10 }}
      setPagination={(updater) => {
        const nextState = typeof updater === 'function' ? updater({ pageIndex: depPage - 1, pageSize: depPagination.limit || 10 }) : updater;
        setDepPage(nextState.pageIndex + 1);
      }}
      totalPages={depPagination.totalPages || 1}
      totalCount={depPagination.total || filteredDependencies.length}
      manualPagination={true}
      enableSorting={true}
    />
  );
}
