import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import { AssessmentBadges } from '@/components/custom/assessment-states';
import { DateFormatter } from '@/components/custom/date-formatter';
import Table from '@/components/custom/table';
import { VulnerabilityLables } from '@/components/custom/vulnerability-labels';
import RemediationProgress from '../../../assets/components/ui/remediation-progress';
import { useStore } from '../../store';
import TableToolbarFilters from '../../../../../../components/common/table-toolbar-filters';

const buildVulnItems = (metrics = {}) =>
  [
    { number: metrics?.critical, label: 'C' },
    { number: metrics?.high, label: 'H' },
    { number: metrics?.medium, label: 'M' },
    { number: metrics?.low, label: 'L' },
    { number: metrics?.info, label: 'I' },
  ].filter((item) => item.number);

const getColumns = () => [
  {
    id: 'title',
    accessorFn: (row) => row.title,
    header: ({ column }) => (
      <DataGridColumnHeader title="Name" column={column} />
    ),
    cell: ({ row }) => {
      const assessment = row.original;
      return (
        <div className="flex flex-col gap-1">
          <Link
            to={`/vm/assessment-edit?assessmentId=${assessment?._id}`}
            className="text-sm font-medium text-mono hover:text-primary"
          >
            {assessment?.title || 'Untitled Assessment'}
          </Link>
        </div>
      );
    },
    enableSorting: false,
    size: 320,
    meta: {
      cellClassName: 'align-top',
      skeleton: <Skeleton className="h-6 w-full" />,
    },
  },
  // {
  //   id: 'department',
  //   accessorFn: (row) => row.departments,
  //   header: ({ column }) => (
  //     <DataGridColumnHeader title="Department" column={column} />
  //   ),
  //   cell: ({ row }) => {
  //     return (
  //       <>
  //         {
  //           row.original?.departments?.length > 0 ? (
  //             row.original?.departments?.map(d => <Badge className=" h-fit w-fit" variant="secondary">{d?.name || "Not Set"}</Badge>)
  //           ) : (
  //             <Badge variant="secondary">Not Set</Badge>
  //           )
  //         }
  //       </>
  //     );
  //   },
  //   enableSorting: false,
  //   size: 120,
  //   meta: {
  //     skeleton: <Skeleton className="h-6" />,
  //   },
  // },
  {
    id: 'state',
    accessorFn: (row) => row.state,
    header: ({ column }) => (
      <DataGridColumnHeader title="State" column={column} />
    ),
    cell: ({ row }) => {
      const total = row.original.totalVulns ?? 0;
      const resolved = row.original.resolvedVulns ?? 0;
      return (
        <div className="flex flex-wrap">
          <AssessmentBadges
            state={row.original.state}
            resolved={total == 0 ? -1 : Math.max(total - resolved, 0)}
          />
        </div>
      );
    },
    enableSorting: false,
    size: 140,
    meta: {
      skeleton: <Skeleton className="h-6 w-full" />,
    },
  },
  {
    id: 'vulnCount',
    accessorFn: (row) => row.vulnMetrics,
    header: ({ column }) => (
      <DataGridColumnHeader title="Vulnerabilities" column={column} />
    ),
    cell: ({ row }) => (
      <VulnerabilityLables items={buildVulnItems(row.original.vulnMetrics)} />
    ),
    enableSorting: true,
    size: 250,
    meta: {
      skeleton: <Skeleton className="h-6 w-full" />,
    },
  },
  {
    id: 'progress',
    accessorFn: (row) => row.resolvedVulns,
    header: ({ column }) => (
      <DataGridColumnHeader title="Remediation Progress" column={column} />
    ),
    cell: ({ row }) => {
      const percent = row.original?.remediationProgress ?? 0;
      return (
        <div>
          <RemediationProgress progress={percent} />
        </div>
      );
    },
    enableSorting: true,
    size: 150,
    meta: {
      skeleton: <Skeleton className="h-6 w-full" />,
    },
  },
  {
    id: 'createdAt',
    accessorFn: (row) => row.createdAt,
    header: ({ column }) => (
      <DataGridColumnHeader title="Created At" column={column} />
    ),
    cell: ({ row }) => {
      const assessment = row.original;
      return <DateFormatter date={assessment?.createdAt} />;
    },
    enableSorting: true,
    size: 100,
    meta: {
      skeleton: <Skeleton className="h-6 w-full" />,
    },
  },
];

function AssessmentTable({ data, isLoading, isFetching }) {
  const pagination = useStore((state) => state.pagination);
  const setPagination = useStore((state) => state.setPagination);
  const sorting = useStore((state) => state.sorting);
  const setSorting = useStore((state) => state.setSorting);
  const rowSelection = useStore((state) => state.rowSelection);
  const setRowSelection = useStore((state) => state.setRowSelection);
  const searchQuery = useStore((state) => state.searchQuery);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);

  const columns = getColumns();

  return (
    <Table
      data={data?.assessments || []}
      columns={columns}
      pagination={pagination}
      setPagination={setPagination}
      sorting={sorting}
      setSorting={setSorting}
      rowSelection={rowSelection}
      setRowSelection={setRowSelection}
      search={searchQuery}
      setSearch={setSearchQuery}
      searchPlaceholder="Type Assessment Title"
      searchWidth="56"
      totalPages={data?.totalPages}
      totalCount={data?.totalItems}
      isLoading={isLoading || isFetching}
      toolbar={<TableToolbarFilters supportedFilters={data?.advanced_filters} filters={filters} setFilters={setFilters} isLoadingFilters={isLoading}/>}
      enableSorting={true}
      grid
    />
  );
}

export default AssessmentTable;
