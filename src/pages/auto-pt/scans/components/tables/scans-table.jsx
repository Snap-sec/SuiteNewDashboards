import { useMemo, useRef } from 'react';
import { useAuth } from '@/auth/context/auth-context';
import { Badge } from '@/components/ui/badge';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';

import { Skeleton } from '@/components/ui/skeleton';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import { DateFormatter } from '@/components/custom/date-formatter';
import { StatusBadge } from '@/components/custom/status-badge';
import { Profile } from '@/components/custom/profile';
import Table from '@/components/custom/table';
import VulnerabilitiesBadges from '@/components/custom/vulnerabilities-badges';
import TableToolbarFilters from '@/components/common/table-toolbar-filters';
import useStore from '../../store';
import ActionColumn from '../tab-content/action-column';

// Helper function to format time until scheduled scan
const formatTimestampDuration = (timestamp) => {
  if (!timestamp) return '-';
  const now = new Date();
  const target = new Date(timestamp);
  const diffMs = target.getTime() - now.getTime();
  if (isNaN(diffMs)) return '-';
  if (diffMs <= 0) return 'Soon';

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
  return parts.join(' ');
};

function getColumns(isAuditor) {
  const baseColumns = [
    {
      accessorKey: 'name',
      accessorFn: (row) =>
        row?.original?.projectId?.name ||
        row?.original?.pentestId?.name ||
        row?.original?.name,
      header: ({ column }) => (
        <DataGridColumnHeader title="Project Name" column={column} />
      ),
      cell: ({ row }) => {
        const projectName =
          row.original?.projectId?.name ||
          row.original?.pentestId?.name ||
          row.original?.project?.name ||
          row.original?.name ||
          '-';

        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">
                {projectName}
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
      accessorKey: 'status',
      accessorFn: (row) =>
        row?.original?.status || row?.original?.lastRunStatus,
      header: ({ column }) => (
        <DataGridColumnHeader title="Status" column={column} />
      ),
      cell: ({ row }) => {
        return <StatusBadge status={row?.original?.status} />;
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
        const isScheduled =
          row.original?.is_upcoming ||
          row.original?.isScheduled ||
          row.original?.status === 'scheduled';

        if (isScheduled) return <span>-</span>;

        const vulns =
          row.original?.lastRunSummary?.vuln_counts ||
          row.original?.vuln_counts;
        const scanName =
          row.original?.projectId?.name ||
          row.original?.pentestId?.name ||
          row.original?.name;
          
        return (
          <div className="flex justify-start">
            <VulnerabilitiesBadges
              vulnerabilities={vulns}
              assetName={scanName}
            />
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
      accessorKey: 'triggered_by',
      accessorFn: (row) =>
        row?.original?.trigger === 'manual'
          ? row?.original?.triggered_by?.name || 'Manual'
          : '-',
      header: ({ column }) => (
        <DataGridColumnHeader title="Triggered By" column={column} />
      ),
      cell: ({ row }) => {
        const isManual =
          row.original?.trigger === 'manual' ||
          (!row.original?.trigger &&
            !row.original?.is_upcoming &&
            !row.original?.isScheduled);

        // If trigger is not manual, dont show triggered by
        if (!isManual) {
          return <span className="text-muted-foreground">-</span>;
        }

        const hasTriggeredBy =
          row.original?.triggered_by &&
          (row.original?.triggered_by?.name ||
            row.original?.triggered_by?.userId ||
            row.original?.triggered_by?.email);

        if (hasTriggeredBy) {
          return (
            <Profile
              userId={row.original?.triggered_by?.userId}
              name={row.original?.triggered_by?.name || 'Unknown'}
              email={
                row.original?.triggered_by?.email ||
                row.original?.triggered_by?.name
              }
              graphicsUserName={row.original?.triggered_by?.name}
              size="26px"
            />
          );
        }

        return <span className="text-muted-foreground text-sm">Manual</span>;
      },
      enableSorting: false,
      size: 170,
      meta: {
        skeleton: <Skeleton className="h-6" />,
      },
    },
    {
      accessorKey: 'schedule',
      accessorFn: (row) =>
        row?.original?.schedule?.frequency ||
        row?.original?.frequency ||
        row?.original?.schedule_type ||
        row?.original?.scan_config?.frequency,
      header: ({ column }) => (
        <DataGridColumnHeader title="Schedule" column={column} />
      ),
      cell: ({ row }) => {
        const frequency =
          row.original?.schedule?.frequency ||
          row.original?.frequency ||
          row.original?.schedule_type ||
          row.original?.scan_config?.frequency;

        if (!frequency || frequency === 'none') {
          return <span className="text-muted-foreground">Manual</span>;
        }
        return (
          <div className="flex flex-col w-fit gap-1">
            <Badge
              variant="secondary"
              appearance="outline"
              className="w-fit capitalize"
            >
              {frequency}
            </Badge>
          </div>
        );
      },
      enableSorting: false,
      size: 170,
      meta: {
        skeleton: <Skeleton className="h-6" />,
      },
    },
    {
      accessorKey: 'createdAt',
      accessorFn: (row) =>
        row?.original?.createdAt ||
        row?.original?.next_run_at ||
        row?.original?.scheduled_at,
      header: ({ column }) => (
        <DataGridColumnHeader title="Created" column={column} />
      ),
      cell: ({ row }) => {
        const isScheduled =
          row.original?.is_upcoming ||
          row.original?.isScheduled ||
          row.original?.status === 'scheduled' ||
          !row.original?.createdAt;

        if (isScheduled) {
          const scheduledTimestamp =
            row.original?.next_run_at ||
            row.original?.scheduled_at ||
            row.original?.scheduledAt ||
            row.original?.schedule_date;

          return (
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">Starts in</span>
              <span className="text-sm font-medium">
                {formatTimestampDuration(scheduledTimestamp)}
              </span>
            </div>
          );
        }

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
        if (row.original?.is_upcoming || !row.original?.createdAt) {
          return null;
        }
        return (
          <AuthorityGuard forbidRoles={['Auditor']}>
            <ActionColumn scan={row.original} />
          </AuthorityGuard>
        );
      },
      enableSorting: false,
      size: 50,
      meta: {
        skeleton: <Skeleton className="h-6" />,
      },
    },
  ];

  if (isAuditor) {
    return baseColumns.filter((col) => col.accessorKey !== 'action');
  }

  return baseColumns;
}

function mergeFilters(prevFilters = [], newFilters = []) {
  if (!Array.isArray(newFilters) || newFilters.length === 0) {
    return prevFilters || [];
  }
  if (!Array.isArray(prevFilters) || prevFilters.length === 0) {
    return newFilters;
  }

  const filterMap = new Map();

  prevFilters.forEach((f) => {
    if (!f) return;
    const key = (f.key || f.id || f.name || '').toLowerCase();
    filterMap.set(key, { ...f });
  });

  newFilters.forEach((newF) => {
    if (!newF) return;
    const key = (newF.key || newF.id || newF.name || '').toLowerCase();
    const existing = filterMap.get(key);

    if (!existing) {
      filterMap.set(key, { ...newF });
    } else {
      const existingOpts = existing.options || existing.filters || [];
      const newOpts = newF.options || newF.filters || [];

      const optsMap = new Map();
      existingOpts.forEach((opt) => {
        optsMap.set(String(opt.value ?? opt.id), opt);
      });
      newOpts.forEach((opt) => {
        optsMap.set(String(opt.value ?? opt.id), opt);
      });

      const mergedOptions = Array.from(optsMap.values());
      filterMap.set(key, {
        ...existing,
        ...newF,
        options: mergedOptions,
        filters: mergedOptions,
      });
    }
  });

  return Array.from(filterMap.values());
}

function ScansTable({ scans = {}, isLoading, isFetching, totalCount }) {
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

  const filtersRef = useRef([]);

  const rawAdvancedFilters = useMemo(() => {
    const apiFilters =
      scans?.advanced_filters ||
      scans?.data?.advanced_filters ||
      scans?.filters ||
      scans?.data?.filters;

    if (Array.isArray(apiFilters) && apiFilters.length > 0) {
      return apiFilters;
    }

    if (
      apiFilters &&
      typeof apiFilters === 'object' &&
      !Array.isArray(apiFilters)
    ) {
      const normalized = Object.entries(apiFilters)
        .map(([key, values]) => {
          if (!Array.isArray(values) || !values.length) return null;
          const filterKey = key === 'states' ? 'status' : key;
          const filterName =
            key === 'states'
              ? 'Status'
              : key.charAt(0).toUpperCase() + key.slice(1);
          return {
            key: filterKey,
            name: filterName,
            options: values.map((val) => ({
              label:
                typeof val === 'string'
                  ? val.charAt(0).toUpperCase() + val.slice(1)
                  : String(val),
              value: val,
            })),
          };
        })
        .filter(Boolean);

      if (normalized.length > 0) return normalized;
    }

    return null;
  }, [scans]);

  if (rawAdvancedFilters && rawAdvancedFilters.length > 0) {
    filtersRef.current = mergeFilters(filtersRef.current, rawAdvancedFilters);
  }

  const supportedFilters = useMemo(() => {
    return filtersRef.current?.length
      ? filtersRef.current
      : rawAdvancedFilters?.length
        ? rawAdvancedFilters
        : [];
  }, [rawAdvancedFilters]);

  const regularScans = useMemo(() => {
    return Array.isArray(scans?.data)
      ? scans.data
      : scans?.data?.scans || [];
  }, [scans]);

  const rawFutureScans = useMemo(() => {
    return (
      scans?.future_scans ||
      scans?.data?.future_scans ||
      scans?.upcoming ||
      scans?.data?.upcoming ||
      []
    );
  }, [scans]);

  const upcomingScans = useMemo(() => {
    return rawFutureScans.map((scan, idx) => ({
      ...scan,
      _id:
        scan?._id ||
        `upcoming-scan-${scan?.projectId?._id || idx}-${scan?.scheduled_at || scan?.next_run_at || idx}`,
      is_upcoming: true,
      isScheduled: true,
      status: scan?.status || 'upcoming',
    }));
  }, [rawFutureScans]);

  const filteredUpcoming = useMemo(() => {
    let list = upcomingScans;
    const statusFilter = filters.status || filters.state;
    if (statusFilter) {
      const allowed = statusFilter
        .split(',')
        .map(decodeURIComponent)
        .map((s) => s.toLowerCase());
      if (!allowed.includes('upcoming') && !allowed.includes('scheduled')) {
        return [];
      }
    }
    const projectFilter =
      filters.project || filters.projectId || filters.pentestId;
    if (projectFilter) {
      const allowedProjects = projectFilter
        .split(',')
        .map(decodeURIComponent)
        .map((s) => s.toLowerCase());
      list = list.filter((s) => {
        const id = String(
          s?.projectId?._id ||
            s?.projectId?.id ||
            s?.pentestId?._id ||
            s?.pentestId?.id ||
            s?.projectId ||
            s?.pentestId ||
            s?.name ||
            '',
        ).toLowerCase();
        const name = String(
          s?.projectId?.name ||
            s?.pentestId?.name ||
            s?.project?.name ||
            s?.name ||
            '',
        ).toLowerCase();
        return allowedProjects.some((p) => p === id || p === name);
      });
    }
    if (!searchQuery) return list;
    const q = searchQuery.toLowerCase();
    return list.filter((s) => {
      const name =
        s?.projectId?.name ||
        s?.pentestId?.name ||
        s?.project?.name ||
        s?.name ||
        '';
      return name.toLowerCase().includes(q);
    });
  }, [upcomingScans, searchQuery, filters]);

  const scansList = useMemo(() => {
    // Show upcoming scans on top (prepended on the first page)
    if (pagination.pageIndex === 0 && filteredUpcoming.length > 0) {
      return [...filteredUpcoming, ...regularScans];
    }
    return regularScans;
  }, [filteredUpcoming, regularScans, pagination.pageIndex]);

  const count =
    (totalCount ??
      scans?.meta?.total ??
      scans?.pagination?.total ??
      regularScans.length) + (filteredUpcoming.length || 0);

  const totalPages =
    scans?.pagination?.totalPages ??
    scans?.meta?.totalPages ??
    Math.ceil(count / pagination.pageSize) ??
    1;

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
      toolbar={
        <TableToolbarFilters
          filters={filters}
          setFilters={setFilters}
          supportedFilters={supportedFilters}
          isLoadingFilters={Boolean(isLoading && !supportedFilters?.length)}
          onReset={() => setFilters({})}
        />
      }
    />
  );
}

export default ScansTable;
