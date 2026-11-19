import _ from "lodash";
import { useMemo } from 'react';
import { ChartPie, Check, Dock, FileChartPie, FileSliders, FileText, Loader, Trash, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import {
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from '@/components/ui/data-grid-table';
import { Skeleton } from '@/components/ui/skeleton';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import { DateFormatter } from '@/components/custom/date-formatter';
import { Profile } from '@/components/custom/profile';
import Table from '@/components/custom/table';
import { CustomTooltip } from '@/components/custom/tooltip';
import useStore from '../store';
import ReportListDropdown from './dropdowns/report-list-dropdown';
import { useAuth } from '@/auth/context/auth-context';

const enum_map = {
  revalidation: 'Full Revalidation Report',
  fullrevalidation: 'Organization Level Revalidation Report',
  vulnerability: 'Vulnerability Report',
  fullexec: 'Full Executive Report',
  executive: 'Executive Report',
  asset: 'Asset Report',
  allvulns: 'Organization Wide Vulnerabilities Report',
  'allvulns-assessment': 'Assessment Level Vulnerabilities Report',
  certificate: 'Certificate of Completion',
  sla: 'SLA Report',
};

function getColumns(user) {
  const isAuditor = user?.role?.toLowerCase() === 'auditor';

  return [
    ...(user?.role === 'Auditor' ? [] : [{
      id: 'select',
      accessorKey: '_id',
      header: ({ table }) => <DataGridTableRowSelectAll table={table} />,
      cell: ({ row }) => <DataGridTableRowSelect row={row} />,
      enableSorting: false,
      enableHiding: false,
      size: 35,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    }]),
    {
      id: 'name',
      accessorFn: (row) => row.title,
      header: ({ column }) => (
        <DataGridColumnHeader title="Report Name" column={column} />
      ),

      cell: ({ row }) => (
        <div className="flex items-center grow gap-2.5">
          {/* {row.original.format === 'pdf' ? (
            <FileText className="w-4 h-4 text-red-500" />
          ) : (
            <FileSpreadsheet className="w-4 h-4 text-green-600" />
          )} */}

          <div className="flex flex-col">
            <span className="text-sm font-medium text-mono mb-px truncate">
              {row.original.type == 'allvulns' && row.original.assessmentId
                ? 'Assessment Level Vulnerabilities Report'
                : enum_map[row.original.type]}
            </span>
            <span className="text-xs text-secondary-foreground">
              <DateFormatter date={row.original.createdAt} /> -{' '}
              <span>{row.original.generatedBy?.name || 'Unknown'}</span>
            </span>
          </div>
        </div>
      ),

      enableSorting: false,
      size: 240,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'Report Type',
      accessorFn: (row) => row.type,
      header: ({ column }) => (
        <DataGridColumnHeader title="Assessment Name" column={column} />
      ),

      cell: ({ row }) => (
        // <div className="flex items-center gap-1.5">
        //   {row.original.type === 'Vulnerability' ? (
        //     <FileText size={16} className="text-info" />
        //   ) : row.original.type === 'Full Executive' ? (
        //     <ChartPie size={16} className="text-info" />
        //   ) : row.original.type === 'Executive' ? (
        //     <FileChartPie size={16} className="text-info" />
        //   ) : (
        //     <FileSliders size={16} className="text-info" />
        //   )}
        //   {enum_map[row.original.type] || 'Unknown'}
        // </div>

        <div>{row?.original?.assessment?.title || 'No Assessment'}</div>
      ),

      enableSorting: false,
      size: 130,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7 w-full" />,
      },
    },

    {
      id: 'Report Type',
      accessorFn: (row) => row.type,
      header: ({ column }) => (
        <DataGridColumnHeader title="Service Vendor" column={column} />
      ),

      cell: ({ row }) => (
        <div
          title={row?.original?.serviceVendor?.name || '-'}
          className="truncate"
        >
          {row?.original?.serviceVendor?.name || '-'}
        </div>
      ),

      enableSorting: false,
      size: 100,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7 w-full" />,
      },
    },

    {
      id: 'state',
      accessorFn: (row) => row.state,
      header: ({ column }) => (
        <DataGridColumnHeader title="State" column={column} />
      ),

      cell: ({ row }) => {
        const createdAt = row?.original?.createdAt;
        const status = row.original.status;

        // Check if createdAt is more than 1 hour (3600000 ms) ago
        const isOld = createdAt
          ? Date.now() - new Date(createdAt).getTime() > 3600000
          : false;

        let displayStatus = status;
        let badgeVariant =
          status === 'completed'
            ? 'success'
            : status === 'failed'
              ? 'destructive'
              : 'warning';

        // If older than 1 hour, override to 'failed'
        if (!status === 'completed' && isOld) {
          displayStatus = 'failed';
          badgeVariant = 'destructive';
        }

        return (
          <div className="flex items-center gap-1.5">
            <Badge size="lg" variant={badgeVariant} appearance="outline">
              {status === 'completed' ? (
                <Check />
              ) : status === 'failed' ? (
                <X />
              ) : (
                <Loader className=" animate-spin" />
              )}
              {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
            </Badge>
          </div>
        );
      },

      enableSorting: false,
      size: 100,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7 w-full" />,
      },
    },
    ...(!isAuditor
      ? [
        {
          id: 'actions',
          accessorFn: (row) => row.state,
          header: ({ column }) => (
            <DataGridColumnHeader title="" column={column} />
          ),
          cell: ({ row }) => <ReportListDropdown row={row} />,
          enableSorting: false,
          size: 40,
          meta: {
            cellClassName: '',
            skeleton: <Skeleton className="h-7 w-full" />,
          },
        },
      ]
      : []),
  ];
}

const ReportList = ({ data = [], paginationData, isLoading, isFetching }) => {
  const pagination = useStore((state) => state.pagination);
  const setPagination = useStore((state) => state.setPagination);
  const searchQuery = useStore((state) => state.searchQuery);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const rowSelection = useStore((state) => state.rowSelection);
  const setRowSelection = useStore((state) => state.setRowSelection);
  const { user } = useAuth();

  const columns = useMemo(() => getColumns(user), [user]);

  return (
    <Table
      data={data}
      columns={columns}
      isLoading={isLoading || isFetching}
      pagination={pagination}
      setPagination={setPagination}
      totalPages={paginationData?.totalPages}
      totalCount={paginationData?.total}
      search={searchQuery}
      setSearch={setSearchQuery}
      rowSelection={rowSelection}
      setRowSelection={setRowSelection}
      enableSorting={false}
      searchPlaceholder="Search by Report Title"
      searchWidth="60"
    />
  );
};

export default ReportList;
