import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useGenerateEndpointThreatsMutation } from '@/services/tm/endpointApi';
import { Badge } from '@/components/ui/badge';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import { ContentLoader } from '@/components/common/content-loader';
import { EmptyScreen } from '@/components/common/empty-screen';
import Table from '@/components/custom/table';
import { VulnerabilityLables } from '@/components/custom/vulnerability-labels';
import TableToolbarFilters from '../../../../../components/common/table-toolbar-filters';
import { useGetApiSecRequestsQuery } from '../../../../../services/apisec/requestsApi';
import FullRequest from '../../../../TM/pages/threats-detail/components/full-request';
import useEndpointsStore from '../../store';
import EndpointMetrics from '../endpoint-matrics';
import ImportEndpointsModel from '../import-endpoints-model';

function Endpoints() {

  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSeverityClick = React.useCallback((item) => {
    const severityMap = {
      'C': 'critical',
      'H': 'high',
      'M': 'medium',
      'L': 'low',
      'I': 'info'
    };
    const severity = severityMap[item.label];
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set('tab', 'Vulnerabilities');
      newParams.set('severity', severity);
      return newParams;
    });
  }, [setSearchParams]);

  const pagination = useEndpointsStore((state) => state.pagination);
  const setPagination = useEndpointsStore((state) => state.setPagination);
  const search = useEndpointsStore((state) => state.searchQuery);
  const setSearch = useEndpointsStore((state) => state.setSearchQuery);
  const sorting = useEndpointsStore((state) => state.sorting);
  const setSorting = useEndpointsStore((state) => state.setSorting);
  const filters = useEndpointsStore((state) => state.filters);
  const setFilters = useEndpointsStore((state) => state.setFilters);

  // Mutation hooks
  const [generateThreats] = useGenerateEndpointThreatsMutation();

  // Handler to generate threats for an endpoint
  const handleGenerateThreats = React.useCallback((endpointId) => {
    toast.promise(generateThreats(endpointId).unwrap(), {
      loading: 'Generating threats',
      success: 'Threats are being generated',
      error: 'Failed to generate threats',
    });
  }, [generateThreats]);

  const { data, isLoading, isFetching, error, isError } = useGetApiSecRequestsQuery({
    projectIds: id,
    search,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    ...filters,
    ...(sorting?.length
      ? { sortBy: sorting[0]?.id, sort: sorting[0]?.desc ? 'desc' : 'asc' }
      : {
        // Default sorting: newest first
        sortBy: 'createdAt',
        sort: 'desc',
      }),
  }, { pollingInterval: 10000 });


  // Reset pagination whenever search or filters change
  React.useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [search, filters, setPagination]);

  // Define columns with access to handleGenerateThreats and handleDelete inside the component
  const columns = React.useMemo(() => [
    {
      accessorKey: 'Endpoint',
      header: ({ column }) => (
        <DataGridColumnHeader title="Endpoint" column={column} />
      ),
      cell: ({ row }) => {
        const name = row?.original?.name || 'Unknown';
        const displayName = name.length > 40 ? name.slice(0, 40) + '...' : name;

        return (
          <div>
            {row?.original?.rawHttp ? (
              <FullRequest
                raw={row.original.rawHttp}
                generated={row?.original?.threats_generated}
                onClick={() => handleGenerateThreats(row.original._id)}
                showGenerateThreatButton={false}
                triggerBtn={
                  <p className="cursor-pointer">
                    {displayName}
                  </p>
                }
              />
            ) : (
              <p>{displayName}</p>
            )}
          </div>
        );
      },
      size: 200,
      enableSorting: false,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      accessorKey: 'method',
      header: ({ column }) => (
        <DataGridColumnHeader title="Method" column={column} />
      ),
      cell: ({ row }) => {
        const method = row.original.method;
        const variant =
          method === 'GET'
            ? 'primary'
            : method === 'POST'
              ? 'success'
              : method === 'PUT' || method === 'PATCH'
                ? 'warning'
                : 'mono';
        return (
          <Badge variant={variant} appearance="outline">
            {method}
          </Badge>
        );
      },
      size: 70,
      enableSorting: false,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      accessorKey: 'Host',
      header: ({ column }) => (
        <DataGridColumnHeader title="Host" column={column} />
      ),
      cell: ({ row }) => {
        const raw = row?.original?.url;
        let origin = 'Unknown';
        if (raw) {
          try {
            origin = new URL(raw).origin;
          } catch (e) {
            // fallback: strip path segments (scheme may be missing)
            const parts = raw.split('/');
            origin = parts.length >= 3 ? parts.slice(0, 3).join('/') : raw;
          }
        }
        return <Badge appearance="outline">{origin}</Badge>;
      },
      enableSorting: false,
      size: 100,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      accessorKey: 'updatedAt',
      header: ({ column }) => (
        <DataGridColumnHeader title="Last Crawled At" column={column} />
      ),
      cell: ({ row }) => {
        const date = row.original.updatedAt;
        return (
          <span className="text-sm text-muted-foreground">
            {date
              ? new Date(date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
              : 'Never'}
          </span>
        );
      },
      enableSorting: true,
      size: 100,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },

    {
      id: 'totalVulns',
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
              <VulnerabilityLables items={items} onItemClick={handleSeverityClick} />
            ) : (
              <span className="text-muted-foreground ml-2">No Vulnerabilities Found</span>
            )}
          </div>
        );
      },
      size: 70,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
  ], [handleGenerateThreats, handleSeverityClick]);


  // if (StatusLoading) {
  //   return (
  //     <div className="h-[600px]">
  //       <ContentLoader className="w-full h-full" />
  //     </div>
  //   );
  // }

  if (isError) return <ApiErrorHandler error={error} />;


  if (!isError && data?.total === 0 && !search && Object.keys(filters)?.length == 0) {
    return (
      <EmptyScreen
        title="No Endpoints Found"
        subTitle="There where no endpoints found in this project!"
        engage={<ImportEndpointsModel showText={true} />}
        showTitle={false}
      />
    );
  }

  return (
    <div>
      <div className="mb-4">
        <EndpointMetrics metrics={data?.summary} isLoading={isLoading} />
      </div>

      <Table
        data={data?.data || []}
        columns={columns}
        search={search}
        setSearch={setSearch}
        pagination={pagination}
        setPagination={setPagination}
        totalCount={data?.meta?.totalItems}
        totalPages={
          data?.meta?.totalItems
            ? Math.ceil(data?.meta?.totalItems / pagination.pageSize)
            : 0
        }
        sorting={sorting}
        setSorting={setSorting}
        isLoading={isLoading}
        enableSearch={true}
        enableSorting={true}
        manualSorting={true}
        manualPagination={true}
        showPagination={true}
        grid
        toolbar={
          <TableToolbarFilters
            filters={filters}
            setFilters={setFilters}
            supportedFilters={data?.advanced_filters}
            isLoadingFilters={isLoading}
          />
        }
      />
    </div>
  );
}

export default Endpoints;