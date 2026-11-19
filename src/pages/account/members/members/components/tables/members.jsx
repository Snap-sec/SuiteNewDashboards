'use client';

import { useAuth } from '@/auth/context/auth-context';
import {
  Copy,
  Lock,
  MoreHorizontal,
  Pencil,
  Settings2,
  Trash,
  Unlock,
  UserRoundPlus,
  X,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { copyToClipboard, timeAgo, toAbsoluteUrl } from '@/lib/helpers';
import {
  useDeleteMemberMutation,
  useLockAccountMutation,
  useUnlockAccountMutation,
} from '@/services/auth/orgApi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardToolbar } from '@/components/ui/card';
import { useDataGrid } from '@/components/ui/data-grid';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridColumnVisibility } from '@/components/ui/data-grid-column-visibility';
import {
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from '@/components/ui/data-grid-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { Profile } from '@/components/custom/profile';
import Table from '@/components/custom/table';
import { CustomTooltip } from '@/components/custom/tooltip';
import { UserRoleBadge } from '@/components/custom/user-role-badge';
import TableToolbarFilters from '../../../../../../components/common/table-toolbar-filters';
import useStore from '../../store';
import TableToolbar from '../members-table-toolbar';

function ActionsCell({ row }) {
  const [deleteMember] = useDeleteMemberMutation();
  const [lockAccount, { isLoading: isLocking }] = useLockAccountMutation();
  const [unlockAccount, { isLoading: isUnLocking }] =
    useUnlockAccountMutation();
  const navigate = useNavigate();

  const handleCopyId = () => {
    copyToClipboard(
      `${window.location.host}/auth/signup?invite=${row.original.userId}`,
    );
    toast.success('Copied!');
  };

  const handleDeleteMember = () => {
    toast.promise(deleteMember(row.original.userId).unwrap(), {
      loading: 'Deleting member',
      error: 'Failed to delete member',
      success: 'Member removed',
    });
  };

  const handleLockMember = () => {
    toast.promise(lockAccount({ userId: row.original.userId }).unwrap(), {
      loading: 'Locking member',
      error: 'Failed to lock member',
      success: 'Member locked',
    });
  };

  const handleUnlockMember = () => {
    toast.promise(unlockAccount({ userId: row.original.userId }).unwrap(), {
      loading: 'Unlocking member',
      error: 'Failed to unlock member',
      success: 'Member unlocked',
    });
  };

  return (
    <div className="flex gap-1 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {!row.original.hasSignedUp && (
            <ButtonWithConfirm
              variant="ghost"
              className="w-full justify-start"
              onConfirm={handleCopyId}
            >
              Copy Invite Link
            </ButtonWithConfirm>
          )}

          <AuthorityGuard roles={['Admin']}>
            {row?.original?.isActive ? (
              <ButtonWithConfirm
                className={`w-full justify-start ${row.original?.role == 'Admin' && 'hidden'}`}
                variant="ghost"
                confirm={true}
                description={`Are you sure you want to lock this member's account?`}
                confirmButton={
                  <Button
                    variant="destructive"
                    disabled={isUnLocking || isLocking}
                  >
                    Lock
                  </Button>
                }
                cancelButton={<Button variant="outline">Cancel</Button>}
                onConfirm={handleLockMember}
              >
                Lock Member
              </ButtonWithConfirm>
            ) : (
              <ButtonWithConfirm
                variant="ghost"
                className={`w-full justify-start ${row.original?.role == 'Admin' && 'hidden'}`}
                confirm={true}
                description={`Are you sure you want to unlock this member's account?`}
                confirmButton={
                  <Button variant="primary" disabled={isUnLocking || isLocking}>
                    Unlock
                  </Button>
                }
                cancelButton={<Button variant="outline">Cancel</Button>}
                onConfirm={handleUnlockMember}
              >
                Unlock Member
              </ButtonWithConfirm>
            )}
          </AuthorityGuard>

          <ButtonWithConfirm
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onConfirm={handleDeleteMember}
            confirm={true}
            description="Are you sure you want to remove this member?"
          >
            Delete Member
          </ButtonWithConfirm>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

const getColumns = (canManageMembers) => {
  const baseColumns = [
    // {
    //   accessorKey: 'id',
    //   accessorFn: (row) => row.id,
    //   header: () => <DataGridTableRowSelectAll />,
    //   cell: ({ row }) => <DataGridTableRowSelect row={row} />,
    //   enableSorting: false,
    //   enableHiding: false,
    //   enableResizing: false,
    //   size: 51,
    //   meta: {
    //     cellClassName: '',
    //     skeleton: <Skeleton className="w-full h-5" />,
    //   },
    // },
    {
      id: 'member',
      accessorFn: (row) => row.member,
      header: ({ column }) => (
        <DataGridColumnHeader title="Member" column={column} />
      ),

      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <div className="shrink-0">
            {/* <img
                src={toAbsoluteUrl(
                  `/media/avatars/${row.original.member.avatar}`,
                )}
                className="h-9 rounded-full"
                alt="image"
              /> */}
            {canManageMembers ? (
              <Link
                to={`/profile/account/members/permissions-toggle?memberId=${row.original.userId}&memberEmail=${row.original.email}`}
              >
                <Profile
                  size="32px"
                  showEmail
                  email={row.original?.email}
                  name={row.original?.name}
                />
              </Link>
            ) : (
              <Profile
                size="32px"
                showEmail
                email={row.original?.email}
                name={row.original?.name}
                className="cursor-default [&_*]:hover:text-foreground [&_*]:hover:cursor-default"
              />
            )}
          </div>
          {/* <div className="flex flex-col gap-0.5">
            <Link
              to={`/profile/account/members/permissions-toggle?memberId=${row.original.userId}&memberEmail=${row.original.email}`}
              className="leading-none font-medium text-sm text-mono hover:text-primary"
            >
              {row.original?.name || '-'}
            </Link>
            <span className="text-[12px] text-secondary-foreground font-normal">
              {row.original?.email}
            </span>
          </div> */}
        </div>
      ),

      enableSorting: true,
      size: 300,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="w-full h-5" />,
      },
    },

    {
      id: 'team_name',
      accessorFn: (row) => row.member,
      header: ({ column }) => (
        <DataGridColumnHeader title="Team Name" column={column} />
      ),

      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <div className="shrink-0">
            {/* <img
                src={toAbsoluteUrl(
                  `/media/avatars/${row.original.member.avatar}`,
                )}
                className="h-9 rounded-full"
                alt="image"
              /> */}
          </div>
          <Badge className="flex items-center h-fit">
            {row.original?.team?.map((t) => t?.name)?.join?.(', ') || '-'}
          </Badge>
          {/* <span className="text-[12px] text-secondary-foreground font-normal">
              {row.original?.email}
            </span> */}
        </div>
      ),

      enableSorting: true,
      size: 200,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="w-full h-5" />,
      },
    },

    {
      id: 'department_name',
      accessorFn: (row) => row.member,
      header: ({ column }) => (
        <DataGridColumnHeader title="Department" column={column} />
      ),

      cell: ({ row }) => (
        <Badge className="w-fit h-fit" variant="secondary" appearance="light">
          {row.original?.department?.name || 'N/A'}
        </Badge>
      ),

      enableSorting: true,
      size: 200,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="w-full h-5" />,
      },
    },

    {
      id: 'roles',
      accessorFn: (row) => row.roles,
      header: ({ column }) => (
        <DataGridColumnHeader title="Role" column={column} />
      ),

      cell: ({ row }) => (
        <div className="flex flex-wrap gap-2.5 mb-2">
          <UserRoleBadge role={row.original?.role} />
        </div>
      ),

      enableSorting: true,
      size: 110,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="w-full h-5" />,
      },
    },
    {
      id: 'status',
      accessorFn: (row) => row.status,
      header: ({ column }) => (
        <DataGridColumnHeader title="Status" column={column} />
      ),

      cell: ({ row }) => (
        // <Badge
        //   variant={row.original?.hasSignedUp ? 'success' : 'warning'}
        //   appearance="outline"
        // >
        //   {row.original?.hasSignedUp ? 'Signed Up' : 'Yet to Sign Up'}
        // </Badge>
        <CustomTooltip text={row.original?.lock_reason}>
          <Badge
            variant={!row.original?.isActive ? 'warning' : 'success'}
            appearance="outline"
          >
            {!row.original?.isActive ? (
              <>
                <Lock /> Inactive
              </>
            ) : (
              <>
                <Unlock /> Active
              </>
            )}
          </Badge>
        </CustomTooltip>
      ),

      enableSorting: true,
      size: 110,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="w-full h-5" />,
      },
    },
    {
      id: 'lastLogin',
      accessorFn: (row) => row.lastLogin,
      header: ({ column }) => (
        <DataGridColumnHeader title="Recent Activity" column={column} />
      ),

      cell: ({ row }) => (
        <div className=" flex flex-col">
          {/* <span className="text-secondary-foreground text-sm font-normal">
            {row.original.lastLogin
              ? Intl.DateTimeFormat('en-US', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                }).format(new Date(row.original?.lastLogin))
              : 'Never Logged In'}
          </span> */}
          <span className="text-secondary-foreground text-sm font-normal">
            {timeAgo(row.original?.lastLogin)}
          </span>
        </div>
      ),

      enableSorting: true,
      size: 165,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="w-full h-5" />,
      },
    },
  ];

  if (canManageMembers) {
    baseColumns.push({
      id: 'actions',
      header: ({ column }) => <DataGridColumnHeader title="" column={column} />,
      cell: ({ row }) => (
        <AuthorityGuard roles={['Admin', 'Platform Admin']}>
          <ActionsCell row={row} />
        </AuthorityGuard>
      ),
      enableSorting: false,
      size: 50,
      meta: {
        headerClassName: '',
        skeleton: <Skeleton className="w-full h-5" />,
      },
    });
  }

  return baseColumns;
};

const Members = ({
  members,
  advancedFilters,
  loading,
  isFetching,
  totalPages,
  totalCount,
}) => {
  const searchQuery = useStore((state) => state.searchQuery);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const setFilters = useStore((state) => state.setFilters);
  const filters = useStore((state) => state.filters);
  const pagination = useStore((state) => state.pagination);
  const setPagination = useStore((state) => state.setPagination);
  const sorting = useStore((state) => state.sorting);
  const setSorting = useStore((state) => state.setSorting);

  const { user } = useAuth();
  const canManageMembers = ['Admin', 'Platform Admin'].includes(user?.role);

  const columns = getColumns(canManageMembers);

  // const Toolbar = () => {
  //   const { table } = useDataGrid();

  //   return (
  //     <CardToolbar>
  //       <div className="flex flex-wrap items-center gap-2.5">
  //         <Label htmlFor="auto-update" className="text-sm">
  //           Active Users
  //         </Label>
  //         <Switch size="sm" id="auto-update" defaultChecked />
  //         <Button>
  //           <UserRoundPlus />
  //           Add New
  //         </Button>
  //       </div>
  //       <DataGridColumnVisibility
  //         table={table}
  //         trigger={
  //           <Button variant="outline">
  //             <Settings2 />
  //             Columns
  //           </Button>
  //         }
  //       />
  //     </CardToolbar>
  //   );
  // };

  return (
    <Table
      data={members || []}
      totalPages={totalPages}
      search={searchQuery}
      setSearch={setSearchQuery}
      pagination={pagination}
      setPagination={setPagination}
      columns={columns}
      sorting={sorting}
      setSorting={setSorting}
      manualSorting={true}
      manualPagination={true}
      enableSorting={false}
      isLoading={loading || isFetching}
      totalCount={totalCount}
      toolbar={
        <TableToolbarFilters
          filters={filters}
          setFilters={setFilters}
          supportedFilters={advancedFilters}
          isLoadingFilters={loading}
        />
      }
    />
  );
};

export { Members };
