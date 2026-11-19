import { useEffect, useMemo, useRef, useState } from 'react';
import {
  CircleAlert,
  OctagonX,
  RefreshCcw,
  Search,
  ShieldAlert,
  X,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { debounce } from '@/lib/helpers';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import {
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from '@/components/ui/data-grid-table';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { CustomAvatarGroup } from '@/components/custom/avatar-group';
import { DateFormatter } from '@/components/custom/date-formatter';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import { Profile } from '@/components/custom/profile';
import SeverityLabel from '@/components/custom/severity-label';
import { StateLabels } from '@/components/custom/state-labels';
import Table from '@/components/custom/table';
import TableToolbarFilters from '../../../../../components/common/table-toolbar-filters';
import AuthorityGuard from '../../../../../components/custom/authority-guard/AuthorityGuard';
import { formatDate, formatDateTime } from '../../../../../lib/helpers';
import useStore from '../store';
import VMBulkUpdate from './bulk-update';

function getColumns() {
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
      size: 40,
      meta: { skeleton: <Skeleton className="h-7" /> },
    },
    {
      id: 'title',
      accessorFn: (row) => row.title,
      header: ({ column }) => (
        <DataGridColumnHeader title="Title" column={column} />
      ),

      cell: ({ row }) => (
        <Link
          to={`/csp-m/vulnerability-report?id=${row?.original?._id}&assessmentId=${row?.original?.assessmentId?._id || row?.original?.assessmentId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="leading-none text-sm text-mono hover:text-primary"
        >
          <div className="flex flex-col gap-1 lg:gap-2.5 ">
            <div className="flex items-center gap-1.5">
              <p title={row.original.title} className="truncate block">
                {row.original.title}
              </p>
              {row?.original?.blockers?.length > 0 && (
                // <ShieldAlert size={15} className="text-destructive" />
                <Badge size="sm" variant="destructive" appearance="outline">
                  Blocked
                </Badge>
              )}
            </div>
          </div>
        </Link>
      ),

      enableSorting: false,
      size: 400,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7 w-full" />,
      },
    },
    {
      id: 'owner',
      accessorFn: (row) => row.owner,
      header: ({ column }) => (
        <DataGridColumnHeader title="Owner" column={column} />
      ),
      cell: ({ row }) => {
        const ownerName = row.original.assigneeDetails?.firstName
          ? `${row.original.assigneeDetails?.firstName}`
          : row.original?.assignee?.name;

        if (ownerName) {
          return (
            <Profile
              name={ownerName}
              // role={row.original.assigneeDetails?.role || ' '}
              email={
                row.original.assigneeDetails?.email ||
                row.original?.assignee?.email
              }
            />
          );
        }

        return (
          <span className="text-muted-foreground text-sm font-medium pl-1">
            No Owner
          </span>
        );
      },

      enableSorting: false,
      size: 150,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    // {
    //   id: 'assigned_at',
    //   accessorFn: (row) => row.owner,
    //   header: ({ column }) => (
    //     <DataGridColumnHeader title="Assigned At" column={column} />
    //   ),
    //   cell: ({ row }) => (
    //     <p>{row.original.assignedAt}</p>
    //   ),

    //   enableSorting: false,
    //   size: 150,
    //   meta: {
    //     cellClassName: '',
    //     skeleton: <Skeleton className="h-7 w-[100px]" />,
    //   },
    // },
    // {
    //   id: 'Assessment Name',
    //   accessorFn: (row) => row.assessmentTitle,
    //   header: ({ column }) => (
    //     <DataGridColumnHeader title="Assessment Name" column={column} />
    //   ),

    //   cell: ({ row }) => (
    //     <Link
    //       to={`/vm/assessment-edit?assessmentId=${row?.original?.assessmentId}`}
    //       // target="_blank"
    //       rel="noopener noreferrer"
    //       className="leading-none font-medium text-sm text-mono hover:text-primary"
    //     >
    //       <div
    //         data-testid="assessment-badge"
    //         className="flex items-center gap-1.5"
    //       >
    //         {row.original.assessmentTitle || 'Unknown'}
    //       </div>
    //     </Link>
    //   ),

    //   enableSorting: false,
    //   size: 150,
    //   meta: {
    //     cellClassName: '',
    //     skeleton: <Skeleton className="h-7 w-[100px]" />,
    //   },
    // },
    {
      id: 'state',
      accessorFn: (row) => row.eventType,
      header: ({ column }) => (
        <DataGridColumnHeader title="State" column={column} />
      ),

      cell: ({ row }) => <StateLabels state={row.original.state} />,

      enableSorting: false,
      size: 130,
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
        <SeverityLabel severity={row.original.cvssRating} size="sm" />
      ),

      enableSorting: true,
      size: 100,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'Reported On',
      accessorFn: (row) => row.createdAt,
      header: ({ column }) => (
        <div className="flex items-center gap-1">
          <DataGridColumnHeader title="Reported On" column={column} />
          <DetailedHoverPopover
            // buttonText={
            //   <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            //     <CircleAlert className="h-4 w-4" />
            //   </Button>
            // }
            showBadge={false}
            popoverTitle="Timeline Definitions"
            popoverContent={
              <div className="space-y-2 text-xs">
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">First Reported:</strong>{' '}
                  The date and time when the vulnerability was initially
                  identified in your environment.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">
                    Last Updated / Detected:
                  </strong>{' '}
                  The most recent date when the vulnerability was either updated
                  or re-verified by a scan.
                </p>
              </div>
            }
          />
        </div>
      ),

      cell: ({ row }) => (
        <div className=" flex flex-col">
          <DateFormatter date={row.original.createdAt} />{' '}
          {/* <div className=' flex items-center gap-0.5'>
            <RefreshCcw size={9} />
            <DateFormatter date={row.original.updatedAt} />
          </div>{' '} */}
        </div>
      ),

      enableSorting: true,
      size: 120,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
  ];
}

function VulnList({ data, isLoading, isFetching }) {
  const pagination = useStore((state) => state.pagination);
  const searchQuery = useStore((state) => state.searchQuery);
  const sorting = useStore((state) => state.sorting);
  const setPagination = useStore((state) => state.setPagination);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const setSorting = useStore((state) => state.setSorting);
  const rowSelection = useStore((state) => state.rowSelection);
  const setRowSelection = useStore((state) => state.setRowSelection);
  const setFilters = useStore((state) => state.setFilters);
  const filters = useStore((state) => state.filters);
  const navigate = useNavigate();

  // Clear selection when pagination changes
  useEffect(() => {
    setRowSelection(() => ({}));
  }, [pagination.pageIndex, pagination.pageSize, setRowSelection]);

  // Clear selection when component unmounts (navigating away)
  useEffect(() => {
    return () => {
      setRowSelection(() => ({}));
    };
  }, [setRowSelection]);

  const transformedFilters = useMemo(() => {
    if (!data?.filters) return [];

    const f = [];

    if (data.filters.severity) {
      f.push({
        key: 'severity',
        name: 'Severity',
        filters: data.filters.severity.map((s) => ({ label: s, value: s })),
      });
    }

    if (data.filters.assessments) {
      f.push({
        key: 'assessmentTitle',
        name: 'Assessments',
        filters: data.filters.assessments.map((a) => ({
          label: a.title,
          value: a.title,
        })),
      });
    }

    if (data.filters.assignee) {
      f.push({
        key: 'assignee',
        name: 'Owners',
        filters: data.filters.assignee.map((a) => ({ label: a, value: a })),
      });
    }

    if (data.filters.state) {
      f.push({
        key: 'state',
        name: 'State',
        filters: data.filters.state.map((s) => ({ label: s, value: s })),
      });
    }

    if (data.filters.businessUnits) {
      f.push({
        key: 'businessUnits',
        name: 'Business Unit',
        filters: [
          { label: 'Unassigned', value: 'Unassigned' },
          ...data.filters.businessUnits.map((bu) => ({
            label: bu.name,
            value: bu.id,
          })),
        ],
      });
    }

    if (data.filters.departments) {
      f.push({
        key: 'departmentId',
        name: 'Departments',
        filters: data.filters.departments.map((d) => ({
          label: d.name,
          value: d.id,
        })),
      });
    }

    if (data.filters.sla) {
      f.push({
        key: 'sla',
        name: 'SLA',
        filters: data.filters.sla.map((s) => ({ label: s, value: s })),
      });
    }

    if (data.filters.hasBlocker) {
      f.push({
        key: 'hasBlocker',
        name: 'Blocked',
        filters: data.filters.hasBlocker.map((b) => ({ label: b, value: b })),
      });
    }

    return f;
  }, [data?.filters]);

  const columns = useMemo(() => getColumns(), []);
  const selectedRowsCount = Object.keys(rowSelection).length;

  const [searchFocused, setSearchFocused] = useState(false);
  const searchWrapperRef = useRef(null);

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(e.target)
      ) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const advancedSearchHref = `/vm/search${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`;

  const customSearchInput = (
    <div ref={searchWrapperRef} className="relative flex items-center">
      <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      <Input
        placeholder="Search ..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setSearchFocused(true)}
        className={`ps-9 transition-all duration-200 ${
          searchFocused || searchQuery ? 'pe-44 w-72' : 'w-40'
        }`}
      />
      {(searchFocused || searchQuery?.length > 0) && (
        <div className="absolute end-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
          <Link
            to={advancedSearchHref}
            className="flex items-center gap-1 text-[11px] text-primary hover:underline font-medium whitespace-nowrap transition-all duration-150 active:scale-95 active:opacity-70"
            onClick={() => setSearchFocused(false)}
          >
            <Search className="size-3" />
            Advanced Search
          </Link>
          {searchQuery && (
            <Button
              mode="icon"
              variant="ghost"
              className="h-5 w-5 p-0 shrink-0"
              onClick={() => setSearchQuery('')}
            >
              <X className="size-3.5" />
            </Button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      <Table
        data={data?.userVulns}
        columns={columns}
        enableSorting={true}
        isLoading={isLoading || isFetching}
        totalPages={data?.totalPages}
        totalCount={data?.totalItems}
        pagination={pagination}
        setPagination={setPagination}
        sorting={sorting}
        setSorting={setSorting}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        search={searchQuery}
        setSearch={setSearchQuery}
        newSearchInput={customSearchInput}
        grid
        toolbar={
          <TableToolbarFilters
            filters={filters}
            setFilters={setFilters}
            supportedFilters={data?.advanced_filters}
            isLoadingFilters={isLoading}
            onReset={() =>
              navigate(window.location.pathname, { replace: true })
            }
          />
        }
      />
      {selectedRowsCount > 1 && <VMBulkUpdate vulns={data?.userVulns} />}
    </>
  );
}

export default VulnList;
