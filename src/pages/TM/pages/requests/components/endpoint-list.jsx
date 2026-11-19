import { useEffect, useMemo } from 'react';
import { Link } from 'react-router';
import { Badge } from '@/components/ui/badge';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import {
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from '@/components/ui/data-grid-table';
import { Skeleton } from '@/components/ui/skeleton';
import Table from '@/components/custom/table';
import { VulnerabilityLables } from '@/components/custom/vulnerability-labels';
import FullRequest from '@/components/custom/full-request';
import useStore from '../store';
import TableToolbar from './table-toolbar';

function getColumns() {
  return [
    {
      id: 'name',
      header: ({ column }) => <DataGridColumnHeader title="Name" column={column} />,
      accessorFn: row => row.name,
      cell: ({ row }) => 
      <p className="truncate block max-w-[180px] font-medium" title={row.original.name}>
        {row.original.name}
     </p>,

      size: 200,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'method',
      header: ({ column }) => (
        <DataGridColumnHeader title="Method" column={column} />
      ),
      accessorFn: (row) => row.method,
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.method === 'GET'
              ? 'primary'
              : row.original.method === 'POST'
                ? 'success'
                : row.original.method === 'PUT'
                  ? 'warning'
                  : row.original.method === 'PATCH'
                    ? 'secondary'
                    : row.original.method === 'DELETE'
                      ? 'destructive'
                      : ' '
          }
          appearance="outline"
        >
          {row.original.method}
        </Badge>
      ),
      size: 80,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'url',
      header: ({ column }) => (
        <DataGridColumnHeader title="URL" column={column} />
      ),
      accessorFn: (row) => row.url,
      cell: ({ row }) => (
        <FullRequest
          raw={row?.original?.raw_request}
          showGenerateThreatButton={false}
          triggerBtn={
            <p
              className="truncate cursor-pointer hover:text-primary block max-w-[260px]"
              title={row.original.url}
            >
              {row.original.url}
            </p>
          }
        />
      ),
      size: 300,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'collectionName',
      header: ({ column }) => (
        <DataGridColumnHeader title="Collection Name" column={column} />
      ),
      accessorFn: (row) => row.collection?.name,
      cell: ({ row }) => (
        <p
          className="truncate block max-w-[180px] font-medium"
          title={row.original.collection?.name}
        >
          {row.original.collection?.name}
        </p>
      ),
      size: 200,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'threats',
      header: ({ column }) => (
          <DataGridColumnHeader title="Threats" column={column} />
      ),
      accessorFn: (row) => Object.values(row.severity || {}).reduce((a, b) => a + b, 0),
      cell: ({ row }) => {
        const severityCounts = row.original.severity;
          return (
            <p>
              <VulnerabilityLables
                items={[
                  { label: 'C', number: severityCounts?.critical || 0 },
                  { label: 'H', number: severityCounts?.high || 0 },
                  { label: 'M', number: severityCounts?.medium || 0 },
                  { label: 'L', number: severityCounts?.low || 0 },
                ]}
              />
            </p>
          );
      },
      size: 190,
      meta: {
          cellClassName: '',
          skeleton: <Skeleton className="h-7" />,
      },
  }
  ];
}

function EndpointsList({ data, isLoading, isFetching }) {
  const columns = useMemo(() => getColumns(), []);
  const pagination = useStore((state) => state.pagination);
  const setPagination = useStore((state) => state.setPagination);
  const sorting = useStore((state) => state.sorting);
  const setSorting = useStore((state) => state.setSorting);
  const search = useStore((state) => state.searchQuery);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);

  // Reset to first page when filters or search changes
  useEffect(() => {
    setPagination(() => ({ ...pagination, pageIndex: 0 }));
  }, [filters, search]);

  return (
    <Table
      data={data?.endpoints}
      isLoading={isLoading || isFetching}
      columns={columns}
      searchPlaceholder = {"Search Requests..."}
      pagination={pagination}
      totalPages={data?.total ? Math.ceil(data.total / pagination.pageSize) : 0}
      totalCount={data?.total}
      setPagination={setPagination}
      sorting={sorting}
      setSorting={setSorting}
      enableSearch={true}
      search={search}
      setSearch={setSearchQuery}
      toolbar={
        <TableToolbar
          setFilters={setFilters}
          supportedFilters={data?.filters}
        />
      }
    />
  );
}

export default EndpointsList;
