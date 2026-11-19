import { useMemo, useState } from 'react';
import { useAuth } from '@/auth/context/auth-context';
import { MoreHorizontal, Plus, Trash } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import {
  useRemoveMemberFromTeamMutation,
  useUpdateTeamAuthMutation,
} from '@/services/auth/teamsApi';
import { Button } from '@/components/ui/button';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { Profile } from '@/components/custom/profile';
import Table from '@/components/custom/table';
import useStore from '../../../teams/store';
import UpdateTeamModel from '../modals/update-team-model';

export default function MembersTable({ members }) {
  const { user } = useAuth();
  const role = user?.role?.toLowerCase();
  const isMember =
    role === 'member' ||
    role === 'developer' ||
    role === 'auditor';

  const { teamId } = useParams();
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 });
  const [sorting, setSorting] = useState([]);
  const [search, setSearch] = useState('');
  const setUpdateTeamDetail = useStore((state) => state.setUpdateTeamDetail);
  const setShowAddTeamModal = useStore((state) => state.setShowAddTeamModal);

  const filteredMembers = useMemo(() => {
    if (!members) return [];
    if (!search) return members;
    const lowerSearch = search.toLowerCase();
    return members.filter((member) => {
      const name = (member.name || '').toLowerCase();
      const email = (member.email || '').toLowerCase();
      return name.includes(lowerSearch) || email.includes(lowerSearch);
    });
  }, [members, search]);

  const [removeMember, { isLoading: isRemoving }] =
    useRemoveMemberFromTeamMutation();
  const [updateTeam, { isLoading: isUpdatingRole }] =
    useUpdateTeamAuthMutation();

  const handleDeleteMember = async (memberId) => {
    if (isMember) return;
    try {
      await removeMember({
        teamId,
        memberId: memberId,
      }).unwrap();

      toast.success('Member removed successfully');
    } catch (error) {
      console.error('Failed to remove member:', error);
      toast.error(error?.data?.message || 'Failed to remove member');
    }
  };

  const handleToggleLead = async (member, isLead) => {
    if (isMember) return;
    // Current leads objects
    const currentLeads = members.filter((m) => m.isLead);
    let newLeads;

    if (isLead) {
      // Add member to leads
      newLeads = [...currentLeads, member];
    } else {
      // Remove member from leads
      newLeads = currentLeads.filter((m) => m.id !== member.id);
    }

    // Ensure uniqueness based on ID
    const uniqueLeads = Array.from(
      new Map(newLeads.map((item) => [item.id, item])).values(),
    );

    const payloadLeads = uniqueLeads.map((l) => ({
      id: l.id || l.userId,
      name: l.name,
      email: l.email,
    }));

    toast.promise(
      updateTeam({
        teamId,
        payload: { team_lead: payloadLeads },
      }).unwrap(),
      {
        loading: 'Updating team leads...',
        success: 'Updated team leads successfully!',
        error: (error) => error?.data?.error || 'Failed to update team leads',
      },
    );
  };

  const allColumns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <DataGridColumnHeader title="Name" column={column} />
        ),
        cell: ({ row }) => (
          <Profile
            email={row.original.email}
            name={row.original.name || row.original.email}
            showEmail={true}
          />
        ),
        enableSorting: false,
        size: 150,
        meta: { skeleton: <Skeleton className="h-7" /> },
      },
      // {
      //   accessorKey: "email",
      //   header: ({ column }) => <DataGridColumnHeader title="Email" column={column} />,
      //   cell: ({ row }) => row.original.email,
      //   enableSorting: false,
      //   size: 200,
      //   meta: { skeleton: <Skeleton className="h-7" /> },
      // },
      {
        accessorKey: 'isLead',
        header: ({ column }) => (
          <DataGridColumnHeader title="Is Lead" column={column} />
        ),
        cell: ({ row }) => (
          <div>
            <Switch
              checked={row.original.isLead}
              onCheckedChange={(checked) =>
                handleToggleLead(row.original, checked)
              }
              disabled={isUpdatingRole || isMember}
              className="w-10"
            />
          </div>
        ),
        enableSorting: false,
        size: 120,
        meta: { skeleton: <Skeleton className="h-7" /> },
      },
      {
        id: 'actions',
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
                onConfirm={() => handleDeleteMember(row.original.id)}
                confirm={true}
                description="Are you sure you want to remove this member from the team?"
                confirmButton={
                  <Button variant="destructive" disabled={isRemoving}>
                    Remove
                  </Button>
                }
              >
                Remove
              </ButtonWithConfirm>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
        enableSorting: false,
        size: 0,
      },
    ],
    [members, isRemoving, isUpdatingRole, teamId, isMember],
  );

  const filteredColumns = useMemo(
    () =>
      isMember ? allColumns.filter((col) => col.id !== 'actions') : allColumns,
    [allColumns, isMember],
  );

  return (
    <div className="p-0 mt-6">
      <UpdateTeamModel />

      <Table
        rightToolbar={
          !isMember && (
            <div className="-mt-1">
              <Button
                variant="outline"
                onClick={() => {
                  setUpdateTeamDetail({ id: teamId, teamMembers: members });
                  setShowAddTeamModal(true);
                }}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Members
              </Button>
            </div>
          )
        }
        data={filteredMembers}
        columns={filteredColumns}
        search={search}
        setSearch={setSearch}
        sorting={sorting}
        setSorting={setSorting}
        pagination={pagination}
        setPagination={setPagination}
        enableSorting={true}
        totalCount={filteredMembers?.length}
        totalPages={1}
      />
    </div>
  );
}
