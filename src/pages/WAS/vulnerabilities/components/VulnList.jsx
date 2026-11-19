import React, { useMemo } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Info, RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import { DateFormatter } from '@/components/custom/date-formatter';
import SeverityLabel from '@/components/custom/severity-label';
import { StateLabels } from '@/components/custom/state-labels';
import Table from '@/components/custom/table';
import TableToolbarFilters from '../../../../components/common/table-toolbar-filters';
import useStore from '../store';
import VulnerabilityActions from './vulnerability-actions';
import VMBulkUpdate from './bulk-update';
import VulnInfo from './vuln-info';
import SendToVM from './actions/send-to-vm';


function getColumns(disableSync) {
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
          <VulnInfo data={row?.original} title={row?.original?.title} />

          <p className="flex items-center gap-2 text-sm font-normal text-muted-foreground">
            {row.original?.transformedRequestSnapshot?.url?.length > 70
              ? `${row.original?.transformedRequestSnapshot?.url.substring(0, 70)}...`
              : row.original?.transformedRequestSnapshot?.url}
          </p>
        </div>
      ),

      enableSorting: false,
      size: 300,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },

    {
      id: 'cwe',
      accessorFn: (row) => row.cwe,
      header: ({ column }) => (
        <DataGridColumnHeader title="CWE" column={column} />
      ),

      cell: ({ row }) => (
        <p className="text-sm text-muted-foreground truncate" title={row?.original?.cwe}>
          {row?.original?.cwe || '-'}
        </p>
      ),

      enableSorting: false,
      size: 100,
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
      size: 110,
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
      size: 110,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },

    {
      id: 'project',
      accessorFn: (row) => row.detectionCount,
      header: ({ column }) => (
        <DataGridColumnHeader title="Application" column={column} />
      ),

      cell: ({ row }) => (
        <Badge variant="secondary">
          {(row?.original?.projectId && row?.original?.projectId[0]?.name) || "N/A"}
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
      id: "reportedOn",
      accessorFn: (row) => row.firstDetectedAt,
      header: ({ column }) => (
        <DataGridColumnHeader
          title="Detected On"
          column={column}
        />
      ),
      cell: ({ row }) => (
        <div className="flex flex-col gap-1 justify-center">
          <DateFormatter
            date={row?.original?.firstDetectedAt}
            className="text-sm font-medium"
          />
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-normal">
            <RotateCcw className="size-3" />
            <DateFormatter date={row?.original?.lastDetectedAt} />
          </div>
        </div>
      ),
      enableSorting: true,
      size: 100,
      meta: {
        cellClassName: "",
        skeleton: <Skeleton className="h-7" />,
      },
    },

    {
      id: 'vmTicket',
      accessorFn: (row) => row._id,
      header: ({ column }) => (
        <DataGridColumnHeader title="VM Ticket" column={column} />
      ),
      cell: ({ row }) => <SendToVM row={row.original} iconOnly={false} disableSync={disableSync} />,
      enableSorting: false,
      size: 140,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },

    {
      id: 'actions',
      accessorFn: (row) => row._id,
      header: ({ column }) => (
        <DataGridColumnHeader title="" column={column} />
      ),
      cell: ({ row }) => <VulnerabilityActions data={row.original} />,
      size: 90,
      enableSorting: false,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
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

  const disableSync = data?.metadata?.vm_configuration_exists === false;
  const columns = useMemo(() => getColumns(disableSync), [disableSync]);
  const selectedRowsCount = Object.keys(rowSelection).length;

  return (
    <>
      <Table
        grid
        data={data?.userVulns || []}
        columns={columns}
        enableSorting={true}
        isLoading={isLoading}
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
            isLoadingFilters={isLoading}
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