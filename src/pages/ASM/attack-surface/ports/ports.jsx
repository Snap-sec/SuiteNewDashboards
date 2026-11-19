import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useGetAsmAssetsQuery } from '@/services/asm/attackSurfaceApi';
import { Badge } from '@/components/ui/badge';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridTableRowSelect, DataGridTableRowSelectAll } from '@/components/ui/data-grid-table';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyScreen } from '@/components/common/empty-screen';
import ApiErrorHandler from '@/components/common/api-error-handler';
import PageHeading from '@/components/custom/page-heading';

import { CustomTooltip } from '@/components/custom/tooltip';
import useDebounce from '../../../../hooks/use-debounce';
import Table from '../components/table/asset-table';
import CsvExportBtn from '../subdomains/components/csv-export-btn';
import TimelineModel from '../subdomains/components/modals/asset-timeline-model/timeline-model';
import Metrics from './components/metrics';
import useStore from './store';
import TableToolbarFilters from '../../../../components/common/table-toolbar-filters';


function getColumns() {


  const getPortStatusInfo = (status) => {
    switch (status) {
      case "open":
        return { variant: "success", label: "Open" };

      case "closed":
        return { variant: "destructive", label: "Closed" };

      case "filtered":
        return { variant: "warning", label: "Filtered" };

      case "unknown":
        return { variant: "secondary", label: "Unknown" };

      default:
        return { variant: "default", label: "Unknown" };
    }
  };


  return [
    {
      id: 'host',
      accessorFn: (row) => row.host,
      header: ({ column }) => (
        <DataGridColumnHeader title="Host" column={column} />
      ),

      cell: ({ row }) => (
        <Link
          to={`/casm/asset-details/${row.original.associatedAssetId}`}
          className="font-medium text-sm truncate max-w-[400px] hover:text-primary cursor-pointer transition-colors"
          title={row.original?.ip || row.original?.subdomain || ''}
        >
          {row.original?.ip || row.original?.subdomain || '-'}
          {row?.original?.isNew && <Badge className="ml-2" size="sm">New</Badge>}
        </Link>
      ),
      enableSorting: false,
      size: 200,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'port',
      accessorFn: (row) => row.port,
      header: ({ column }) => (
        <DataGridColumnHeader title="Port" column={column} />
      ),

      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          {row.original?.value || 'No Port'}
        </div>
      ),

      enableSorting: false,
      size: 100,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'version',
      accessorFn: (row) => row.sercvice,
      header: ({ column }) => (
        <DataGridColumnHeader title="Service Version" column={column} />
      ),

      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 w-full" title={row.original?.properties?.port_service_version}>
          <span className="truncate block w-full">
            {row.original?.properties?.port_service_version || 'Unknown Version'}
          </span>
        </div>
      ),

      enableSorting: false,
      size: 150,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'status',
      accessorFn: (row) => row.status,
      header: ({ column }) => (
        <DataGridColumnHeader title="Status" column={column} />
      ),

      cell: ({ row }) => (
        <Badge appearance="outline" variant="default">
          {getPortStatusInfo(row.original?.properties?.port_status).label}
        </Badge>
      ),

      enableSorting: false,
      size: 100,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },

    },
    {
      id: 'is_internal',
      accessorFn: (row) => row.is_internal,
      header: ({ column }) => (
        <DataGridColumnHeader title="Network Scope" column={column} />
      ),

      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          {row.original?.is_internal ?
            <Badge variant="success"
              appearance="outline">
              Internal
            </Badge>
            :
            <Badge variant="destructive"
              appearance="outline">
              External
            </Badge>
          }
        </div>
      ),

      enableSorting: false,
      size: 100,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
  ];
}

const Ports = () => {
  const pagination = useStore((state) => state.pagination);
  const searchQuery = useStore((state) => state.searchQuery);
  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);
  const setPagination = useStore((state) => state.setPagination);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const [sorting, setSorting] = useState([]);

  const debouncedSearch = useDebounce(searchQuery, 400)

  useEffect(() => {
    setPagination(() => ({ pageIndex: 0, pageSize: 25 }));
  }, [searchQuery, filters]);

  // Convert TanStack Table sorting to API format
  const getSortParams = () => {
    if (sorting.length === 0) return {};
    const sort = sorting[0];
    return {
      sortBy: sort.id,
      sortOrder: sort.desc ? 'desc' : 'asc',
    };
  };

  const {
    data: PortsData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetAsmAssetsQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: debouncedSearch,
    // unified_view: true,
    ...filters,
    ...getSortParams(),
    type: 'port',
  });
  const columns = getColumns();

  if (isError && !isLoading && !isFetching)
    return <ApiErrorHandler error={error} />;

  if (!isLoading && !isFetching && !PortsData?.total && !debouncedSearch && Object.keys(filters || {}).length === 0)
    return (
      <EmptyScreen
        title="No Ports Found"
        subTitle="When new ports are added, they will show here."
      />
    );

  return (
    <div className="p-4">
      <Helmet>
        <title>Xpose | Ports</title>
      </Helmet>

      <div className="w-full flex items-center justify-between">
        <PageHeading
          title="Ports"
          description="View and manage all ports across your organization’s attack surface."
        />
      </div>

      <div className="mb-4 mt-1">
        <Metrics
          metrics={PortsData?.stats}
          isLoading={isLoading}
        />
      </div>

      <Table
        data={PortsData?.data || []}
        columns={columns}
        isLoading={isLoading || isFetching}
        totalPages={Math.ceil(PortsData?.total / pagination.pageSize)}
        totalCount={PortsData?.total}
        pagination={pagination}
        setPagination={setPagination}
        search={searchQuery}
        setSearch={setSearchQuery}
        sorting={sorting}
        setSorting={setSorting}
        enableSorting={true}
        manualPagination={true}
        manualSorting={true}
        grid
        toolbar={
          <TableToolbarFilters
            filters={filters}
            setFilters={setFilters}
            supportedFilters={PortsData?.advanced_filters}
            isLoadingFilters={isLoading}
          />
        }
        toolbar_right={<CsvExportBtn type="port" />}
      />
    </div>
  );
};

export default Ports;