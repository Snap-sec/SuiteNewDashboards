import { useMemo } from 'react';
import { Clock, Key, RefreshCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import {
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from '@/components/ui/data-grid-table';
import { Skeleton } from '@/components/ui/skeleton';
import { DateFormatter } from '@/components/custom/date-formatter';
import Table from '@/components/custom/table';
import { SourceBadge } from '../../../../../components/custom/source-badge.jsx';
import { Badge } from '../../../../../components/ui/badge.jsx';
import { formatDate, formatDateTime } from '../../../../../lib/helpers.js';
import useStore from '../../store.js';
import TableToolbarFilters from '../../../../../components/common/table-toolbar-filters.jsx';

function getColumns() {
  return [
    {
      accessorKey: '_id',
      accessorFn: (row) => row._id,
      header: () => <DataGridTableRowSelectAll />,
      cell: ({ row }) => <DataGridTableRowSelect row={row} />,
      enableSorting: false,
      enableHiding: false,
      enableResizing: false,
      size: 51,
      meta: {
        cellClassName: '',
      },
    },
    {
      id: 'source',
      accessorFn: (row) => row.name,
      header: ({ column }) => (
        <DataGridColumnHeader title="Source" column={column} />
      ),

      cell: ({ row }) => (
        <SourceBadge source={row?.original?.integrationId?.type || 'manual'} />
      ),

      enableSorting: false,
      size: 100,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'environment',
      accessorFn: (row) => row.name,
      header: ({ column }) => (
        <DataGridColumnHeader title="Environment" column={column} />
      ),

      cell: ({ row }) => (
        <Link
          to={`/was/environment/${row?.original?._id}`}
          className="leading-none font-medium text-sm text-mono hover:text-primary"
        >
          <div className="flex flex-col gap-1 lg:gap-2.5">
            <div
              className="flex items-center gap-1 truncate"
              title={row.original.name}
            >
              <p>
                {row.original.name.length > 50
                  ? `${row.original.name.substring(0, 50)}...`
                  : row.original.name}
              </p>
            </div>
          </div>
        </Link>
      ),

      enableSorting: false,
      size: 200,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },

    {
      id: 'Workspace',
      accessorFn: (row) => row.workspaceName,
      header: ({ column }) => (
        <DataGridColumnHeader title="Workspace" column={column} />
      ),

      cell: ({ row }) => <p>{row?.original?.workspaceName || '-'}</p>,

      enableSorting: false,
      size: 150,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },

    {
      id: 'variables',
      accessorFn: (row) => row.workspaceName,
      header: ({ column }) => (
        <DataGridColumnHeader title="Variables" column={column} />
      ),

      cell: ({ row }) => (
        <div className=" flex space-x-2">
          <Key className=" h-4 w-4 text-muted-foreground" />
          <span className=" font-semibold">
            {
              row?.original?.values?.filter((item) => item.enabled === true)
                .length
            }{' '}
            / {row?.original?.values?.length}{' '}
          </span>
          <span className=" text-muted-foreground text-xs">enabled</span>
        </div>
      ),

      enableSorting: false,
      size: 150,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },

    // {
    //   id: 'status',
    //   accessorFn: (row) => row.isPublic,
    //   header: ({ column }) => (
    //     <DataGridColumnHeader title="Status" column={column} />
    //   ),

    //   cell: ({ row }) => (
    //     <Badge
    //       variant={'success'}
    //       appearance={'light'}
    //       className={' capitalize'}
    //     >
    //       {row.original.integrationId?.status}
    //     </Badge>
    //   ),

    //   enableSorting: false,
    //   size: 130,
    //   meta: {
    //     cellClassName: '',
    //     skeleton: <Skeleton className="h-7" />,
    //   },
    // },

    {
      id: 'updated',
      accessorFn: (row) => row.createdAt,
      header: ({ column }) => (
        <DataGridColumnHeader title="Updated" column={column} />
      ),

      cell: ({ row }) => (
        <div className=" flex gap-1.5">
          <Clock className=' h-5 w-5 text-muted-foreground' />
          {formatDate(row?.original?.updatedAt)}
        </div>
      ),

      enableSorting: true,
      size: 120,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
  ];
}

function EnvironmentsTable({ data, isLoading, isFetching, supportedFilters }) {
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

  return (
    <>
      <Table
        grid
        data={data}
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
        search={searchQuery}
        setSearch={setSearchQuery}
        toolbar={<TableToolbarFilters
          filters={filters}
          setFilters={setFilters}
          supportedFilters={supportedFilters}
          isLoadingFilters={isLoading}
        />}
      />
    </>
  );
}

export default EnvironmentsTable;
