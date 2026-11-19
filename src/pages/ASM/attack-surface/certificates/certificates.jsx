import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useGetAsmAssetsQuery } from '@/services/asm/attackSurfaceApi';
import { Badge } from "@/components/ui/badge";
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridTableRowSelect, DataGridTableRowSelectAll } from '@/components/ui/data-grid-table';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyScreen } from '@/components/common/empty-screen';
import ApiErrorHandler from '@/components/common/api-error-handler';
import PageHeading from '@/components/custom/page-heading';

import { CustomTooltip } from '@/components/custom/tooltip';
import { DateFormatter } from '../../../../components/custom/date-formatter';
import useDebounce from '../../../../hooks/use-debounce';
import { formatDate } from '../../../../lib/helpers';
import { useGetAsmCertificatesQuery } from '../../../../services/asm/attackSurfaceApi';
import Table from '../components/table/asset-table';
import CsvExportBtn from '../subdomains/components/csv-export-btn';
import TimelineModel from '../subdomains/components/modals/asset-timeline-model/timeline-model';
import Metrics from './components/metrics';
import useStore from './store';
import TableToolbarFilters from '../../../../components/common/table-toolbar-filters';


function getColumns() {
  return [
    {
      id: 'commonName',
      accessorFn: (row) => row.commonName,
      header: ({ column }) => (
        <DataGridColumnHeader title="Common Name" column={column} />
      ),

      cell: ({ row }) => (
        // <TimelineModel
        //   assetId={row.original?._id}
        //   assetData={row.original}
        //   trigger={
        //     <div className="flex flex-col cursor-pointer">
        //       <div className="flex items-center gap-1.5">
        //         <p className="text-mono font-medium text-sm max-w-[500px] truncate">
        //           {row.original?.value}
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
        //       <p className="text-xs text-muted-foreground truncate max-w-[400px]">
        //         {row.original?.properties?.certificate_issuer_o || 'Unknown Issuer'}
        //       </p>
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
      size: 150,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },

    {
      id: 'certificate_valid_from',
      accessorFn: (row) => row.validFrom,
      header: ({ column }) => (
        <DataGridColumnHeader title="Valid From" column={column} />
      ),

      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          {formatDate(row.original?.properties?.certificate_valid_from)}
        </div>
      ),

      enableSorting: true,
      size: 100,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'certificate_valid_to',
      accessorFn: (row) => row.validTo,
      header: ({ column }) => (
        <DataGridColumnHeader title="Valid To" column={column} />
      ),

      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          {formatDate(row.original?.properties?.certificate_valid_to)}
        </div>
      ),

      enableSorting: true,
      size: 100,
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

      cell: ({ row }) => {
        const isExpired = row.original?.properties?.certificate_is_expired;
        const validTo = row.original?.properties?.certificate_valid_to;
        const now = new Date();
        const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        const isAboutToExpire = !isExpired && validTo && new Date(validTo) < thirtyDaysFromNow && new Date(validTo) > now;

        let variant = 'success';
        let label = 'Valid';

        if (isExpired) {
          variant = 'destructive';
          label = 'Expired';
        } else if (isAboutToExpire) {
          variant = 'warning';
          label = 'About to Expire';
        }

        return (
          <div data-testid="certificate-status">
            <Badge
              variant={variant}
              // appearance="outline"
              appearance="ghost"
            >
              {label}
            </Badge>
          </div>
        );
      },

      enableSorting: false,
      size: 50,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    // {
    //   id: 'details',
    //   accessorFn: (row) => row.details,
    //   header: ({ column }) => (
    //     <DataGridColumnHeader title="Details" column={column} />
    //   ),

    //   cell: ({ row }) => (
    //     <div className="flex flex-col gap-1 overflow-hidden">
    //       Algorithm: {row.original?.properties?.certificate_algorithm || 'Unknown'}
    //       <span className="text-[10px] text-muted-foreground">
    //         Serial: {row.original?.properties?.certificate_serial_number || 'No Serial'}
    //       </span>
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

const Certificates = () => {
  const pagination = useStore((state) => state.pagination);
  const searchQuery = useStore((state) => state.searchQuery);
  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);
  const setPagination = useStore((state) => state.setPagination);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const [sorting, setSorting] = React.useState([]);

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
    data: CertificatesData,
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
    type: 'certificate',
  });

  const columns = getColumns();

  if (isError && !isLoading && !isFetching)
    return <ApiErrorHandler error={error} />;

  if (!isLoading && !isFetching && !CertificatesData?.stats?.total && !debouncedSearch && Object.keys(filters || {}).length === 0)
    return <EmptyScreen
      title="No Certificates Found"
      subTitle="When new certificates are added, they will show here."
    />

  return (
    <div className="p-4">
      <Helmet>
        <title>Xpose | Certificates</title>
      </Helmet>

      <div className="w-full flex items-center justify-between">
        <PageHeading
          title="Certificates"
          description="View and manage all certificates across your organization’s attack surface."
        />
      </div>

      <div className="mb-4 mt-1">
        <Metrics
          metrics={CertificatesData?.stats}
          totalCertificates={CertificatesData?.stats?.total}
          isLoading={isLoading}
        />
      </div>

      <Table
        data={CertificatesData?.data || []}
        columns={columns}
        isLoading={isLoading || isFetching}
        totalPages={Math.ceil(CertificatesData?.total / pagination.pageSize)}
        totalCount={CertificatesData?.total}
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
            supportedFilters={CertificatesData?.advanced_filters}
            isLoadingFilters={isLoading}
            setFilters={setFilters}
          />
        }
        toolbar_right={<CsvExportBtn type="certificate" />}
      />
    </div>
  );
};

export default Certificates;