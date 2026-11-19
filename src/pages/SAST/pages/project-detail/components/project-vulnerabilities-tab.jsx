import React, { useMemo } from 'react';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import Table from '@/components/custom/table';
import SeverityLabel from '@/components/custom/severity-label';

function getVulnColumns() {
  return [
    {
      id: 'vulnerabilityID',
      accessorFn: (row) => row.vulnerabilityID,
      header: ({ column }) => (
        <DataGridColumnHeader title="Vulnerability ID" column={column} />
      ),
      cell: ({ row }) => (
        <a
          href={row.original.primaryURL || `https://nvd.nist.gov/vuln/detail/${row.original.vulnerabilityID}`}
          target="_blank"
          rel="noreferrer"
          className="hover:underline font-medium"
        >
          {row.original.vulnerabilityID}
        </a>
      ),
      enableSorting: true,
      size: 200,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'pkgName',
      accessorFn: (row) => row.pkgName,
      header: ({ column }) => (
        <DataGridColumnHeader title="Package & Version" column={column} />
      ),
      cell: ({ row }) => (
        <span>
          {row.original.pkgName} v{row.original.installedVersion}
        </span>
      ),
      enableSorting: true,
      size: 180,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'severity',
      accessorFn: (row) => row.severity,
      header: ({ column }) => (
        <DataGridColumnHeader title="Severity" column={column} />
      ),
      cell: ({ row }) => (
        <SeverityLabel severity={row.original.severity} score={row.original.cvssScore} />
      ),
      enableSorting: true,
      size: 120,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'fixedVersion',
      accessorFn: (row) => row.fixedVersion,
      header: ({ column }) => (
        <DataGridColumnHeader title="Fixed Version" column={column} />
      ),
      cell: ({ row }) => (
        <span>
          {row.original.fixedVersion || 'N/A'}
        </span>
      ),
      enableSorting: true,
      size: 140,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'target',
      accessorFn: (row) => row.target,
      header: ({ column }) => (
        <DataGridColumnHeader title="Target File" column={column} />
      ),
      cell: ({ row }) => (
        <span>
          {row.original.target || 'manifest'}
        </span>
      ),
      enableSorting: true,
      size: 150,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
  ];
}

export function ProjectVulnerabilitiesTab({
  filteredVulns = [],
  searchQuery,
  handleSearchChange,
  vulnPagination = {},
  vulnPage,
  setVulnPage,
  isLoading,
}) {
  const columns = useMemo(() => getVulnColumns(), []);

  return (
    <Table
      data={filteredVulns}
      columns={columns}
      isLoading={isLoading}
      search={searchQuery}
      setSearch={(val) => handleSearchChange({ target: { value: val } })}
      searchPlaceholder="Filter vulnerabilities..."
      pagination={{ pageIndex: vulnPage - 1, pageSize: vulnPagination.limit || 10 }}
      setPagination={(updater) => {
        const nextState = typeof updater === 'function' ? updater({ pageIndex: vulnPage - 1, pageSize: vulnPagination.limit || 10 }) : updater;
        setVulnPage(nextState.pageIndex + 1);
      }}
      totalPages={vulnPagination.totalPages || 1}
      totalCount={vulnPagination.total || filteredVulns.length}
      manualPagination={true}
      enableSorting={true}
    />
  );
}
