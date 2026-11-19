import { useMemo } from 'react';
import { useAuth } from '@/auth/context/auth-context';
import { Calendar, Clock, Server, TriangleAlert, User, Zap } from 'lucide-react';
import { Link } from 'react-router';
import { Badge } from '@/components/ui/badge';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridTableRowSelect, DataGridTableRowSelectAll } from '@/components/ui/data-grid-table';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import TableToolbarFilters from '@/components/common/table-toolbar-filters';
import { DateFormatter } from '@/components/custom/date-formatter';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import { Profile } from '@/components/custom/profile';
import { StatusBadge } from '@/components/custom/status-badge';
import Table from '@/components/custom/table';
import AuthorityGuard from '../../../../../../components/custom/authority-guard/AuthorityGuard';
import { formatMsIntoDuration, formatTimestampDuration } from '../../../../../../lib/helpers';
import useStore from '../../store';
import ActionColumn from '../tab-content/action-column';


function getColumns(isAuditor) {
  const baseColumns = [
    // {
    //   id: 'selection',
    //   header: ({ table }) => <DataGridTableRowSelectAll table={table} />,
    //   cell: ({ row, table }) => (
    //     <DataGridTableRowSelect
    //       row={row}
    //       table={table}
    //       className="translate-y-[1px]"
    //     />
    //   ),
    //   enableSorting: false,
    //   enableHiding: false,
    //   size: 40,
    // },
    {
      accessorKey: 'name',
      accessorFn: (row) => row?.original?.group?.name,
      header: ({ column }) => (
        <DataGridColumnHeader title="Asset Group" column={column} />
      ),
      cell: ({ row }) => {
        const assetList = row.original?.assetList || [];
        const mainAsset =
          assetList[0]?.value || row.original?.assetId?.value || 'Unnamed Scan';
        const groupName = row?.original?.group?.name;
        const remainingAssets = assetList.slice(1);

        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Link
                to={`/vs/scans/${row.original._id}`}
                className="hover:text-primary transition-colors"
              >
                <span
                  title={groupName || mainAsset}
                  className="text-sm font-medium line-clamp-1 max-w"
                >
                  {groupName || mainAsset}
                </span>
                {/* <Badge
                  variant="secondary"
                  size="sm"
                  className="capitalize ml-2"
                >
                  {row.original?.scanType || '-'}
                </Badge> */}
              </Link>

              {remainingAssets.length > 0 && (
                <DetailedHoverPopover
                  buttonText={`+${remainingAssets.length}`}
                  popoverTitle="Assets"
                  trigger="hover"
                  showBadge={true}
                  width="w-[320px]"
                  popoverContent={
                    <div className="flex flex-col gap-1">
                      {remainingAssets.map((asset, idx) => (
                        <div
                          key={idx}
                          className="py-1 border-b last:border-0 border-border/40"
                        >
                          <p className="text-[11px] font-mono break-all">
                            {asset.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  }
                />
              )}

              {row.original?.isUpcoming && (
                <Badge
                  variant="outline"
                  className="text-[10px] px-1.5 py-0 h-5 bg-blue-500/10 text-blue-500 border-blue-500/20"
                >
                  Upcoming
                </Badge>
              )}
            </div>
            {/* {row.original?.scanner?.name && (
              <p className="text-xs text-muted-foreground hover:text-primary transition-colors">
                {row.original?.scanner?.name}
              </p>
            )} */}
          </div>
        );
      },
      enableSorting: false,
      size: 200,
      meta: {
        skeleton: <Skeleton className="h-10" />,
      },
    },

    {
      accessorKey: 'status',
      accessorFn: (row) => row?.original?.state,
      header: ({ column }) => (
        <DataGridColumnHeader title="Status" column={column} />
      ),
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          <StatusBadge
            progress={row.original?.progress}
            showPercentage={true}
            status={row.original?.state}
            label={
              row.original?.state?.toLowerCase() === 'running'
                ? 'Scanning'
                : undefined
            }
          />
        </div>
      ),
      enableSorting: false,
      size: 130,
      meta: {
        skeleton: <Skeleton className="h-6" />,
      },
    },

    {
      accessorKey: 'scanner',
      header: ({ column }) => (
        <DataGridColumnHeader title="Scanner" column={column} />
      ),
      cell: ({ row }) => {
        const scanner = row.original?.scanner;
        if (!scanner) return <span className="text-muted-foreground">-</span>;
        return (
          <div className="flex items-center gap-2">
            <span className="text-sm">{scanner?.name || 'Unknown'}</span>
          </div>
        );
      },
      size: 140,
      meta: {
        skeleton: <Skeleton className="h-6" />,
      },
    },
    {
      accessorKey: 'triggeredBy',
      accessorFn: (row) => row?.original?.triggeredBy,
      header: ({ column }) => (
        <DataGridColumnHeader title="Triggered By" column={column} />
      ),
      cell: ({ row }) => {
        const triggeredBy = row.original?.triggeredBy;
        if (!triggeredBy)
          return <span className="text-muted-foreground">-</span>;

        if (triggeredBy.user) {
          const { firstName, lastName, email, role } = triggeredBy.user;
          return (
            <Profile
              name={`${firstName || ''} ${lastName || ''}`.trim() || email}
              email={email}
              role={role}
              size="26px"
            />
          );
        }

        if (triggeredBy.auto_trigger === 'aim_policy') {
          return (
            <div className="flex items-center gap-3">
              <div className="w-[26px] h-[26px] rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                <Zap className="w-3.5 h-3.5 text-blue-500" />
              </div>
              <div className="flex flex-col min-w-0 overflow-hidden">
                <span className="text-sm font-medium text-foreground truncate">
                  AIM Policy
                </span>
                <span
                  className="text-xs text-muted-foreground truncate"
                  title={triggeredBy.rule_name || 'Trigger VS'}
                >
                  {triggeredBy.rule_name || 'Trigger VS'}
                </span>
              </div>
            </div>
          );
        }

        if (triggeredBy.auto_trigger === 'periodic') {
          return (
            <div className="flex items-center gap-3">
              <div className="w-[26px] h-[26px] rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
                <Clock className="w-3.5 h-3.5 text-purple-500" />
              </div>
              <div className="flex flex-col min-w-0 overflow-hidden">
                <span className="text-sm font-medium text-foreground truncate">
                  Periodic Scan
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  Automated Schedule
                </span>
              </div>
            </div>
          );
        }

        return <span className="text-muted-foreground">-</span>;
      },
      enableSorting: false,
      size: 150,
      meta: {
        skeleton: <Skeleton className="h-6" />,
      },
    },

    {
      accessorKey: 'totalAssets',
      accessorFn: (row) => row?.original?.totalAssets,
      header: ({ column }) => (
        <DataGridColumnHeader title="Assets" column={column} />
      ),
      cell: ({ row }) => {
        const totalAssets =
          row.original?.totalAssets ?? row.original?.group?.totalAssets ?? 0;
        return (
          <div>
            {totalAssets}
          </div>
        );
      },
      enableSorting: true,
      size: 80,
      meta: {
        skeleton: <Skeleton className="h-6" />,
      },
    },
    {
      id: 'totalVulns',
      // accessorKey: 'vulnerabilities',
      accessorFn: (row) => row?.original?.totalVulns,
      header: ({ column }) => (
        <DataGridColumnHeader title="Vulnerabilities" column={column} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1">
            {row?.original?.totalVulns || 0}
          </div>
        );
      },
      enableSorting: true,
      size: 140,
      meta: {
        skeleton: <Skeleton className="h-6" />,
      },
    },

    {
      accessorKey: 'startedAt',
      accessorFn: (row) => row?.original?.startedAt,
      header: ({ column }) => (
        <DataGridColumnHeader title="Started" column={column} />
      ),
      cell: ({ row }) => {
        const date = row.original?.startedAt || row.original?.createdAt;
        if (!date) return <span className="text-muted-foreground">-</span>;
        return <DateFormatter date={date} />;
      },
      enableSorting: true,
      size: 150,
      meta: {
        skeleton: <Skeleton className="h-6" />,
      },
    },

    // {
    //   accessorKey: 'nextScan',
    //   accessorFn: (row) => row?.original?.nextScan,
    //   header: ({ column }) => (
    //     <DataGridColumnHeader title="Scheduled For" column={column} />
    //   ),
    //   cell: ({ row }) => {
    //     const nextScan = row.original?.nextScan;
    //     if (!nextScan || row.original?.schedule === 'immediate') return <span className="text-muted-foreground">-</span>;

    //     const nextScanDate = new Date(nextScan);
    //     const now = new Date();
    //     const isUpcoming = nextScanDate > now;

    //     if (isUpcoming) {
    //       return (
    //         row.original?.schedule !== "immediate" && (
    //           <div className="flex flex-col">
    //             <span className="text-xs text-muted-foreground flex items-center gap-1">
    //               <Clock className="w-3 h-3" />
    //               In {formatTimestampDuration(nextScan)}
    //             </span>
    //             {/* <DateFormatter date={nextScan} /> */}
    //           </div>
    //         )
    //       );
    //     }
    //     return (
    //       row.original?.schedule !== "immediate" && (
    //         <DateFormatter date={nextScan} />
    //       )
    //     );
    //   },
    //   enableSorting: false,
    //   size: 150,
    //   meta: {
    //     skeleton: <Skeleton className="h-6" />,
    //   },
    // },

    {
      accessorKey: 'frequency',
      accessorFn: (row) => row?.original?.schedule,
      header: ({ column }) => (
        <DataGridColumnHeader title="Frequency" column={column} />
      ),
      cell: ({ row }) => (
        <div className="flex flex-col w-fit gap-0.5">
          <Badge variant="secondary" appearance="outline" className="w-fit">
            {row.original?.schedule || '-'}
          </Badge>
        </div>
      ),
      enableSorting: false,
      size: 80,
      meta: {
        skeleton: <Skeleton className="h-6 w-full" />,
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

function ScansTable({ scans = [], isLoading, totalCount }) {
  const { user } = useAuth();
  const isAuditor = user?.role === 'Auditor';
  const searchQuery = useStore((state) => state.searchQuery);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const pagination = useStore((state) => state.pagination);
  const setPagination = useStore((state) => state.setPagination);
  const sorting = useStore((state) => state.sorting);
  const setSorting = useStore((state) => state.setSorting);
  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);
  const columns = useMemo(() => getColumns(isAuditor), [isAuditor]);
  const count = totalCount ?? scans?.scans?.length ?? 0;

  return (
    <Table
      data={scans?.scans}
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
      totalPages={Math.ceil(count / pagination?.pageSize)}
      manualPagination={true}
      enableSearch={true}
      showPagination={true}
      grid
      pageSizeOptions={[10, 20, 50]}
      toolbar={
        <TableToolbarFilters
          filters={filters}
          setFilters={setFilters}
          supportedFilters={scans?.advanced_filters}
          isLoadingFilters={isLoading}
        />
      }
    />
  );
}

export default ScansTable;