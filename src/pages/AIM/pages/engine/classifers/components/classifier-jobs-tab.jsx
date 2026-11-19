import { useMemo, useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { useGetAimRuleJobsQuery, useUpdateAimRuleJobMutation } from '@/services/asset-inventory/policy-engine/rules-api';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import Table from '@/components/custom/table';
import { DateFormatter } from '@/components/custom/date-formatter';
import { EmptyScreen } from '@/components/common/empty-screen';

const StatusDot = ({ status }) => {
  let label = status || 'Unknown';
  if (status === 'completed') label = 'Completed';
  else if (status === 'failed') label = 'Failed';
  else if (status === 'in_progress') label = 'In Progress';
  else if (status === 'pending') label = 'Pending';
  else if (status === 'cancelled') label = 'Cancelled';

  const colorClass =
    status === 'completed'
      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
      : status === 'failed'
        ? 'bg-red-500/10 text-red-500 border-red-500/20'
        : status === 'in_progress'
          ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
          : status === 'cancelled'
            ? 'bg-muted text-muted-foreground border-border/40'
            : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';

  return (
    <Badge variant="secondary" appearance="outline" className={`capitalize font-medium gap-1.5 ${colorClass}`}>
      {label}
    </Badge>
  );
};

const JobActionsDropdown = ({ row, policyId }) => {
  const [open, setOpen] = useState(false);
  const job = row.original;
  const jobId = job?._id;
  const status = job?.status;

  const [updateJob, { isLoading: isUpdating }] = useUpdateAimRuleJobMutation();

  const handleCancelJob = () => {
    toast.promise(
      updateJob({ policyId, jobId, payload: { status: 'cancelled' } }).unwrap(),
      {
        loading: 'Cancelling job…',
        success: 'Job cancelled successfully',
        error: (err) => err?.data?.message || 'Failed to cancel job',
      },
    );
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
          <DropdownMenuItem variant="destructive" asChild>
            <ButtonWithConfirm
              disabled={isUpdating || status === 'completed' || status === 'failed' || status === 'cancelled'}
              variant="ghost"
              confirm={true}
              dialog="Are you sure you want to cancel this job?"
              onConfirm={() => {
                if (isUpdating) return;
                handleCancelJob();
                setOpen(false);
              }}
              confirmButton={<Button variant="destructive" disabled={isUpdating}>Cancel</Button>}
              cancelButton={<Button variant="outline">Back</Button>}
              className="w-full justify-start font-normal h-8 px-2 py-1.5 text-sm text-destructive hover:text-destructive hover:bg-destructive/10 focus:bg-destructive/10"
            >
              Cancel
            </ButtonWithConfirm>
          </DropdownMenuItem>
        </AuthorityGuard>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export function ClassifierJobsTab({ policyId }) {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const { data, isLoading, isFetching } = useGetAimRuleJobsQuery(
    {
      policyId,
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    },
    { skip: !policyId },
  );

  const columns = useMemo(
    () => [
      {
        id: 'jobId',
        accessorFn: (row) => row._id,
        header: ({ column }) => <DataGridColumnHeader title="Job ID" column={column} />,
        cell: ({ getValue }) => <span className="font-mono text-xs">{getValue()}</span>,
        enableSorting: false,
        meta: { skeleton: <Skeleton className="h-7" /> },
      },
      {
        id: 'status',
        accessorFn: (row) => row.status,
        header: ({ column }) => <DataGridColumnHeader title="Status" column={column} />,
        cell: ({ getValue }) => <StatusDot status={getValue()} />,
        enableSorting: false,
        meta: { skeleton: <Skeleton className="h-7" /> },
      },
      {
        id: 'trigger',
        accessorFn: (row) => row.executionTrigger,
        header: ({ column }) => <DataGridColumnHeader title="Trigger" column={column} />,
        cell: ({ getValue }) => (
          <Badge variant="secondary" appearance="outline" className="capitalize text-xs font-normal">
            {getValue() || '—'}
          </Badge>
        ),
        enableSorting: false,
        meta: { skeleton: <Skeleton className="h-7" /> },
      },
      {
        id: 'created',
        accessorFn: (row) => row.createdAt,
        header: ({ column }) => <DataGridColumnHeader title="Created" column={column} />,
        cell: ({ getValue }) => <DateFormatter date={getValue()} format="MMM D, hh:mm A" />,
        enableSorting: false,
        meta: { skeleton: <Skeleton className="h-7" /> },
      },
      {
        id: 'updated',
        accessorFn: (row) => row.updatedAt,
        header: ({ column }) => <DataGridColumnHeader title="Last Updated" column={column} />,
        cell: ({ getValue }) => <DateFormatter date={getValue()} format="MMM D, hh:mm A" />,
        enableSorting: false,
        meta: { skeleton: <Skeleton className="h-7" /> },
      },
      {
        id: 'actions',
        cell: ({ row }) => <JobActionsDropdown row={row} policyId={policyId} />,
        size: 50,
        enableSorting: false,
        meta: { skeleton: <Skeleton className="h-7" /> },
      },
    ],
    [policyId],
  );

  const jobsData = data?.data?.jobs || data?.data || [];
  const hasJobs = jobsData.length > 0;

  return (
    <div className="mt-4 space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Jobs</h3>
        <p className="text-sm text-muted-foreground">Execution history for this classifier policy.</p>
      </div>

      {!isLoading && !isFetching && !hasJobs ? (
        <div className="py-8 bg-card rounded-xl border border-border/50">
          <EmptyScreen
            title="No Execution History"
            subTitle="This classifier policy has not been executed yet."
          />
        </div>
      ) : (
        <Table
          data={jobsData}
          columns={columns}
          isLoading={isLoading || isFetching}
          totalCount={data?.data?.pagination?.total || data?.data?.count || 0}
          totalPages={data?.data?.pagination?.totalPages || 0}
          pagination={pagination}
          setPagination={setPagination}
          cardHeading={false}
          enableSorting={false}
          enableSearch={false}
          showColumnVisibility={false}
          grid={true}
        />
      )}
    </div>
  );
}
