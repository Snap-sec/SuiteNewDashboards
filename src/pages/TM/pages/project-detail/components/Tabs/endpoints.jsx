import React, { useState } from 'react';
import { Eye, RefreshCcwDot, RotateCcw, Trash } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useGetProjectStatsQuery } from '@/services/tm/projectApi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import { ContentLoader } from '@/components/common/content-loader';
import { EmptyScreen } from '@/components/common/empty-screen';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import Table from '../../../../../../components/custom/table';
import { CustomTooltip } from '../../../../../../components/custom/tooltip';
import { useGenerateEndpointThreatsMutation } from '../../../../../../services/tm/endpointApi';
import {
  useDeleteEndpointMutation,
  useGetProjectEndpointsQuery,
} from '../../../../../../services/tm/projectApi';
import FullRequest from '../../../threats-detail/components/full-request';
import useEndpointsStore from '../../store';
import EndpointMetrics from '../endpoint-matrics';
import ImportEndpointsModel from '../import-endpoints-model';
import EndpointsTableToolbar from '../table-tool-bar';

function Endpoints() {
  const { projectId } = useParams();

  // Zustand state
  const pagination = useEndpointsStore((state) => state.pagination);
  const setPagination = useEndpointsStore((state) => state.setPagination);
  const search = useEndpointsStore((state) => state.searchQuery);
  const setSearch = useEndpointsStore((state) => state.setSearchQuery);
  const sorting = useEndpointsStore((state) => state.sorting);
  const setSorting = useEndpointsStore((state) => state.setSorting);
  const filters = useEndpointsStore((state) => state.filters);

  // Mutation hooks
  const [generateThreats] = useGenerateEndpointThreatsMutation();
  const [deleteEndpoint] = useDeleteEndpointMutation();

  // Handler to generate threats for an endpoint
  const handleGenerateThreats = (endpointId) => {
    toast.promise(generateThreats(endpointId).unwrap(), {
      loading: 'Generating threats',
      success: 'Threats are being generated',
      error: 'Failed to generate threats',
    });
  };

  // Handler to delete an endpoint
  const handleDelete = async (endpointId) => {
    try {
      await deleteEndpoint(endpointId).unwrap();
      toast.success('Endpoint deleted');
    } catch (error) {
      console.error('Failed to delete endpoint:', error);
      toast.error('Failed to delete endpoint');
    }
  };

  // Fetch project endpoints
  const { data, isLoading, isFetching } = useGetProjectEndpointsQuery({
    projectId,
    search,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    ...filters,
    ...(sorting?.length
      ? { sortBy: sorting[0]?.id, sort: sorting[0]?.desc ? 'desc' : 'asc' }
      : {}),
  });

  // Reset pagination whenever search or filters change
  React.useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [search, filters, setPagination]);

  // Get stats Data

  const { data: StatusData, isLoading: StatusLoading } =
    useGetProjectStatsQuery(projectId);

  if (StatusLoading) {
    return <ContentLoader className="w-full h-full" />;
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

  // Define columns with access to handleGenerateThreats and handleDelete inside the component
  const columns = [
    {
      accessorKey: 'Endpoint',
      header: ({ column }) => (
        <DataGridColumnHeader title="Endpoint" column={column} />
      ),
      cell: ({ row }) => (
        <div>
          <>
            <p>
              {row?.original?.name.length > 70
                ? row.original.name.slice(0, 70) + '...'
                : row.original.name || 'Unknown'}
            </p>
            <div className="flex items-center gap-2">
             
              <div>
                {row?.original?.raw_request ? (
                  <FullRequest 
                    raw={row.original.raw_request} 
                    generated={row?.original?.threats_generated} 
                    onClick={() => handleGenerateThreats(row.original._id)} 
                    triggerBtn={
                    <p className="text-[11px] text-primary cursor-pointer">
                      {row?.original?.url.length > 50 ? row.original.url.slice(0, 50) + '...' : row.original.url}
                    </p>
                    }  
                  />
                ) : (
                  <p className="text-[11px] text-primary cursor-pointer">
                    {row?.original?.url.length > 50 ? row.original.url.slice(0, 50) + '...' : row.original.url}
                  </p>
                )}
              </div>
            </div>
          </>
        </div>
      ),
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
      cell: ({ row }) => (
        <Badge appearance="outline">{row.original.host}</Badge>
      ),
      enableSorting: false,
      size: 150,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      accessorKey: 'threatcount',
      header: ({ column }) => (
        <DataGridColumnHeader title="Total Threats" column={column} />
      ),
      cell: ({ row }) =>
        row.original.threats.length > 0 ? (
          <CustomTooltip text={'View Threats for this Endpoint'}>
            <Link
              target="_blank"
              to={`/threat-modeler/threats?endpointId=${row.original._id}`}
              className=" hover:underline hover:text-primary"
            >
              {row.original.threats?.length}
            </Link>
          </CustomTooltip>
        ) : (
          <p>{row.original.threats?.length || 0}</p>
        ),

      size: 150,
      enableSorting: true,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      accessorKey: 'threatgenerated',
      header: ({ column }) => (
        <DataGridColumnHeader title="Threat Generated" column={column} />
      ),
      cell: ({ row }) => (
        <Badge
          variant={row.original.threats_generated ? 'warning' : 'success'}
          appearance="outline"
        >
          {row.original.threats_generated ? 'Generated' : 'Pending'}
        </Badge>
      ),
      size: 150,
      enableSorting: true,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'actions',
      header: ({ column }) => (
        <DataGridColumnHeader title="Actions" column={column} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            {row.original.threats_generated ? (
              <CustomTooltip text="Re-Generate Threats">
                <ButtonWithConfirm
                  variant="ghost"
                  confirm={true}
                  onConfirm={() => handleGenerateThreats(row.original._id)}
                >
                  <RotateCcw />
                </ButtonWithConfirm>
              </CustomTooltip>
            ) : (
              <CustomTooltip text="Generate Threats">
                <AuthorityGuard roles={['Admin']}>
                  <ButtonWithConfirm
                    variant="ghost"
                    confirm={true}
                    onConfirm={() => handleGenerateThreats(row.original._id)}
                  >
                    <RefreshCcwDot />
                  </ButtonWithConfirm>
                </AuthorityGuard>
              </CustomTooltip>
            )}

            <CustomTooltip text="Delete Endpoint">
              <AuthorityGuard roles={['Admin']}>
                <ButtonWithConfirm
                  variant="ghost"
                  confirm={true}
                  onConfirm={() => handleDelete(row.original._id)}
                >
                  <Trash />
                </ButtonWithConfirm>
              </AuthorityGuard>
            </CustomTooltip>
          </div>
        );
      },
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
  ];

  return (
    <div>
      <div className="flex justify-end mb-3 -mt-4">
        <ImportEndpointsModel showText />
      </div>
      <div className="mb-4">
        <EndpointMetrics metrics={StatusData} />
      </div>
      <Table
        data={data?.endpoints || []}
        columns={columns}
        search={search}
        setSearch={setSearch}
        pagination={pagination}
        setPagination={setPagination}
        totalPages={
          data?.total ? Math.ceil(data.total / pagination.pageSize) : 0
        }
        sorting={sorting}
        setSorting={setSorting}
        isLoading={isLoading || isFetching}
        enableSearch={true}
        enableSorting={true}
        manualSorting={true}
        manualPagination={true}
        showPagination={true}
        toolbar={<EndpointsTableToolbar supportedFilters={data?.filters} />}
      />
    </div>
  );
}

export default Endpoints;
