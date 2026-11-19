import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useGetAsmAssetsQuery } from '@/services/asm/attackSurfaceApi';
import { Badge } from '@/components/ui/badge';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridTableRowSelect, DataGridTableRowSelectAll } from '@/components/ui/data-grid-table';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyScreen } from '@/components/common/empty-screen';
import ApiErrorHandler from '@/components/common/api-error-handler';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import PageHeading from '@/components/custom/page-heading';
import { CustomTooltip } from '@/components/custom/tooltip';
import TableToolbarFilters from '../../../../components/common/table-toolbar-filters';
import useDebounce from '../../../../hooks/use-debounce';
import { useGetAsmIPsQuery } from '../../../../services/asm/attackSurfaceApi';
import Table from '../components/table/asset-table';
import CsvExportBtn from '../subdomains/components/csv-export-btn';
import TimelineModel from '../subdomains/components/modals/asset-timeline-model/timeline-model';
import SubdomainsInfoDrawerModal from '../subdomains/components/modals/subdomain-info-modal/subdomains-info-drawer-modal';
import Metrics from './components/metrics';
import useStore from './store';


function getColumns() {
  return [
    {
      id: 'ip',
      accessorFn: (row) => row.value,
      header: ({ column }) => (
        <DataGridColumnHeader title="IP Address" column={column} />
      ),

      cell: ({ row }) => (
        // <TimelineModel
        //   assetId={row.original?._id}
        //   assetData={row.original}
        //   trigger={
        //     <div className="cursor-pointer">
        //       <div className="flex flex-col">
        //         <div className="flex items-center gap-1.5">
        //           <p className="text-mono font-medium text-sm truncate" title={row.original?.value}
        //           >
        //             {row.original?.value}
        //           </p>
        //           {row?.original?.isNew && (
        //             <Badge
        //               size="xs"
        //               variant="primary"
        //               appearance="outline"
        //             >
        //               New
        //             </Badge>
        //           )}
        //         </div>
        //         <p className='text-xs text-muted-foreground truncate max-w-[180px]' title={row?.original?.subdomain}>
        //           {row?.original?.subdomain || "No Host"}
        //         </p>
        //       </div>
        //     </div>
        //   }
        // />
        <Link
          to={`/casm/asset-details/${row.original._id}`}
          className="font-medium text-sm truncate max-w-[400px] hover:text-primary cursor-pointer transition-colors"
        >
          {row.original?.value || '-'}
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
      id: 'openPorts',
      accessorFn: (row) => row.associated_ports?.length || 0,
      header: ({ column }) => (
        <DataGridColumnHeader title="Open Ports" column={column} />
      ),

      cell: ({ row }) => (
        <div className="flex flex-wrap items-center gap-1">
          {row?.original?.associated_ports.length
            ? row?.original?.associated_ports?.slice(0, 3).map((tech) => (
                <Badge key={tech?._id} variant="default" appearance="outline">
                  {tech?.value}
                </Badge>
              ))
            : '-'}
          {row?.original?.associated_ports?.length > 3 && (
            <DetailedHoverPopover
              popoverTitle="Ports"
              buttonText={`+${row?.original?.associated_ports?.length - 3} more`}
              popoverContent={row?.original?.associated_ports
                ?.slice(3)
                .map((tech) => (
                  <Badge
                    key={tech?._id}
                    className="m-0.5 h-fit"
                    variant="default"
                    appearance="outline"
                  >
                    {tech?.value}
                  </Badge>
                ))}
            />
          )}
        </div>
      ),

      enableSorting: true,
      size: 200,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },

    {
      id: 'location',
      accessorFn: (row) => row.properties?.ip_location,
      header: ({ column }) => (
        <DataGridColumnHeader title="Location" column={column} />
      ),

      cell: ({ row }) => {
        const loc = row.original?.properties?.ip_location || '';
        const countryCode = loc ? loc.split(',').pop()?.trim() : null;
        return row?.original?.network_scope !== 'internal' && loc ? (
          <div className="flex gap-1 items-center">
            {countryCode || '-'}
            <span className="text-[11px] text-muted-foreground">
              ({row.original?.properties?.ip_city || '-'})
            </span>
          </div>
        ) : (
          <div className="text-muted-foreground">-</div>
        );
      },

      enableSorting: false,
      size: 150,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'network_scope',
      accessorFn: (row) => row.network_scope,
      header: ({ column }) => (
        <DataGridColumnHeader title="Network Scope" column={column} />
      ),

      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          {row.original?.network_scope === 'internal' ? (
            <Badge variant="success" appearance="outline">
              Internal
            </Badge>
          ) : (
            <Badge variant="destructive" appearance="outline">
              External
            </Badge>
          )}
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
      id: 'organisation',
      accessorFn: (row) => row.properties?.ip_org,
      header: ({ column }) => (
        <DataGridColumnHeader title="Organisation" column={column} />
      ),

      cell: ({ row }) => {
        const rawOrg = row.original?.properties?.ip_org || '';
        const orgName = rawOrg.replace(/^AS\d+\s*/i, '') || '-';
        if (row?.original?.network_scope === 'internal' || orgName === '-') {
          return <div className="text-muted-foreground">-</div>;
        }
        return (
          <CustomTooltip text={orgName}>
            <span className="truncate block max-w-[150px]">{orgName}</span>
          </CustomTooltip>
        );
      },

      enableSorting: false,
      size: 150,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
  ];
}

const IPAddresses = () => {
  const pagination = useStore((state) => state.pagination);
  const searchQuery = useStore((state) => state.searchQuery);
  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);
  const setPagination = useStore((state) => state.setPagination);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const [sorting, setSorting] = React.useState([]);

  const debouncedSearch = useDebounce(searchQuery, 400)

  useEffect(() => {
    setPagination(() => ({ pageIndex: 0, pageSize: 25 }));
  }, [searchQuery, filters]);

  // Convert TanStack Table sorting to API format
  const getSortParams = () => {
    if (sorting.length === 0) return {};

    const sort = sorting[0];
    if (sort.id === 'openPorts') {
      return {
        sortBy: 'portCount',
        sortOrder: sort.desc ? 'desc' : 'asc',
      };
    }

    return {
      sortBy: sort.id,
      sortOrder: sort.desc ? 'desc' : 'asc',
    };
  };

  const {
    data: IPAddressesData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetAsmAssetsQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: debouncedSearch,
    // unified_view: true,
    // spread filters converting arrays to comma-separated strings for API
    ...(filters
      ? Object.fromEntries(
        Object.entries(filters)
          .filter(([_, value]) => value !== undefined && value !== null)
          .map(([key, value]) => [
            key,
            Array.isArray(value)
              ? value.filter((v) => String(v).trim() !== '').join(',')
              : value,
          ]),
      )
      : {}),
    ...getSortParams(),
    type: 'ip',
  });

  const columns = getColumns();

  if (isError && !isLoading && !isFetching)
    return <ApiErrorHandler error={error} />;

  if (
    !isLoading &&
    !isFetching &&
    !IPAddressesData?.total &&
    !debouncedSearch &&
    Object.keys(filters || {}).length === 0
  )
    return (
      <EmptyScreen
        title="No IPs Found"
        subTitle="When new IPs are added, they will show here."
      />
    );

  return (
    <div className="p-4">
      <Helmet>
        <title>Xpose | IP Addresses</title>
      </Helmet>

      <div className="w-full flex items-center justify-between pr-2">
        <PageHeading
          title="IP Addresses"
          description="View and manage all IP addresses across your organization’s attack surface."
        />
      </div>

      <div className="mb-4">
        <Metrics
          metrics={IPAddressesData?.stats}
          isLoading={isLoading}
        />
      </div>

      <Table
        data={IPAddressesData?.data || []}
        assetType="ip"
        columns={columns}
        isLoading={isLoading || isFetching}
        totalPages={Math.ceil(IPAddressesData?.total / pagination.pageSize)}
        totalCount={IPAddressesData?.total}
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
        // enableSorting={true}
        // sorting={sorting}
        // setSorting={setSorting}
        toolbar={
          <TableToolbarFilters
            filters={filters}
            supportedFilters={IPAddressesData?.advanced_filters}
            isLoadingFilters={isLoading}
            setFilters={setFilters}
          />
        }
        toolbar_right={<CsvExportBtn type="ip" />}
      />
    </div>
  );
};

export default IPAddresses;