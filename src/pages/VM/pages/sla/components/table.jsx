import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import Table from '@/components/custom/table';

const getColumns = () => [
  {
    id: 'name',
    accessorFn: (row) => row.name,
    header: ({ column }) => (
      <DataGridColumnHeader title="Department" column={column} />
    ),
    cell: ({ row }) => (
      <div className="leading-none font-medium text-sm text-mono flex items-center gap-1">
        {row.original.name}
      </div>
    ),
    enableSorting: false,
    size: 200,
    meta: {
      skeleton: <Skeleton className="h-6" />,
    },
  },
  {
    id: 'totalTickets',
    accessorFn: (row) => row.totalTickets || 0,
    header: ({ column }) => (
      <DataGridColumnHeader title="Total Tickets" column={column} />
    ),
    cell: ({ row }) => (
      <Badge appearance="outline" className="font-medium">
        {row.original.totalTickets || 0}
      </Badge>
    ),
    enableSorting: true,
    size: 90,
    meta: {
      cellClassName: 'text-left',
      skeleton: <Skeleton className="h-7" />,
    },
  },
  {
    id: 'resolvedTickets',
    accessorFn: (row) => row.resolvedTickets || 0,
    header: ({ column }) => (
      <DataGridColumnHeader title="Resolved" column={column} />
    ),
    cell: ({ row }) => (
      <Badge appearance="outline" variant="success" className="font-medium">
        {row.original.resolvedTickets || 0}
      </Badge>
    ),
    enableSorting: false,
    size: 80,
    meta: {
      cellClassName: 'text-left',
      skeleton: <Skeleton className="h-7" />,
    },
  },
  {
    id: 'breached',
    accessorFn: (row) => row.breached || 0,
    header: ({ column }) => (
      <DataGridColumnHeader title="Breached" column={column} />
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Badge appearance="outline" className="font-medium">
          {row.original.breached || 0}
        </Badge>
      </div>
    ),
    enableSorting: false,
    size: 180,
    meta: {
      cellClassName: '',
      skeleton: <Skeleton className="h-7" />,
    },
  },
  {
    id: 'Compliant',
    accessorFn: (row) => row.compliant || 0,
    header: ({ column }) => (
      <DataGridColumnHeader title="Compliant" column={column} />
    ),
    cell: ({ row }) => (
      <Badge appearance="outline" className="font-medium">
        {row.original.compliant || 0}
      </Badge>
    ),
    enableSorting: false,
    size: 180,
    meta: {
      cellClassName: '',
      skeleton: <Skeleton className="h-7" />,
    },
  },
  {
    id: 'atRisk',
    accessorFn: (row) => row.atRisk || 0,
    header: ({ column }) => (
      <DataGridColumnHeader title="At Risk" column={column} />
    ),
    cell: ({ row }) => (
      <Badge appearance="outline" className="font-medium">
        {row.original.atRisk || 0}
      </Badge>
    ),
    enableSorting: false,
    size: 80,
    meta: {
      cellClassName: '',
      skeleton: <Skeleton className="h-7" />,
    },
  },
];

const SLATable = ({ data, isLoading }) => {
  const [sorting, setSorting] = useState([{ id: 'totalTickets', desc: true }]);

  const columns = useMemo(() => getColumns(), []);

  return (
    <Table
      data={data || []}
      columns={columns}
      sorting={sorting}
      setSorting={setSorting}
      isLoading={isLoading}
      enableSorting={true}
      cardHeading={false}
      manualSorting={false}
      manualPagination={false}
      showPagination={false}
      tableLayout={{
        columnsPinnable: true,
        columnsMovable: true,
        columnsVisibility: true,
        cellBorder: false,
      }}
      className="h-full"
    />
  );
};

export default SLATable;
