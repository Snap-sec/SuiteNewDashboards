import { useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { Database } from 'lucide-react';
import { useGetAimAdapterLogsQuery } from '@/services/asset-inventory/adaptersApi';
import { Badge } from '@/components/ui/badge';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import Table from '@/components/custom/table';
import ApiErrorHandler from '../../../../../components/common/api-error-handler';
import GetAssetTypeInfo from '../../../../../components/custom/asset-icons';

function RefreshLogs() {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });
  const [sorting, setSorting] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data: logsData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetAimAdapterLogsQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    sort: sorting[0]?.id,
    sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
    search: searchQuery, // Search not supported by backend yet, but good to have prepared
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
              src={row.original.logo}
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
          <div className="text-sm truncate max-w-[250px]" title={log}>
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
      id: 'records_synced',
      accessorFn: (row) => row.records_synced,
      header: ({ column }) => (
        <DataGridColumnHeader title="Records Synced" column={column} />
      ),
      cell: ({ row }) => (
        <span className="text-sm text-foreground flex items-center gap-1">
          <Database className="w-4 h-4" />{' '}
          {row?.original?.records_breakdown &&
          Object.keys(row?.original?.records_breakdown)?.length > 0 ? (
            <DetailedHoverPopover
              popoverTitle="Ports"
              buttonText={row.original.records_synced ?? '-'}
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
          ) : (
            row.original.records_synced
          )}
        </span>
      ),
      size: 75,
      enableSorting: true,
      meta: {
        skeleton: <Skeleton className="h-6" />,
      },
    },
    // {
    //     id: 'duration',
    //     accessorFn: (row) => row.duration,
    //     header: ({ column }) => (
    //         <DataGridColumnHeader title="Duration" column={column} />
    //     ),
    //     cell: ({ row }) => {
    //         const durationMs = row.original.duration;
    //         if (!durationMs) return <span className="text-sm text-muted-foreground">-</span>;

    //         let formatted = '';
    //         if (durationMs < 1000) {
    //             formatted = `${durationMs}ms`;
    //         } else {
    //             const seconds = Math.floor(durationMs / 1000);
    //             if (seconds < 60) {
    //                 formatted = `${seconds}s`;
    //             } else {
    //                 const minutes = Math.floor(seconds / 60);
    //                 const remainingSeconds = seconds % 60;
    //                 formatted = `${minutes}m ${remainingSeconds}s`;
    //             }
    //         }

    //         return <span className="text-sm text-foreground">{formatted}</span>;
    //     },
    //     size: 100,
    //     meta: {
    //         skeleton: <Skeleton className="h-6" />,
    //     },
    // },
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
      size: 75,
      meta: {
        skeleton: <Skeleton className="h-6" />,
      },
    },
  ];

  if (isError) return <ApiErrorHandler error={error} />;

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
          logsData?.pagination?.total / pagination.pageSize,
        )}
        enableSearch={false}
        cardHeading={false}
        search={searchQuery}
        setSearch={setSearchQuery}
      />
    </div>
  );
}

export default RefreshLogs;
