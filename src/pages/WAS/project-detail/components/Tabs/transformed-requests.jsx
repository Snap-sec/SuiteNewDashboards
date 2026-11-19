import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import {
  useDeleteEndpointMutation,
  useGetProjectStatsQuery,
} from '@/services/tm/projectApi';
import { Badge } from '@/components/ui/badge';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import { ContentLoader } from '@/components/common/content-loader';
import { EmptyScreen } from '@/components/common/empty-screen';
import Table from '@/components/custom/table';
import { useGetTransformedRequestsQuery } from '@/services/apisec/transformedRequestsApi';
import useEndpointsStore from '../../store';
import ImportEndpointsModel from '../import-endpoints-model';
import TableToolbarFilters from '@/components/common/table-toolbar-filters';
import { VulnerabilityLables } from '@/components/custom/vulnerability-labels';
import RequestComparisonModal from '../request-comparison';

function TransformedRequests() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSeverityClick = (item) => {
    const severityMap = {
      'C': 'critical',
      'H': 'high',
      'M': 'medium',
      'L': 'low',
      'I': 'info',
    };
    const severity = severityMap[item.label];
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set('tab', 'Vulnerabilities');
      newParams.set('severity', severity);
      return newParams;
    });
  };

  // Zustand state
  const pagination = useEndpointsStore((state) => state.pagination);
  const setPagination = useEndpointsStore((state) => state.setPagination);
  const search = useEndpointsStore((state) => state.searchQuery);
  const setSearch = useEndpointsStore((state) => state.setSearchQuery);
  const sorting = useEndpointsStore((state) => state.sorting);
  const setSorting = useEndpointsStore((state) => state.setSorting);
  const filters = useEndpointsStore((state) => state.filters);
  const setFilters = useEndpointsStore((state) => state.setFilters);

  const [showRequestComparison, setShowRequestComparison] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Fetch project endpoints
  const { data, isLoading } = useGetTransformedRequestsQuery({
    projectId: id,
    search,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    ...filters,
    ...(sorting?.length
      ? { sortBy: sorting[0]?.id, sort: sorting[0]?.desc ? 'desc' : 'asc' }
      : {
        sortBy: 'createdAt',
        sort: 'desc',
      }),
  });

  // Reset pagination whenever search or filters change
  React.useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [search, filters, setPagination]);

  // Get stats Data
  const { data: StatusData, isLoading: StatusLoading } =
    useGetProjectStatsQuery(id);

  if (StatusLoading) {
    return (
      <div className="h-[600px]">
        <ContentLoader className="w-full h-full" />
      </div>
    );
  }

  if (data?.total === 0 && !search && Object.keys(filters)?.length == 0) {
    return (
      <EmptyScreen
        title="No Endpoints Found"
        subTitle="There where no endpoints found in this project!"
        engage={<ImportEndpointsModel showText={true} />}
        showTitle={false}
      />
    );
  }

  // Define columns
  const columns = [
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
      accessorKey: 'Endpoint',
      header: ({ column }) => (
        <DataGridColumnHeader title="Endpoint" column={column} />
      ),
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <p className="font-medium text-sm">
            {row?.original?.rawRequest?.name?.length > 40
              ? row.original?.rawRequest?.name?.slice?.(0, 40) + '...'
              : row.original?.rawRequest?.name || 'Unknown'}
          </p>
          <div
            onClick={() => {
              setSelectedRequest(row.original);
              setShowRequestComparison(true);
            }}
            className="group cursor-pointer"
          >
            <p className="text-[11px] text-primary hover:underline transition-all">
              {row?.original?.rawRequest?.url?.length > 60
                ? row.original.rawRequest.url.slice(0, 60) + '...'
                : row.original.rawRequest.url}
            </p>
          </div>
        </div>
      ),
      size: 180,
      enableSorting: false,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      accessorKey: 'rule',
      header: ({ column }) => (
        <DataGridColumnHeader title="Rule" column={column} />
      ),
      cell: ({ row }) => {
        return (
          <Badge appearance="outline">
            {row.original?.rule?.rule_name?.slice?.(0, 15) + (row.original?.rule?.rule_name?.length > 15 ? '...' : '')}
          </Badge>
        );
      },
      size: 120,
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
            const parts = raw.split('/');
            origin = parts.length >= 3 ? parts.slice(0, 3).join('/') : raw;
          }
        }
        return <Badge appearance="outline" className="font-mono text-[10px]">{origin}</Badge>;
      },
      enableSorting: false,
      size: 150,
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
      size: 190,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
  ];

  return (
    <div className="space-y-4 p-4">
      <Table
        grid
        data={data?.requests || []}
        columns={columns}
        search={search}
        setSearch={setSearch}
        pagination={pagination}
        setPagination={setPagination}
        totalCount={data?.total}
        totalPages={
          data?.total
            ? Math.ceil(data?.total / pagination.pageSize)
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
        toolbar={
          <TableToolbarFilters
            filters={filters}
            setFilters={setFilters}
            supportedFilters={data?.advanced_filters}
            isLoadingFilters={isLoading}
          />
        }
      />

      <RequestComparisonModal
        data={selectedRequest}
        isOpen={showRequestComparison}
        onClose={() => {
          setShowRequestComparison(false);
          setSelectedRequest(null);
        }}
      />
    </div>
  );
}

export default TransformedRequests;