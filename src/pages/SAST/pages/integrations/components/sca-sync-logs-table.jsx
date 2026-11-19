import React, { useMemo } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { Database } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import Table from '@/components/custom/table';
import GetAssetTypeInfo from '@/components/custom/asset-icons';
import { useIntegration } from '../context/integration-context';
import { EmptyScreen } from '../../../../../components/common/empty-screen';
import ApiErrorHandler from '../../../../../components/common/api-error-handler';

function getColumns() {
  return [
    {
      id: 'type',
      accessorFn: (row) => row.type,
      header: ({ column }) => (
        <DataGridColumnHeader title="Adapter" column={column} />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <img
            src={`/new-adapter-logos/${(row.original.type || '').toLowerCase()}.svg`}
            alt={row.original.type || row.original.integrationName}
            className="w-5 h-5 object-contain rounded-sm shrink-0"
            onError={(e) => {
              e.currentTarget.src = '/new-adapter-logos/defaultlogo.webp';
            }}
          />
          <span className="text-sm text-foreground">{row.original.title || row.original.integrationName || row.original.type}</span>
        </div>
      ),
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
      cell: ({ row }) => (
        <Badge className="capitalize">{row.original.event || 'Unknown'}</Badge>
      ),
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
      size: 80,
      meta: {
        skeleton: <Skeleton className="h-6 w-full" />,
      },
    },
  ];
}

export function ScaSyncLogsTable({ syncLogs: propsSyncLogs, isLoading: propsIsLoading }) {
  const context = useIntegration() || {};
  const syncLogs = propsSyncLogs ?? context.syncLogs ?? [];
  const isLoading = propsIsLoading ?? context.isLogsLoading;
  const isError = context.isError;
  const error = context.error;

  const columns = useMemo(() => getColumns(), []);

  if (!isError && !isLoading && syncLogs.length === 0) {
    return (
      <EmptyScreen
        title="No Sync Logs Found"
        subTitle="There are currently no sync logs available."
        darkImgUrl="/media/illustrations/19-dark.svg"
        lightImgUrl="/media/illustrations/19.svg"
        engage={null}
        showTitle={false}
      />
    );
  }

  if (isError && !isLoading) return <ApiErrorHandler error={error} />


  return (
    <Table
      data={syncLogs}
      columns={columns}
      isLoading={isLoading}
      manualPagination={false}
      enableSorting={false}
    />
  );
}
