import _, { filter } from 'lodash';
import { Link } from 'react-router';
import { useGetAimAssetsQuery } from '@/services/asset-inventory/assets/assetsApi';
import { Badge } from '@/components/ui/badge';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import GetAssetTypeInfo from '@/components/custom/asset-icons';
import { Profile } from '@/components/custom/profile';
import Table from '@/components/custom/table';
import { EmptyScreen } from '../../../../../../components/common/empty-screen';
import TableToolbarFilters from '../../../../../../components/common/table-toolbar-filters';
import VulnerabilitiesBadges from '@/components/custom/vulnerabilities-badges';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { Button } from '@/components/ui/button';
import { useRemoveAimBusinessUnitAssociatedAssetsMutation } from '@/services/asset-inventory/businessUnitsApi';
import { toast } from 'sonner';
import useStore from '../../store';
import AddAssetsToBusinessUnitModal from '../forms/add-assets-to-business-unit';
import AuthorityGuard from '../../../../../../components/custom/authority-guard/AuthorityGuard';
import ApiErrorHandler from '../../../../../../components/common/api-error-handler';


const ActionsCell = ({ row, businessUnitId }) => {
  const [removeAsset, { isLoading: isRemoving }] = useRemoveAimBusinessUnitAssociatedAssetsMutation();

  const handleRemove = async () => {
    toast.promise(removeAsset({ businessUnitId, assetId: row?.original?._id }).unwrap(), {
      loading: 'Removing Asset...',
      success: 'Asset removed successfully',
      error: 'Failed to remove asset',
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <ButtonWithConfirm
          confirm={true}
          variant="ghost"
          disabled={isRemoving}
          onConfirm={handleRemove}
          className="w-full text-red-500 justify-start px-2 py-1.5 h-auto font-normal text-sm rounded- text-left hover:bg-red-200/20 hover:text-dertructive"
          dialog={
            <div className="flex flex-col items-center gap-2">
              <p className="text-center font-semibold">
                Remove Association?
              </p>
              <p className="text-sm text-muted-foreground text-center">
                Are you sure you want to remove this asset association from the business unit?
              </p>
            </div>
          }
        >
          Remove Association
        </ButtonWithConfirm>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

function getColumns(businessUnitId) {
  return [
    {
      id: 'assetValue',
      accessorFn: (row) => row.value,
      header: ({ column }) => (
        <DataGridColumnHeader title="Asset Value" column={column} />
      ),
      cell: ({ row }) => (
        <div className="flex flex-col">
          <Link
            to={`/assetinventory/asset-edit/${row.original._id}?asset=${row?.original?.type}`}
            className="text-secondary-foreground font-medium hover:text-primary break-words truncate overflow-hidden whitespace-nowrap"
            title={row.original.value}
          >
            {row.original.value}
          </Link>
          <span
            className="text-xs text-muted-foreground truncate max-w-[200px]"
            title={row.original.name}
          >
            {row.original.name}
          </span>
        </div>
      ),
      size: 200,
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'type',
      accessorFn: (row) => row.type,
      header: ({ column }) => (
        <DataGridColumnHeader title="Type" column={column} />
      ),
      cell: ({ row }) => (
        <Badge variant="secondary" className="capitalize">
          {GetAssetTypeInfo(row?.original?.type).icon}{' '}
          {GetAssetTypeInfo(row?.original?.type).label}
        </Badge>
      ),
      size: 100,
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },

    {
      id: 'owner',
      accessorFn: (row) => row.owner,
      header: ({ column }) => (
        <DataGridColumnHeader title="Owner" column={column} />
      ),
      cell: ({ row }) => {
        const owner = row?.original?.owner;
        const userName = owner?.user?.email;
        const teamName = owner?.team?.name;
        const departmentName = owner?.department?.name;

        if (userName) {
          return (
            <Profile
              email={owner?.user?.email || ''}
              name={
                owner?.user?.firstName + ' ' + (owner?.user?.lastName || '') ||
                owner?.user?.email?.split('@')[0]
              }
            // role={owner?.user?.email}
            />
          );
        }
        if (teamName) {
          return <span className="text-sm font-medium">{teamName}</span>;
        }
        if (departmentName) {
          return <span className="text-sm font-medium">{departmentName}</span>;
        }
        return <span className="text-muted-foreground">No owner</span>;
      },

      enableSorting: false,
      size: 180,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },

    {
      id: 'Vulns',
      accessorFn: (row) => row.assessmentTitle,
      header: ({ column }) => (
        <DataGridColumnHeader title="Active Vulnerabilities" column={column} />
      ),

      cell: ({ row }) => {
        const stats = row?.original?.security?.vulnerability_stats;
        return (
          <div className="flex items-start justify-start">
            <VulnerabilitiesBadges
              vulnerabilities={stats ? { ...stats, info: stats.info ?? stats.none } : null}
              assetName={row?.original?.value}
            />
          </div>
        );
      },

      enableSorting: true,
      size: 80,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },

    {
      id: 'actions',
      accessorFn: (row) => row.vulnerabilities?.length || 0,
      header: ({ column }) => (
        <DataGridColumnHeader title="" column={column} />
      ),
      cell: ({ row }) => (
        <AuthorityGuard forbidRoles={['Auditor']}>
          <ActionsCell row={row} businessUnitId={businessUnitId} />
        </AuthorityGuard>
      ),
      enableSorting: false,
      size: 50,
      meta: {
        cellClassName: 'text-center',
        skeleton: <Skeleton className="h-7" />,
      },
    },
  ];
}

const AssociatedAssets = ({ businessUnitId }) => {
  const pagination = useStore((state) => state.pagination);
  const setPagination = useStore((state) => state.setPagination);
  const search = useStore((state) => state.searchQuery);
  const setSearch = useStore((state) => state.setSearchQuery);
  const sorting = useStore((state) => state.sorting);
  const setSorting = useStore((state) => state.setSorting);
  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);

  const { data, isLoading, isFetching, isError, error } = useGetAimAssetsQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    ...(sorting?.length
      ? {
        sortBy:
          sorting[0]?.id === 'assetValue'
            ? 'value'
            : sorting[0]?.id === 'Vulns'
              ? 'properties.vulnerabilityStats.total'
              : sorting[0]?.id,
        sort: sorting[0]?.desc ? 'desc' : 'asc',
      }
      : {}),
    ...(Object.keys(filters || {}).length ? filters : {}),
    search: search,
    businessUnitIds: businessUnitId,
    unified_view: true,
  });

  const hasFilters = Object.keys(filters || {}).length > 0;

  // Show Empty Screen when there are no associated assets
  if (!isError && !isLoading && !search && !hasFilters && !data?.pagination?.total)
    return (
      <EmptyScreen
        title="No Associated Assets Found"
        engage={
          <AuthorityGuard forbidRoles={['Auditor']}>
            <AddAssetsToBusinessUnitModal businessUnitId={businessUnitId} />
          </AuthorityGuard>
        }
      />
    );

  if (isError) return <ApiErrorHandler error={error} />

  const columns = getColumns(businessUnitId);

  return (
    <Table
      data={data?.assets || []}
      columns={columns}
      isLoading={isLoading || isFetching}
      pagination={pagination}
      setPagination={setPagination}
      sorting={sorting}
      setSorting={setSorting}
      totalPages={data?.pagination?.totalPages}
      totalCount={data?.pagination?.total}
      search={search}
      setSearch={setSearch}
      enableSorting={true}
      searchPlaceholder="Search Assets"
      searchWidth="60"
      toolbar={
        <TableToolbarFilters
          supportedFilters={data?.advanced_filters}
          isLoadingFilters={isLoading}
          filters={filters}
          setFilters={setFilters}
        />
      }
      rightToolbar={
        <AuthorityGuard forbidRoles={['Auditor']}>
          <AddAssetsToBusinessUnitModal businessUnitId={businessUnitId} />
        </AuthorityGuard>
      }
    />
  );
};

export default AssociatedAssets;