import { useMemo } from 'react';
import { Clock, Layers, Zap } from 'lucide-react';
import { Link } from 'react-router';
import { Badge } from '@/components/ui/badge';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import {
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from '@/components/ui/data-grid-table';
import { Skeleton } from '@/components/ui/skeleton';
import { DateFormatter } from '@/components/custom/date-formatter';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import { StatusBadge } from '@/components/custom/status-badge';
import { StateLabels } from '@/components/custom/state-labels';
import Table from '@/components/custom/table';
import AuthorityGuard from '../../../../../../components/custom/authority-guard/AuthorityGuard';
import useStore from '../../store';
import ActionColumn from '../tab-content/action-column';
import TableToolbar from '../toolbar';
import { useAuth } from '@/auth/context/auth-context';
import VulnerabilitiesBadges from '@/components/custom/vulnerabilities-badges';

function getColumns(isAuditor) {
  const baseColumns = [

    {
      accessorKey: 'name',
      accessorFn: (row) => row?.original?.name,
      header: ({ column }) => (
        <DataGridColumnHeader title="Scan Name" column={column} />
      ),
      cell: ({ row }) => {
        const scanName = row.original?.name || 'Unnamed Scan';

        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">
                {scanName}
              </span>
            </div>
          </div>
        );
      },
      enableSorting: false,
      size: 250,
      meta: {
        skeleton: <Skeleton className="h-6" />,
      },
    },
    {
      accessorKey: 'Environment',
      header: ({ column }) => (
        <DataGridColumnHeader title="Environment" column={column} />
      ),
      cell: ({ row }) => {
        const accountList = row.original?.accounts || [];
        const mainAccount =
          accountList[0]?.user_provided_name || accountList[0]?.title || '-';

        return (
          <span className="text-sm text-muted-foreground">
            {mainAccount}
          </span>
        );
      },
      enableSorting: false,
      size: 200,
      meta: {
        skeleton: <Skeleton className="h-6" />,
      },
    },
    {
      accessorKey: 'status',
      accessorFn: (row) => row?.original?.status || row?.original?.lastRunStatus,
      header: ({ column }) => (
        <DataGridColumnHeader title="Status" column={column} />
      ),
      cell: ({ row }) => {
        let status = row.original?.status || row.original?.lastRunStatus;
        if (!status) return <span>-</span>;
        return <StateLabels state={status} />;
      },
      enableSorting: false,
      size: 150,
      meta: {
        skeleton: <Skeleton className="h-6" />,
      },
    },
    {
      accessorKey: 'vulnerabilities',
      accessorFn: (row) => row?.original?.vuln_counts?.total,
      header: ({ column }) => (
        <DataGridColumnHeader title="Vulnerabilities" column={column} />
      ),
      cell: ({ row }) => {
        const vulns = row.original?.lastRunSummary?.vuln_counts || row.original?.vuln_counts;
        const scanName = row.original?.name;
        const hasData = vulns && Object.keys(vulns).length > 0 && (vulns.total ?? Object.values(vulns).reduce((a, b) => a + (b || 0), 0)) > 0;
        if (!hasData) return <span>-</span>;
        return (
          <div className="flex justify-start">
            <VulnerabilitiesBadges vulnerabilities={vulns} assetName={scanName} />
          </div>
        );
      },
      enableSorting: false,
      size: 250,
      meta: {
        skeleton: <Skeleton className="h-6" />,
      },
    },
    {
      accessorKey: 'schedule',
      accessorFn: (row) => row?.original?.schedule?.frequency,
      header: ({ column }) => (
        <DataGridColumnHeader title="Schedule" column={column} />
      ),
      cell: ({ row }) => {
        const schedule = row.original?.schedule;
        if (!schedule || schedule.frequency === 'none') {
          return <span className="text-muted-foreground">Manual</span>;
        }
        return (
          <div className="flex flex-col w-fit gap-1">
            <Badge variant="secondary" appearance="outline" className="w-fit capitalize">
              {schedule.frequency}
            </Badge>

          </div>
        );
      },
      enableSorting: false,
      size: 150,
      meta: {
        skeleton: <Skeleton className="h-6" />,
      },
    },
    {
      accessorKey: 'createdAt',
      accessorFn: (row) => row?.original?.createdAt,
      header: ({ column }) => (
        <DataGridColumnHeader title="Created" column={column} />
      ),
      cell: ({ row }) => {
        const date = row.original?.createdAt;
        if (!date) return <span className="text-muted-foreground">-</span>;
        return <DateFormatter date={date} />;
      },
      enableSorting: true,
      size: 150,
      meta: {
        skeleton: <Skeleton className="h-6" />,
      },
    },
    {
      accessorKey: 'action',
      header: '',
      cell: ({ row }) => {
        return (
          <AuthorityGuard forbidRoles={['Auditor']}>
            <ActionColumn scan={row.original} />
          </AuthorityGuard>
        );
      },
      enableSorting: false,
      size: 70,
      meta: {
        skeleton: <Skeleton className="h-6" />,
      },
    },
  ];

  if (isAuditor) {
    return baseColumns.filter(col => col.accessorKey !== 'action');
  }

  return baseColumns;
}

function ScansTable({ scans = {}, isLoading, totalCount }) {
  const { user } = useAuth();
  const isAuditor = user?.role === 'Auditor';
  const searchQuery = useStore((state) => state.searchQuery);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const pagination = useStore((state) => state.pagination);
  const setPagination = useStore((state) => state.setPagination);
  const sorting = useStore((state) => state.sorting);
  const setSorting = useStore((state) => state.setSorting);
  const columns = useMemo(() => getColumns(isAuditor), [isAuditor]);

  const scansList = Array.isArray(scans?.data) ? scans.data : (scans?.data?.scans || []);
  const count = totalCount ?? scans?.pagination?.total ?? scansList.length ?? 0;
  const totalPages = scans?.pagination?.totalPages ?? Math.ceil(count / pagination.pageSize) ?? 1;

  return (
    <Table
      data={scansList}
      columns={columns}
      isLoading={isLoading}
      enableSorting={true}
      search={searchQuery}
      setSearch={setSearchQuery}
      searchPlaceholder="Search scans..."
      pagination={pagination}
      setPagination={setPagination}
      sorting={sorting}
      setSorting={setSorting}
      totalCount={count}
      totalPages={totalPages}
      manualPagination={true}
      enableSearch={true}
      showPagination={true}
      grid
      pageSizeOptions={[10, 20, 50]}
    // toolbar={<TableToolbar supportedFilters={scans?.filters} />}
    />
  );
}

export default ScansTable;
