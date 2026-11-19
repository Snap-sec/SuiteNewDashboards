import React, { useEffect, useMemo, useState } from 'react';
import { Clock, Globe, MoreHorizontal, Plus, RotateCcw, TriangleAlert } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { NoSearchResultsFound } from '@/components/common/no-search-found';
import { DateFormatter } from '@/components/custom/date-formatter';
import PageHeading from '@/components/custom/page-heading';
import { StatusBadge } from '@/components/custom/status-badge';
import Table from '@/components/custom/table';
import { ButtonWithConfirm, ConfirmDialog } from '@/components/custom/button-with-confirmation';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import { EmptyScreen } from '../../../components/common/empty-screen';
import { Button } from '../../../components/ui/button';
import useDebounce from '../../../hooks/use-debounce';
import { useCancelAsmScanMutation, useGetAsmScansDashboardStatsQuery, useRetryAsmScanMutation } from '../../../services/asm/scansApi';
import LaunchNewScan from '../integrations/components/buttons/launch-new-scan';
import useStore from '../rules/store';
import TableToolbarFilters from '@/components/common/table-toolbar-filters';
import AuthorityGuard from '../../../components/custom/authority-guard/AuthorityGuard';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';

const Scans = () => {
  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);

  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 });
  const [sorting, setSorting] = useState([]);
  const [scanToCancel, setScanToCancel] = useState(null);

  const debouncedSearch = useDebounce(search, 400)

  const [isScanConfigured, setIsScanConfigured] = useState(true);

  const {
    data: scansData,
    isLoading: isStatsLoading,
    isFetching: isFetchingScans,
    isError,
  } = useGetAsmScansDashboardStatsQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    ...(search && { search: debouncedSearch }),
    ...(sorting.length > 0
      ? { sortBy: sorting[0]?.id, sortOrder: sorting[0]?.desc ? 'desc' : 'asc' }
      : {}),
    ...filters,
  }, { pollingInterval: 5000 });

  const [cancelScan] = useCancelAsmScanMutation();
  const [retryScan, { isLoading: isRetrying }] = useRetryAsmScanMutation();

  const handleCancelScan = (scanId) => {
    toast.promise(cancelScan(scanId).unwrap(), {
      loading: 'Cancelling scan...',
      success: 'Scan cancelled successfully',
      error: 'Failed to cancel scan',
    });
  };

  const handleRetry = () => {
    toast.promise(retryScan().unwrap(), {
      loading: 'Retrying scan...',
      success: 'Scan retry triggered successfully',
      error: (error) => {
        return error?.data?.message || 'Failed to retry scan';
      },
    });
  };

  // Reset pagination when filters or search changes
  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [filters, search]);

  // Helper function to format duration
  const formatDuration = (ms) => {
    if (!ms) return '-';
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    return `${minutes}m ${seconds}s`;
  };

  // Helper function to format time until scheduled scan
  const formatTimestampDuration = (timestamp) => {
    if (!timestamp) return '-';
    const now = new Date();
    const target = new Date(timestamp);
    const diffMs = Math.abs(now - target);
    const totalMinutes = Math.floor(diffMs / 60000);
    const minutes = totalMinutes % 60;
    const totalHours = Math.floor(totalMinutes / 60);
    const hours = totalHours % 24;
    const totalDays = Math.floor(totalHours / 24);
    const days = totalDays % 30;
    const months = Math.floor(totalDays / 30);

    let parts = [];
    if (months > 0) parts.push(`${months}mo`);
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0 || parts.length === 0) parts.push(`${minutes}min`);
    return parts.join(" ");
  };

  // Combine upcoming and regular scans for the table
  const allScans = useMemo(() => {
    const upcoming = scansData?.upcoming || [];
    const regular = Array.isArray(scansData) ? scansData : (scansData?.data || []);
    return [...upcoming, ...regular];
  }, [scansData]);

  // Check if any scan has exposure_analysis pending or failed on completed scan
  const canRetry = useMemo(() => {
    const regular = Array.isArray(scansData) ? scansData : (scansData?.data || []);
    return regular.some((scan) => {
      const expStatus = scan?.exposure_analysis?.status;
      return scan?.status === 'completed' && (expStatus === 'pending' || expStatus === 'failed');
    });
  }, [scansData]);

  const totalCount = scansData?.total || allScans.length;
  const totalPages = Math.ceil(totalCount / pagination.pageSize);

  // Define table columns
  const columns = useMemo(() => {
    const cols = [
      {
        accessorKey: 'domains',
        header: ({ column }) => <DataGridColumnHeader title="Domain" column={column} />,
        cell: ({ row }) => {
          const domains = row.original?.settingSnapshot?.domains || row.original?.settingSnapshot?.data?.domains || [];
          const isScheduled = !row.original?.createdAt;
          return (
            <div className="flex items-center gap-2 flex-wrap">

              {domains.slice(0, 2).map((domain, index) => (
                <p key={index} className="flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  {domain}
                </p>
              ))}
              {domains.length > 2 && (
                <DetailedHoverPopover
                  popoverTitle="More Domains"
                  buttonText={`+${domains.length - 2} more`}
                  trigger="hover"
                  showBadge={true}
                  width="w-[280px]"
                  popoverContent={
                    <div className="flex flex-col gap-1.5">
                      {domains.slice(2).map((domain, index) => (
                        <div key={index} className="flex items-center gap-1.5 text-xs">
                          <Globe className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                          <span className="break-all">{domain}</span>
                        </div>
                      ))}
                    </div>
                  }
                />
              )}
            </div>
          );
        },
        enableSorting: false,
        size: 280,
        minSize: 180,
        meta: {
          skeleton: <Skeleton className="h-6 w-full" />,
        },
      },
      {
        accessorKey: 'status',
        header: ({ column }) => (
          <DataGridColumnHeader title="Status" column={column} />
        ),
        cell: ({ row }) => (
          <StatusBadge
            status={row.original?.status}
            progress={row.original?.progress}
            label={(row.original?.status === 'running' || row.original?.status === 'pending') && row.original?.currentPhase ? row.original.currentPhase : undefined}
            showPercentage={row.original?.currentPhase !== 'Queued for scan' && row.original?.currentPhase !== 'Preparing initial commands'}
          />
        ),
        size: 220,
        minSize: 160,
        enableSorting: false,
        meta: {
          skeleton: <Skeleton className="h-6 w-full" />,
        },
      },
      {
        accessorKey: 'createdAt',
        header: ({ column }) => <DataGridColumnHeader title="Started" column={column} />,
        cell: ({ row }) => {
          const isScheduled = !row.original?.createdAt;
          if (isScheduled) {
            return (
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Starts in</span>
                <span className="text-sm">{formatTimestampDuration(row.original?.scheduledAt)}</span>
              </div>
            );
          }
          return <DateFormatter date={row.original?.createdAt} />;
        },
        enableSorting: true,
        size: 160,
        minSize: 130,
        meta: {
          skeleton: <Skeleton className="h-6 w-full" />,
        },
      },
      {
        accessorKey: 'execution_time',
        header: ({ column }) => <DataGridColumnHeader title="Duration" column={column} />,
        cell: ({ row }) => {
          if (!row.original?.createdAt) return '-';
          return formatDuration(row.original?.execution_time);
        },
        enableSorting: true,
        size: 130,
        minSize: 100,
        meta: {
          skeleton: <Skeleton className="h-6 w-full" />,
        },
      },
      {
        accessorKey: 'frequency',
        header: ({ column }) => (
          <DataGridColumnHeader title="Frequency" column={column} />
        ),
        cell: ({ row }) => (
          <Badge>
            {row.original?.settingSnapshot?.frequency || '-'}
          </Badge>
        ),
        enableSorting: false,
        size: 130,
        minSize: 100,
        meta: {
          skeleton: <Skeleton className="h-6 w-full" />,
        },
      },
    ];

    const hasActionableRow = allScans.some((scan) => {
      const isScheduled = !scan?.createdAt;
      if (isScheduled) return false;
      const isRunningOrPending = scan?.status === 'running' || scan?.status === 'pending';
      const isCompleted = scan?.status === 'completed';
      const expStatus = scan?.exposure_analysis?.status;
      const canRetryRow = isCompleted && (expStatus === 'pending' || expStatus === 'failed');
      return isRunningOrPending || canRetryRow;
    });

    if (hasActionableRow) {
      cols.push({
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          const status = row.original?.status;
          const scanId = row.original?._id;
          const isScheduled = !row.original?.createdAt;

          if (isScheduled) return null;

          const isRunningOrPending = status === 'running' || status === 'pending';
          const isCompleted = status === 'completed';
          const expStatus = row.original?.exposure_analysis?.status;
          const canRetryRow = isCompleted && (expStatus === 'pending' || expStatus === 'failed');

          if (!isRunningOrPending && !canRetryRow) {
            return null;
          }

          return (
            <div className="flex justify-end pr-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {canRetryRow && (
                    <DropdownMenuItem
                      className="cursor-pointer"
                      disabled={isRetrying}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRetry();
                      }}
                    >
                      <RotateCcw className={`w-4 h-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
                      <span>{isRetrying ? 'Retrying...' : 'Retry'}</span>
                    </DropdownMenuItem>
                  )}

                  {isRunningOrPending && (
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setScanToCancel(scanId);
                      }}
                    >
                      <span>Cancel</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
        size: 60,
        minSize: 50,
      });
    }

    return cols;
  }, [allScans, isRetrying]);

  // Show empty state only when there's no data and no filters applied
  if (
    !isStatsLoading &&
    allScans.length === 0 &&
    Object.keys(filters).length === 0 &&
    !search
  ) {
    return (
      <EmptyScreen
        title="No data available"
        subTitle="There are no data to show, please create a scan, click the button below."
        engage={
          <AuthorityGuard forbidRoles={['Auditor']}>
            <div className="flex items-center gap-2">
              {canRetry && (
                <Button
                  variant="outline"
                  disabled={isRetrying}
                  onClick={handleRetry}
                >
                  <RotateCcw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
                  {isRetrying ? 'Retrying...' : 'Retry'}
                </Button>
              )}

              {!isScanConfigured && <Link to={`/casm/settings`}>
                <Button>
                  <Plus /> Configure
                </Button>
              </Link>}

              <LaunchNewScan setIsScanConfigured={setIsScanConfigured} />
            </div>
          </AuthorityGuard>
        }
      />
    );
  }

  return (
    <div className="p-4">
      <Helmet>
        <title>Xpose | Scans</title>
      </Helmet>
      <div className="w-full flex items-center justify-between mb-1">
        <PageHeading title="Scans" description="View, manage, and launch scans across your organization’s attack surface." />

        <AuthorityGuard forbidRoles={['Auditor']}>
          <div className="flex items-center gap-2">
            {canRetry && (
              <ButtonWithConfirm
                confirm={true}
                variant="outline"
                disabled={isRetrying}
                confirmTitle="Retry Scan"
                dialog="Are you sure you want to retry this scan?"
                onConfirm={handleRetry}
              >
                <RotateCcw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
                {isRetrying ? 'Retrying...' : 'Retry'}
              </ButtonWithConfirm>
            )}
            <LaunchNewScan setIsScanConfigured={setIsScanConfigured} />
          </div>
        </AuthorityGuard>
      </div>

      <Table
        data={allScans}
        columns={columns}
        enableSorting={true}
        isLoading={isStatsLoading}
        totalCount={totalCount}
        totalPages={totalPages}
        pagination={pagination}
        setPagination={setPagination}
        sorting={sorting}
        setSorting={setSorting}
        search={search}
        setSearch={setSearch}
        searchPlaceholder="Search scans..."
        manualPagination={true}
        enableSearch={true}
        showPagination={true}
        pageSizeOptions={[10, 20, 50]}
        toolbar={
          <TableToolbarFilters
            filters={filters}
            supportedFilters={scansData?.advanced_filters}
            isLoadingFilters={isStatsLoading}
            setFilters={setFilters}
          />
        }
      />
      <ConfirmDialog
        open={!!scanToCancel}
        setOpen={(open) => !open && setScanToCancel(null)}
        onConfirm={() => {
          if (scanToCancel) handleCancelScan(scanToCancel);
          setScanToCancel(null);
        }}
        variant="destructive"
        title="Cancel Scan"
        dialog="Are you sure you want to cancel this scan? This action cannot be undone."
      />
    </div>
  );
};

export default Scans;