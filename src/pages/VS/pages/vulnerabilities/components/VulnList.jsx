import React, { useMemo } from 'react';
import { Eye, Link2, RefreshCcw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useGetVsConfigQuery, useSendVsToVmMutation } from '@/services/vs/vsApi';
import { useAuth } from '@/auth/context/auth-context';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import {
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from '@/components/ui/data-grid-table';
import { Skeleton } from '@/components/ui/skeleton';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import { DateFormatter } from '@/components/custom/date-formatter';
import { Profile } from '@/components/custom/profile';
import SeverityLabel from '@/components/custom/severity-label';
import { StateLabels } from '@/components/custom/state-labels';
import Table from '@/components/custom/table';
import { CustomTooltip } from '@/components/custom/tooltip';
import TableToolbarFilters from '../../../../../components/common/table-toolbar-filters';
import useStore from '../store';
import BulkUpdate from './bulk-update';
import TableToolbar from './table-toolbar';
import VulnerabilityActionCell from './ui/vuln-action-cell';

function VulnTitle({ row }) {
  const setSelectedVuln = useStore((state) => state.setSelectedVuln);
  const setShowInfo = useStore((state) => state.setShowInfo);

  return (
    <div
      className="flex flex-col gap-1 hover:text-primary cursor-pointer"
      onClick={() => {
        setShowInfo(true);
        setSelectedVuln(row.original);
      }}
    >
      <p>{row.original.title || row.original._raw?.info?.name || '-'}</p>
    </div>
  );
}

function VMTicketCell({ row, disableSync }) {
  const { user } = useAuth();
  const isAuditor = user?.role === 'Auditor';
  const [sendToVm, { isLoading: isSyncing }] = useSendVsToVmMutation();

  const handleSingleSync = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAuditor) return;

    if (disableSync) {
      toast.error('Configure assessment in the settings');
      return;
    }

    toast.promise(sendToVm({ vulnIds: [row?._id] }).unwrap(), {
      loading: 'Sending to VM...',
      success: 'Sent successfully',
      error: (err) => err?.data?.message || 'Failed to send to VM',
    });
  };

  if (row?.sentToVm) {
    return (
      <Badge className="text-[11px] h-fit" variant="secondary" appearance="outline">
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
    <CustomTooltip
      text={
        disableSync
          ? 'Configure assessment in the settings'
          : 'Send to VM'
      }
    >
      <span>
        <ButtonWithConfirm
          variant="outline"
          size="sm"
          className="h-7 text-[11px] flex gap-1.5 items-center border-dashed"
          onConfirm={handleSingleSync}
          disabled={isSyncing || disableSync || isAuditor}
          confirm={true}
          confirmVariant="warning"
          confirmTitle="Send to VM"
          dialog="Are you sure you want to send this vulnerability to Vulnerability Management? This will create a new ticket."
          confirmButton={<Button disabled={isSyncing}>Confirm</Button>}
        >
          <RefreshCcw size={12} className={isSyncing ? 'animate-spin' : ''} />
          Send to VM
        </ButtonWithConfirm>
      </span>
    </CustomTooltip>
  );
}

function getColumns(disableSync, isAuditor = false) {
  return [
    ...(!isAuditor
      ? [
        {
          accessorKey: '_id',
          accessorFn: (row) => row._id,
          header: () => <DataGridTableRowSelectAll />,
          cell: ({ row }) => <DataGridTableRowSelect row={row} />,
          enableSorting: false,
          enableHiding: false,
          enableResizing: false,
          size: 51,
          meta: {
            cellClassName: '',
            skeleton: <Skeleton className="h-7 w-full" />,
          },
        },
      ]
      : []),
    {
      id: 'title',
      accessorFn: (row) => row.title,
      header: ({ column }) => (
        <DataGridColumnHeader title="Title" column={column} />
      ),

      cell: ({ row }) => (
        <div
          className={`leading-none font-medium text-sm text-mono ${row.original.sentToVm && 'hover:text-primary'}`}
        >
          <VulnTitle row={row} />
        </div>
      ),

      enableSorting: false,
      size: 300,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7 w-full" />,
      },
    },
    {
      id: 'target',
      accessorFn: (row) => row.matched_at || 'Unknown',
      header: ({ column }) => (
        <DataGridColumnHeader title="Asset" column={column} />
      ),

      cell: ({ row }) => (
        <div
          className="text-sm truncate max-w-[200px]"
          title={row.original.matched_at || '-'}
        >
          {row.original.matched_at || '-'}
        </div>
      ),

      enableSorting: false,
      size: 200,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'state',
      accessorFn: (row) => row.state || 'Unknown',
      header: ({ column }) => (
        <DataGridColumnHeader title="State" column={column} />
      ),

      cell: ({ row }) => <StateLabels state={row.original.state || 'open'} />,

      enableSorting: false,
      size: 130,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'scanner',
      accessorFn: (row) => row.scannerId?.name || 'Unknown',
      header: ({ column }) => (
        <DataGridColumnHeader title="Scanner" column={column} />
      ),

      cell: ({ row }) => (
        <StateLabels
          state={row.original.scannerId?.name}
          className="text-[11px]"
        />
      ),

      enableSorting: false,
      size: 130,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'severity_number',
      accessorFn: (row) => row.severity,
      header: ({ column }) => (
        <DataGridColumnHeader title="Severity" column={column} />
      ),

      cell: ({ row }) => <SeverityLabel severity={row.original.severity} />,

      enableSorting: true,
      size: 100,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'createdAt',
      accessorFn: (row) => row.createdAt,
      header: ({ column }) => (
        <DataGridColumnHeader title="Reported On" column={column} />
      ),

      cell: ({ row }) => <DateFormatter date={row.original.createdAt} />,

      enableSorting: true,
      size: 110,
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
    ...(!isAuditor
      ? [
          {
            id: 'actions',
            header: ({ column }) => (
              <DataGridColumnHeader title="" column={column} />
            ),
            cell: ({ row }) => (
              <AuthorityGuard forbidRoles={['Auditor']}>
                <VulnerabilityActionCell row={row.original} />
              </AuthorityGuard>
            ),
            enableSorting: false,
            size: 70,
            meta: {
              cellClassName: 'text-center',
              skeleton: <Skeleton className="h-7" />,
            },
          },
        ]
      : []),
  ];
}

function VulnList({ data, isLoading, isFetching }) {
  const { user } = useAuth();
  const isAuditor = user?.role === 'Auditor';
  const navigate = useNavigate();
  const pagination = useStore((state) => state.pagination);
  const searchQuery = useStore((state) => state.searchQuery);
  const sorting = useStore((state) => state.sorting);
  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);
  const setPagination = useStore((state) => state.setPagination);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const setSorting = useStore((state) => state.setSorting);
  const rowSelection = useStore((state) => state.rowSelection);
  const setRowSelection = useStore((state) => state.setRowSelection);

  const disableSync = data?.metadata?.vm_configuration_exists === false;
  const columns = useMemo(
    () => getColumns(disableSync, isAuditor),
    [disableSync, isAuditor]
  );

  return (
    <>
      <Table
        data={data?.vulns}
        columns={columns}
        enableSorting={true}
        searchPlaceholder="Search Vulns...."
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
        grid
        toolbar={
          <TableToolbarFilters
            filters={filters}
            setFilters={setFilters}
            supportedFilters={data?.advanced_filters || []}
            isLoadingFilters={isLoading}
            onReset={() =>
              navigate(window.location.pathname, { replace: true })
            }
          />
        }
      />
      {!isAuditor && Object.entries(rowSelection).length > 1 && (
        <BulkUpdate vulnerabilities={data?.userVulns} />
      )}
    </>
  );
}

export default VulnList;
