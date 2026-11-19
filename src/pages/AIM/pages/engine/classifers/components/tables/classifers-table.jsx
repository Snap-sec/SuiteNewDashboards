import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { useToggleAimPolicyMutation } from '@/services/asset-inventory/policyApi';
import { useNavigate } from 'react-router-dom';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import Table from '@/components/custom/table';
import { formatDate } from '../../../../../../../lib/helpers';
import useStore from '../../store';
import ClassifersListDropdown from '../dropdowns/classifers-list-dropdown';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';

const EnabledSwitch = ({ row }) => {
  const [togglePolicy, { isLoading }] = useToggleAimPolicyMutation();

  const handleToggle = async (checked) => {
    toast.promise(togglePolicy({
      policyId: row.original._id,
      enabled: checked,
    }).unwrap(), {
      loading: `${checked ? 'Enabling' : 'Disabling'} classifier...`,
      success: `Classifier ${checked ? 'enabled' : 'disabled'} successfully`,
      error: `Failed to ${checked ? 'enable' : 'disable'} classifier`,
    });
  };

  return (
    <Switch
      checked={row.original.enabled}
      onCheckedChange={handleToggle}
      disabled={isLoading}
      className="w-10"
    />
  );
};

function getColumns() {
  const userJSON = localStorage.getItem('user');
  const user = JSON.parse(userJSON);

  const pagination = useStore((state) => state.pagination);
  const navigate = useNavigate();

  return [
    {
      id: 'name',
      accessorFn: (row) => row.name,
      header: ({ column }) => (
        <DataGridColumnHeader title="Name" column={column} />
      ),

      cell: ({ row }) => (
        <p className=" truncate" title={row?.original?.name}>
          {row?.original?.name}
        </p>
      ),

      enableSorting: false,
      size: 150,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },

    {
      id: 'Description',
      accessorFn: (row) => row.description,
      header: ({ column }) => (
        <DataGridColumnHeader title="Description" column={column} />
      ),

      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground truncate" title={row?.original?.description}>
          {row?.original?.description || '-'}
        </div>
      ),

      enableSorting: false,
      size: 150,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'isEnabled',
      accessorFn: (row) => row.enabled,
      header: ({ column }) => (
        <DataGridColumnHeader title="Enabled" column={column} />
      ),

      cell: ({ row }) => {
        return <AuthorityGuard forbidRoles={['Auditor']}><EnabledSwitch row={row} /></AuthorityGuard>;
      },

      enableSorting: false,
      size: 100,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },

    {
      id: 'matched_assets',
      accessorFn: (row) => row?.matched_assets,
      header: ({ column }) => (
        <DataGridColumnHeader title="Matched Assets" column={column} />
      ),

      cell: ({ row }) => (
        <p className=" truncate" title={row?.original?.matched_assets}>
          {row?.original?.matched_assets || '-'}
        </p>
      ),

      enableSorting: true,
      size: 100,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },

    {
      id: 'createdAt',
      accessorFn: (row) => row?.createdAt,
      header: ({ column }) => (
        <DataGridColumnHeader title="Created On" column={column} />
      ),

      cell: ({ row }) => <p>{formatDate(row?.original?.createdAt)}</p>,

      enableSorting: true,
      size: 100,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },

    {
      id: 'actions',
      accessorFn: (row) => row.state,
      header: ({ column }) => (
        <DataGridColumnHeader title="Actions" column={column} />
      ),
      cell: ({ row }) => (
        <AuthorityGuard forbidRoles={['Auditor']}>
        <div className="flex">
          <ClassifersListDropdown row={row} navigate={navigate} />
        </div>
        </AuthorityGuard>
      ),
      enableSorting: false,
      size: 50,
      meta: {
        headerClassName: '',
      },
    },
  ];
}

const ClassifersTable = ({
  data = [],
  paginationData,
  isLoading,
  isFetching,
}) => {
  const pagination = useStore((state) => state.pagination);
  const setPagination = useStore((state) => state.setPagination);
  const search = useStore((state) => state.searchQuery);
  const setSearch = useStore((state) => state.setSearchQuery);
  const sorting = useStore((state) => state.sorting);
  const setSorting = useStore((state) => state.setSorting);

  const columns = getColumns();

  return (
    <Table
      data={data}
      columns={columns}
      isLoading={isLoading || isFetching}
      manualPagination={false}
      manualSorting={true}
      search={search}
      setSearch={setSearch}
      sorting={sorting}
      setSorting={setSorting}
      enableSorting={true}
      searchPlaceholder="Search Classifiers"
      searchWidth="60"
    />
  );
};

export default ClassifersTable;
