import React, { useMemo, useState } from 'react';
import Table from '@/components/custom/table';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DateFormatter } from '@/components/custom/date-formatter';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyScreen } from '@/components/common/empty-screen';
import { Info, AlertTriangle, XCircle } from 'lucide-react';

function getLogColumns() {
  return [
    {
      id: 'type',
      accessorFn: (row) => row.type,
      header: ({ column }) => (
        <DataGridColumnHeader title="Type" column={column} />
      ),
      cell: ({ row }) => {
        const type = (row.original.type || 'info').toLowerCase();
        let variant = 'outline';

        if (type === 'error') {
          variant = 'destructive';
        } else if (type === 'warn' || type === 'warning') {
          variant = 'warning';
        }

        return (
          <Badge variant={variant} appearance="outline" className="gap-1.5 capitalize">
            {type}
          </Badge>
        );
      },
      enableSorting: true,
      size: 100,
      meta: {
        skeleton: <Skeleton className="h-7 w-full" />,
      },
    },
    {
      id: 'message',
      accessorFn: (row) => row.message,
      header: ({ column }) => (
        <DataGridColumnHeader title="Message" column={column} />
      ),
      cell: ({ row }) => {
        const msg = row.original.message || '-';
        return (
          <div
            title={typeof msg === 'string' ? msg : JSON.stringify(msg)}
            className="text-foreground"
          >
            {msg}
          </div>
        );
      },
      enableSorting: false,
      size: 500,
      meta: {
        skeleton: <Skeleton className="h-7 w-full" />,
      },
    },
    {
      id: 'timestamp',
      accessorFn: (row) => row.timestamp,
      header: ({ column }) => (
        <DataGridColumnHeader title="Timestamp" column={column} />
      ),
      cell: ({ row }) => {
        const dateVal = row.original.timestamp;
        return (
          <div className="text-muted-foreground">
            {dateVal ? <DateFormatter date={dateVal} /> : '-'}
          </div>
        );
      },
      enableSorting: true,
      size: 160,
      meta: {
        skeleton: <Skeleton className="h-7 w-full" />,
      },
    }
  ];
}

export function RunLogsTable({ runInfo, isLoading, isFetching }) {
  const [logPagination, setLogPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [logSearch, setLogSearch] = useState('');

  const logs = useMemo(() => {
    let allLogs = Array.isArray(runInfo?.logs) ? runInfo.logs : [];

    if (logSearch) {
      allLogs = allLogs.filter((log) =>
        (log.message || '').toLowerCase().includes(logSearch.toLowerCase()) ||
        (log.type || '').toLowerCase().includes(logSearch.toLowerCase())
      );
    }

    return allLogs;
  }, [runInfo, logSearch]);

  const logColumns = useMemo(() => getLogColumns(), []);

  const paginatedLogs = useMemo(() => {
    const start = logPagination.pageIndex * logPagination.pageSize;
    const end = start + logPagination.pageSize;
    return logs.slice(start, end);
  }, [logs, logPagination.pageIndex, logPagination.pageSize]);
  
  const totalLogCount = logs.length;
  const totalLogPages = Math.ceil(totalLogCount / logPagination.pageSize) || 1;

  return (
    <div className="mt-4 flex flex-col gap-2">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Run Logs</h3>
        <p className="text-xs text-muted-foreground">View detailed execution logs for this workflow run.</p>
      </div>
      
      {logs.length === 0 && !logSearch ? (
        <EmptyScreen
          title="No logs found"
          subTitle="This workflow run hasn't generated any logs yet."
        />
      ) : (
        <div className="border border-border rounded-xl bg-card overflow-hidden">
          <Table
            data={paginatedLogs}
            columns={logColumns}
            isLoading={isLoading || isFetching}
            search={logSearch}
            setSearch={setLogSearch}
            searchPlaceholder="Search logs..."
            pagination={logPagination}
            setPagination={setLogPagination}
            totalCount={totalLogCount}
            totalPages={totalLogPages}
            showPagination={true}
            manualPagination={true}
            cardHeading={false}
            searchWidth="64"
          />
        </div>
      )}
    </div>
  );
}
