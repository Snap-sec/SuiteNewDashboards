import { useState, useMemo } from 'react';
import { useAuth } from '@/auth/context/auth-context';
import { Check, Loader, X } from 'lucide-react';
import useDebounce from '@/hooks/use-debounce';
import { useGetVmReportsQuery } from '@/services/vm/reportApi';
import { Badge } from '@/components/ui/badge';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DateFormatter } from '@/components/custom/date-formatter';
import Table from '@/components/custom/table';
import ReportListDropdown from '../../report/components/dropdowns/report-list-dropdown';
import { Skeleton } from '../../../../../components/ui/skeleton';

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

  return [
    {
      id: 'name',
      accessorFn: (row) => row.title,
      header: ({ column }) => (
        <DataGridColumnHeader title="Report Name" column={column} />
      ),
      cell: ({ row }) => (
        <div className="flex items-center grow gap-2.5">
          {row.original.format === 'pdf' ? (
            <img src={`/media/file-types/pdf.svg`} alt="image" />
          ) : (
            <img src={`/media/file-types/excel.svg`} alt="image" />
          )}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-mono mb-px truncate">
              {row.original.type == 'allvulns' && row.original.assessmentId
                ? 'Assessment Level Vulnerabilities Report'
                : enum_map[row.original.type] || row.original.type}
            </span>
            <span className="text-xs text-secondary-foreground">
              <DateFormatter date={row.original.createdAt} /> -{' '}
              <span>{row.original.generatedBy?.email || 'Unknown'}</span>
            </span>
          </div>
        </div>
      ),
      enableSorting: false,
      meta: { skeleton: <Skeleton className="h-7" /> },
    },
    {
      id: 'state',
      accessorFn: (row) => row.state,
      header: ({ column }) => (
        <DataGridColumnHeader title="State" column={column} />
      ),
      cell: ({ row }) => {
        const createdAt = row?.original?.createdAt;
        const status = row.original.status || 'unknown';

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

        if (status !== 'completed' && isOld) {
          displayStatus = 'failed';
          badgeVariant = 'destructive';
        }

        return (
          <div className="flex items-center gap-1.5">
            <Badge size="lg" variant={badgeVariant} appearance="outline">
              {status === 'completed' ? (
                <Check className="mr-1 h-3 w-3" />
              ) : status === 'failed' ? (
                <X className="mr-1 h-3 w-3" />
              ) : (
                <Loader className="mr-1 h-3 w-3 animate-spin" />
              )}
              {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
            </Badge>
          </div>
        );
      },
      enableSorting: false,
      meta: { skeleton: <Skeleton className="h-7" /> },
    },

    ...(user?.role?.toLowerCase() !== 'auditor'
      ? [
          {
            id: 'actions',
            accessorFn: (row) => row.state,
            header: ({ column }) => (
              <DataGridColumnHeader title="" column={column} />
            ),
            cell: ({ row }) => <ReportListDropdown row={row} />,
            enableSorting: false,
            size: 50,
            meta: { skeleton: <Skeleton className="h-7" /> },
          },
        ]
      : []),
  ];
}

export function AssessmentReportsTable({ assessmentId }) {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 400);
  const { user } = useAuth();

  const {
    data: reports,
    isLoading,
    isFetching,
  } = useGetVmReportsQuery(
    {
      search: debouncedSearch,
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      assessmentId: assessmentId,
    },
    { pollingInterval: 5000, skip: !assessmentId },
  );

  const columns = useMemo(() => getColumns(user), [user]);

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4 text-foreground">
        Assessment Reports
      </h3>
      <Table
        data={reports?.data?.reports || []}
        columns={columns}
        isLoading={isLoading}
        pagination={pagination}
        setPagination={setPagination}
        totalPages={reports?.data?.pagination?.totalPages || 0}
        totalCount={reports?.data?.pagination?.total || 0}
        search={searchQuery}
        setSearch={setSearchQuery}
        enableSorting={false}
        searchPlaceholder="Search by Report Title"
      />
    </div>
  );
}
