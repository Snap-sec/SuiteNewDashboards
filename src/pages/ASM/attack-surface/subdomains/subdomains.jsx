import React, { useEffect } from 'react';
import { Activity, BrainCircuit, CircleSlash2, CircleUser, ExternalLink, Link2, ShieldBan, ShieldCheck } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router';
import { useGetAsmAssetsQuery } from '@/services/asm/attackSurfaceApi';
import { Badge } from '@/components/ui/badge';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyScreen } from '@/components/common/empty-screen';
import ApiErrorHandler from '@/components/common/api-error-handler';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import PageHeading from '@/components/custom/page-heading';

import TableToolbarFilters from '../../../../components/common/table-toolbar-filters';
import { CustomTooltip } from '../../../../components/custom/tooltip';
import useDebounce from '../../../../hooks/use-debounce';
import Table from '../components/table/asset-table';
import CsvExportBtn from './components/csv-export-btn';
import DeadStatusPopover from './components/dead-status-popover';
import Metrics from './components/metrics';
import TimelineModel from './components/modals/asset-timeline-model/timeline-model';
import useStore from './store';
import SeverityLabel from '../../../../components/custom/severity-label';


function getColumns() {
  return [
    {
      id: 'subdomain',
      accessorFn: (row) => row.value,
      header: ({ column }) => (
        <DataGridColumnHeader title="Subdomain" column={column} />
      ),

      cell: ({ row }) => {
        return (
          <Link
            to={`/casm/asset-details/${row.original._id}`}
            className="font-medium text-sm truncate max-w-[400px] hover:text-primary cursor-pointer transition-colors"
          >
            {row.original?.value || '-'}
            {row?.original?.isNew && <Badge className="ml-2" size="sm">New</Badge>}
          </Link>
        )
      },

      enableSorting: false,
      size: 200,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },


    {
      id: 'associated_ports',
      accessorFn: (row) => row.properties.subdomain_status,
      header: ({ column }) => (
        <DataGridColumnHeader title="Open Ports" column={column} />
      ),

      cell: ({ row }) => (
        <div className='flex items-center gap-1'>
          {row?.original?.associated_ports?.slice(0, 2).map((tech) => (
            <Badge
              key={tech?._id}
              className=" h-fit border"
              variant="default"
              appearance="outline"
            >
              {tech?.value}
            </Badge>
          ))}

          {row?.original?.associated_ports?.length == 0 && <p>-</p>}

          {row?.original?.associated_ports?.length > 2 && (
            <div className="flex flex-wrap gap-2">
              <DetailedHoverPopover
                popoverTitle="Ports"
                buttonText={`+${row?.original?.associated_ports?.length - 2} more`}
                popoverContent={row?.original?.associated_ports?.slice(2).map((tech) => (
                  <Badge
                    key={tech?._id}
                    className="m-0.5 h-fit"
                    variant="default"
                    appearance="outline">
                    {tech?.value}
                  </Badge>
                ))}

              />
            </div>
          )}
        </div>
      ),

      enableSorting: true,
      size: 150,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },

    {
      id: 'Ip Addresses',
      accessorFn: (row) => row.properties.subdomain_status,
      header: ({ column }) => (
        <DataGridColumnHeader title="IP Addresses" column={column} />
      ),

      cell: ({ row }) => (
        <div className='flex items-center gap-1'>
          {row?.original?.associated_ip?.slice(0, 1).map((tech) => (
            <Badge
              key={tech?._id}
              variant="default"
              appearance="outline"
            >
              {tech?.value}
            </Badge>
          ))}

          {row?.original?.associated_ip?.length == 0 && <p>-</p>}

          {row?.original?.associated_ip?.length > 1 && (
            <div className="flex flex-wrap gap-2">
              <DetailedHoverPopover
                popoverTitle="Ip Addresses"
                buttonText={`+${row?.original?.associated_ip?.length - 1} more`}
                popoverContent={row?.original?.associated_ip?.slice(1).map((tech) => (
                  <Badge
                    key={tech?._id}
                    className="m-0.5"
                    variant="default"
                    appearance="outline">
                    {tech?.value}
                  </Badge>
                ))}

              />
            </div>
          )}
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
      id: 'network_scope',
      accessorFn: (row) => row.network_scope,
      header: ({ column }) => (
        <DataGridColumnHeader title="Network Scope" column={column} />
      ),

      cell: ({ row }) => {
        const isDead = row.original?.properties?.subdomain_status === 'dead';
        const isInternal = isDead || row.original?.network_scope === 'internal';

        return (
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            {isInternal ? (
              <Badge variant="success" appearance="outline">
                Internal
              </Badge>
            ) : (
              <Badge variant="destructive" appearance="outline">
                External
              </Badge>
            )}
          </div>
        );
      },

      enableSorting: false,
      size: 100,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7 w-full" />,
      },
    },

  ];
}


const Subdomains = () => {
  const pagination = useStore((state) => state.pagination);
  const searchQuery = useStore((state) => state.searchQuery);
  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);
  const setPagination = useStore((state) => state.setPagination);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const [sorting, setSorting] = React.useState([]);

  const debouncedSearch = useDebounce(searchQuery, 400)

  useEffect(() => { setPagination(() => ({ pageIndex: 0, pageSize: 25 })) }, [filters, searchQuery]);

  // Convert TanStack Table sorting to API format
  const getSortParams = () => {
    if (sorting.length === 0) return {};

    const sort = sorting[0];
    if (sort.id === 'openPorts') {
      return {
        sortBy: 'portCount',
        sortOrder: sort.desc ? 'desc' : 'asc'
      };
    }

    return {
      sortBy: sort.id,
      sortOrder: sort.desc ? 'desc' : 'asc'
    };
  };


  const {
    data: SubdomainsData,
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
    type: "subdomain"
  });

  const columns = getColumns();

  if (isError && !isLoading && !isFetching)
    return <ApiErrorHandler error={error} />;

  if (
    !isLoading &&
    !isFetching &&
    !SubdomainsData?.total &&
    !debouncedSearch &&
    Object.keys(filters || {}).length === 0
  ) {
    return (
      <EmptyScreen
        title="No Subdomains Found"
        subTitle="When new subdomains are added, they will show here."
      />
    );
  }

  return (
    <div className="p-4">
      <Helmet>
        <title>Xpose | Subdomains</title>
      </Helmet>

      <div className="w-full flex items-center justify-between pr-2">
        <PageHeading
          title="Subdomains"
          description="View and manage all subdomains across your organization’s attack surface."
        />
      </div>

      <div className="mb-4">
        <Metrics
          metrics={SubdomainsData?.stats}
          isLoading={isLoading}
        />
      </div>

      <Table
        data={SubdomainsData?.data || []}
        columns={columns}
        isLoading={isLoading || isFetching}
        totalPages={Math.ceil(SubdomainsData?.total / pagination.pageSize)}
        totalCount={SubdomainsData?.total}
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
            supportedFilters={SubdomainsData?.advanced_filters}
            isLoadingFilters={isLoading}
            setFilters={setFilters}
          />
        }
        toolbar_right={<CsvExportBtn type="subdomain" />}
      />
    </div>
  );
};

export default Subdomains;