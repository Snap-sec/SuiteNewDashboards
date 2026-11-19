import React, { useEffect, useMemo, useState } from 'react';
import EditAutomationRuleModal from '@/pages/VM/pages/automation-engine/components/edit-automation-rule-modal';
import { Edit, MoreHorizontal, Play, Plus, Trash } from 'lucide-react';
import { toast } from 'sonner';
import useDebounce from '@/hooks/use-debounce';
import {
  useDeleteAutomationRuleMutation,
  useExecuteAutomationRuleMutation,
  useGetAutomationRulesQuery,
  useToggleAutomationRuleMutation,
} from '@/services/vm/automationApi';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import CreateAutomationRuleModal from '@/components/common/create-automation-rule-modal';
import { EmptyScreen } from '@/components/common/empty-screen';
import { ButtonWithConfirm, ConfirmDialog } from '@/components/custom/button-with-confirmation';
import Table from '@/components/custom/table';
import RuleDetailsDrawer from '@/pages/VM/pages/relevance-group-details/components/modals/rule-details-drawer';
import { useAuth } from '@/auth/context/auth-context';
import ApiErrorHandler from '../../../../../components/common/api-error-handler';

export default function AutomationTab({ assessmentId, assessmentData }) {
  const { user } = useAuth();
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);
  const [selectedRule, setSelectedRule] = useState(null);

  const { data, isLoading, isFetching, isError, error } = useGetAutomationRulesQuery({
    search: debouncedSearch || undefined,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    parent_resource: 'assessment',
    parent_resource_id: assessmentId,
    assessment_id: assessmentId,
  });

  const [deleteRule] = useDeleteAutomationRuleMutation();
  const [toggleRule, { isLoading: isToggling }] = useToggleAutomationRuleMutation();
  const [executeRule, { isLoading: isExecuting }] = useExecuteAutomationRuleMutation();

  const [showToggleConfirm, setShowToggleConfirm] = useState(false);
  const [pendingToggle, setPendingToggle] = useState(null);

  useEffect(() => {
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  }, [debouncedSearch]);

  const rules = data?.data?.rules || data?.data || [];
  const totalCount = data?.data?.totalItems || rules.length || 0;
  const totalPages = data?.data?.totalPages || 1;

  const handleConfirmToggle = () => {
    if (!pendingToggle) return;
    const { rule, enabled } = pendingToggle;
    toast.promise(toggleRule({ id: rule._id, enabled }).unwrap(), {
      loading: 'Updating status…',
      success: 'Status updated',
      error: 'Failed to update status',
    });
    setShowToggleConfirm(false);
    setPendingToggle(null);
  };

  const handleDelete = (id) => {
    toast.promise(deleteRule(id).unwrap(), {
      loading: 'Deleting rule…',
      success: 'Rule deleted',
      error: 'Failed to delete rule',
    });
  };

  const handleExecute = (id) => {
    toast.promise(executeRule(id).unwrap(), {
      loading: 'Executing rule…',
      success: 'Rule execution enqueued',
      error: 'Failed to execute rule',
    });
  };

  const columns = useMemo(
    () => [
      {
        id: 'name',
        header: ({ column }) => (
          <DataGridColumnHeader title="Rule" column={column} />
        ),
        accessorFn: (row) => row.name,
        cell: ({ row }) => (
          <div className="flex flex-col gap-1">
            <span
              className="font-semibold text-sm text-foreground cursor-pointer hover:underline hover:text-primary transition-colors"
              onClick={() => setSelectedRule(row.original)}
            >
              {row.original.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {row.original.description || 'No description'}
            </span>
          </div>
        ),
        meta: {
          skeleton: <Skeleton className="h-7 w-[200px]" />,
        },
      },
      {
        id: 'execution',
        header: ({ column }) => (
          <DataGridColumnHeader title="Execution" column={column} />
        ),
        accessorFn: (row) => row.execution_policy?.type,
        cell: ({ row }) => (
          <span className="text-xs font-medium text-foreground">
            {row.original.execution_policy?.type === 'event'
              ? 'Event Based'
              : row.original.execution_policy?.type === 'scheduled'
                ? 'Scheduled'
                : '—'}
          </span>
        ),
        size: 50,
        meta: {
          skeleton: <Skeleton className="h-7 w-[100px]" />,
        },
      },
      {
        id: 'enabled',
        header: ({ column }) => (
          <DataGridColumnHeader title="Status" column={column} />
        ),
        accessorFn: (row) => row.enabled,
        cell: ({ row }) => (
          <Switch
            disabled={isToggling || user?.role?.toLowerCase() === 'auditor'}
            checked={row.original.enabled}
            onCheckedChange={(checked) => {
              setPendingToggle({ rule: row.original, enabled: checked });
              setShowToggleConfirm(true);
            }}
          />
        ),
        size: 50,
        meta: {
          skeleton: <Skeleton className="h-7 w-[100px]" />,
        },
      },
      ...(user?.role?.toLowerCase() !== 'auditor' ? [{
        id: 'actions',
        header: ({ column }) => (
          <DataGridColumnHeader title="" column={column} />
        ),
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 shrink-0"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-[160px]">
              <ButtonWithConfirm
                variant="ghost"
                confirm={true}
                disabled={isExecuting}
                onConfirm={() => handleExecute(row.original._id)}
                confirmButton={<Button variant="primary">Execute</Button>}
                cancelButton={<Button variant="outline">Cancel</Button>}
                className="w-full justify-start h-8 px-2 text-xs font-normal cursor-pointer flex items-center"
              >
                Execute Now
              </ButtonWithConfirm>

              <EditAutomationRuleModal
                rule={row.original}
                trigger={
                  <DropdownMenuItem
                    className="h-8 px-2 text-xs cursor-pointer flex items-center"
                    onSelect={(e) => e.preventDefault()}
                  >
                    Edit Rule
                  </DropdownMenuItem>
                }
              />

              <DropdownMenuSeparator />

              <DropdownMenuItem variant="destructive" asChild>
                <ButtonWithConfirm
                  variant="ghost"
                  confirm={true}
                  disabled={isToggling}
                  onConfirm={() => handleDelete(row.original._id)}
                  confirmButton={<Button variant="destructive">Delete</Button>}
                  cancelButton={<Button variant="outline">Cancel</Button>}
                  className="w-full justify-start h-8 px-2 text-xs text-destructive hover:text-destructive font-normal cursor-pointer flex items-center"
                >
                  Delete Rule
                </ButtonWithConfirm>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        size: 30,
        meta: {
          skeleton: <Skeleton className="h-7 w-[120px]" />,
        },
      }] : []),
    ],
    [setSelectedRule, user, isExecuting, isToggling],
  );

  if (!isError && !isLoading && !isFetching && rules.length === 0 && !search) {
    return (
      <EmptyScreen
        title="No Automation Rules Found"
        subTitle="Create your first automation rule for this assessment to start automating workflows."
        engage={
          user?.role?.toLowerCase() !== 'auditor' ? (
            <CreateAutomationRuleModal
              context={{
                assessmentId,
                parentResource: 'assessment',
                parentResourceId: assessmentId,
              }}
              origin="assessment"
              defaultConditions={[
                {
                  field: 'assessment',
                  operator: 'equals',
                  value: assessmentId,
                },
              ]}
              trigger={
                <Button className="flex items-center gap-1.5">
                  <Plus className="size-4" />
                  Create Rule
                </Button>
              }
            />
          ) : null
        }
      />
    );
  }

  if(isError) return <ApiErrorHandler error={error} />

  const rightToolbar = (
    <div className="flex items-center gap-2">
      {user?.role?.toLowerCase() !== 'auditor' && (
        <CreateAutomationRuleModal
          context={{
            assessmentId,
            parentResource: 'assessment',
            parentResourceId: assessmentId,
          }}
          origin="assessment"
          defaultConditions={[
            {
              field: 'assessment',
              operator: 'equals',
              value: assessmentId,
            },
          ]}
          trigger={
            <Button variant="outline" className="flex items-center gap-1.5">
              <Plus className="size-4" />
              Create Rule
            </Button>
          }
        />
      )}
    </div>
  );

  return (
    <>
      <Table
        data={rules}
        columns={columns || []}
        search={search}
        setSearch={setSearch}
        rightToolbar={rightToolbar}
        manualPagination={true}
        manualSorting={false}
        showPagination={true}
        cardHeading={true}
        isLoading={isLoading || isFetching}
        pagination={pagination}
        setPagination={setPagination}
        totalCount={totalCount}
        totalPages={totalPages}
      />
      <ConfirmDialog
        open={showToggleConfirm}
        setOpen={setShowToggleConfirm}
        onConfirm={handleConfirmToggle}
        title="Confirm Status Change"
        dialog={`Are you sure you want to ${pendingToggle?.enabled ? 'enable' : 'disable'} this automation rule?`}
        confirmButton={
          <Button variant="primary">
            Confirm
          </Button>
        }
        cancelButton={<Button variant="outline">Cancel</Button>}
      />
      <RuleDetailsDrawer
        rule={selectedRule}
        open={!!selectedRule}
        onClose={() => setSelectedRule(null)}
        onRuleUpdate={setSelectedRule}
      />
    </>
  );
}
