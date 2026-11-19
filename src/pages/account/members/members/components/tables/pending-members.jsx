import { Check, Settings2, UserRoundPlus, X } from 'lucide-react';
import { toast } from 'sonner';
import { formatDateTime } from '@/lib/helpers';
import { useProcessRegisterationMutation } from '@/services/auth/orgApi';
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
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { Profile } from '@/components/custom/profile';
import Table from '@/components/custom/table';
import { UserRoleBadge } from '@/components/custom/user-role-badge';
import useStore from '../../store';

function ActionsCell({ row }) {
  const [processRegisteration] = useProcessRegisterationMutation();
  console.log('-----', row);

  const handleProcessReg = (action) => {
    toast.promise(
      processRegisteration({ userId: row.original._id, action }).unwrap(),
      {
        loading: 'Processing registeration',
        error: 'Failed to process registeration',
        success: 'Registeration ' + action,
      },
    );
  };

  return (
    <div className="flex items-center">
      <ButtonWithConfirm
        variant="ghost"
        onConfirm={() => handleProcessReg('approve')}
        confirm={true}
      >
        <Check />
      </ButtonWithConfirm>
      <ButtonWithConfirm
        variant="ghost"
        onConfirm={() => handleProcessReg('reject')}
        confirm={true}
      >
        <X />
      </ButtonWithConfirm>
    </div>
  );
}

const getColumns = () => {
  return [
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
            <Profile size="25px" email={row.original?.email} />
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="leading-none font-medium text-sm text-mono hover:text-primary">
              {row.original?.firstName + ' ' + row.original?.lastName || '-'}
            </span>
            <span className="text-[12px] text-secondary-foreground font-normal">
              {row.original?.email}
            </span>
          </div>
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
      size: 220,
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
        <Badge
          variant={row.original?.hasSignedUp ? 'success' : 'warning'}
          appearance="outline"
        >
          {row.original?.hasSignedUp ? 'Signed Up' : 'Yet to Sign Up'}
        </Badge>
      ),

      enableSorting: true,
      size: 165,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="w-full h-5" />,
      },
    },
    {
      id: 'createdAt',
      accessorFn: (row) => row.createdAt,
      header: ({ column }) => (
        <DataGridColumnHeader title="Created At" column={column} />
      ),

      cell: ({ row }) => (
        <span className="text-secondary-foreground font-normal">
          {formatDateTime(row?.original?.createdAt)}
        </span>
      ),

      enableSorting: true,
      size: 165,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="w-full h-5" />,
      },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => <ActionsCell row={row} />,
      enableSorting: false,
      size: 120,
      meta: {
        headerClassName: '',
        skeleton: <Skeleton className="w-full h-5" />,
      },
    },
  ];
};

const PendingMembers = ({ members, loading, totalPages }) => {
  const searchQuery = useStore((state) => state.searchQuery);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const pagination = useStore((state) => state.pagination);
  const setPagination = useStore((state) => state.setPagination);

  const columns = getColumns();

  const Toolbar = () => {
    const { table } = useDataGrid();

    return (
      <CardToolbar>
        <div className="flex flex-wrap items-center gap-2.5">
          <Label htmlFor="auto-update" className="text-sm">
            Active Users
          </Label>
          <Switch size="sm" id="auto-update" defaultChecked />
          <Button>
            <UserRoundPlus />
            Add New
          </Button>
        </div>
        <DataGridColumnVisibility
          table={table}
          trigger={
            <Button variant="outline">
              <Settings2 />
              Columns
            </Button>
          }
        />
      </CardToolbar>
    );
  };

  return (
    <Table
      data={members || []}
      totalPages={totalPages}
      search={searchQuery}
      setSearch={setSearchQuery}
      pagination={pagination}
      setPagination={setPagination}
      columns={columns}
      manualSorting={false}
      manualPagination={true}
      enableSorting={false}
      isLoading={loading}
    />
  );
};

export { PendingMembers };
