import { RefreshCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import {
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from '@/components/ui/data-grid-table';
import { Skeleton } from '@/components/ui/skeleton';
import { DateFormatter } from '@/components/custom/date-formatter';
import Table from '@/components/custom/table';
import SeverityLabel from '../../../../../../components/custom/severity-label';
import { StateLabels } from '../../../../../../components/custom/state-labels';
import usePagination from '../../../../../../hooks/use-pagination';

function getColumns() {
  return [
    {
      id: 'title',
      accessorFn: (row) => row._id,
      header: ({ column }) => (
        <DataGridColumnHeader title="Title" column={column} />
      ),
      cell: ({ row }) => (
        <div className="flex flex-col">
          <Link
            to={`/vm/vulnerability-report?id=${row?.original?._id}&assessmentId=${row?.original?.assessmentId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="leading-none font-medium text-sm text-mono hover:text-primary"
          >
            {row.original.title}
          </Link>
        </div>
      ),

      size: 200,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'assessment',
      accessorFn: (row) => row._id,
      header: ({ column }) => (
        <DataGridColumnHeader title="Assessment Name" column={column} />
      ),
      cell: ({ row }) => (
        <div className="flex flex-col">
          {/* <Link to={`/caim/asset-edit/${row.original._id}`} className="text-secondary-foreground font-medium hover:text-primary"> */}
          {row.original.assessmentName}
          {/* </Link> */}
        </div>
      ),

      size: 100,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'severity',
      accessorFn: (row) => row._id,
      header: ({ column }) => (
        <DataGridColumnHeader title="Severity" column={column} />
      ),
      cell: ({ row }) => (
        <div className="flex flex-col">
          <Link
            to={`/assetinventory/asset-edit/${row.original._id}`}
            className="text-secondary-foreground font-medium hover:text-primary"
          >
            <SeverityLabel severity={row.original?.severity} />
          </Link>
        </div>
      ),

      size: 110,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'state',
      accessorFn: (row) => row._id,
      header: ({ column }) => (
        <DataGridColumnHeader title="State" column={column} />
      ),
      cell: ({ row }) => (
        <div className="flex flex-col">
          <StateLabels state={row.original.state} />
        </div>
      ),

      size: 100,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'first_detected',
      accessorFn: (row) => row.first_detected,
      header: ({ column }) => (
        <DataGridColumnHeader title="Detected On" column={column} />
      ),

      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <DateFormatter date={row.original.first_detected} />
          <div className="flex items-center gap-0.5 text-muted-foreground text-xs">
            <RefreshCcw size={9} />
            <DateFormatter date={row.original.last_detected} />
          </div>
        </div>
      ),

      enableSorting: true,
      size: 100,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
  ];
}

function VulnList({ data }) {
  const columns = getColumns();

  const { pagination, setPagination } = usePagination(10);

  return (
    <Table
      data={data}
      columns={columns}
      pagination={pagination}
      setPagination={setPagination}
      manualPagination={false}
      enableSearch={false}
      newSearchInput={
        <h3
          data-slot="card-title"
          class="text-base font-semibold leading-none tracking-tight"
        >
          Vulnerabilities
        </h3>
      }
    />
  );
}

export default VulnList;
