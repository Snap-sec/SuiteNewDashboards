import { useMemo } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { Plus, SquarePen, MoreHorizontal, Pencil } from 'lucide-react';
import { Link } from 'react-router';
import { formatDate } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CustomAvatarGroup } from '@/components/custom/avatar-group';
import PageHeading from '@/components/custom/page-heading';
import Table from '@/components/custom/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import useStore from '../../store';

const Teams = ({ data, loading }) => {
  const setShowAddTeamModal = useStore((state) => state.setShowAddTeamModal);
  const sorting = useStore((state) => state.sorting);
  const setSorting = useStore((state) => state.setSorting);
  const searchQuery = useStore((state) => state.searchQuery);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const user = JSON.parse(localStorage.getItem('user'));

  const columnHelper = createColumnHelper();

  const columns = useMemo(() => {
    const baseColumns = [
      columnHelper.accessor('name', {
        header: ({ column }) => (
          <DataGridColumnHeader title="Team" column={column} />
        ),
        cell: (info) => (
          <div className="flex flex-col">
            <Link
              to={`/profile/account/members/teams/${info.row.original._id}`}
              className="font-medium text-foreground"
            >
              {info.getValue()}
            </Link>
            <span className="text-sm text-muted-foreground">
              {info.row.original.description}
            </span>
          </div>
        ),
        enableSorting: false,
        meta: {
          skeleton: <Skeleton className="h-[40px]" />,
        },
      }),

      columnHelper.accessor('department', {
        header: ({ column }) => (
          <DataGridColumnHeader title="Department" column={column} />
        ),
        cell: (info) => info.getValue()?.name || '-',
        enableSorting: false,
        size: 80,
        meta: {
          skeleton: <Skeleton className="h-[20px]" />,
        },
      }),

      columnHelper.accessor('updatedAt', {
        header: ({ column }) => (
          <DataGridColumnHeader title="Last Modified" column={column} />
        ),
        cell: (info) => (
          <span className="text-sm">
            {info.getValue() ? formatDate(info.getValue()) : '-'}
          </span>
        ),
        enableSorting: true,
        size: 60,
        meta: {
          skeleton: <Skeleton className="h-[20px]" />,
        },
      }),

      columnHelper.accessor('members', {
        header: ({ column }) => (
          <DataGridColumnHeader title="Members" column={column} />
        ),
        cell: (info) => {
          const emails = info
            .getValue()
            ?.filter((m) => m)
            ?.map((member) => member?.email)
            ?.filter(Boolean);

          if (!emails || emails.length === 0) {
            return '-';
          }

          return (
            <CustomAvatarGroup
              emails={emails}
              size={'30px'}
              maxVisible={3}
              more={{
                variant: 'text-white ring-background bg-blue-500',
              }}
            />
          );
        },
        size: 60,
        enableSorting: false,
        meta: {
          skeleton: <Skeleton className="h-[30px] rounded-full" />,
        },
      }),
    ];

    if (user?.role === 'Admin') {
      baseColumns.push(
        columnHelper.accessor('actions', {
          header: ({ column }) => (
            <DataGridColumnHeader title="" column={column} />
          ),
          cell: (info) => (
            <AuthorityGuard roles={['Admin']}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Link
                    to={`/profile/account/members/teams/${info.row.original._id}`}
                    className="w-full"
                  >
                    <DropdownMenuItem className="cursor-pointer">
                      Edit
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
            </AuthorityGuard>
          ),
          enableSorting: false,
          size: 10,
          meta: {
            skeleton: <Skeleton className="w-full h-[40px]" />,
          },
        })
      );
    }

    return baseColumns;
  }, [user?.role, columnHelper]);

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <PageHeading title="Teams" description="Manage and organize teams within your organization." />

        {user?.role === 'Admin' && (
          <Button onClick={() => setShowAddTeamModal(true)}>
            <Plus /> Add Team
          </Button>
        )}
      </div>

      <Table
        data={data || []}
        columns={columns}
        isLoading={loading}
        manualPagination={false}
        manualSorting={true}
        sorting={sorting}
        setSorting={setSorting}
        enableSearch={true}
        enableSorting={true}
        searchPlaceholder="Search teams..."
        search={searchQuery}
        setSearch={setSearchQuery}
      />
    </div>
  );
};

export { Teams };
