import { useState, useEffect, useMemo } from 'react';
import { Info, RotateCcw } from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyScreen } from '@/components/common/empty-screen';
import { DateFormatter } from '@/components/custom/date-formatter';
import SeverityLabel from '@/components/custom/severity-label';
import Table from '@/components/custom/table';
import TableToolbarFilters from '../../../../../components/common/table-toolbar-filters';
import { StateLabels } from '../../../../../components/custom/state-labels';
import { useGetApiSecVulnsQuery } from '../../../../../services/apisec/vulnerabilityApi';
import VulnerabilityActions from '../../../vulnerabilities/components/vulnerability-actions';
import VulnInfo from '../../../vulnerabilities/components/vuln-info';
import MetricsCard from '../../../vulnerabilities/components/metrics-card';
import SendToVM from '../../../vulnerabilities/components/actions/send-to-vm';
import AuthorityGuard from '../../../../../components/custom/authority-guard/AuthorityGuard';


const getColumns = (disableSync) => [
  {
    id: 'Title',
    header: ({ column }) => (
      <DataGridColumnHeader title="Title" column={column} />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex flex-col gap-1">
          <VulnInfo data={row?.original} title={row?.original?.title} />

          <p className="flex items-center gap-2 text-sm font-normal text-muted-foreground">
            {row?.original?.transformedRequestSnapshot?.url?.length > 50
              ? `${row?.original?.transformedRequestSnapshot?.url.substring(0, 50)}...`
              : row?.original?.transformedRequestSnapshot?.url}
          </p>
        </div>
      );
    },
    size: 250,
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

    cell: ({ row }) => (
      <StateLabels state={row?.original?.status} />
    ),

    enableSorting: false,
    size: 70,
    meta: {
      cellClassName: '',
      skeleton: <Skeleton className="h-7" />,
    },
  },
  {
    id: 'severity',
    header: ({ column }) => (
      <DataGridColumnHeader title="Severity" column={column} />
    ),
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
    id: "reportedOn",
    accessorFn: (row) => row.firstDetectedAt,
    header: ({ column }) => (
      <DataGridColumnHeader
        title="Detected On"
        column={column}
      />
    ),
    cell: ({ row }) => (
      <div className="flex flex-col gap-1 justify-center">
        <DateFormatter
          date={row?.original?.firstDetectedAt}
          className="text-sm font-medium"
        />

        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-normal">
          <RotateCcw className="size-3" />
          <DateFormatter date={row?.original?.lastDetectedAt} />
        </div>
      </div>
    ),
    enableSorting: true,
    size: 70,
    meta: {
      cellClassName: "",
      skeleton: <Skeleton className="h-7" />,
    },
  },

  {
    id: 'vmTicket',
    accessorFn: (row) => row._id,
    header: ({ column }) => (
      <DataGridColumnHeader title="VM Ticket" column={column} />
    ),
    cell: ({ row }) => <SendToVM row={row.original} disableSync={disableSync} />,
    enableSorting: false,
    size: 90,
    meta: {
      cellClassName: '',
      skeleton: <Skeleton className="h-7" />,
    },
  },

  {
    id: 'actions',
    accessorFn: (row) => row._id,
    header: ({ column }) => (
      <DataGridColumnHeader title="" column={column} />
    ),
    cell: ({ row }) => <VulnerabilityActions data={row.original} />,
    enableSorting: false,
    size: 50,
    meta: {
      cellClassName: '',
      skeleton: <Skeleton className="h-7" />,
    },
  },
];

function Threats() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState('');

  const [filters, setFilters] = useState(() => {
    const severity = searchParams.get('severity');
    const scannerId = searchParams.get('scannerId');
    const ruleId = searchParams.get('ruleId');
    const initialFilters = { supressed: 'false' };
    if (severity) {
      initialFilters.severity = severity;
    }
    if (scannerId) {
      initialFilters.scannerId = scannerId;
    }
    if (ruleId) {
      initialFilters.ruleId = ruleId;
    }
    return initialFilters;
  });

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 25 });
  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    const severity = searchParams.get('severity');
    const scannerId = searchParams.get('scannerId');
    const ruleId = searchParams.get('ruleId');
    setFilters((prev) => {
      let next = { ...prev };
      if (severity) {
        next.severity = severity;
      } else {
        delete next.severity;
      }
      if (scannerId) {
        next.scannerId = scannerId;
      } else {
        delete next.scannerId;
      }
      if (ruleId) {
        next.ruleId = ruleId;
      } else {
        delete next.ruleId;
      }
      return next;
    });
  }, [searchParams]);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [search, filters]);

  const { data, isLoading, isFetching } = useGetApiSecVulnsQuery({
    projectId: id,
    search,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    ...filters,
    ...(sorting?.length
      ? { sortBy: sorting[0]?.id, sort: sorting[0]?.desc ? 'desc' : 'asc' }
      : {}),
  }, { pollingInterval: 10000 });

  const disableSync = data?.metadata?.vm_configuration_exists === false;
  const columns = useMemo(() => getColumns(disableSync), [disableSync]);

  const defaultFilters = { supressed: 'false' };

  const filtersEqualDefault =
    Object.keys(defaultFilters).length === Object.keys(filters).length &&
    Object.keys(defaultFilters).every((k) => filters[k] === defaultFilters[k]);

  const hasActiveFiltersOrSearch = search.trim() !== '' || !filtersEqualDefault;

  if (data?.pagination?.total === 0 && !hasActiveFiltersOrSearch && !isLoading) {
    return (
      <EmptyScreen
        title="No Vulnerabilities Found"
        subTitle="When new vulnerabilities are Found, they will show here."
        engage={
          <AuthorityGuard forbidRoles={['Auditor']}>
            <Button
              onClick={() => {
                navigate('?tab=scan-settings');
              }}
            >
              Go to Scan Settings
            </Button>
          </AuthorityGuard>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <MetricsCard metrics={data?.summary} isLoading={isLoading} />
      </div>
      <Table
        grid
        data={data?.data || []}
        columns={columns}
        search={search}
        setSearch={setSearch}
        pagination={pagination}
        setPagination={setPagination}
        totalCount={data?.pagination?.total}
        totalPages={Math.ceil(
          (data?.pagination?.total || 0) / pagination.pageSize,
        )}
        sorting={sorting}
        setSorting={setSorting}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        isLoading={isLoading}
        enableSearch={true}
        enableSorting={true}
        manualPagination={true}
        manualSorting={true}
        showPagination={true}
        toolbar={
          <TableToolbarFilters
            supportedFilters={data?.advanced_filters}
            filters={filters}
            setFilters={setFilters}
            isLoadingFilters={isLoading}
          />
        }
      />
    </div>
  );
}

export default Threats;