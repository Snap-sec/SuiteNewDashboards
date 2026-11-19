import { useMemo } from 'react';
import { ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Profile } from '@/components/custom/profile';
import SeverityLabel from '@/components/custom/severity-label';
import { StateLabels } from '@/components/custom/state-labels';
import Table from '@/components/custom/table';
import useStore from '../../store';
import UnarchiveVuln from '../actions/unarchive-vuln';
import TableToolbarFilters from '@/components/common/table-toolbar-filters';
import { useAuth } from '@/auth/context/auth-context';

function getColumns(isAuditor = false) {
  return [
    {
      id: 'title',
      accessorFn: (row) => row.title,
      header: ({ column }) => (
        <DataGridColumnHeader title="Title" column={column} />
      ),

      cell: ({ row }) => (
        <Link
          to={`/vm/vulnerability-report-view?archiveId=${row?.original?._id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="leading-none font-medium text-sm text-mono hover:text-primary"
        >
          <div className="flex flex-col gap-1 lg:gap-2.5">
            <div className="flex items-center gap-1">
              {row?.original?.full_document?.blockers?.length > 0 && (
                <ShieldAlert size={15} className="text-destructive" />
              )}
              <p>
                {row?.original?.full_document?.title?.length > 50
                  ? `${row?.original?.full_document?.title.substring(0, 50)}...`
                  : row?.original?.full_document?.title}
              </p>
            </div>

            {/* <p className="text-gray-500 whitespace-normal break-words">
              {row.original?.full_document?.affectedAssets[0]?.assetName ||
                row.original?.full_document?.affectedAssets[0]?.value ||
                'No Associated Asset'}
            </p> */}
          </div>
        </Link>
      ),

      enableSorting: false,
      size: 400,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'Archived By',
      accessorFn: (row) => row.archivedBy,
      header: ({ column }) => (
        <DataGridColumnHeader title="Archived By" column={column} />
      ),
      cell: ({ row }) => {
        const archivedBy = row.original?.archivedBy;
        if (!archivedBy || !archivedBy.name) {
          return <span className="text-gray-500 italic text-sm">System</span>;
        }

        return (
          <Profile
            name={archivedBy.name}
            // role={archivedBy.email || ' '}
            email={archivedBy.email || ' '}
          />
        );
      },

      enableSorting: false,
      size: 200,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },

    {
      id: 'state',
      accessorFn: (row) => row.eventType,
      header: ({ column }) => (
        <DataGridColumnHeader title="State" column={column} />
      ),

      cell: ({ row }) => (
        <StateLabels state={row?.original?.full_document?.state} />
      ),

      enableSorting: false,
      size: 70,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },

    {
      id: 'Severity',
      accessorFn: (row) => row.severity,
      header: ({ column }) => (
        <DataGridColumnHeader title="Severity" column={column} />
      ),

      cell: ({ row }) => (
        <SeverityLabel score={row?.original?.full_document?.cvssScore} />
      ),

      enableSorting: true,
      size: 60,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },

    ...(!isAuditor
      ? [
          {
            id: 'Actions',
            accessorFn: (row) => row.createdAt,
            header: ({ column }) => (
              <DataGridColumnHeader title="" column={column} />
            ),
            cell: ({ row }) => <UnarchiveVuln row={row} />,
            enableSorting: false,
            size: 40,
            meta: {
              cellClassName: '',
              skeleton: <Skeleton className="h-7" />,
            },
          },
        ]
      : []),
  ];
}

function VulnList({ data, isLoading, isFetching, supportedFilters }) {
  const { user } = useAuth();
  const isAuditor = user?.role === 'Auditor';

  const pagination = useStore((state) => state.pagination);
  const searchQuery = useStore((state) => state.searchQuery);
  const sorting = useStore((state) => state.sorting);
  const setPagination = useStore((state) => state.setPagination);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const setSorting = useStore((state) => state.setSorting);
  const rowSelection = useStore((state) => state.rowSelection);
  const setRowSelection = useStore((state) => state.setRowSelection);
  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);

  const columns = useMemo(() => getColumns(isAuditor), [isAuditor]);

  return (
    <Table
      data={data?.archives || []}
      columns={columns}
      enableSorting={true}
      isLoading={isLoading || isFetching}
      totalPages={data?.totalPages}
      totalCount={data?.total}
      pagination={pagination}
      setPagination={setPagination}
      sorting={sorting}
      setSorting={setSorting}
      rowSelection={rowSelection}
      setRowSelection={setRowSelection}
      search={searchQuery}
      setSearch={setSearchQuery}
      grid
      // grid={true}
      toolbar={
        <TableToolbarFilters
          filters={filters}
          setFilters={setFilters}
          supportedFilters={supportedFilters}
          isLoadingFilters={isLoading}
        />
      }
    />
  );
}

export default VulnList;
