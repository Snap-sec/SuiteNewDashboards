import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Profile } from '@/components/custom/profile';
import Table from '@/components/custom/table';
import { useAuth } from '@/auth/context/auth-context';
import { useGetProjectCollabratorsQuery } from '@/services/tm/projectApi';
import RemoveCollaborator from './actions/remove-project-collaborator';

function getColumns(isLoading, defaultThreatOwner, isOwner) {
  return [
    {
      id: 'name',
      accessorKey: 'name',
      header: ({ column }) => (
        <DataGridColumnHeader title="Name" column={column} />
      ),
      cell: ({ row }) => (
        <div className=" flex flex-col space-x-0.5">
          <Profile
            name={row.original.name || row.original.email}
            email={row.original.email}
            role={row.original.role}
          />
        </div>
      ),
      enableSorting: false,
      size: 300,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'email',
      accessorKey: 'email',
      header: ({ column }) => (
        <DataGridColumnHeader title="Email" column={column} />
      ),
      cell: ({ row }) => (
        <div className="w-full flex flex-col items-start">
          <span className="text-sm">{row.original.email}</span>
          {defaultThreatOwner?.email == row.original.email && (
            <div className="w-full flex justify-start items-start">
              <Badge
                variant={'destructive'}
                appearance="outline"
                className="capitalize w-fit mt-0.5"
                size="xs"
              >
                Default Threat owner
              </Badge>
            </div>
          )}
        </div>
      ),
      enableSorting: false,
      size: 250,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'totalthreats',
      accessorKey: 'totalthreats',
      header: ({ column }) => (
        <DataGridColumnHeader title="Total Threats" column={column} />
      ),
      cell: ({ row }) => (
        <span className="text-sm">{row.original.metrics?.total} Threats</span>
      ),
      enableSorting: false,
      size: 150,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'role',
      accessorKey: 'role',
      header: ({ column }) => (
        <DataGridColumnHeader title="Role" column={column} />
      ),
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.role === 'manager'
              ? 'primary'
              : row.original.role === 'owner'
                ? 'warning'
                : 'info'
          }
          appearance="outline"
          className="capitalize"
        >
          {row.original.role}
        </Badge>
      ),
      enableSorting: false,
      size: 120,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'actions',
      accessorKey: 'role',
      header: ({ column }) => (
        <DataGridColumnHeader title="Actions" column={column} />
      ),
      cell: ({ row }) =>
        isOwner &&
        row.original.role != 'owner' && (
          <RemoveCollaborator collaboratorId={row?.original?.userId} />
        ),
      enableSorting: false,
      size: 120,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
  ];
}

function CollabratorTable({ defaultThreatOwner }) {
  const location = useLocation();
  const { user } = useAuth();

  const projectId = location.pathname.split('/')[3];

  const [sorting, setSorting] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, isFetching } = useGetProjectCollabratorsQuery({
    projectId,
    search: searchQuery,
  });

  const [pagination, setPagination] = useState({
    pageSize: 5,
    pageIndex: 0,
  });

  // is current user the owner;
  const isOwner = data?.collaborators?.map((c) => c.userId == user.userId);

  const columns = getColumns(isLoading, defaultThreatOwner, isOwner);

  return (
    <Table
      grid
      data={data?.collaborators || []}
      columns={columns}
      isLoading={isLoading || isFetching}
      pagination={pagination}
      setPagination={setPagination}
      sorting={sorting}
      setSorting={setSorting}
      search={searchQuery}
      setSearch={setSearchQuery}
      enableSorting={true}
      totalPages={1}
      className="h-full"
    />
  );
}

export default CollabratorTable;
