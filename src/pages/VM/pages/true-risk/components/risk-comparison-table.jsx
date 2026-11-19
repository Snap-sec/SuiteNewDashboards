import React, { useMemo } from 'react';
import Table from '@/components/custom/table';
import { Badge } from '@/components/ui/badge';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';

const RiskComparisonTable = () => {
  const data = useMemo(
    () => [
      { name: 'Critical Authentication Bypass', cvss: '9.8', risk: '9.8', delta: '+0.0' },
      { name: 'Unprotected SSH on Public Endpoint', cvss: '7.5', risk: '9.4', delta: '▲ +1.9' },
      { name: 'Legacy CMS Internal Vulnerability', cvss: '8.1', risk: '4.2', delta: '▼ -3.9' },
      { name: 'Missing Strict-Transport-Security', cvss: '3.7', risk: '5.8', delta: '▲ +2.1' },
    ],
    []
  );

  const columns = useMemo(
    () => [
      {
        id: 'name',
        accessorFn: (row) => row?.name,
        header: ({ column }) => (
          <DataGridColumnHeader title="Vulnerability Identification" column={column} />
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-2 py-1">
            {row.original?.name}
          </div>
        ),
        size: 300,
        enableSorting: false,
        meta: {
          skeleton: <Skeleton className="h-7" />,
        },
      },
      {
        id: 'cvss',
        accessorFn: (row) => row?.cvss,
        header: ({ column }) => (
          <div className="flex w-full justify-center">
            <DataGridColumnHeader title="Legacy CVSS" column={column} />
          </div>
        ),
        cell: ({ row }) => (
          <span className="font-mono text-muted-foreground block text-center w-full">
            {row.original?.cvss}
          </span>
        ),
        size: 100,
        enableSorting: false,
        meta: {
          headerClassName: 'text-center',
          cellClassName: 'text-center',
          skeleton: <Skeleton className="h-7 mx-auto" />,
        },
      },
      {
        id: 'risk',
        accessorFn: (row) => row?.risk,
        header: ({ column }) => (
          <div className="flex w-full justify-center">
            <DataGridColumnHeader title="True Risk" column={column} />
          </div>
        ),
        cell: ({ row }) => (
          <span className="font-mono block text-center w-full">
            {row.original?.risk}
          </span>
        ),
        size: 100,
        enableSorting: false,
        meta: {
          headerClassName: 'text-center',
          cellClassName: 'text-center',
          skeleton: <Skeleton className="h-7 mx-auto" />,
        },
      },
      {
        id: 'delta',
        accessorFn: (row) => row?.delta,
        header: ({ column }) => (
          <div className="flex w-full justify-end">
            <DataGridColumnHeader title="Adjust" column={column} />
          </div>
        ),
        cell: ({ row }) => {
          const delta = row.original?.delta || '';
          return (
            <div className="flex justify-end w-full">
              <Badge
                variant={
                  delta.includes('▲') ? 'dangerSoft' : delta.includes('▼') ? 'success' : 'secondary'
                }
                appearance="light"
                className="font-bold"
              >
                {delta}
              </Badge>
            </div>
          );
        },
        size: 100,
        enableSorting: false,
        meta: {
          headerClassName: 'text-right',
          cellClassName: 'text-right',
          skeleton: <Skeleton className="h-7 ml-auto" />,
        },
      },
    ],
    []
  );

  return (
    <Table
      data={data}
      columns={columns}
      enableSearch={false}
      showPagination={false}
      cardHeading={false}
      className="border-0 shadow-none p-0"
    />
  );
};

export default RiskComparisonTable;
