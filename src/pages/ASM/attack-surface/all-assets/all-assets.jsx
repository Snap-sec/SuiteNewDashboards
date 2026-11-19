import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useGetAsmAssetsQuery } from '@/services/asm/attackSurfaceApi';
import { Badge } from "@/components/ui/badge";
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyScreen } from '@/components/common/empty-screen';
import ApiErrorHandler from '@/components/common/api-error-handler';
import PageHeading from '@/components/custom/page-heading';
import useDebounce from '../../../../hooks/use-debounce';
import GetAssetTypeInfo from '@/components/custom/asset-icons';
import Table from '../components/table/asset-table';
import CsvExportBtn from '../subdomains/components/csv-export-btn';
import { ShieldCheck, ShieldBan } from 'lucide-react';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import useStore from './store';
import TableToolbarFilters from '../../../../components/common/table-toolbar-filters';
import { Link } from 'react-router-dom';

function getColumns() {
  return [
    {
      id: 'value',
      accessorFn: (row) => (row.type === 'port' ? row.ip : row.value),
      header: ({ column }) => (
        <DataGridColumnHeader title="Asset" column={column} />
      ),
      cell: ({ row }) => {
        const isPort = row.original?.type === 'port';
        const displayValue = isPort ? `${row.original?.ip || row.original.subdomain}:${row.original.value}` : row.original?.value;
        const typeInfo = GetAssetTypeInfo(row.original.type);

        return (
          <Link
            to={`/casm/asset-details/${row.original._id}`}
            className="font-medium text-sm truncate max-w-[400px] hover:text-primary cursor-pointer transition-colors"
          >
            {displayValue || '-'}
            {row?.original?.isNew && <Badge className="ml-2" size="sm">New</Badge>}
          </Link>
        );
      },
      enableSorting: false,
      size: 300,
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'network_scope',
      accessorFn: (row) => row.network_scope,
      header: ({ column }) => (
        <DataGridColumnHeader title="Network Scope" column={column} />
      ),
      cell: ({ row }) => {
        const scope = row.original?.network_scope;
        if (!scope) return <span className="text-muted-foreground">-</span>;
        
        return (
          <Badge 
            variant={scope === 'internal' ? 'success' : 'destructive'} 
            appearance="outline" 
            className="capitalize"
          >
            {scope}
          </Badge>
        );
      },
      enableSorting: false,
      size: 150,
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'type',
      accessorFn: (row) => row.type,
      header: ({ column }) => (
        <DataGridColumnHeader title="Type" column={column} />
      ),
      cell: ({ row }) => {
        const typeInfo = GetAssetTypeInfo(row.original.type);
        return (
          <Badge variant="secondary" appearance="outline" className="capitalize flex items-center gap-1.5 w-fit">
            <span className="text-muted-foreground">{typeInfo.icon}</span>
            {typeInfo.label}
          </Badge>
        );
      },
      enableSorting: false,
      size: 150,
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },
    // {
    //   id: 'hasWAF',
    //   accessorFn: (row) => row.hasWAF,
    //   header: ({ column }) => (
    //     <DataGridColumnHeader title="WAF" column={column} />
    //   ),
    //   cell: ({ row }) => (
    //     <div className="flex items-center gap-1.5" data-testid="subdomain-waf">
    //       {row.original?.hasWaf ? (
    //         <div className="text-green-500 text-xs flex items-center gap-1">
    //           <ShieldCheck size={16} />{' '}
    //           {row.original?.wafs?.map((waf) => waf.split(' ')[0])?.join(',') ||
    //             'Unknown WAF'}
    //         </div>
    //       ) : (
    //         <div className="text-xs flex items-center gap-1">
    //           <ShieldBan size={16} /> No WAF
    //         </div>
    //       )}
    //     </div>
    //   ),
    //   enableSorting: false,
    //   size: 150,
    //   meta: {
    //     cellClassName: '',
    //     skeleton: <Skeleton className="h-7" />,
    //   },
    // },
  ];
}

const AllAssets = () => {
  const navigate = useNavigate();
  const pagination = useStore((state) => state.pagination);
  const searchQuery = useStore((state) => state.searchQuery);
  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);
  const setPagination = useStore((state) => state.setPagination);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const [sorting, setSorting] = React.useState([]);

  const debouncedSearch = useDebounce(searchQuery, 400);

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
    data: allAssetsData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetAsmAssetsQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: debouncedSearch,
    unified_view: true,
    ...filters,
    ...getSortParams(),
    // type omitted to get all assets
  });

  const columns = getColumns();

  if (isError && !isLoading && !isFetching)
    return <ApiErrorHandler error={error} />;

  if (!isLoading && !debouncedSearch && !isFetching && !allAssetsData?.total && Object.keys(filters || {}).length === 0) {
    return (
      <EmptyScreen
        title="No Assets Found"
        subTitle="When assets are discovered, they will appear here."
      />
    );
  }

  return (
    <div className="p-4">
      <Helmet>
        <title>Xpose | All Assets</title>
      </Helmet>

      <div className="w-full flex items-center justify-between">
        <PageHeading
          title="All Assets"
          description="View and manage all assets discovered across your organization’s attack surface."
        />
      </div>

      <div className="mt-1">
        <Table
          onRowClick={(row) => navigate(`/casm/asset-details/${row.original._id}`)}
          data={allAssetsData?.data || []}
          columns={columns}
          isLoading={isLoading || isFetching}
          totalPages={Math.ceil(allAssetsData?.total / pagination.pageSize)}
          totalCount={allAssetsData?.total}
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
              supportedFilters={allAssetsData?.advanced_filters}
              isLoadingFilters={isLoading}
              setFilters={setFilters}
            />
          }
          toolbar_right={<CsvExportBtn type="all" />}
        />
      </div>
    </div>
  );
};

export default AllAssets;
