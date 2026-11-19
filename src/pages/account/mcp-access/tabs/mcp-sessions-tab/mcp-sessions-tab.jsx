import { useEffect, useMemo } from 'react';
import { Monitor, ShieldAlert, Terminal } from 'lucide-react';
import { Helmet } from 'react-helmet';
import useDebounce from '@/hooks/use-debounce';
import { useGetMcpSessionsQuery } from '@/services/mcps/mcpApi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyScreen } from '@/components/common/empty-screen';
import TableToolbarFilters from '@/components/common/table-toolbar-filters';
import { DateFormatter } from '@/components/custom/date-formatter';
import { StatusBadge } from '@/components/custom/status-badge';
import Table from '@/components/custom/table';
import { Profile } from '../../../../../components/custom/profile';
import useStore from './store';
import ApiErrorHandler from '../../../../../components/common/api-error-handler';

function getColumns() {
  return [
    {
      id: 'ideTool',
      accessorFn: (row) => row.ideTool,
      header: ({ column }) => (
        <DataGridColumnHeader title="IDE / Tool" column={column} />
      ),
      cell: ({ row }) => (
        <div className=" flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs text-foreground">
              {row.original.ideTool || 'Unknown'}
            </span>
          </div>

          <span className="font-mono text-xs text-muted-foreground truncate max-w-[220px] block">
            {row.original.sessionId}
          </span>
        </div>
      ),
      enableSorting: false,
      size: 240,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-5" />,
      },
    },

    {
      id: 'device',
      accessorFn: (row) => row.device,
      header: ({ column }) => (
        <DataGridColumnHeader title="Device" column={column} />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary/10 rounded-md">
            <Monitor className="size-3.5 text-primary" />
          </div>
          <span className="text-xs font-medium text-foreground capitalize">
            {row.original.device || 'Unknown'}
          </span>
        </div>
      ),
      enableSorting: false,
      size: 120,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-5" />,
      },
    },

    {
      id: 'user',
      accessorFn: (row) => row.user,
      header: ({ column }) => (
        <DataGridColumnHeader title="User" column={column} />
      ),
      cell: ({ row }) => (
        <Profile
          userId={row.original.userId}
          email={row.original.user?.email}
          name={row.original.user?.name}
          size="25px"
        />
      ),
      enableSorting: false,
      size: 200,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-5" />,
      },
    },

    {
      id: 'status',
      accessorFn: (row) => row.status,
      header: ({ column }) => (
        <DataGridColumnHeader title="Status" column={column} />
      ),
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
      enableSorting: false,
      size: 80,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-5" />,
      },
    },
    {
      id: 'requestedVulns',
      accessorFn: (row) => row.requestedVulns?.length || 0,
      header: ({ column }) => (
        <DataGridColumnHeader title="Vuln Requests" column={column} />
      ),
      cell: ({ row }) => {
        const count = row.original.requestedVulns?.length || 0;
        return (
          <Badge
            variant="outline"
            className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium ${
              count > 0
                ? 'bg-primary/10 text-primary border-primary/20'
                : 'bg-muted text-muted-foreground border-border'
            }`}
          >
            {count}
          </Badge>
        );
      },
      enableSorting: true,
      size: 80,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-5" />,
      },
    },

    {
      id: 'createdAt',
      accessorFn: (row) => row.createdAt,
      header: ({ column }) => (
        <DataGridColumnHeader title="Created At" column={column} />
      ),
      cell: ({ row }) => <DateFormatter date={row.original.createdAt} />,
      enableSorting: true,
      size: 45,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-5" />,
      },
    },
  ];
}

function SessionsList({ data, isLoading, isFetching, isError, error }) {
  const pagination = useStore((state) => state.pagination);
  const searchQuery = useStore((state) => state.searchQuery);
  const sorting = useStore((state) => state.sorting);
  const setPagination = useStore((state) => state.setPagination);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const setSorting = useStore((state) => state.setSorting);
  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);

  const columns = getColumns();

  const transformedFilters = useMemo(() => {
    if (!data?.advancedFilters) return [];

    const f = [];
    if (data.advancedFilters.users) {
      f.push({
        key: 'users',
        name: 'Users',
        filters: [
          { label: 'Unassigned', value: 'unassigned' },
          ...data.advancedFilters.users.map((u) => ({
            label: u.name || u.email || u.id,
            value: u.id,
          })),
        ],
      });
    }
    return f;
  }, [data?.advancedFilters]);

  if(isError) return <ApiErrorHandler error={error} />

  return (
    <Table
      data={data?.sessions}
      columns={columns}
      enableSorting={true}
      searchPlaceholder="Search sessions..."
      isLoading={isLoading || isFetching}
      totalPages={Math.ceil(data?.total / pagination.pageSize) || 1}
      totalCount={data?.total}
      pagination={pagination}
      setPagination={setPagination}
      sorting={sorting}
      setSorting={setSorting}
      search={searchQuery}
      setSearch={setSearchQuery}
      toolbar={
        <TableToolbarFilters
          filters={filters}
          setFilters={setFilters}
          supportedFilters={transformedFilters}
          isLoadingFilters={isLoading}
        />
      }
    />
  );
}

export function McpSessionsTab({ onSwitchToSetup }) {
  const pagination = useStore((state) => state.pagination);
  const setPagination = useStore((state) => state.setPagination);
  const searchQuery = useStore((state) => state.searchQuery);
  const sorting = useStore((state) => state.sorting);
  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);

  const debouncedSearch = useDebounce(searchQuery, 500);

  useEffect(() => {
    setPagination(() => ({ pageIndex: 0, pageSize: pagination.pageSize }));
  }, [searchQuery, filters]);

  const { data, isLoading, isFetching, isError, error } = useGetMcpSessionsQuery({
    search: debouncedSearch,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    users: filters.users,
    ...(sorting?.length && sorting[0]
      ? { sortBy: sorting[0]?.id, sortAs: sorting[0]?.desc ? 'desc' : 'asc' }
      : {}),
  });

  if (
    !isError &&
    !isLoading &&
    !data?.data?.total &&
    Object.keys(filters).length === 0 &&
    !debouncedSearch
  ) {
    return (
      <div className="flex flex-col gap-5 lg:gap-7.5">
        <Helmet>
          <title>Auth | MCP Sessions</title>
        </Helmet>
        <EmptyScreen
          title="No MCP Sessions Found"
          subTitle="There are no active MCP sessions. Connect an IDE or CLI agent to get started."
          engage={
            <Button
              size="sm"
              onClick={onSwitchToSetup}
              className="cursor-pointer"
            >
              View Setup Instructions
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 lg:gap-7.5 pb-2">
      <Helmet>
        <title>Auth | MCP Sessions</title>
      </Helmet>

      <SessionsList data={data?.data} isLoading={isLoading} isFetching={isFetching} isError={isError} error={error} />
    </div>
  );
}
