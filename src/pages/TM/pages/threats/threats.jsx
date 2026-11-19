import { useState } from 'react';
import { RefreshCcw } from 'lucide-react';
import { Link } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import useHandleFilterChange from '@/hooks/use-handle-filter-change';
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
import Table from '@/components/custom/table';
import { CustomTooltip } from '@/components/custom/tooltip';
import PageHeading from '../../../../components/custom/page-heading';
import { Profile } from '../../../../components/custom/profile';
import SeverityLabel from '../../../../components/custom/severity-label';
import { StatusBadge } from '../../../../components/custom/status-badge';
import { useGetThreatsQuery } from '../../../../services/tm/threatApi';
import FullRequest from '../threats-detail/components/full-request';
import ManualImportThreatModel from './components/Manual-import-threate-model';
import ThreatsBulkUpdate from './threats-bulk-update';
import { Helmet } from 'react-helmet';
import useDebounce from '@/hooks/use-debounce';

const columns = [
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
    accessorKey: 'Title',
    header: 'Title',
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Link to={`/threat-modeler/threat-detail/${row?.original?._id}`}>
            <p className="leading-none font-medium text-sm text-mono hover:text-primary truncate max-w-90">
              {row?.original?.title}
            </p>
            <p className="text-[11px] text-slate-500 truncate max-w-80">
              {row?.original?.endpoint?.url}
            </p>
          </Link>
          <div className="-mt-2">
            {row?.original?.endpoint?.raw_request ? (
              <FullRequest raw={row?.original?.endpoint?.raw_request} showGenerateThreatButton={false} />
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
    accessorKey: 'Owner',
    header: 'Owner',
    cell: ({ row }) => {
      return (
        // <p>{row?.original?.state}</p>
        <div>
          <Profile
            email={row.original?.owner?.email || row.original?.owner?.userId}
            name={row.original?.owner?.name || 'Unknown'}
          />
        </div>
      );
    },
    size: 70,
    meta: {
      cellClassName: '',
      skeleton: <Skeleton className="h-7" />,
    },
  },

  {
    accessorKey: 'Project',
    header: 'Project',
    cell: ({ row }) => {
      return (
        // <p>{row?.original?.state}</p>
        <div>
          <Link
            to={`/threat-modeler/projects/${row.original.project?._id}?name=${row.original.project?.name}`}
          >
            <Badge className=" hover:underline">
              {row.original.project?.name}
            </Badge>
          </Link>
        </div>
      );
    },
    size: 70,
    meta: {
      cellClassName: '',
      skeleton: <Skeleton className="h-7" />,
    },
  },

  {
    accessorKey: 'State',
    header: 'State',
    cell: ({ row }) => {
      return (
        // <p>{row?.original?.state}</p>
        <div>
          <StatusBadge status={row?.original?.state} />
        </div>
      );
    },
    size: 70,
    meta: {
      cellClassName: '',
      skeleton: <Skeleton className="h-7" />,
    },
  },

  {
    accessorKey: 'severity',
    header: 'Severity',
    cell: ({ row }) => {
      return (
        <div>
          <SeverityLabel severity={row?.original?.severity} />
        </div>
      );
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
  const [params, setParams] = useSearchParams();

  const severityFilters =
    supportedFilters?.severity?.map((severity) => ({
      id: severity,
      label: severity,
      value: severity,
    })) || [];
  const stateFilters =
    supportedFilters?.states?.map((state) => ({
      id: state,
      label: state,
      value: state,
    })) || [];
  const projectFilters =
    supportedFilters?.projects?.map((state) => ({
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
  const confidenceFilters =
    supportedFilters?.confidence?.map((state) => ({
      id: state,
      label: state,
      value: state,
    })) || [];

  const collectionFilters =
    supportedFilters?.collections?.map((state) => ({
      id: state,
      label: state,
      value: state,
    })) || [];

  const { handleFilterChange } = useHandleFilterChange(setFilters);

  console.log('filters: ', filters);

  return (
    <div className="flex gap-2 items-center">
      <CustomTooltip text="Filter by Projects">
        <FilterButton
          title="Projects"
          defaultValue={filters['project.name']}
          filters={projectFilters}
          onChange={handleFilterChange('project.name')}
        />
      </CustomTooltip>
      <CustomTooltip text="Filter by Collections">
        <FilterButton
          title="Collections"
          defaultValue={filters['collection.name']}
          filters={collectionFilters}
          onChange={handleFilterChange('collection.name')}
        />
      </CustomTooltip>
      <CustomTooltip text="Filter by Severity">
        <FilterButton
          title="Severity"
          defaultValue={filters.severity}
          filters={severityFilters}
          onChange={handleFilterChange('severity')}
        />
      </CustomTooltip>
      <CustomTooltip text="Filter by Severity">
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
      <CustomTooltip text="Filter by Confidence">
        <FilterButton
          title="Confidence"
          defaultValue={filters['confidence.value']}
          filters={confidenceFilters}
          onChange={handleFilterChange('confidence.value')}
        />
      </CustomTooltip>
      <CustomTooltip text="Clear all applied Filter">
        <Button
          variant="outline"
          onClick={() => {
            setFilters({});
            setParams({});
          }}
        >
          <RefreshCcw />
          Reset
        </Button>
      </CustomTooltip>
    </div>
  );
}
function Threats() {
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 25 });
  const [sorting, setSorting] = useState([]);
  const [filters, setFilters] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const debouncedSearch = useDebounce(search, 400)

  const selectedRowsCount = Object.keys(rowSelection).length;

  const [params, setParams] = useSearchParams();

  const pageFilters = {
    ...(params.get('endpointId')
      ? { endpointId: params.get('endpointId') }
      : {}),
  };

  const { data, isLoading, isFetching } = useGetThreatsQuery({
    search:debouncedSearch,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    ...filters,
    ...pageFilters,
    ...(sorting?.length
      ? { sortBy: sorting[0]?.id, sort: sorting[0]?.desc ? 'desc' : 'asc' }
      : {}),
  });

  if (data?.total === 0 && !search && Object.keys(filters).length === 0) {
    return (
      <EmptyScreen
        title="No Threats Found"
        subTitle="You have not created any projects yet!"
        engage={<ManualImportThreatModel showText={true} />}
      />
    );
  }

  return (
    <div className="p-4">
      <Helmet>
        <title>Threat Modeler | Threats </title>
      </Helmet>
      <div className="flex items-center justify-between mb-4">
        <PageHeading title="Threats" description="List of threats" />
        <ManualImportThreatModel showText={true} />
      </div>

      {selectedRowsCount > 1 && (
        <ThreatsBulkUpdate
          threats={data?.threats}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
        />
      )}

      <Table
        data={data?.threats || []}
        columns={columns}
        searchPlaceholder={"Search Threats..."}
        search={search}
        setSearch={setSearch}
        pagination={pagination}
        setPagination={setPagination}
        totalPages={Math.ceil(data?.total / pagination.pageSize)}
        sorting={sorting}
        setSorting={setSorting}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        isLoading={isLoading || isFetching}
        enableSearch={true}
        enableSorting={true}
        manualSorting={true}
        manualPagination={true}
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
