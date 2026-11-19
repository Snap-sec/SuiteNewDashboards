import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useGetAsmAssetsQuery } from '@/services/asm/attackSurfaceApi';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyScreen } from '@/components/common/empty-screen';
import ApiErrorHandler from '@/components/common/api-error-handler';
import PageHeading from '@/components/custom/page-heading';

import { CustomTooltip } from '@/components/custom/tooltip';
import TableToolbarFilters from '../../../../components/common/table-toolbar-filters';
import { Badge } from '../../../../components/ui/badge';
import useDebounce from '../../../../hooks/use-debounce';
import Table from '../components/table/asset-table';
import CsvExportBtn from '../subdomains/components/csv-export-btn';
import TimelineModel from '../subdomains/components/modals/asset-timeline-model/timeline-model';
import Metrics from './components/metrics';
import useStore from './store';


function getColumns() {
  return [
    // {
    //   accessorKey: '_id',
    //   accessorFn: (row) => row._id,
    //   header: () => <DataGridTableRowSelectAll />,
    //   cell: ({ row }) => <DataGridTableRowSelect row={row} />,
    //   enableSorting: false,
    //   enableHiding: false,
    //   enableResizing: false,
    //   size: 51,
    //   meta: {
    //     cellClassName: '',
    //   },
    // },
    {
      id: 'foundOn',
      accessorFn: (row) => row.foundOn,
      header: ({ column }) => (
        <DataGridColumnHeader title="Asset" column={column} />
      ),

      cell: ({ row }) => (
        // <TimelineModel
        //   assetId={row.original?._id}
        //   assetData={row.original}
        //   trigger={
        //     <div className="cursor-pointer max-w-[400px]">
        //       <div className="flex items-center gap-1.5">
        //         <p className="text-mono font-medium text-sm truncate">
        //           {row.original?.subdomain}
        //         </p>
        //         {row?.original?.isNew && (
        //           <Badge
        //             size="xs"
        //             variant="primary"
        //             appearance="outline"
        //           >
        //             New
        //           </Badge>
        //         )}
        //       </div>
        //     </div>
        //   }
        // />
        <Link
          to={`/casm/asset-details/${row.original._id}`}
          title={row.original?.domain}
          className="font-medium text-sm block max-w-[400px] truncate hover:text-primary cursor-pointer transition-colors"
        >
          {row.original?.domain || '-'}
          {row?.original?.isNew && <Badge className="ml-2" size="sm">New</Badge>}
        </Link>
      ),

      enableSorting: false,
      size: 250,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'record',
      accessorFn: (row) => row.ipAddress,
      header: ({ column }) => (
        <DataGridColumnHeader title="Record" column={column} />
      ),

      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 w-full" title={row.original?.value}>
          <span className="truncate block w-full">
            {row.original?.value || 'Unknown Record'}
          </span>
        </div>
      ),

      enableSorting: false,
      size: 300,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },

    {
      id: 'type',
      accessorFn: (row) => row.type,
      header: ({ column }) => (
        <DataGridColumnHeader title="Record Type" column={column} />
      ),

      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          {row.original?.properties?.dns_class || 'Unknown Type'}
        </div>
      ),

      enableSorting: false,
      size: 150,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
  ];
}


const DNSRecords = () => {
  const pagination = useStore((state) => state.pagination);
  const searchQuery = useStore((state) => state.searchQuery);
  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);
  const setPagination = useStore((state) => state.setPagination);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const [sorting, setSorting] = useState([]);

  const debouncedSearch = useDebounce(searchQuery, 400)

  useEffect(() => { setPagination(() => ({ pageIndex: 0, pageSize: 25 })) }, [searchQuery, filters]);

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
    data: DNSRecordsData,
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
    type: 'dns',
  });

  const columns = getColumns();

  if (isError && !isLoading && !isFetching)
    return <ApiErrorHandler error={error} />;

  const isEmpty = !isLoading && !isFetching && (!DNSRecordsData?.data || DNSRecordsData.data.length === 0) && !debouncedSearch && Object.keys(filters || {}).length === 0;

  if (isEmpty) {
    return <EmptyScreen
      title="No DNS Records Found"
      subTitle="When new DNS records are added, they will show here."
    />
  }

  return (
    <div className="p-4">
      <Helmet>
        <title>Xpose | DNS Records</title>
      </Helmet>
      <div className="w-full flex items-center justify-between">
        <PageHeading
          title="DNS Records"
          description="View and manage all DNS records across your organization’s attack surface."
        />
      </div>
      <div className="mb-4 mt-1">
        <Metrics
          metrics={DNSRecordsData?.stats}
          isLoading={isLoading}
        />
      </div>
      <Table
        data={DNSRecordsData?.data || []}
        columns={columns}
        isLoading={isLoading || isFetching}
        totalPages={Math.ceil(DNSRecordsData?.total / pagination.pageSize)}
        totalCount={DNSRecordsData?.total}
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
            supportedFilters={DNSRecordsData?.advanced_filters}
            isLoadingFilters={isLoading}
            filters={filters}
            setFilters={setFilters}
          />
        }
        toolbar_right={<CsvExportBtn type="dns" />}
      />
    </div>
  );
};

export default DNSRecords;