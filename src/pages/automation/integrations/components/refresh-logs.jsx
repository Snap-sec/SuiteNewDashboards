import { useEffect, useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { Database } from 'lucide-react';
import useDebounce from '@/hooks/use-debounce';
import { useGetAutomationAdapterLogsQuery } from '@/services/automation/adaptersApi';
import { Badge } from '@/components/ui/badge';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import ApiErrorHandler from '@/components/common/api-error-handler';
import { EmptyScreen } from '@/components/common/empty-screen';
import GetAssetTypeInfo from '@/components/custom/asset-icons';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import Table from '@/components/custom/table';
import ModelIcon from './model-icon';


function RefreshLogs() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });
  const [sorting, setSorting] = useState([{ id: 'createdAt', desc: true }]);
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
  } = useGetAutomationAdapterLogsQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: debouncedSearch || undefined,
    sort: sorting[0]?.id || 'createdAt',
    sortOrder: sorting[0] ? (sorting[0]?.desc ? 'desc' : 'asc') : 'desc',
  });

  const columns = [
    {
      id: 'type',
      accessorFn: (row) => row.type,
      header: ({ column }) => (
        <DataGridColumnHeader title="Adapter" column={column} />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <ModelIcon type={row.original.type} />
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium text-foreground capitalize truncate">
              {row.original.type || '-'}
            </span>
            {row.original.user_provided_name && (
              <span className="text-xs text-muted-foreground truncate">
                {row.original.user_provided_name}
              </span>
            )}
          </div>
        </div>
      ),
      size: 180,
      enableSorting: false,
      meta: {
        skeleton: <Skeleton className="h-6 w-full" />,
      },
    },

    {
      id: 'model',
      accessorFn: (row) => row.model,
      header: ({ column }) => (
        <DataGridColumnHeader title="Model Name" column={column} />
      ),
      cell: ({ row }) => {
        const model = row.original.model

        return model ? (
          <Badge
            title={model}
            variant="secondary"
            appearance="outline"
            size="sm"
            className="font-mono text-xs max-w-[120px] sm:max-w-[160px] md:max-w-[200px]"
          >
            <span className="truncate">{model}</span>
          </Badge>
        ) : (
          '-'
        );
      },
      size: 100,
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
      size: 80,
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
      size: 80,
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
        const log = row.original.log || '-';
        return (
          <div
            className="text-sm text-muted-foreground truncate max-w-[300px]"
            title={log}
          >
            {log}
          </div>
        );
      },
      size: 300,
      enableSorting: false,
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
      size: 130,
      meta: {
        skeleton: <Skeleton className="h-6 w-full" />,
      },
    },
  ];

  if (isError) return <ApiErrorHandler error={error} />;

  if (!isLoading && !logsData?.meta?.total && !debouncedSearch)
    return (
      <EmptyScreen
        title="No Refresh Logs"
        subTitle="There are no refresh logs currently."
      />
    );

  return (
    <div className="mt-4">
      <Table
        data={logsData?.data || []}
        columns={columns}
        pagination={pagination}
        setPagination={setPagination}
        sorting={sorting}
        setSorting={setSorting}
        enableSorting={true}
        isLoading={isLoading || isFetching}
        manualPagination={true}
        totalCount={logsData?.meta?.total}
        totalPages={logsData?.meta?.totalPages}
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