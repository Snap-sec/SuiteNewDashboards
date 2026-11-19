import { useMemo, useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { useGetAutomationRuleJobsQuery, useCancelAutomationRuleJobMutation } from '@/services/vm/automationApi';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import Table from '@/components/custom/table';
import { DateFormatter } from '@/components/custom/date-formatter';
import { EmptyScreen } from '@/components/common/empty-screen';
import { StatusBadge } from '@/components/custom/status-badge';
import { useAuth } from '@/auth/context/auth-context';

const StatusDot = ({ status }) => {
  let color = 'bg-gray-500';
  let label = status || 'Unknown';
  if (status === 'completed') {
    color = 'bg-emerald-500';
    label = 'Completed';
  } else if (status === 'failed') {
    color = 'bg-red-500';
    label = 'Failed';
  } else if (status === 'in_progress') {
    color = 'bg-blue-500';
    label = 'In progress';
  } else if (status === 'pending') {
    color = 'bg-yellow-500';
    label = 'Pending';
  }

  return (
    <Badge variant="secondary" appearance="outline" className={`capitalize font-medium gap-1.5 ${status === 'completed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : status === 'failed' ? 'bg-red-500/10 text-red-500 border-red-500/20' : status === 'in_progress' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'}`}>
      {label}
    </Badge>
  );
};

const JobListDropdown = ({ row, ruleId }) => {
  const [open, setOpen] = useState(false);
  const job = row.original;
  const status = job?.status;
  const jobId = job?._id;

  const [cancelJob, { isLoading: isCanceling }] = useCancelAutomationRuleJobMutation();

  const handleCancelJob = () => {
    toast.promise(cancelJob({ ruleId, jobId, payload: { status: 'cancelled' } }).unwrap(), {
      loading: 'Canceling Job...',
      success: 'Job Canceled Successfully',
      error: (err) => {
        console.log(err);
        return err?.data?.message || 'Failed to cancel the Job';
      },
    });
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[150px]" side="bottom" align="end">
        <AuthorityGuard forbidRoles={['Auditor']}>
          <DropdownMenuItem asChild>
            <ButtonWithConfirm
              disabled={isCanceling || status == "timeout" ||  status === 'completed' || status === "cancelled" || status === 'completed_successfully' || status === 'failed'}
              variant="ghost"
              confirm={true}
              dialog="Are you sure you want to cancel this job?"
              onConfirm={() => {
                if (isCanceling) return;
                handleCancelJob();
                setOpen(false);
              }}
              confirmButton={
                <Button variant="destructive" disabled={isCanceling}>
                  Cancel
                </Button>
              }
              cancelButton={<Button variant="outline">Back</Button>}
              className="w-full justify-start font-normal text-destructive hover:bg-red-50 hover:text-destructive dark:hover:bg-red-950/50 focus:bg-red-50 focus:text-destructive dark:focus:bg-red-950/50 px-2 py-1.5 text-sm h-8 cursor-pointer"
            >
              <span>Cancel</span>
            </ButtonWithConfirm>
          </DropdownMenuItem>
        </AuthorityGuard>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export function JobsTab({ ruleId }) {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const { user } = useAuth();
  const isAuditor = user?.role === 'Auditor';

  const { data, isLoading, isFetching } = useGetAutomationRuleJobsQuery(
    {
      id: ruleId,
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    },
    { skip: !ruleId, pollingInterval: 5000 }
  );

  const columns = useMemo(
    () => [
      {
        id: 'jobId',
        accessorFn: (row) => row._id,
        header: ({ column }) => <DataGridColumnHeader title="Job ID" column={column} />,
        cell: ({ getValue }) => <span className="font-mono text-xs truncate max-w-[220px] block" title={getValue()}>{getValue()}</span>,
        enableSorting: false,
        size: 220,
        minSize: 180,
        meta: { skeleton: <Skeleton className="h-7 w-full" /> },
      },
      {
        id: 'status',
        accessorFn: (row) => row.status,
        header: ({ column }) => <DataGridColumnHeader title="Status" column={column} />,
        cell: ({ getValue, row }) => {
          const status = getValue();
          const isScanning = status === 'matching_vulnerabilities';
          const isApplying = status === 'applying_actions';
          const isError = status === 'completed_with_errors';
          return (
            <div className="whitespace-nowrap">
              <StatusBadge
                variant="outline"
                status={status}
                showProgress={isApplying && row.original.dispatchedCount > 0}
                progress={{
                  total: row.original.dispatchedCount || 0,
                  processed: (row.original.completedCount || 0) + (row.original.failedCount || 0)
                }}
                showFound={isScanning}
                foundCount={row.original.matchedCount || 0}
                showErrors={isError}
                errorCount={row.original.failedCount || 0}
              />
            </div>
          );
        },
        enableSorting: false,
        size: 180,
        minSize: 150,
        meta: { skeleton: <Skeleton className="h-7 w-full" /> },
      },
      {
        id: 'trigger',
        accessorFn: (row) => row.executionTrigger,
        header: ({ column }) => <DataGridColumnHeader title="Trigger" column={column} />,
        cell: ({ getValue }) => (
          <div className="whitespace-nowrap">
            <Badge variant="secondary" appearance="outline" className="capitalize text-xs font-normal">
              {getValue() || '—'}
            </Badge>
          </div>
        ),
        enableSorting: false,
        size: 120,
        minSize: 100,
        meta: { skeleton: <Skeleton className="h-7 w-full" /> },
      },
      {
        id: 'created',
        accessorFn: (row) => row.createdAt,
        header: ({ column }) => <DataGridColumnHeader title="Created" column={column} />,
        cell: ({ getValue }) => (
          <div className="whitespace-nowrap">
            <DateFormatter date={getValue()} format="MMM D, hh:mm A" />
          </div>
        ),
        enableSorting: false,
        size: 160,
        minSize: 140,
        meta: { skeleton: <Skeleton className="h-7 w-full" /> },
      },
      {
        id: 'updated',
        accessorFn: (row) => row.updatedAt,
        header: ({ column }) => <DataGridColumnHeader title="Last Updated" column={column} />,
        cell: ({ getValue }) => (
          <div className="whitespace-nowrap">
            <DateFormatter date={getValue()} format="MMM D, hh:mm A" />
          </div>
        ),
        enableSorting: false,
        size: 160,
        minSize: 140,
        meta: { skeleton: <Skeleton className="h-7 w-full" /> },
      },
      ...(!isAuditor
        ? [
          {
            id: 'actions',
            cell: ({ row }) => <JobListDropdown row={row} ruleId={ruleId} />,
            size: 60,
            minSize: 50,
            enableSorting: false,
            meta: { skeleton: <Skeleton className="h-7 w-8" /> },
          },
        ]
        : []),
    ],
    [ruleId, isAuditor]
  );

  const jobsData = data?.data?.jobs || data?.data || [];
  const totalCount = data?.data?.total ?? data?.data?.pagination?.total ?? data?.data?.count ?? jobsData.length;
  const totalPages = data?.data?.totalPages ?? data?.data?.pagination?.totalPages ?? (totalCount ? Math.ceil(totalCount / pagination.pageSize) : 0);
  const hasJobs = jobsData.length > 0;

  return (
    <div className="mt-4 space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Jobs</h3>
        <p className="text-sm text-muted-foreground">Execution history for this automation rule.</p>
      </div>

      {!isLoading && !isFetching && !hasJobs ? (
        <div className="py-8 bg-card rounded-xl border border-border/50">
          <EmptyScreen
            title="No Execution History"
            subTitle="This automation rule has not been executed yet."
          />
        </div>
      ) : (
        <Table
          data={jobsData}
          columns={columns}
          isLoading={isLoading}
          totalCount={totalCount}
          totalPages={totalPages}
          pagination={pagination}
          setPagination={setPagination}
          cardHeading={false}
          enableSorting={false}
          enableSearch={false}
          showColumnVisibility={false}
          grid={true}
          userTableLayout={{
            width: 'auto',
          }}
        />
      )}
    </div>
  );
}
