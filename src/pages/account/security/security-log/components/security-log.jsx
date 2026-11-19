import { useEffect } from 'react';
import { Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useGetActivityQuery } from '@/services/notify/activityApi';
import { Badge } from '@/components/ui/badge';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import {
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from '@/components/ui/data-grid-table';
import { Skeleton } from '@/components/ui/skeleton';
import { MethodBadge } from '@/components/custom/method-badge';
import Table from '@/components/custom/table';
import { Profile } from '../../../../../components/custom/profile';
import { timeAgo } from '../../../../../lib/helpers';
import useStore from '../store';
import TableToolbarFilters from '@/components/common/table-toolbar-filters';
import ApiErrorHandler from '../../../../../components/common/api-error-handler';


const getColumns = () => [

  {
    id: 'eventType',
    accessorFn: (row) => row.eventType,
    header: ({ column }) => (
      <DataGridColumnHeader title="Event Title" column={column} />
    ),

    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <Search size={14} className="text-primary" />
          <span className="leading-none font-medium">
            {row.original?.action}
          </span>
        </div>

        <span className="text-secondary-foreground font-normal break-words">
          {row.original?.raw.originalUrl?.replace(/\/\//g, '/')}
        </span>
      </div>
    ),

    enableSorting: false,
    size: 300,
    meta: {
      cellClassName: '',
      skeleton: <Skeleton className="h-[30px]" />,
    },
  },
  {
    id: 'actionTaken',
    accessorFn: (row) => row.actionTaken,
    header: ({ column }) => (
      <DataGridColumnHeader title="User" column={column} />
    ),

    cell: ({ row }) => (
      <span>
        <Profile
          email={row.original.user.email}
          name={row.original.user.name}
          size='32px'
        />
      </span>
    ),

    enableSorting: false,
    size: 120,
    meta: {
      cellClassName: '',
      skeleton: <Skeleton className="h-[30px]" />,
    },
  },
  {
    id: 'method',
    accessorFn: (row) => row?.raw?.method,
    header: ({ column }) => (
      <DataGridColumnHeader title="HTTP Method" column={column} />
    ),

    cell: ({ row }) => <MethodBadge method={row.original?.raw?.method} />,

    enableSorting: false,
    size: 70,
    meta: {
      cellClassName: '',
      skeleton: <Skeleton className="h-[30px]" />,
    },
  },
  {
    id: 'actionType',
    accessorFn: (row) => row?.resourceMeta?.actionType,
    header: ({ column }) => (
      <DataGridColumnHeader title="Action Type" column={column} />
    ),

    cell: ({ row }) => (
      <span className="text-secondary-foreground font-normal capitalize">
        {row.original?.resourceMeta?.actionType}
      </span>
    ),

    enableSorting: false,
    size: 70,
    meta: {
      cellClassName: '',
      skeleton: <Skeleton className="h-[30px]" />,
    },
  },
  {
    id: 'Origin',
    accessorFn: (row) => row.sourceIp,
    header: ({ column }) => (
      <DataGridColumnHeader title="Origin" column={column} />
    ),

    cell: ({ row }) => (
      <span className="text-secondary-foreground font-normal">
        <Badge variant={row.original?.severity?.variant} appearance="outline">
          {row.original?.origin?.toUpperCase()}
        </Badge>
      </span>
    ),

    enableSorting: false,
    size: 40,
    meta: {
      cellClassName: '',
      skeleton: <Skeleton className="h-[30px]" />,
    },
  },
  {
    id: 'IP Address',
    accessorFn: (row) => row.severity,
    header: ({ column }) => (
      <DataGridColumnHeader title="IP Address" column={column} />
    ),

    cell: ({ row }) => (
      <Badge variant={row.original?.severity?.variant} appearance="outline">
        <p title={row.original?.raw?.ip?.replace(/^::ffff:/, '') || 'N/A'} className="max-w-[140px] truncate">
          {row.original?.raw?.ip?.replace(/^::ffff:/, '') || 'N/A'}
        </p>
      </Badge>
    ),

    enableSorting: false,
    size: 100,
    meta: {
      cellClassName: '',
      skeleton: <Skeleton className="w-full h-[30px]" />,
    },
  },
  {
    id: 'timestamp',
    accessorFn: (row) => row.timestamp,
    header: ({ column }) => (
      <DataGridColumnHeader title="Time Ago" column={column} />
    ),

    cell: ({ row }) => (
      <span className="text-secondary-foreground font-normal">
        {timeAgo(row.original.createdAt)}
      </span>
    ),

    enableSorting: true,
    size: 50,
    meta: {
      cellClassName: '',
      skeleton: <Skeleton className="w-full h-[30px]" />,
    },
  },
];

const SecurityLog = () => {
  const location = useLocation();
  const email = location.state?.email;

  const pagination = useStore((state) => state.pagination);
  const setPagination = useStore((state) => state.setPagination);
  const searchQuery = useStore((state) => state.searchQuery);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);
  const sorting = useStore((state) => state.sorting);
  const setSorting = useStore((state) => state.setSorting);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [searchQuery, filters, setPagination]);

  const {
    data: activity,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetActivityQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: searchQuery,
    email,
    ...filters,
    ...(sorting?.length
      ? { sortBy: sorting[0]?.id, sort: sorting[0]?.desc ? 'desc' : 'asc' }
      : {}),
  });

  const columns = getColumns();

  if(isError) return <ApiErrorHandler error={error} />

  return (
    <Table
      data={activity?.activity}
      columns={columns}
      totalPages={Math.ceil(activity?.total / pagination.pageSize)}
      pagination={pagination}
      setPagination={setPagination}
      totalCount={activity?.total}
      search={searchQuery}
      setSearch={setSearchQuery}
      manualPagination={true}
      enableSorting={true}
      sorting={sorting}
      setSorting={setSorting}
      toolbar={
        <TableToolbarFilters
          filters={filters}
          setFilters={setFilters}
          supportedFilters={activity?.advanced_filters}
          isLoadingFilters={isLoading}
        />
      }
      isLoading={isLoading || isFetching}
      className="mt-1"
    />
  );
};

export { SecurityLog };
