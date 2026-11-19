import { MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridTableRowSelect, DataGridTableRowSelectAll } from '@/components/ui/data-grid-table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { DateFormatter } from '@/components/custom/date-formatter';
import { Profile } from '@/components/custom/profile';
import Table from '@/components/custom/table';
import { CustomTooltip } from '@/components/custom/tooltip';
import { StatusBadge } from '@/components/custom/status-badge';
import AuthorityGuard from '../../../../../components/custom/authority-guard/AuthorityGuard';
import appConfig from '../../../../../config/appConfig';
import { useDeleteAsmReportMutation } from '../../../../../services/asm/reportsApi';
import CancelReport, { isReportCancellable } from '../actions/cancel-report';
import useStore from '../../store';
import { useMemo } from 'react';


const ActionsCell = ({ row }) => {
  const [deleteAsmReport, { isLoading: isDeleting }] = useDeleteAsmReportMutation();

  const status = row.original?.status;
  const isCancellable = isReportCancellable(status);
  const isFailed = status === 'failed';
  const isCancelled = status === 'cancelled' || status === 'canceled';
  const isPendingProcessing = isCancellable;
  const reportId = row.original.reportId || row.original._id;

  const downloadReport = () => {
    window.open(`${appConfig.BASE_URL}/op/api/v1/reports/${reportId}/download`);
  };

  const handleDeleteReport = () => {
    toast.promise(deleteAsmReport(reportId).unwrap(), {
      loading: 'Deleting Report...',
      success: 'Report Deleted Successfully',
      error: 'Failed to delete the Report',
    });
  };

  return (
    <AuthorityGuard forbidRoles={['Auditor']}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem
            onClick={downloadReport}
            disabled={isPendingProcessing || isFailed || isCancelled}
            className="cursor-pointer"
          >
            Download
          </DropdownMenuItem>

          {isCancellable && (
            <CancelReport
              reportId={reportId}
              reportName={row.original.name}
              asDropdownItem={true}
            />
          )}

          <DropdownMenuSeparator />

          <ButtonWithConfirm
            confirm={true}
            confirmOnInput={row.original.name}
            variant="ghost"
            disabled={isPendingProcessing || isDeleting}
            onConfirm={handleDeleteReport}
            className="w-full justify-start text-destructive px-2 py-1.5 h-auto font-normal text-sm rounded-md hover:!bg-red-300/20 hover:text-destructive text-left"
            dialog={
              <div className="flex flex-col items-center gap-2">
                <p className="text-center font-semibold">
                  Are you sure you want to delete this report?
                </p>
                <p className="text-sm text-muted-foreground text-center">
                  This action cannot be undone.
                </p>
              </div>
            }
          >
            Delete
          </ButtonWithConfirm>
        </DropdownMenuContent>
      </DropdownMenu>
    </AuthorityGuard>
  );
};

function getColumns() {
  const userJSON = localStorage.getItem('user');
  const user = JSON.parse(userJSON);

  return [
    {
      id: 'select',
      accessorKey: '_id',
      header: ({ table }) => (
        <AuthorityGuard forbidRoles={['Auditor']}>
          <DataGridTableRowSelectAll table={table} />
        </AuthorityGuard>
      ),
      cell: ({ row }) => (
        <AuthorityGuard forbidRoles={['Auditor']}>
          <DataGridTableRowSelect row={row} />
        </AuthorityGuard>
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'name',
      accessorFn: (row) => row.title,
      header: ({ column }) => (
        <DataGridColumnHeader title="Name" column={column} />
      ),

      cell: ({ row }) => (
        <div
          className="flex items-center grow gap-2.5"
          onClick={() => {
            window.open(
              `${appConfig.BASE_URL}/op/api/v1/reports/${row.original.reportId}/download`,
            );
          }}
        >
          <img
            src={`/media/file-types/${row.original.format}.svg`}
            className="w-6 h-6"
            alt="image"
          />

          <div className="flex flex-col">
            <span className="text-sm font-medium text-mono cursor-pointer hover:text-primary mb-px">
              {row.original.name}
            </span>
          </div>
        </div>
      ),

      enableSorting: false,
      size: 300,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'owner',
      accessorFn: (row) => row.owner,
      header: ({ column }) => (
        <DataGridColumnHeader title="Generated By" column={column} />
      ),

      cell: ({ row }) => (
        <Profile
          name={row?.original?.createdBy?.name || 'Unknown'}
          email={row?.original?.createdBy?.email}
          role={row.original.createdBy?.role}
        />
      ),

      enableSorting: false,
      size: 250,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'state',
      accessorFn: (row) => row.state,
      header: ({ column }) => (
        <DataGridColumnHeader title="Status" column={column} />
      ),

      cell: ({ row }) => {
        const isFailed = row.original?.status === 'failed';
        const badge = <StatusBadge status={row.original?.status} size="lg" />;

        if (isFailed) {
          return (
            <CustomTooltip text="Report failed: Process interrupted or timed out.">
              <div className="flex items-center gap-1.5">{badge}</div>
            </CustomTooltip>
          );
        }

        return <div className="flex items-center gap-1.5">{badge}</div>;
      },

      enableSorting: false,
      size: 100,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'date',
      accessorFn: (row) => row.type,
      header: ({ column }) => (
        <DataGridColumnHeader title="Created At" column={column} />
      ),

      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <DateFormatter date={row.original.createdAt} />
        </div>
      ),

      enableSorting: false,
      size: 150,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },



    {
      id: 'actions',
      header: () => '',
      cell: ({ row }) => <ActionsCell row={row} />,

      enableSorting: false,
      size: 50,
      meta: {
        headerClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
  ];
}

const ReportList = ({ data = [], isLoading, isFetching, totalCount, totalPages }) => {
  const pagination = useStore((state) => state.pagination);
  const setPagination = useStore((state) => state.setPagination);
  const search = useStore((state) => state.searchQuery);
  const setSearch = useStore((state) => state.setSearchQuery);
  const rowSelection = useStore((state) => state.rowSelection);
  const setRowSelection = useStore((state) => state.setRowSelection);

  const columns = useMemo(() => getColumns(), [rowSelection]);

  return (
    <Table
      data={data}
      columns={columns}
      isLoading={isLoading || isFetching}
      pagination={pagination}
      setPagination={setPagination}
      totalCount={totalCount}
      totalPages={totalPages}
      manualPagination={true}
      search={search}
      setSearch={setSearch}
      rowSelection={rowSelection}
      setRowSelection={setRowSelection}
      enableSorting={false}
      enableSearch={true}
      showPagination={true}
    />
  );
};

export default ReportList;