import { useMemo } from 'react';
import {
  BrainCircuit,
  Check,
  CircleCheckBig,
  CircleSlash2,
  CircleUser,
  Edit,
  Ellipsis,
  Link2,
  RefreshCcw,
  RotateCcw,
  Settings,
  Trash,
  TriangleAlert,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import {
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from '@/components/ui/data-grid-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { Profile } from '@/components/custom/profile';
import Table from '@/components/custom/table';
import { CustomTooltip } from '@/components/custom/tooltip';
import TableToolbarFilters from '../../../../components/common/table-toolbar-filters';
import GetAssetTypeInfo from '../../../../components/custom/asset-icons';
import AuthorityGuard from '../../../../components/custom/authority-guard/AuthorityGuard';
import ExpandableText from '../../../../components/custom/expandable-text';
import SeverityLabel from '../../../../components/custom/severity-label';
import { StateLabels } from '../../../../components/custom/state-labels';
import { formatDateTime, timeAgo } from '../../../../lib/helpers';
import {
  useDeleteAsmExposureMutation,
  useMarkAsmExposureSafeMutation,
  useSyncAsmVulnsMutation,
  useUpdateAsmExposureMutation,
} from '../../../../services/asm/exposureApi';
import useStore from '../store';
import AsmBulkUpdate from './asm-bulk-update';
import ExposureInfoModal from './modals/exposure-info-modal';
import TableToolbar from './table-toolbar';

// get asset value depending on asset type
function getValue(asset) {
  switch (asset.type) {
    case 'subdomain':
      return asset.value;
    case 'port':
      return asset.subdomain;
    case 'cert':
      return asset?.commonName;
    default:
      return asset.value || 'N/A';
  }
}

function ActionCell(row) {
  const [markSafe] = useMarkAsmExposureSafeMutation();
  const [deleteExposure, { isLoading: isDeleting }] =
    useDeleteAsmExposureMutation();
  const [updateExposureUser] = useUpdateAsmExposureMutation();

  const location = useLocation();
  const setShowEdit = useStore((state) => state.setShowEdit);
  const setSelectedExposure = useStore((state) => state.setSelectedExposure);

  const handleRestore = () => {
    const payload = {
      exposureId: row.row?._id,
      falsePositive: false,
      hidden_by_disabled_rule: false,
      state: row.row?.previous_state || 'In Review',
    };

    toast.promise(updateExposureUser(payload).unwrap(), {
      loading: 'Restoring exposure...',
      success: 'Exposure restored successfully',
      error: 'Failed to restore exposure',
    });
  };

  const handleEdit = () => {
    setShowEdit(true);
    setSelectedExposure(row?.row);
  };

  const handleDeleteExposure = () => {
    toast.promise(deleteExposure(row.row?._id).unwrap(), {
      loading: 'Deleting exposure',
      success: 'Exposure deleted successfully',
      error: 'Failed to delete Exposure',
    });
  };

  return (
    <AuthorityGuard forbidRoles={['Auditor']}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
            <Ellipsis size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          {location.pathname.includes('/false-exposures') ? (
            <DropdownMenuItem onClick={handleRestore}>
              {/* <RotateCcw /> */}
              Restore
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={handleEdit}>
              {/* <Edit /> */}
              Edit
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <ButtonWithConfirm
            confirm={true}
            variant="ghost"
            confirmVariant="destructive"
            onConfirm={handleDeleteExposure}
            disabled={isDeleting}
            confirmTitle="Delete Exposure"
            dialog="Are you sure you want to delete this exposure? This action cannot be undone."
            className="text-destructive hover:text-destructive hover:!bg-red-300/20"
          >
            Delete
          </ButtonWithConfirm>
        </DropdownMenuContent>
      </DropdownMenu>
    </AuthorityGuard>
  );
}

function VMTicketCell({ row, disableSync }) {
  const [syncVulns, { isLoading: isSyncing }] = useSyncAsmVulnsMutation();

  const handleSingleSync = () => {
    if (disableSync) {
      toast.error('Configure assessment in the settings');
      return;
    }

    toast.promise(syncVulns(row?._id).unwrap(), {
      loading: 'Escalating Ticket...',
      success: 'Ticket escalated successfully',
      error: 'Failed to escalate Ticket',
    });
  };

  if (row?.sentToVm) {
    return (
      <Badge className="text-[11px]" variant="secondary" appearance="outline">
        <Link
          className="w-full flex gap-2 items-center"
          target="_blank"
          to={`/vm/vulnerability-report?id=${row?.universalVulnId}&assessmentId=${row?.assessmentId}`}
        >
          View Ticket
          <Link2 size={12} />
        </Link>
      </Badge>
    );
  }

  return (
    <AuthorityGuard forbidRoles={['Auditor']}>
      <CustomTooltip
        text={
          disableSync
            ? 'Configure assessment in the settings'
            : 'Escalate Ticket'
        }
      >
        <span onClick={(e) => e.stopPropagation()}>
          <ButtonWithConfirm
            variant="outline"
            size="sm"
            className="h-7 text-[11px] flex gap-1.5 items-center border-dashed"
            confirm={true}
            confirmVariant="warning"
            confirmTitle="Escalate Ticket"
            dialog="Are you sure you want to escalate this Ticket?"
            onConfirm={handleSingleSync}
            disabled={isSyncing || disableSync}
            confirmButton={
              <Button variant="primary" disabled={isSyncing}>
                Confirm
              </Button>
            }
            cancelButton={<Button variant="outline">Cancel</Button>}
          >
            <RefreshCcw size={12} className={isSyncing ? 'animate-spin' : ''} />
            Escalate Ticket
          </ButtonWithConfirm>
        </span>
      </CustomTooltip>
    </AuthorityGuard>
  );
}

function getColumns(disableSync) {
  return [
    {
      accessorKey: '_id',
      accessorFn: (row) => row._id,
      header: () => (
        <AuthorityGuard forbidRoles={['Auditor']}>
          <DataGridTableRowSelectAll />
        </AuthorityGuard>
      ),
      cell: ({ row }) => (
        <AuthorityGuard forbidRoles={['Auditor']}>
          <DataGridTableRowSelect row={row} />
        </AuthorityGuard>
      ),
      enableSorting: false,
      enableHiding: false,
      enableResizing: false,
      size: 30,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'asset',
      accessorFn: (row) => row.value || 'Unknown',
      header: ({ column }) => (
        <DataGridColumnHeader title="Asset" column={column} />
      ),
      cell: ({ row }) => (
        <div>
          <ExposureInfoModal
            row={row?.original}
            associatedAsset={row?.original?.associatedAsset}
            assessmentId={row?.original?.assessmentId}
            vulnId={row?.original?.universalVulnId}
            universalVulnId={row?.original?._id}
            trigger={
              <div
                className="cursor-pointer hover:text-primary transition-colors truncate"
                title={row.original?.title}
              >
                {row.original?.title || '-'}
              </div>
            }
          />
          <div className='flex items-center text-gray-500 text-[13px]'>
            <p>
              {row.original?.associatedAsset?.subdomain}
            </p>
            {
              row.original?.associatedAsset?.type === "port" && (
                <p>
                  : {row.original?.associatedAsset?.value}
                </p>
              )
            }
          </div>
        </div>
      ),
      enableSorting: false,
      size: 350,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'severity',
      accessorFn: (row) => row.severity || 'Unassigned',
      header: ({ column }) => (
        <DataGridColumnHeader title="Severity" column={column} />
      ),
      cell: ({ row }) => <SeverityLabel severity={row.original.severity} />,
      enableSorting: true,
      size: 90,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'state',
      accessorFn: (row) => row.severity || 'Unassigned',
      header: ({ column }) => (
        <DataGridColumnHeader title="State" column={column} />
      ),
      cell: ({ row }) => (
        <StateLabels state={row.original.state || 'Not Assigned'} />
      ),
      enableSorting: false,
      size: 110,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'createdAt',
      accessorFn: (row) => row.createdAt || 'Unassigned',
      header: ({ column }) => (
        <DataGridColumnHeader title="Detected At" column={column} />
      ),
      cell: ({ row }) => (
        <div
          className="w-full truncate"
          title={formatDateTime(row.original?.createdAt)}
        >
          {timeAgo(row.original?.createdAt)}
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
      id: 'vm ticket',
      accessorFn: (row) => row.createdAt || 'Unassigned',
      header: ({ column }) => (
        <DataGridColumnHeader title="VM Ticket" column={column} />
      ),
      cell: ({ row }) => <VMTicketCell row={row.original} disableSync={disableSync} />,
      enableSorting: false,
      size: 110,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    // {
    //   id: 'actions',
    //   accessorFn: (row) => 'Unassigned',
    //   header: ({ column }) => (
    //     <AuthorityGuard forbidRoles={['Auditor']}>
    //       <DataGridColumnHeader title="" column={column} />
    //     </AuthorityGuard>
    //   ),
    //   cell: ({ row }) => <ActionCell row={row.original} />,
    //   enableSorting: false,
    //   size: 60,
    //   meta: {
    //     cellClassName: '',
    //     skeleton: <Skeleton className="h-7" />,
    //   },
    // },
  ];
}

function ExposureList({ data, isLoading, isFetching }) {
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

  const disableSync = data?.metadata?.vm_configuration_exists === false;
  const columns = useMemo(() => getColumns(disableSync), [disableSync]);
  const selectedRowsCount = Object.keys(rowSelection).length;

  return (
    <>
      <Table
        data={data?.data}
        columns={columns}
        isLoading={isLoading || isFetching}
        totalPages={Math.ceil(data?.total / pagination.pageSize) || 1}
        totalCount={data?.total}
        pagination={pagination}
        setPagination={setPagination}
        sorting={sorting}
        setSorting={setSorting}
        search={searchQuery}
        setSearch={setSearchQuery}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        toolbar={
          <TableToolbarFilters
            filters={filters}
            supportedFilters={data?.advanced_filters}
            isLoadingFilters={isLoading}
            setFilters={setFilters}
          />
        }
        enableSorting={true}
        grid
      />
      {selectedRowsCount > 1 && <AsmBulkUpdate exposures={data?.data} />}
    </>
  );
}

export default ExposureList;
