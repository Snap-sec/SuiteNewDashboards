import React, { useMemo } from 'react';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import { ShieldAlert } from 'lucide-react';
import SeverityLabel from '@/components/custom/severity-label';
import Table from '@/components/custom/table';

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
          className="text-xs font-medium text-blue-500 hover:underline flex items-center gap-1.5"
        >
          <ShieldAlert className="size-3.5 shrink-0" />
          {row.original.vulnerabilityID}
        </a>
      ),
      enableSorting: true,
      size: 200,
      meta: {
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
        <span className="text-xs font-normal">
          <span className="font-medium text-foreground">{row.original.pkgName || 'Package'}</span> v{row.original.installedVersion || '1.0.0'}
        </span>
      ),
      enableSorting: true,
      size: 180,
      meta: {
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
        <span className="text-xs font-normal text-emerald-600 dark:text-emerald-400">
          {row.original.fixedVersion || 'N/A'}
        </span>
      ),
      enableSorting: true,
      size: 140,
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'target',
      accessorFn: (row) => row.target,
      header: ({ column }) => (
        <DataGridColumnHeader title="Target Repository / Manifest" column={column} />
      ),
      cell: ({ row }) => (
        <span className="text-xs font-normal text-muted-foreground">
          {row.original.target || 'package.json'}
        </span>
      ),
      enableSorting: true,
      size: 200,
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },
  ];
}

export function DependencyAdvisoriesTab({
  vulnerabilitiesList = [],
  searchQuery,
  setSearchQuery,
  isLoading,
}) {
  const columns = useMemo(() => getVulnColumns(), []);

  return (
    <Table
      data={vulnerabilitiesList}
      columns={columns}
      isLoading={isLoading}
      search={searchQuery}
      setSearch={setSearchQuery}
      searchPlaceholder="Filter advisories & CVEs..."
      manualPagination={false}
      enableSorting={true}
    />
  );
}
