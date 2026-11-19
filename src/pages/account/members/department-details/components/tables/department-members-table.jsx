import { useMemo, useState } from 'react';
import { useAuth } from '@/auth/context/auth-context';
import { MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useRemoveTeamFromDepartmentMutation } from '@/services/auth/departmentsApi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { Profile } from '@/components/custom/profile';
import Table from '@/components/custom/table';
import { CustomTooltip } from '@/components/custom/tooltip';
import useStore from '../../../departments/store';
import UpdateTeamModel from '../modals/update-department-model';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';


// Table Columns
function getUserColumns(onDeleteTeam, isMember, isAuditor) {
  const columns = [
    {
      id: 'name',
      accessorKey: 'name',
      header: ({ column }) => (
        <DataGridColumnHeader title="Name" column={column} />
      ),
      cell: ({ row }) => (
        <Link
          to={`/profile/account/members/teams/${row?.original?._id}`}
          className="font-medium hover:text-blue-500"
        >
          {row?.original?.name}
        </Link>
      ),
      enableSorting: false,
      size: 150,
      meta: { skeleton: <Skeleton className="h-7" /> },
    },
    {
      id: 'description',
      accessorKey: 'description',
      header: ({ column }) => (
        <DataGridColumnHeader title="Description" column={column} />
      ),
      cell: ({ row }) => row?.original?.description,
      enableSorting: false,
      size: 200,
      meta: { skeleton: <Skeleton className="h-7" /> },
    },
    {
      id: 'teamlead',
      accessorKey: 'teamlead',
      header: ({ column }) => (
        <DataGridColumnHeader title="Team Lead" column={column} />
      ),
      cell: ({ row }) => {
        const members = row?.original?.members || [];

        const lead = members.find((m) => m?.isLead);

        return (
          <div className="flex items-center gap-2">
            {lead ? (
              <Profile email={lead?.email} size={30} name={lead?.name} />
            ) : (
              <span className="text-secondary-foreground text-sm font-medium">Not Set</span>
            )}
          </div>
        );
      },
      enableSorting: false,
      size: 200,
      meta: { skeleton: <Skeleton className="h-7" /> },
    },
    {
      id: 'totalmembers',
      accessorFn: (row) => row?.members?.length || 0,
      header: ({ column }) => (
        <DataGridColumnHeader title="Total Members" column={column} />
      ),
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row?.original?.members?.length}
        </Badge>
      ),
      enableSorting: true,
      size: 120,
      meta: { skeleton: <Skeleton className="h-7" /> },
    },

    // show this action only to admin and developer
    ...(!isMember && !isAuditor
      ? [
          {
            id: 'action',
            accessorKey: 'action',
            header: ({ column }) => (
              <DataGridColumnHeader title="" column={column} />
            ),
            cell: ({ row }) => (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <ButtonWithConfirm
                    variant="ghost"
                    className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                    onConfirm={() =>
                      onDeleteTeam(row?.original?.id || row?.original?._id)
                    }
                    confirmTitle="Remove Team"
                    dialog={`Are you sure you want to remove "${row?.original?.name}" team?`}
                    confirm={true}
                    confirmOnInput={'shoaibwani'}
                    confirmButton={<Button variant="destructive">Remove</Button>}
                    cancelButton={<Button variant="outline">Cancel</Button>}
                  >
                    Remove
                  </ButtonWithConfirm>
                </DropdownMenuContent>
              </DropdownMenu>
            ),
            enableSorting: false,
            size: 50,
            meta: { skeleton: <Skeleton className="h-7" /> },
          },
        ]
      : []),
  ];

  return columns;
}

export default function MembersTable({ members, search, setSearch, isLoading }) {
  const { user } = useAuth();
  const isMember =
    user?.role?.toLowerCase() === 'member' ||
    user?.role?.toLowerCase() === 'developer';
  const isAuditor = user?.role?.toLowerCase() === 'auditor';
  const { departmentId } = useParams();
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 });
  const [sorting, setSorting] = useState([]);
  const setUpdateDepartmentDetail = useStore(
    (state) => state.setUpdateDepartmentDetail,
  );
  const setShowAddTeamModal = useStore((state) => state.setShowAddTeamModal);
  const [removeTeamFromDepartment, { isLoading: isDeleting }] =
    useRemoveTeamFromDepartmentMutation();

  // Sort members client-side based on the current sorting state
  const sortedMembers = useMemo(() => {
    if (!members || sorting.length === 0) return members;
    const { id, desc } = sorting[0];
    if (id === 'totalmembers') {
      return [...members].sort((a, b) => {
        const aCount = a?.members?.length || 0;
        const bCount = b?.members?.length || 0;
        return desc ? bCount - aCount : aCount - bCount;
      });
    }
    return members;
  }, [members, sorting]);

  const handleDeleteTeam = (teamId) => {
    if (!teamId) {
      toast.error('Team ID is missing');
      return;
    }
    if (!departmentId) {
      toast.error('Department ID is missing');
      return;
    }
    toast.promise(removeTeamFromDepartment({ departmentId, teamId }).unwrap(), {
      loading: 'Removing the team..',
      success: 'Team Removed',
      error: 'Failed to remove team',
    });
  };

  return (
    <div className="p-0 mt-6">
      <UpdateTeamModel />
      <Table
        rightToolbar={
          !isMember && (
            <AuthorityGuard forbidRoles={['Auditor']}>
              <div className="-mt-1">
                <Button
                  variant="outline"
                  onClick={() => {
                    setUpdateDepartmentDetail({
                      id: departmentId,
                      departmentTeams: members,
                    });
                    setShowAddTeamModal(true);
                  }}
                >
                  <Plus /> Add Team
                </Button>
              </div>
            </AuthorityGuard>
          )
        }
        data={sortedMembers}
        columns={getUserColumns(handleDeleteTeam, isMember, isAuditor)}
        isLoading={isLoading}
        search={search}
        setSearch={setSearch}
        sorting={sorting}
        setSorting={setSorting}
        pagination={pagination}
        setPagination={setPagination}
        enableSorting={true}
        totalCount={members?.length}
        totalPages={1}
      />
    </div>
  );
}