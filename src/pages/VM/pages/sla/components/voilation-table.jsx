;
// voilation-table.jsx - Table rendering and pagination handling
import { useMemo } from 'react';
import { CircleAlert, CircleEllipsis, FileBadge2, Globe, LayoutPanelLeft, MapPin, Server, Settings, Users } from 'lucide-react';
import { Link } from 'react-router';
import { Badge } from '@/components/ui/badge';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import { Profile } from '@/components/custom/profile';
import Table from '@/components/custom/table';
import TableToolbarFilters from '../../../../../components/common/table-toolbar-filters';
import SeverityLabel from '../../../../../components/custom/severity-label';
import { StateLabels } from '../../../../../components/custom/state-labels';
import useStore from '../store';


const getSeverityVariant = (severity) => {
  switch ((severity || '').toLowerCase()) {
    case 'critical':
      return 'destructive';
    case 'high':
      return 'warning';
    case 'medium':
      return 'secondary';
    case 'low':
      return 'success';
    default:
      return 'outline';
  }
};

function getColumns(isLoading) {
  return [
    {
      id: 'title',
      accessorFn: (row) => row.title,
      header: ({ column }) => (
        <DataGridColumnHeader title="Title" column={column} />
      ),
      cell: ({ row }) => (
        <div>
          <Link
            to={`/vm/vulnerability-report?id=${row.original?._id}&assessmentId=${row.original?.assessmentId?._id}`}
            title={row.original.title}
            className="font-medium hover:text-primary cursor-pointer line-clamp-1"
          >
            {row.original.title}
          </Link>
          {/* <p className='text-xs text-muted-foreground font-normal'>
            {row.original.affectedAssets[0]?.value}
          </p> */}
        </div>
      ),
      enableSorting: false,
      size: 250,
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'assessmentName',
      accessorFn: (row) => row.title,
      header: ({ column }) => (
        <DataGridColumnHeader title="Assessment Name" column={column} />
      ),
      cell: ({ row }) => (
        <>
          <p>{row.original?.assessmentName}</p>
          {/* <p className='text-sm text-muted-foreground'>
            sadsad
          </p> */}
        </>
      ),
      enableSorting: false,
      size: 200,
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'severity',
      accessorFn: (row) => row.severity,
      header: ({ column }) => (
        <DataGridColumnHeader title="Severity" column={column} />
      ),
      cell: ({ row }) => <SeverityLabel severity={row.original.severity} />,
      enableSorting: true,
      size: 80,
      meta: { skeleton: <Skeleton className="h-7" /> },
    },
    {
      id: 'status',
      accessorFn: (row) => row.violationType,
      header: ({ column }) => (
        <DataGridColumnHeader title="Status" column={column} />
      ),
      cell: ({ row }) => (
        <div className="flex flex-wrap">
          <StateLabels state={row.original.state} />
        </div>
      ),
      size: 120,
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'assignee',
      accessorFn: (row) => row.assignee?.name,
      header: ({ column }) => (
        <DataGridColumnHeader title="Owner" column={column} />
      ),
      cell: ({ row }) => (
        <Profile
          name={row.original.assignee?.name || 'Unassigned'}
          email={row.original.assignee?.email || ''}
        />
      ),
      size: 150,
      enableSorting: false,
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'daysOverdue',
      accessorFn: (row) => row.daysOverdue,
      header: ({ column }) => (
        <DataGridColumnHeader title="Time Overdue" column={column} />
      ),
      cell: ({ row }) => (
        <DetailedHoverPopover
          buttonText={
            <Badge
              appearance="outline"
              variant="destructive"
              className="flex items-center w-fit gap-2 cursor-pointer"
            >
              {row.original.daysOverdue} days
              <CircleAlert size={12} className="opacity-70" />
            </Badge>
          }
          showBadge={false}
          popoverTitle="SLA Overdue"
          popoverContent={
            <p className="text-muted-foreground">
              The vulnerability has passed its SLA deadline by{' '}
              <strong>{row.original.daysOverdue}</strong> days.
            </p>
          }
        />
      ),
      size: 100,
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },
  ];
}

function VoilationTable({ data, isLoading, isFetching, pagination, setPagination }) {
  const sorting = useStore((state) => state.sorting);
  const setSorting = useStore((state) => state.setSorting);
  const searchQuery = useStore((state) => state.searchQuery);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);

  const columns = useMemo(() => getColumns(isLoading), [isLoading]);

  const totalPages = data && data.total && data.limit
    ? Math.ceil(Number(data.total) / Number(data.limit))
    : 1;

  return (
    <Table
      data={data?.violations || data || []}
      columns={columns}
      isLoading={isLoading || isFetching}
      totalPages={totalPages || 1}
      totalCount={data?.total || 0}
      pagination={pagination}
      setPagination={setPagination}
      sorting={sorting}
      setSorting={setSorting}
      search={searchQuery}
      setSearch={setSearchQuery}
      grid={true}
      toolbar={
        <TableToolbarFilters
          filters={filters}
          setFilters={setFilters}
          supportedFilters={data?.advanced_filters || []}
          isLoadingFilters={isLoading}
        />
      }
      enableSorting={true}
    />
  );
}

export default VoilationTable;