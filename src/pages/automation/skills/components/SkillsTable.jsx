import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '@/components/custom/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DateFormatter } from '@/components/custom/date-formatter';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import useDebounce from '@/hooks/use-debounce';
import {
  useGetSkillsQuery,
  useDeleteSkillMutation,
  useUpdateSkillMutation,
} from '@/services/automation/skillsApi';
import { ConfirmDialog } from '@/components/custom/button-with-confirmation';
import { EmptyScreen } from '@/components/common/empty-screen';
import ApiErrorHandler from '@/components/common/api-error-handler';
import { Badge } from '@/components/ui/badge';
import { Plus, RefreshCw, MoreHorizontal, Trash2, Pencil } from 'lucide-react';
import EditSkillModal from './EditSkillModal';

function getColumns({ navigate, setSkillToEdit, setSkillToDelete, isLoading }) {
  return [
    {
      id: 'name',
      accessorFn: (row) => row.name,
      header: ({ column }) => (
        <DataGridColumnHeader title="Skill Name" column={column} />
      ),
      cell: ({ row }) => {
        if (isLoading) return <Skeleton className="h-7" />;
        const status = row.original.status;
        return (
          <div className="flex gax-w flex-col">
            <div>
            <span
              className="font-medium truncate hover:text-primary cursor-pointer"
              onClick={() =>
                navigate(`/ai-agent-builder/skills/${row.original._id || row.original.id}`)
              }
            >
              {row.original.name || 'Untitled Skill'}
            </span>
            {status && status !== 'ready' && (
              <Badge
                variant={
                  status === 'failed'
                    ? 'destructive'
                    : status === 'processing'
                      ? 'default'
                      : 'secondary'
                }
                className="text-[10px] px-1.5 py-0 capitalize shrink-0 font-normal"
              >
                {status}
              </Badge>
            )}
            </div>

            <span
            className="truncate block"
            title={row.original.description?.trim() || 'No description provided'}
          >
            {row.original.description?.trim() || '-'}
          </span>
          </div>
        );
      },
      enableSorting: true,
      size: 240,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
   
    {
      id: 'createdAt',
      accessorFn: (row) => row.createdAt,
      header: ({ column }) => (
        <DataGridColumnHeader title="Created At" column={column} />
      ),
      cell: ({ row }) =>
        isLoading ? (
          <Skeleton className="h-7" />
        ) : (
          <div>
            {row.original.createdAt ? (
              <DateFormatter date={row.original.createdAt} />
            ) : (
              '-'
            )}
          </div>
        ),
      enableSorting: true,
      size: 140,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'updatedAt',
      accessorFn: (row) => row.updatedAt,
      header: ({ column }) => (
        <DataGridColumnHeader title="Last Modified" column={column} />
      ),
      cell: ({ row }) =>
        isLoading ? (
          <Skeleton className="h-7" />
        ) : (
          <div>
            {row.original.updatedAt ? (
              <DateFormatter date={row.original.updatedAt} />
            ) : (
              '-'
            )}
          </div>
        ),
      enableSorting: true,
      size: 140,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        if (isLoading) return <Skeleton className="h-7" />;
        return (
          <div className="flex items-center justify-start gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setSkillToEdit(row.original)}
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive cursor-pointer"
                  onClick={() => setSkillToDelete(row.original)}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
      size: 50,
      meta: {
        cellClassName: 'text-end',
        skeleton: <Skeleton className="h-7" />,
      },
    },
  ];
}

export default function SkillsTable({ onOpenCreateModal, onSyncSkills, isSyncing }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [skillToDelete, setSkillToDelete] = useState(null);
  const [skillToEdit, setSkillToEdit] = useState(null);

  const debouncedSearch = useDebounce(search, 300);

  const queryParams = useMemo(
    () => ({
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      ...(debouncedSearch ? { search: debouncedSearch } : {}),
    }),
    [pagination.pageIndex, pagination.pageSize, debouncedSearch]
  );

  const { data: apiData, isLoading, isFetching, isError, error } = useGetSkillsQuery(queryParams);
  const [deleteSkill] = useDeleteSkillMutation();
  const [updateSkill, { isLoading: isUpdatingSkill }] = useUpdateSkillMutation();

  if (isError) {
    return <ApiErrorHandler error={error} />;
  }

  const isTableLoading = isLoading || isFetching;


  const displaySkills = useMemo(() => {
    const raw =
      apiData?.data?.skills ||
      apiData?.data?.data ||
      apiData?.data ||
      apiData?.skills ||
      (Array.isArray(apiData) ? apiData : []);

    const source = Array.isArray(raw) ? raw : [];

    if (!debouncedSearch?.trim()) return source;
    const q = debouncedSearch.toLowerCase();
    return source.filter(
      (s) =>
        s.name?.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q)
    );
  }, [apiData, debouncedSearch]);

  const totalCount =
    apiData?.meta?.total ??
    apiData?.total ??
    apiData?.pagination?.total ??
    displaySkills.length;

  const totalPages =
    apiData?.meta?.totalPages ??
    (Math.ceil(totalCount / pagination.pageSize) || 1);

  const handleConfirmDelete = async () => {
    if (!skillToDelete) return;
    const target = skillToDelete;
    const skillId = target._id || target.id;
    setSkillToDelete(null);
    toast.promise(deleteSkill(skillId).unwrap(), {
      loading: 'Deleting skill...',
      success: `Skill "${target.name || 'Skill'}" deleted successfully`,
      error: (err) => err?.data?.message || err?.message || 'Failed to delete skill',
    });
  };

  const handleUpdateSkill = async (payload) => {
    try {
      await updateSkill(payload).unwrap();
      toast.success(`Skill "${payload.name}" updated successfully`);
    } catch (err) {
      toast.error(err?.data?.message || err?.message || 'Failed to update skill');
      throw err;
    }
  };

  const columns = useMemo(
    () =>
      getColumns({
        navigate,
        setSkillToEdit,
        setSkillToDelete,
        isLoading: isTableLoading,
      }),
    [navigate, isTableLoading]
  );

  const isEmpty = !isTableLoading && !debouncedSearch?.trim() && displaySkills.length === 0;

  if (isEmpty) {
    return (
      <EmptyScreen
        title="No skills found"
        subTitle="Create or sync skills to get started."
        engage={
          (onOpenCreateModal || onSyncSkills) && (
            <div className="flex items-center gap-2 mt-2 justify-center">
              {onSyncSkills && (
                <Button
                  variant="outline"
                  onClick={onSyncSkills}
                  disabled={isSyncing}
                  className="gap-2"
                >
                  <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
                  {isSyncing ? 'Syncing...' : 'Sync Skills'}
                </Button>
              )}
              {onOpenCreateModal && (
                <Button onClick={onOpenCreateModal} className="gap-2">
                  <Plus size={14} /> Create Skill
                </Button>
              )}
            </div>
          )
        }
      />
    );
  }

  return (
    <>
      <Table
        data={displaySkills}
        columns={columns}
        isLoading={isTableLoading}
        search={search}
        setSearch={setSearch}
        searchPlaceholder="Search skills by name or description..."
        searchWidth="72"
        pagination={pagination}
        setPagination={setPagination}
        totalCount={totalCount}
        totalPages={totalPages}
        manualPagination={true}
        manualSorting={false}
        enableSorting={true}
        cardHeading={true}
      />

      <ConfirmDialog
        open={Boolean(skillToDelete)}
        setOpen={(open) => !open && setSkillToDelete(null)}
        onConfirm={handleConfirmDelete}
        variant="destructive"
        title="Delete Skill"
        dialog={`Are you sure you want to delete "${skillToDelete?.name || 'this skill'}"? This action cannot be undone.`}
      />

      <EditSkillModal
        open={Boolean(skillToEdit)}
        setOpen={(open) => !open && setSkillToEdit(null)}
        skill={skillToEdit}
        onUpdateSkill={handleUpdateSkill}
        isLoading={isUpdatingSkill}
      />
    </>
  );
}
