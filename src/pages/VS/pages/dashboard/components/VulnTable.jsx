import { useMemo } from 'react';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import SeverityLabel from '@/components/custom/severity-label';
import { DateFormatter } from '@/components/custom/date-formatter';
import Table from '@/components/custom/table';
import VulnInfo from '../../vulnerabilities/components/vuln-info';
import useStore from '../../vulnerabilities/store';
import { StateLabels } from '../../../../../components/custom/state-labels';

function VulnTitle({ row }) {
  const setSelectedVuln = useStore((state) => state.setSelectedVuln);
  const setShowInfo = useStore((state) => state.setShowInfo);

  return (
    <div
      className="flex flex-col gap-1 hover:text-primary cursor-pointer"
      onClick={() => {
        setSelectedVuln(row.original);
        setShowInfo(true);
      }}
    >
      <p title={row.original.title || row.original._raw?.info?.name || '-'} className="text-sm truncate font-medium leading-none">
        {row.original.title || row.original._raw?.info?.name || '-'}
      </p>
    </div>
  );
}

function getColumns() {
  return [
    {
      id: 'title',
      accessorFn: (row) => row.title,
      header: ({ column }) => <DataGridColumnHeader title="Title" column={column} />,
      cell: ({ row }) => <VulnTitle row={row} />,
      enableSorting: false,
      size: 250,
      meta: {
        skeleton: <Skeleton className="h-5" />,
      },
    },
    {
      id: 'asset',
      header: ({ column }) => <DataGridColumnHeader title="Asset" column={column} />,
      accessorFn: (row) => row.host || row.matched_at,
      cell: ({ row }) => (
        <div
          className="text-sm truncate max-w-[150px]"
          title={row.original.host || row.original.matched_at || '-'}
        >
          {row.original.host || row.original.matched_at || '-'}
        </div>
      ),
      enableSorting: false,
      size: 150,
      meta: {
        skeleton: <Skeleton className="h-5" />,
      },
    },
    {
      id: 'scanner',
      header: ({ column }) => <DataGridColumnHeader title="Scanner" column={column} />,
      accessorFn: (row) => row.scannerId?.name,
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.scannerId?.name || '-'}
        </div>
      ),
      enableSorting: false,
      size: 120,
      meta: {
        skeleton: <Skeleton className="h-5" />,
      },
    },

    {
      id: 'severity',
      header: ({ column }) => <DataGridColumnHeader title="Severity" column={column} />,
      cell: ({ row }) => <SeverityLabel severity={row.original.severity || row.original._raw?.info?.severity} />,
      enableSorting: false,
      size: 100,
      meta: {
        skeleton: <Skeleton className="h-6" />,
      },
    },

    {
      id: 'state',
      header: ({ column }) => <DataGridColumnHeader title="State" column={column} />,
      cell: ({ row }) => <StateLabels state={row.original.state} />,
      enableSorting: false,
      size: 100,
      meta: {
        skeleton: <Skeleton className="h-6" />,
      },
    },

    {
      id: 'found_on',
      header: ({ column }) => <DataGridColumnHeader title="Found On" column={column} />,
      accessorFn: (row) => row.createdAt,
      cell: ({ row }) => (
        <div className="text-sm">
          <DateFormatter date={row.original.createdAt} />
        </div>
      ),
      enableSorting: false,
      size: 120,
      meta: {
        skeleton: <Skeleton className="h-5" />,
      },
    },
  ];
}

function VulnTable({ data, isLoading }) {
  const vulns = useMemo(() => (Array.isArray(data) ? data : []), [data]);
  const columns = useMemo(() => getColumns(), []);

  return (
    <>
      <Table
        data={vulns}
        columns={columns}
        isLoading={isLoading}
        pagination={{ pageIndex: 0, pageSize: 10 }}
        enableSearch={false}
        showPagination={false}
        cardHeading={false}
        grid
        className="border-0 shadow-none p-0"
      />
      <VulnInfo />
    </>
  );
}

export default VulnTable;
