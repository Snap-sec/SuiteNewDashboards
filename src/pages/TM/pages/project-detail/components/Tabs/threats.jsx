import { useState } from 'react';
import { RefreshCcw } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import useHandleFilterChange from '@/hooks/use-handle-filter-change';
import { useGetProjectStatsQuery } from '@/services/tm/projectApi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import {
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from '@/components/ui/data-grid-table';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyScreen } from '@/components/common/empty-screen';
import FilterButton from '@/components/custom/filter-toolbar/filter-button';
import { Profile } from '@/components/custom/profile';
import { CustomTooltip } from '@/components/custom/tooltip';
import SeverityLabel from '../../../../../../components/custom/severity-label';
import { StatusBadge } from '../../../../../../components/custom/status-badge';
import Table from '../../../../../../components/custom/table';
import { useGetProjectThreatsQuery } from '../../../../../../services/tm/projectApi';
import FullRequest from '../../../threats-detail/components/full-request';
import ManualImportThreatModel from '../../../threats/components/Manual-import-threate-model';
import ThreatsBulkUpdate from '../../../threats/threats-bulk-update';
import ImportEndpointsModel from '../import-endpoints-model';
import ImportThreatsCSVModel from '../import-threats-csv-models';
import ThreatsMetrics from '../threats-matrics';

const columns = [
  // Add the selection column at the beginning
  {
    accessorKey: '_id',
    accessorFn: (row) => row._id,
    header: () => <DataGridTableRowSelectAll />,
    cell: ({ row }) => <DataGridTableRowSelect row={row} />,
    enableSorting: false,
    enableHiding: false,
    enableResizing: false,
    size: 10,
    meta: {
      cellClassName: '',
    },
  },
  {
    id: 'Title',
    header: 'Title',
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <div>
            <Link
              to={`/threat-modeler/threat-detail/${row?.original?._id}`}
              className="leading-none font-medium text-sm text-mono hover:text-primary truncate max-w-90"
            >
              {row?.original?.title}
            </Link>
            <p className="text-[12px] text-slate-500 truncate max-w-90">
              {row?.original?.endpointId?.url}
            </p>
          </div>

          <div className="-mt-2">
            {row?.original?.endpointId?.raw_request ? (
              <FullRequest
                raw={row?.original?.endpointId?.raw_request}
                showGenerateThreatButton={false}
              />
            ) : (
              ''
            )}
          </div>
        </div>
      );
    },
    size: 200,
    meta: {
      cellClassName: '',
      skeleton: <Skeleton className="h-7" />,
    },
  },

  {
    id: 'owner',
    accessorFn: (row) => row.owner,
    header: ({ column }) => (
      <DataGridColumnHeader title="Owner" column={column} />
    ),
    cell: ({ row }) => (
      <Profile
        name={
          row.original.owner?.name ? `${row.original.owner?.name}` : 'No Owner'
        }
        email={row.original.owner?.email || row.original.owner?.email || ' '}
      />
    ),

    enableSorting: false,
    size: 150,
    meta: {
      cellClassName: '',
      skeleton: <Skeleton className="h-7" />,
    },
  },

  {
    id: 'State',
    header: 'state',
    cell: ({ row }) => {
      return <StatusBadge status={row?.original?.state} />;
    },
    size: 70,
    meta: {
      cellClassName: '',
      skeleton: <Skeleton className="h-7" />,
    },
  },

  {
    id: 'severity',
    header: 'Severity',
    cell: ({ row }) => {
      return <SeverityLabel severity={row?.original?.severity} />;
    },
    size: 70,
    meta: {
      cellClassName: '',
      skeleton: <Skeleton className="h-7" />,
    },
  },

  {
    id: 'confidence.score',
    accessorFn: (row) => row.confidence.score,
    header: ({ column }) => (
      <DataGridColumnHeader title="Confidence" column={column} />
    ),
    cell: ({ row }) => {
      return <Badge>{row?.original?.confidence?.value}</Badge>;
    },

    sortable: true,
    enableSorting: true,

    size: 70,
    meta: {
      cellClassName: '',
      skeleton: <Skeleton className="h-7" />,
    },
  },
];

function TableToolbar({ supportedFilters, filters, setFilters }) {
  const severityFilters =
    supportedFilters?.severity?.map((severity) => ({
      id: severity,
      label: severity,
      value: severity,
    })) || [];
  const stateFilters =
    supportedFilters?.state?.map((state) => ({
      id: state,
      label: state,
      value: state,
    })) || [];
  const ownerFilters =
    supportedFilters?.owners?.map((state) => ({
      id: state,
      label: state,
      value: state,
    })) || [];

  const { handleFilterChange } = useHandleFilterChange(setFilters);

  return (
    <div className="flex gap-2 items-center">
      <CustomTooltip text="Filter by Severity">
        <FilterButton
          title="Severity"
          defaultValue={filters.severity}
          filters={severityFilters}
          onChange={handleFilterChange('severity')}
        />
      </CustomTooltip>
      <CustomTooltip text="Filter by State">
        <FilterButton
          title="State"
          defaultValue={filters.state}
          filters={stateFilters}
          onChange={handleFilterChange('state')}
        />
      </CustomTooltip>
      <CustomTooltip text="Filter by Owner">
        <FilterButton
          title="Owner"
          defaultValue={filters['owner.email']}
          filters={ownerFilters}
          onChange={handleFilterChange('owner.email')}
        />
      </CustomTooltip>
      <CustomTooltip text="Clear all applied Filters">
        <Button variant="outline" onClick={() => setFilters(() => ({}))}>
          <RefreshCcw />
          Reset
        </Button>
      </CustomTooltip>
    </div>
  );
}
function Threats() {
  const { projectId } = useParams();

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 25 });
  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});

  const selectedRowsCount = Object.keys(rowSelection).length;

  const { data, isLoading, isFetching } = useGetProjectThreatsQuery({
    projectId,
    search,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    ...filters,
    ...(sorting?.length
      ? { sortBy: sorting[0]?.id, sort: sorting[0]?.desc ? 'desc' : 'asc' }
      : {}),
  });

  const { data: StatusData, isLoading: StatusLoading } =
    useGetProjectStatsQuery(projectId);

  // Check if there are any active filters or search terms
  const hasActiveFiltersOrSearch =
    search.trim() !== '' || Object.keys(filters).length > 0;

  // Only show empty screen if no data AND no active search/filters
  if (data?.total === 0 && !hasActiveFiltersOrSearch && !isLoading) {
    return (
      <EmptyScreen
        title="No Threats Found"
        subTitle="There are no threats found in this project!"
        engage={
          <div className="flex items-center gap-4">
            <ImportThreatsCSVModel showText={true} />
            <ManualImportThreatModel showText={true} />
          </div>
        }
        showTitle={false}
      />
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-3 -mt-4 gap-2">
        <ImportThreatsCSVModel />
        <ManualImportThreatModel />
      </div>

      {selectedRowsCount > 1 && (
        <ThreatsBulkUpdate
          threats={data?.threats}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          projectId={projectId}
          showEndpoints={true}
        />
      )}

      <div className="mb-4">
        <ThreatsMetrics metrics={StatusData} isLoading={StatusLoading} />
      </div>

      <Table
        data={data?.threats || []} // Add fallback to prevent undefined errors
        columns={columns}
        search={search}
        setSearch={setSearch}
        pagination={pagination}
        setPagination={setPagination}
        totalPages={Math.ceil((data?.total || 0) / pagination.pageSize)} // Add fallback
        sorting={sorting}
        setSorting={setSorting}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        isLoading={isLoading || isFetching}
        enableSearch={true}
        enableSorting={true}
        manualPagination={true}
        manualSorting={true}
        showPagination={true}
        toolbar={
          <TableToolbar
            supportedFilters={data?.filters}
            filters={filters}
            setFilters={setFilters}
          />
        }
      />
    </div>
  );
}

export default Threats;
