import { useEffect, useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { Database } from 'lucide-react';
import useDebounce from '@/hooks/use-debounce';
import { useGetCsmAdapterLogsQuery } from '@/services/csm/adaptersApi';
import { Badge } from '@/components/ui/badge';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import GetAssetTypeInfo from '@/components/custom/asset-icons';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import Table from '@/components/custom/table';
import ApiErrorHandler from '../../../../../components/common/api-error-handler';
import { EmptyScreen } from '../../../../../components/common/empty-screen';

function RefreshLogs() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });
  const [sorting, setSorting] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const debouncedSearch = useDebounce(searchQuery, 400);

  useEffect(() => {
    if (pagination?.pageIndex !== 0) {
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }
  }, [searchQuery]);

  const {
    data: logsData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetCsmAdapterLogsQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: debouncedSearch || undefined,
    sort: sorting[0]?.id,
    sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
  });

  const columns = [
    {
      id: 'type',
      accessorFn: (row) => row.type,
      header: ({ column }) => (
        <DataGridColumnHeader title="Adapter" column={column} />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.logo ? (
            <img
              src={row.original.logo.toLowerCase()}
              alt={row.original.title}
              className="w-6 h-6 rounded-sm"
            />
          ) : (
            <div className="w-6 h-6 bg-secondary rounded-sm flex items-center justify-center text-[10px] font-bold">
              {row.original.title?.charAt(0) || '?'}
            </div>
          )}
          <span className="text-sm text-foreground">{row.original.title}</span>
        </div>
      ),
      size: 150,
      enableSorting: false,
      meta: {
        skeleton: <Skeleton className="h-6" />,
      },
    },
    // {
    //   id: 'assetName',
    //   accessorFn: (row) => row.assetName,
    //   header: ({ column }) => (
    //     <DataGridColumnHeader title="Asset" column={column} />
    //   ),
    //   cell: ({ row }) => {
    //     const assetName = row.original.assetName || '-';
    //     return (
    //       <div
    //         className="text-sm truncate max-w-[150px]"
    //         title={assetName}
    //       >
    //         {assetName}
    //       </div>
    //     );
    //   },
    //   size: 150,
    //   enableSorting: false,
    //   meta: {
    //     skeleton: <Skeleton className="h-6 w-[120px]" />,
    //   },
    // },
    {
      id: 'integrationName',
      accessorFn: (row) => row.integrationName,
      header: ({ column }) => (
        <DataGridColumnHeader title="Integration Name" column={column} />
      ),
      cell: ({ row }) => {
        const integrationName = row.original.integrationName || '-';
        return (
          <div
            className="text-sm truncate max-w-[150px]"
            title={integrationName}
          >
            {integrationName}
          </div>
        );
      },
      size: 150,
      enableSorting: false,
      meta: {
        skeleton: <Skeleton className="h-6" />,
      },
    },
    {
      id: 'event',
      accessorFn: (row) => row.event,
      header: ({ column }) => (
        <DataGridColumnHeader title="Event" column={column} />
      ),
      cell: ({ row }) => (
        <Badge className="capitalize">{row.original.event || 'Unknown'}</Badge>
      ),
      size: 100,
      enableSorting: false,
      meta: {
        skeleton: <Skeleton className="h-6" />,
      },
    },
    {
      id: 'status',
      header: ({ column }) => (
        <DataGridColumnHeader title="Status" column={column} />
      ),
      cell: ({ row }) => {
        const status = row.original.status || 'info';
        let variant = 'secondary';
        let label = status.charAt(0).toUpperCase() + status.slice(1);

        if (status === 'success') {
          variant = 'success';
        } else if (status === 'failed' || status === 'error') {
          variant = 'destructive';
          label = 'Failed';
        } else if (status === 'in-progress' || status === 'pending') {
          variant = 'info';
          label = 'In Progress';
        }

        return (
          <Badge variant={variant} appearance="outline">
            {label}
          </Badge>
        );
      },
      size: 120,
      meta: {
        skeleton: <Skeleton className="h-6" />,
      },
    },
    {
      id: 'log',
      accessorFn: (row) => row.log,
      header: ({ column }) => (
        <DataGridColumnHeader title="Log Message" column={column} />
      ),
      cell: ({ row }) => {
        const log = row.original.log || '';
        return (
          <div className="text-sm truncate" title={log}>
            {log || '-'}
          </div>
        );
      },
      size: 250,
      enableSorting: false,
      meta: {
        skeleton: <Skeleton className="h-6" />,
      },
    },
    {
      id: 'createdAt',
      accessorFn: (row) => row.createdAt,
      header: ({ column }) => (
        <DataGridColumnHeader title="Date & Time" column={column} />
      ),
      cell: ({ row }) => {
        if (!row.original.createdAt) return '-';
        const date = new Date(row.original.createdAt);
        return (
          <div className="text-sm" title={format(date, 'PP pp')}>
            {formatDistanceToNow(date, { addSuffix: true })}
          </div>
        );
      },
      size: 100,
      meta: {
        skeleton: <Skeleton className="h-6" />,
      },
    },
  ];

  if(isError) return <ApiErrorHandler error={error} />

  if(!isError && !isLoading & !isFetching && logsData?.data?.logs?.length === 0 && debouncedSearch === ''){
    return <EmptyScreen title="No Refresh Logs Found" subTitle="We couldn't find any refresh logs." />
  }

  return (
    <div className="mt-4">
      <Table
        data={logsData?.data?.logs || []}
        columns={columns}
        pagination={pagination}
        setPagination={setPagination}
        sorting={sorting}
        setSorting={setSorting}
        enableSorting={true}
        isLoading={isLoading || isFetching}
        manualPagination={true}
        totalCount={logsData?.data?.pagination?.total}
        totalPages={Math.ceil(
          (logsData?.data?.pagination?.total || 0) / pagination.pageSize,
        )}
        enableSearch={true}
        searchPlaceholder="Search logs..."
        search={searchQuery}
        setSearch={setSearchQuery}
        cardHeading={true}
      />
    </div>
  );
}

export default RefreshLogs;
