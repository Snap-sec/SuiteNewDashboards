import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useGetAsmAssetsQuery } from '@/services/asm/attackSurfaceApi';
import { Badge } from '@/components/ui/badge';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridTableRowSelect, DataGridTableRowSelectAll } from '@/components/ui/data-grid-table';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyScreen } from '@/components/common/empty-screen';
import PageHeading from '@/components/custom/page-heading';
import { CustomTooltip } from '@/components/custom/tooltip';
import ApiErrorHandler from '../../../../components/common/api-error-handler';
import TableToolbarFilters from '../../../../components/common/table-toolbar-filters';
import useDebounce from '../../../../hooks/use-debounce';
import Table from '../components/table/asset-table';
import CsvExportBtn from '../subdomains/components/csv-export-btn';
import TimelineModel from '../subdomains/components/modals/asset-timeline-model/timeline-model';
import Metrics from './components/metrics';
import useStore from './store';


function getColumns() {

  const getApiStatusInfo = (status) => {
    switch (status) {
      case 200:
      case 201:
        return { variant: "success", label: `${status}` };

      case 403:
      case 401:
        return { variant: "destructive", label: `${status}` };

      case 404:
        return { variant: "secondary", label: `${status}` };

      default:
        return { variant: "default", label: status ? `${status}` : 'Unknown' };
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
          to={`/casm/asset-details/${row.original._id}`}
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
        skeleton: <Skeleton className="h-7 w-[100px]" />,
      },
    },
    {
      id: 'endpoint',
      accessorFn: (row) => row.value,
      header: ({ column }) => (
        <DataGridColumnHeader title="Endpoint" column={column} />
      ),

      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 font-medium text-sm truncate max-w-[400px]" title={row.original?.value}>
          {row.original?.value || 'Unknown'}
        </div>
      ),

      enableSorting: false,
      size: 250,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7 w-[100px]" />,
      },
    },
    // {
    //   id: 'technique',
    //   accessorFn: (row) => row.properties?.api_technique,
    //   header: ({ column }) => (
    //     <DataGridColumnHeader title="Discovery Technique" column={column} />
    //   ),

    //   cell: ({ row }) => (
    //     <div className="flex items-center gap-1.5 w-full" title={row.original?.properties?.api_technique}>
    //       <span className="truncate block w-full text-xs">
    //         {row.original?.properties?.api_technique || '-'}
    //       </span>
    //     </div>
    //   ),

    //   enableSorting: false,
    //   size: 200,
    //   meta: {
    //     cellClassName: '',
    //     skeleton: <Skeleton className="h-7 w-[100px]" />,
    //   },
    // },
    {
      id: 'status',
      accessorFn: (row) => row.properties?.api_status_code,
      header: ({ column }) => (
        <DataGridColumnHeader title="Status Code" column={column} />
      ),

      cell: ({ row }) => (
        <Badge appearance="outline" variant={getApiStatusInfo(row.original?.properties?.api_status_code).variant}>
          {getApiStatusInfo(row.original?.properties?.api_status_code).label}
        </Badge>
      ),

      enableSorting: false,
      size: 150,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7 w-[100px]" />,
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
        skeleton: <Skeleton className="h-7 w-[100px]" />,
      },
    },
  ];
}

const Apis = () => {
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
    data: ApisData,
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
    type: 'api',
  });
  const columns = getColumns();

  if (isError && !isLoading && !isFetching)
    return <ApiErrorHandler error={error} />;

  if (!isLoading && !isFetching && !ApisData?.total && !debouncedSearch && Object.keys(filters || {}).length === 0)
    return (
      <EmptyScreen
        title="No APIs Found"
        subTitle="When new APIs are discovered, they will show here."
      />
    );

  return (
    <div className="p-4">
      <Helmet>
        <title>Xpose | APIs</title>
      </Helmet>

      <div className="w-full flex items-center justify-between pr-2">
        <PageHeading
          title="APIs"
          description="View and manage all APIs across your organization’s attack surface."
        />
      </div>

      {/* <div className="mb-4 mt-1">
        <Metrics
          metrics={ApisData?.stats}
          isLoading={isLoading || isFetching}
        />
      </div> */}

      <Table
        data={ApisData?.data || []}
        columns={columns}
        isLoading={isLoading || isFetching}
        totalPages={Math.ceil(ApisData?.total / pagination.pageSize)}
        totalCount={ApisData?.total}
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
            supportedFilters={ApisData?.advanced_filters}
            isLoadingFilters={isLoading}
          />
        }
        toolbar_right={<CsvExportBtn type="api" />}
        className="mt-1"
      />
    </div>
  );
};

export default Apis;