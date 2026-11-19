import { useMemo } from 'react';
import { Activity, ExternalLink, Eye, MoreHorizontal, RefreshCcw, ShieldAlert, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/context/auth-context';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridTableRowSelect, DataGridTableRowSelectAll } from '@/components/ui/data-grid-table';
import { DropdownMenu, DropdownMenuContent,DropdownMenuSeparator, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import TableToolbarFilters from '@/components/common/table-toolbar-filters';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import { DateFormatter } from '@/components/custom/date-formatter';
import { Profile } from '@/components/custom/profile';
import SeverityLabel from '@/components/custom/severity-label';
import { StateLabels } from '@/components/custom/state-labels';
import Table from '@/components/custom/table';
import { Button } from '../../../../../../components/ui/button';
import useStore from '../../store';
import EscalationDetailsModal from '../modals/escalation-details-modal';
import { CustomTooltip } from '../../../../../../components/custom/tooltip';
import { Badge } from '../../../../../../components/ui/badge';


function getColumns(isAuditor = false) {
  return [
    {
      id: 'VulnerabilityTitle',
      accessorFn: (row) => row.title,
      header: ({ column }) => (
        <DataGridColumnHeader title="Entity" column={column} />
      ),

      cell: ({ row }) => (
        <EscalationDetailsModal
          trigger={
            <p title={row?.original?.type === 'campaign' ? row?.original?.campaignId?.name : row?.original?.vulnId?.title} className="truncate leading-none font-medium cursor-pointer text-sm text-mono hover:text-primary">
              {row?.original?.type === 'campaign' 
                ? row?.original?.campaignId?.name 
                : row?.original?.vulnId?.title}
            </p>
          }
          escalationData={row?.original}
        />
      ),

      enableSorting: false,
      size: 250,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    // {
    //   id: 'Status',
    //   accessorFn: (row) => row.status,
    //   header: ({ column }) => (
    //     <DataGridColumnHeader title="Type" column={column} />
    //   ),

    //   cell: ({ row }) => <Badge>{row?.original?.type}</Badge>,

    //   enableSorting: false,
    //   size: 130,
    //   meta: {
    //     cellClassName: '',
    //     skeleton: <Skeleton className="h-7" />,
    //   },
    // },
    {
      id: 'Status',
      accessorFn: (row) => row.status,
      header: ({ column }) => (
        <DataGridColumnHeader title="Status" column={column} />
      ),

      cell: ({ row }) => <StateLabels state={row.original.status} />,

      enableSorting: false,
      size: 130,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },

    {
      id: 'CreatedAt',
      accessorFn: (row) => row.createdAt,
      header: ({ column }) => (
        <DataGridColumnHeader title="Created At" column={column} />
      ),

      cell: ({ row }) => (
        <div className=" flex flex-col">
          <DateFormatter date={row?.original?.createdAt} />{' '}
        </div>
      ),

      enableSorting: true,
      size: 120,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },

    {
      id: 'Actions',
      accessorFn: (row) => row.createdAt,
      header: ({ column }) => <DataGridColumnHeader title="" column={column} />,

      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() =>
                window.open(
                  row?.original?.type === 'campaign'
                    ? `/vm/remidation-campaign-details?id=${row?.original?.campaignId?._id}`
                    : `/vm/vulnerability-report?id=${row?.original?.vulnId?._id}`,
                  '_blank',
                  'noopener,noreferrer',
                )
              }
            >
              {row?.original?.type === 'campaign' ? 'View Campaign' : 'View Vulnerability'}
            </DropdownMenuItem>

            <DropdownMenuSeparator />
            <EscalationDetailsModal
              trigger={
                <AuthorityGuard forbidRoles={['Auditor']}>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  disabled={
                    isAuditor ||
                    row?.original?.status == 'approved' ||
                    row?.original?.status == 'rejected'
                  }
                >
                  Take Action
                </DropdownMenuItem>
                </AuthorityGuard>
              }
              escalationData={row?.original}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      ),

      enableSorting: false,
      size: 50,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
  ];
}

function EscalationsTable({ data, isLoading, isFetching, total, supportedFilters }) {
  const { user } = useAuth();
  const isAuditor = user?.role?.toLowerCase() === 'auditor';

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
      data={data}
      columns={columns}
      enableSorting={true}
      isLoading={isLoading || isFetching}
      totalPages={Math.ceil((total || 0) / (pagination.pageSize || 1))}
      totalCount={total}
      pagination={pagination}
      setPagination={setPagination}
      sorting={sorting}
      setSorting={setSorting}
      rowSelection={rowSelection}
      setRowSelection={setRowSelection}
      search={searchQuery}
      setSearch={setSearchQuery}
      grid
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

export default EscalationsTable;