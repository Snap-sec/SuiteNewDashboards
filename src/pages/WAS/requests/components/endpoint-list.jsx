import { useEffect, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import FullRequest from '@/components/custom/full-request';
import { MethodBadge } from '@/components/custom/method-badge';
import Table from '@/components/custom/table';
import { VulnerabilityLables } from '@/components/custom/vulnerability-labels';
import TableToolbarFilters from '../../../../components/common/table-toolbar-filters';
import useStore from '../store';

function getColumns() {
  return [

    {
      id: 'url',
      header: ({ column }) => (
        <DataGridColumnHeader title="URL" column={column} />
      ),
      accessorFn: (row) => row.url,
      cell: ({ row }) => (
        <FullRequest
          raw={row?.original?.rawHttp}
          showGenerateThreatButton={false}
          triggerBtn={
            <p
              className="truncate cursor-pointer font-medium hover:text-primary block "
              title={row.original.url}
            >
              {row.original.url}
            </p>
          }
        />
      ),
      enableSorting: false,
      size: 300,
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
      cell: ({ row }) => <MethodBadge method={row.original.method} />,
      enableSorting: false,
      size: 80,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },


    {
      id: 'Application',
      header: ({ column }) => (
        <DataGridColumnHeader title="Application" column={column} />
      ),
      accessorFn: (row) => row.collection,
      cell: ({ row }) => <Badge>{row.original.projects[0]?.name || "Unknown"}</Badge>,
      enableSorting: false,
      size: 120,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },

    {
      id: 'vulnCounts.total',
      header: ({ column }) => (
        <DataGridColumnHeader title="Total Vulns" column={column} />
      ),
      accessorFn: (row) => row.totalVulns,
      cell: ({ row }) => {
        const vulnCounts = row?.original?.vulnCounts || {};
        const items = [
          { label: 'C', number: vulnCounts.critical || 0 },
          { label: 'H', number: vulnCounts.high || 0 },
          { label: 'M', number: vulnCounts.medium || 0 },
          { label: 'L', number: vulnCounts.low || 0 },
          { label: 'I', number: vulnCounts.info || 0 },
        ].filter((item) => item.number > 0);

        return (
          <div className="flex items-center min-h-8">
            {items.length > 0 ? (
              <VulnerabilityLables items={items} />
            ) : (
              <span className="text-muted-foreground ml-2">No Vulnerabilities Found</span>
            )}
          </div>
        );
      },
      enableSorting: true,
      size: 190,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },

  ];
}

function EndpointsList({ data, isLoading, isFetching }) {
  // Combine all endpoints from all versions
  // const allEndpoints = useMemo(() => data?.flatMap(group => group.endpoints) || [], [data]);

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
      grid
      data={data?.data}
      isLoading={isLoading || isFetching}
      columns={columns}
      enableSorting={true}
      pagination={pagination}
      totalPages={data?.meta?.totalPages}
      totalCount={data?.meta?.totalItems}
      setPagination={setPagination}
      sorting={sorting}
      setSorting={setSorting}
      // manualPagination={true}
      enableSearch={true}
      // onSearchChange={setSearchQuery}
      search={search}
      setSearch={setSearchQuery}
      toolbar={
        <TableToolbarFilters
          supportedFilters={data?.advanced_filters}
          setFilters={setFilters}
          filters={filters}
          isLoadingFilters={isLoading}
        />
      }
    />
  );
}

export default EndpointsList;