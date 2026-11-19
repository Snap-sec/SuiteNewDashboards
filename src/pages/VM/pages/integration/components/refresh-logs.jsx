import { useEffect, useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { Database } from 'lucide-react';
import { useGetVmAdapterLogsQuery } from '@/services/vm/adaptersApi';
import { Badge } from '@/components/ui/badge';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import Table from '@/components/custom/table';
import useDebounce from '@/hooks/use-debounce';
import GetAssetTypeInfo from '../../../../../components/custom/asset-icons';
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
  } = useGetVmAdapterLogsQuery({
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
        skeleton: <Skeleton className="h-6 w-full" />,
      },
    },
    {
      id: 'assetName',
      accessorFn: (row) => row.assetName,
      header: ({ column }) => (
        <DataGridColumnHeader title="Asset" column={column} />
      ),
      cell: ({ row }) => {
        const assetName = row.original.assetName || '-';
        return (
          <div
            className="text-sm truncate max-w-[150px]"
            title={assetName}
          >
            {assetName}
          </div>
        );
      },
      size: 150,
      enableSorting: false,
      meta: {
        skeleton: <Skeleton className="h-6 w-full" />,
      },
    },
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
        skeleton: <Skeleton className="h-6 w-full" />,
      },
    },
    {
      id: 'event',
      accessorFn: (row) => row.event,
      header: ({ column }) => (
        <DataGridColumnHeader title="Event" column={column} />
      ),
      cell: ({ row }) => {
        const event = row.original.event || 'Unknown';
        let variant = 'secondary';
        
        switch (event.toLowerCase()) {
          case 'delete':
          case 'uninstall':
            variant = 'destructive';
            break;
          case 'install':
          case 'create':
            variant = 'success';
            break;
          case 'refresh':
          case 'push':
            variant = 'info';
            break;
          default:
            variant = 'secondary';
        }

        return (
          <Badge variant={variant} appearance="outline" className="capitalize">
            {event}
          </Badge>
        );
      },
      size: 60,
      enableSorting: false,
      meta: {
        skeleton: <Skeleton className="h-6 w-full" />,
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
      size: 70,
      meta: {
        skeleton: <Skeleton className="h-6 w-full" />,
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
          <div className="text-sm truncate max-w-[250px]" title={log}>
            {log || '-'}
          </div>
        );
      },
      size: 250,
      enableSorting: false,
      meta: {
        skeleton: <Skeleton className="h-6 w-full" />,
      },
    },
    {
      id: 'records_synced',
      accessorFn: (row) => row.records_synced,
      header: ({ column }) => (
        <DataGridColumnHeader title="Records Synced" column={column} />
      ),
      cell: ({ row }) => (
        <span className="text-sm text-foreground flex items-center gap-1">
          {row.original.records_synced !== 0 && (
            <Database className="w-4 h-4" />
          )}{' '}
          {row?.original?.records_breakdown &&
          Object.keys(row?.original?.records_breakdown)?.length > 0 ? (
            <DetailedHoverPopover
              popoverTitle="Breakdown"
              buttonText={
                row.original.records_synced === 0
                  ? '-'
                  : (row.original.records_synced ?? '-')
              }
              popoverContent={Object.entries(
                row?.original?.records_breakdown || {},
              ).map(([key, value]) => (
                <Badge
                  key={key}
                  className="m-0.5 h-fit"
                  variant="default"
                  appearance="outline"
                >
                  {GetAssetTypeInfo(key)?.icon}
                  {key}: {value}
                </Badge>
              ))}
            />
          ) : row.original.records_synced === 0 ? (
            '-'
          ) : (
            (row.original.records_synced ?? '-')
          )}
        </span>
      ),
      size: 95,
      enableSorting: true,
      meta: {
        skeleton: <Skeleton className="h-6 w-full" />,
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
      size: 120,
      meta: {
        skeleton: <Skeleton className="h-6 w-full" />,
      },
    },
  ];

  if (isError) return <ApiErrorHandler error={error} />;  

  if(!isLoading && !logsData?.pagination?.total)
    return <EmptyScreen
    title="No Refresh Logs"
    subTitle="There are no refresh logs currently."
   />

  return (
    <div className="mt-4">
      <Table
        data={logsData?.logs || []}
        columns={columns}
        pagination={pagination}
        setPagination={setPagination}
        sorting={sorting}
        setSorting={setSorting}
        enableSorting={true}
        isLoading={isLoading || isFetching}
        manualPagination={true}
        totalCount={logsData?.pagination?.total}
        totalPages={Math.ceil(
          (logsData?.pagination?.total || 0) / pagination.pageSize,
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
