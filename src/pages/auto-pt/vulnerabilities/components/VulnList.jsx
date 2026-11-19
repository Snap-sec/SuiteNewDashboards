import React, { useMemo } from 'react';
import { Info, RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import { DateFormatter } from '@/components/custom/date-formatter';
import SeverityLabel from '@/components/custom/severity-label';
import { StateLabels } from '@/components/custom/state-labels';
import Table from '@/components/custom/table';
import TableToolbarFilters from '../../../../components/common/table-toolbar-filters';
import useStore from '../store';
import SendToVM from './actions/send-to-vm';
import VMBulkUpdate from './bulk-update';
import VulnInfo from './vuln-info';
import VulnerabilityActions from './vulnerability-actions';
import { Link } from 'react-router';


function getColumns() {
  return [
    // {
    //   id: "select",
    //   header: ({ table }) => (
    //     <Checkbox
    //       checked={table.getIsAllPageRowsSelected()}
    //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //       aria-label="Select all"
    //     />
    //   ),
    //   cell: ({ row }) => (
    //     <Checkbox
    //       checked={row.getIsSelected()}
    //       onCheckedChange={(value) => row.toggleSelected(!!value)}
    //       aria-label="Select row"
    //     />
    //   ),
    //   enableSorting: false,
    //   enableHiding: false,
    //   size: 40,
    // },

    {
      id: 'title',
      accessorFn: (row) => row.title,
      header: ({ column }) => (
        <DataGridColumnHeader title="Title" column={column} />
      ),

      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          {/* <VulnInfo data={row?.original} title={row?.original?.title} /> */}

          <Link
            to={`/apt/vulnerability-report?id=${row?.original?.universalVulnId}&assessmentId=${row?.original?.assessmentId?._id || row?.original?.assessmentId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="leading-none text-sm text-mono hover:text-primary"
          >
            <div className="flex flex-col gap-1 lg:gap-2.5 ">
              <div className="flex items-center gap-1.5">
                <p title={row.original.title} className="truncate block">
                  {row.original.title}
                </p>
              </div>
            </div>
          </Link>
        </div>
      ),

      enableSorting: false,
      size: 650,
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

      cell: ({ row }) => <SeverityLabel severity={row?.original?.severity} />,

      enableSorting: false,
      size: 60,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },

    {
      id: 'status',
      accessorFn: (row) => row.status,
      header: ({ column }) => (
        <DataGridColumnHeader title="Status" column={column} />
      ),

      cell: ({ row }) => <StateLabels state={row?.original?.status} />,

      enableSorting: false,
      size: 60,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },

    {
      id: 'project',
      accessorFn: (row) =>
        row?.pentestId?.name ||
        (Array.isArray(row?.pentestId) ? row?.pentestId[0]?.name : null) ||
        row?.projectId?.name ||
        (Array.isArray(row?.projectId) ? row?.projectId[0]?.name : null) ||
        'N/A',
      header: ({ column }) => (
        <DataGridColumnHeader title="Project" column={column} />
      ),

      cell: ({ row }) => {
        const pentestName =
          row?.original?.pentestId?.name ||
          (Array.isArray(row?.original?.pentestId)
            ? row?.original?.pentestId[0]?.name
            : null) ||
          row?.original?.projectId?.name ||
          (Array.isArray(row?.original?.projectId)
            ? row?.original?.projectId[0]?.name
            : null) ||
          'N/A';

        return (
          <Badge variant="secondary" className="max-w-full">
            <span className="truncate" title={pentestName}>
              {pentestName}
            </span>
          </Badge>
        );
      },

      enableSorting: false,
      size: 80,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },

    {
      id: 'reportedOn',
      accessorFn: (row) => row.createdAt || row.firstDetectedAt,
      header: ({ column }) => (
        <DataGridColumnHeader title="Detected On" column={column} />
      ),
      cell: ({ row }) => (
        <div className="flex flex-col gap-1 justify-center">
          <DateFormatter
            date={row?.original?.createdAt || row?.original?.firstDetectedAt}
            className="text-sm"
          />
        </div>
      ),
      enableSorting: true,
      size: 60,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },

    // {
    //   id: 'vmTicket',
    //   accessorFn: (row) => row._id,
    //   header: ({ column }) => (
    //     <DataGridColumnHeader title="VM Ticket" column={column} />
    //   ),
    //   cell: ({ row }) => <SendToVM row={row.original} iconOnly={false} disableSync={disableSync} />,
    //   enableSorting: false,
    //   size: 140,
    //   meta: {
    //     cellClassName: '',
    //     skeleton: <Skeleton className="h-7" />,
    //   },
    // },

    // {
    //   id: 'actions',
    //   accessorFn: (row) => row._id,
    //   header: ({ column }) => (
    //     <DataGridColumnHeader title="" column={column} />
    //   ),
    //   cell: ({ row }) => <VulnerabilityActions data={row.original} />,
    //   size: 90,
    //   enableSorting: false,
    //   meta: {
    //     cellClassName: '',
    //     skeleton: <Skeleton className="h-7" />,
    //   },
    // },
  ];
}

function VulnList({ data, supported_filters, isLoading, isFetching }) {
  const pagination = useStore((state) => state.pagination);
  const searchQuery = useStore((state) => state.searchQuery);
  const sorting = useStore((state) => state.sorting);
  const setPagination = useStore((state) => state.setPagination);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const setSorting = useStore((state) => state.setSorting);
  const rowSelection = useStore((state) => state.rowSelection);
  const setRowSelection = useStore((state) => state.setRowSelection);
  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);

  const columns = useMemo(() => getColumns(), []);
  const selectedRowsCount = Object.keys(rowSelection).length;

  return (
    <>
      <Table
        grid
        data={data?.userVulns || []}
        columns={columns}
        enableSorting={true}
        isLoading={isLoading || isFetching}
        totalPages={data?.totalPages}
        totalCount={data?.totalItems}
        pagination={pagination}
        setPagination={setPagination}
        sorting={sorting}
        setSorting={setSorting}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        searchPlaceholder={'Search Vulnerabilities'}
        search={searchQuery}
        setSearch={setSearchQuery}
        toolbar={
          <TableToolbarFilters
            filters={filters}
            setFilters={setFilters}
            supportedFilters={supported_filters}
            isLoadingFilters={Boolean(isLoading && !supported_filters?.length)}
          />
        }
      />
      {selectedRowsCount > 1 && (
        <VMBulkUpdate vulnerabilities={data?.userVulns} />
      )}
    </>
  );
}

export default VulnList;
