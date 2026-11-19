import { useMemo } from 'react';
import {
  Edit,
  GripVertical,
  MoreHorizontal,
  Play,
  Trash,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Badge, BadgeDot } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Table from '@/components/custom/table';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch, SwitchIndicator, SwitchWrapper } from '@/components/ui/switch';
import SeverityLabel from '@/components/custom/severity-label';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { Spinner } from '@/components/ui/spinners';
import {
  useDeleteAsmRuleMutation,
  useExecuteAsmRuleMutation,
  useToggleAsmRuleStatusMutation,
} from '@/services/asm/ruleApi';
import useGlobalStore from '@/pages/ASM/store';
import useStore from '../store';

const RuleTable = ({
  data,
  loading,
  pagination,
  onPaginationChange,
  isExecutingRuleSet,
}) => {
  const navigate = useNavigate();
  const setGlobalSelectedRule = useGlobalStore((state) => state.setSelectedRule);
  const setIsEditingRule = useGlobalStore((state) => state.setIsEditingRule);
  const setSelectedRule = useStore((state) => state.setSelectedRule);
  const setMode = useStore((state) => state.setMode);
  const setShowModal = useStore((state) => state.setShowModal);

  const [runRule] = useExecuteAsmRuleMutation();
  const [deleteRule, { isLoading: isDeletingRule }] = useDeleteAsmRuleMutation();
  const [toggleRule] = useToggleAsmRuleStatusMutation();

  const handleToggle = (rule, checked) => {
    toast.promise(toggleRule({ ruleId: rule._id, enabled: checked }).unwrap(), {
      loading: 'Updating Status',
      success: 'Status Updated',
      error: 'Failed to update status',
    });
  };

  const handleExecuteRule = (id) => {
    toast.promise(runRule(id).unwrap(), {
      loading: 'Running Rule',
      success: 'Rule Executed',
      error: 'Failed to execute rule',
    });
  };

  const handleDelete = (id) => {
    toast.promise(deleteRule(id).unwrap(), {
      loading: 'Removing Rule',
      success: 'Rule Removed',
      error: 'Failed to remove the rule',
    });
  };

  const handleEdit = (rule) => {
    setSelectedRule(rule);
    setMode('update');
    setShowModal(true);
    setGlobalSelectedRule(rule);
    setIsEditingRule(true);
    navigate(`/casm/rules/guided-editor`);
  };

  const columns = useMemo(
    () => [
      // {
      //   id: 'priority',
      //   header: ({ column }) => (
      //     <DataGridColumnHeader title="#" column={column} />
      //   ),
      //   cell: ({ row }) => (
      //      <div className="flex items-center gap-2">
      //        <GripVertical className="size-4 text-muted-foreground cursor-grab" />
      //        <span className="text-xs">{row.index + 1 + (pagination.pageIndex * pagination.pageSize)}</span>
      //      </div>
      //   ),
      //   size: 50,
      //   meta: {
      //     skeleton: <Skeleton className="h-5 w-4" />,
      //   },
      // },
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <DataGridColumnHeader title="Rule Name" column={column} />
        ),
        cell: ({ row }) => (
          <div className="flex flex-col gap-0.5 max-w-[400px]">
            <span className="font-medium text-sm line-clamp-1">{row.original.name}</span>
            <span className="text-[11px] text-muted-foreground line-clamp-1">
              {row.original.description}
            </span>
          </div>
        ),
        size: 200,
        meta: {
          skeleton: <div className='flex flex-col gap-1'><Skeleton className="h-5 w-40" /><Skeleton className="h-4 w-60" /></div>,
        },
      },
      {
        id: 'matches',
        header: ({ column }) => (
          <DataGridColumnHeader title="Matches" column={column} />
        ),
        cell: ({ row }) => (
          <span className="text-sm font-medium">
            {row.original?.exposure_count} assets
          </span>
        ),
        size: 70,
        meta: {
          skeleton: <Skeleton className="h-7 w-20" />,
        },
      },
      {
        accessorKey: 'risk',
        header: ({ column }) => (
          <DataGridColumnHeader title="Risk" column={column} />
        ),
        cell: ({ row }) => {
            return <SeverityLabel severity={row.original?.risk} />;
        },
        size: 80,
        meta: {
          skeleton: <Skeleton className="h-7 w-20" />,
        },
      },
      {
        accessorKey: 'goal',
        header: ({ column }) => (
          <DataGridColumnHeader title="Goal" column={column} />
        ),
        cell: ({ row }) => {
          const isSafe = row.original?.risk === 'none';
          return (
            <Badge
              variant={isSafe ? 'success' : 'destructive'}
              appearance="ghost"
              className="px-0 gap-1.5"
            >
              <BadgeDot />
              {isSafe ? 'Safe' : 'Unsafe'}
            </Badge>
          );
        },
        size: 80,
        meta: {
          skeleton: <Skeleton className="h-7 w-20" />,
        },
      },
      {
        id: 'status',
        header: ({ column }) => (
          <DataGridColumnHeader title="Status" column={column} />
        ),
        cell: ({ row }) => (
          <div onClick={(e) => e.stopPropagation()}>
            <SwitchWrapper>
              <Switch
                checked={row.original?.enabled !== false}
                onCheckedChange={(checked) => handleToggle(row.original, checked)}
                size="md"
              />
              <SwitchIndicator state="on" className="text-[10px] font-bold">ON</SwitchIndicator>
              <SwitchIndicator state="off" className="text-[10px] font-bold">OFF</SwitchIndicator>
            </SwitchWrapper>
          </div>
        ),
        size: 50,
        meta: {
          skeleton: <Skeleton className="h-7 w-12" />,
        },
      },
      {
        id: 'actions',
        header: ({ column }) => (
          <DataGridColumnHeader title="" column={column} />
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-end mr-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent/50 transition-opacity">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem
                  disabled={isExecutingRuleSet}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExecuteRule(row.original._id);
                  }}
                  className="flex items-center gap-2 cursor-pointer"
                >

                  Execute
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(row.original);
                  }}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  Edit
                </DropdownMenuItem>

                <div onClick={(e) => e.stopPropagation()}>
                  <ButtonWithConfirm
                    variant="ghost"
                    confirm={true}
                    disabled={isDeletingRule}
                    onConfirm={() => handleDelete(row.original._id)}
                    confirmButton={<Button variant="primary">Proceed</Button>}
                    cancelButton={<Button variant="outline">Cancel</Button>}
                    className="w-full justify-start text-destructive font-normal"
                  >
                    Delete
                  </ButtonWithConfirm>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
        size: 50,
        meta: {
          skeleton: <Skeleton className="h-7 w-7" />,
        },
      },
    ],
    [isExecutingRuleSet, isDeletingRule, pagination]
  );

  return (
    <Table
      data={data?.results}
      columns={columns}
      isLoading={loading}
      pagination={pagination}
      setPagination={onPaginationChange}
      totalPages={data?.totalPages}
      totalCount={data?.totalResults}
      cardHeading={false}
      showPagination={true}
    />
  );
};

export default RuleTable;
