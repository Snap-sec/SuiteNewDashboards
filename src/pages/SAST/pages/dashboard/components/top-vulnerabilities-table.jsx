import React, { useState, useMemo } from 'react';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import Table from '@/components/custom/table';
import SeverityLabel from '@/components/custom/severity-label';
import { fa } from '@faker-js/faker';

function getColumns(isLoading) {
  return [
    {
      id: 'vulnerabilityID',
      accessorFn: (row) => row.vulnerabilityID,
      header: ({ column }) => (
        <DataGridColumnHeader title="Vulnerability ID" column={column} />
      ),
      cell: ({ row }) => (
        <a
          href={row.original.primaryURL}
          target="_blank"
          rel="noreferrer"
          className="leading-none text-sm text-mono hover:text-primary"
        >
          <span>{row.original.vulnerabilityID}</span>
        </a>
      ),
      enableSorting: false,
      size: 170,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'pkgName',
      accessorFn: (row) => row.pkgName,
      header: ({ column }) => (
        <DataGridColumnHeader title="Package Name" column={column} />
      ),
      cell: ({ row }) => (
        <span>
          {row.original.pkgName}
        </span>
      ),
      enableSorting: false,
      size: 150,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'installedVersion',
      accessorFn: (row) => row.installedVersion,
      header: ({ column }) => (
        <DataGridColumnHeader title="Installed / Fixed" column={column} />
      ),
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">v{row.original.installedVersion}</span>
          <span className="text-muted-foreground text-xs">
            Fix: {row.original.fixedVersion || 'None'}
          </span>
        </div>
      ),
      enableSorting: false,
      size: 140,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'projectName',
      accessorFn: (row) => row.projectName,
      header: ({ column }) => (
        <DataGridColumnHeader title="Repository" column={column} />
      ),
      cell: ({ row }) => (
        <Badge variant="secondary">
          {row.original.projectName}
        </Badge>
      ),
      enableSorting: false,
      size: 150,
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
      enableSorting: false,
      size: 110,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'cvssScore',
      accessorFn: (row) => row.cvssScore || 0,
      header: ({ column }) => (
        <DataGridColumnHeader title="CVSS" column={column} />
      ),
      cell: ({ row }) => (
        <span className="text-xs font-normal text-foreground">
          {row.original.cvssScore ? row.original.cvssScore.toFixed(1) : 'N/A'}
        </span>
      ),
      enableSorting: false,
      size: 80,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
  ];
}

export function TopVulnerabilitiesTable({
  vulnerabilities = [],
  isLoading,
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVulns = useMemo(() => {
    if (!searchQuery) return vulnerabilities;
    const query = searchQuery.toLowerCase();
    return vulnerabilities.filter(
      (v) =>
        v.pkgName?.toLowerCase().includes(query) ||
        v.vulnerabilityID?.toLowerCase().includes(query) ||
        v.projectName?.toLowerCase().includes(query),
    );
  }, [vulnerabilities, searchQuery]);

  const columns = useMemo(() => getColumns(isLoading), [isLoading]);

  return (
    <Table
      data={filteredVulns}
      columns={columns}
      isLoading={isLoading}
      search={searchQuery}
      setSearch={setSearchQuery}
      searchPlaceholder="Search package..."
      showPagination={false}
      manualPagination={false}
      enableSorting={true}
    />
  );
}
