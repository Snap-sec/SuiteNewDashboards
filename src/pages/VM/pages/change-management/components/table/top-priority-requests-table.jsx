import { useState } from 'react';
import { EyeOff } from 'lucide-react';
import { Link } from 'react-router';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import { DateFormatter } from '@/components/custom/date-formatter';
import { PriorityBadge } from '@/components/custom/priority-badge';
import { StatusBadge } from '@/components/custom/status-badge';
import Table from '@/components/custom/table';
import { CustomTooltip } from '@/components/custom/tooltip';
import { VulnerabilityLables } from '@/components/custom/vulnerability-labels';
import SeverityLabel from '../../../../../../components/custom/severity-label';

const columns = [
  {
    accessorKey: 'applicationServiceName',
    header: ({ column }) => (
      <DataGridColumnHeader title="Change Title" column={column} />
    ),
    cell: ({ row }) => {
      return (
        <Link
          to={`/vm/assessment-edit?assessmentId=${row?.original?.id}`}
          className="block font-medium text-sm text-mono hover:text-primary break-words whitespace-normal"
        >
          {row.original.title}
        </Link>
      );
    },
    enableSorting: false,
    meta: {
      cellClassName: '',
      skeleton: <Skeleton className="h-7 w-full" />,
    },
  },

  // {
  //   id: 'App_Name',
  //   header: ({ column }) => (
  //     <DataGridColumnHeader title="App Name" column={column} />
  //   ),
  //   cell: ({ row }) => {
  //     return (
  //       <p className='className="block font-medium text-sm text-mono hover:text-primary break-words whitespace-normal"'>
  //         {row.original?.appName || 'none'}
  //       </p>
  //     );
  //   },
  //   enableSorting: false,
  //   size: 100,
  //   meta: {
  //     cellClassName: '',
  //     skeleton: <Skeleton className="h-7" />,
  //   },
  // },
  {
    id: 'Business unit',
    header: ({ column }) => (
      <DataGridColumnHeader title="Business Unit" column={column} />
    ),
    cell: ({ row }) => {
      return (
        <p className="text-sm">
          {row.original?.businessUnits?.[0]?.name || '-'}
        </p>
      );
    },
    enableSorting: false,
    size: 100,
    meta: {
      cellClassName: '',
      skeleton: <Skeleton className="h-7 w-full" />,
    },
  },
  {
    id: 'Vulnerabilities',
    header: ({ column }) => (
      <DataGridColumnHeader title="Vulnerabilities" column={column} />
    ),
    cell: ({ row }) => (
      <div className="flex flex-wrap">
        <VulnerabilityLables
          items={[
            { number: row.original?.vulnMetrics?.critical || 0, label: 'C' },
            { number: row.original?.vulnMetrics?.high || 0, label: 'H' },
            { number: row.original?.vulnMetrics?.medium || 0, label: 'M' },
            { number: row.original?.vulnMetrics?.low || 0, label: 'L' },
            { number: row.original?.vulnMetrics?.none || 0, label: 'N' },
          ].filter((item) => item.number !== 0)}
        />
      </div>
    ),
    enableSorting: false,
    size: 100,
    meta: {
      cellClassName: '',
      skeleton: <Skeleton className="h-7 w-full" />,
    },
  },
  {
    id: 'priority',
    header: ({ column }) => (
      <DataGridColumnHeader title="Priority" column={column} />
    ),
    cell: ({ row }) => <SeverityLabel severity={row?.original?.priority} />,

    enableSorting: false,
    size: 100,
    meta: {
      cellClassName: '',
      skeleton: <Skeleton className="h-7 w-full" />,
    },
  },

  {
    id: 'state',
    header: ({ column }) => (
      <DataGridColumnHeader title="Status" column={column} />
    ),
    cell: ({ row }) => (
      <div className="flex flex-wrap">
        <StatusBadge status={row?.original?.state} />
      </div>
    ),

    enableSorting: false,
    size: 70,
    meta: {
      cellClassName: '',
      skeleton: <Skeleton className="h-7 w-full" />,
    },
  },

  // {
  //   id: 'updatedAt',
  //   accessorFn: (row) => row.createdAt,
  //   header: ({ column }) => (
  //     <DataGridColumnHeader title="Updated At" column={column} />
  //   ),
  //   cell: ({ row }) => <DateFormatter date={row.original.updatedAt} />,

  //   enableSorting: false,
  //   size: 50,
  //   meta: {
  //     cellClassName: '',
  //     skeleton: <Skeleton className="h-7" />,
  //   },
  // },
];

function TablePtop({ data = [{}], isLoading }) {
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});

  return (
    <div className="mt-8">
      <h3
        data-slot="card-title"
        className="text-base font-normal mb-2 leading-none tracking-tight text-gray-500 text-sm"
      >
        Top priority requests
      </h3>

      <div className="mt-4">
        <Table
          data={data}
          columns={columns}
          search={search}
          isLoading={isLoading}
          setSearch={setSearch}
          pagination={pagination}
          setPagination={setPagination}
          sorting={sorting}
          setSorting={setSorting}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          totalPages={0} // Adjust according to backend data
          enableSorting
          enableSearch={false}
          onRowClick={(row) => console.log('Row clicked:', row)}
          showPagination={false}
          cardHeading={false}
        />
      </div>
    </div>
  );
}

export default TablePtop;
