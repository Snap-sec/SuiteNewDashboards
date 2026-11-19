import { useMemo } from 'react';
import { RefreshCcw, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import {
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from '@/components/ui/data-grid-table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { DateFormatter } from '@/components/custom/date-formatter';
import { Profile } from '@/components/custom/profile';
import SeverityLabel from '@/components/custom/severity-label';
import { StateLabels } from '@/components/custom/state-labels';
import Table from '@/components/custom/table';
import ProfileImage from '../../../../../../components/common/profile-image';
import { VulnerabilityLables } from '../../../../../../components/custom/vulnerability-labels';
import VulnerabilitiesBadges from '../../../../../VM/pages/assets/components/ui/vulnerabilities-badges';
import useStore from '../../store';
import { useAuth } from '@/auth/context/auth-context';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import BusinessUnitsDropdown from '../dropdowns/business-units-dropdown';
import TableToolbarFilters from '@/components/common/table-toolbar-filters';

const getRiskInfo = (score) => {
  const n = parseInt(score) || 0;
  if (n === 0) return { label: 'Not Assessed', variant: 'secondary' };
  if (n >= 1 && n <= 11) return { label: 'Low Risk', variant: 'success' };
  if (n >= 12 && n <= 16) return { label: 'Medium Risk', variant: 'warning' };
  if (n >= 17 && n <= 22) return { label: 'High Risk', variant: 'warning' };
  if (n >= 23 && n <= 27) return { label: 'Critical Risk', variant: 'destructive' };
  return { label: 'Not Assessed', variant: 'secondary' };
};

function getColumns(user) {
  return [
    {
      id: 'BusinessUnit',
      accessorFn: (row) => row.title,
      header: ({ column }) => (
        <DataGridColumnHeader title="Business Unit" column={column} />
      ),

      cell: ({ row }) => (
        <div className=' flex gap-2'>
          <ProfileImage
            src={row?.original?.logo}
            fallbackAvatarText={row?.original?.name}
          />

          <Link to={`/assetinventory/business-unit/${row?.original?._id}`}>
            <p
              title={row?.original?.name}
              className="text-secondary-foreground font-medium hover:text-primary break-words truncate overflow-hidden whitespace-nowrap max-w-40"
            >
              {row?.original?.name}
            </p>
            {/* <p className="text-sm text-muted-foreground truncate overflow-hidden whitespace-nowrap w-[200px] truncate">
              {row?.original?.description}
            </p> */}
          </Link>
        </div>
      ),

      enableSorting: true,
      size: 200,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },

    {
      id: 'owner',
      accessorFn: (row) => row.owner,
      header: ({ column }) => (
        <DataGridColumnHeader title="Owner" column={column} />
      ),
      cell: ({ row }) => (
        <Profile
          name={
            row?.original?.owner?.firstName
              ? `${row?.original?.owner?.firstName}`
              : row.original?.owner?.name || 'No Owner'
          }
          role={row.original.owner?.role || ' '}
          email={row.original.owner?.email || row.original?.owner?.email || ' '}
        />
      ),

      enableSorting: false,
      size: 130,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },

    {
      id: 'assetsCount',
      accessorFn: (row) => row.assessmentTitle,
      header: ({ column }) => (
        <DataGridColumnHeader title="Assets" column={column} />
      ),

      cell: ({ row }) => (
        <div
          data-testid="assessment-badge"
          className="flex items-center gap-1.5"
        >
          {row?.original?.assetsCount}
        </div>
      ),

      enableSorting: true,
      size: 100,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },

    {
      id: 'riskScore',
      accessorFn: (row) => row.riskScore,
      header: ({ column }) => (
        <DataGridColumnHeader title="Criticality" column={column} />
      ),

      cell: ({ row }) => {
        const { label, variant } = getRiskInfo(row?.original?.riskScore);
        return (
          <Badge variant={variant} appearance="outline">
            {label}
          </Badge>
        );
      },

      enableSorting: false,
      size: 150,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },

    {
      id: 'SecurityPosture',
      accessorFn: (row) => row.assessmentTitle,
      header: ({ column }) => (
        <DataGridColumnHeader title="Open Vulnerabilities" column={column} />
      ),

      cell: ({ row }) => {
        const items = [
          { number: row?.original?.risk?.critical, label: 'C' },
          { number: row?.original?.risk?.high, label: 'H' },
          { number: row?.original?.risk?.medium, label: 'M' },
          { number: row?.original?.risk?.low, label: 'L' },
        ].filter(item => Number(item.number) > 0);

        return (
          <div
            data-testid="assessment-badge"
            className="flex items-center gap-1.5"
          >
            {items.length > 0 ? (
              <VulnerabilityLables items={items} />
            ) : (
              <span className="text-muted-foreground">No Vulnerabilities Found</span>
            )}
          </div>
        );
      },

      enableSorting: false,
      size: 150,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },

    {
      id: 'updatedAt',
      accessorFn: (row) => row.updatedAt,
      header: ({ column }) => (
        <DataGridColumnHeader title="Last Updated" column={column} />
      ),

      cell: ({ row }) => (
        <div className=" flex flex-col">
          <DateFormatter date={row?.original?.updatedAt} />{' '}
        </div>
      ),
      enableSorting: true,
      size: 120,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'actions',
      header: ({ column }) => (
        <AuthorityGuard forbidRoles={['Auditor']}>
          <DataGridColumnHeader title="" column={column} />
        </AuthorityGuard>
      ),
      cell: ({ row }) => {
        const loggedInUserId = user?._id || user?.id || user?.userId;
        const owner = row.original?.owner;
        const isOwner =
          owner &&
          loggedInUserId &&
          (owner.id === loggedInUserId ||
            owner._id === loggedInUserId ||
            owner.userId === loggedInUserId);

        return (
          <AuthorityGuard forbidRoles={['Auditor']}>
            <BusinessUnitsDropdown row={row} />

          </AuthorityGuard>
        );
      },
      size: 50,
      meta: {
                cellClassName: '',
                skeleton: <Skeleton className="h-7" />,
            },
    },
  ];
}

function BusinessUnitsTable({ data, isLoading, isFetching}) {
  const { user } = useAuth();
  const pagination = useStore((state) => state.pagination);
  const searchQuery = useStore((state) => state.searchQuery);
  const sorting = useStore((state) => state.sorting);
  const setPagination = useStore((state) => state.setPagination);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const setSorting = useStore((state) => state.setSorting);
  const rowSelection = useStore((state) => state.rowSelection);
  const setRowSelection = useStore((state) => state.setRowSelection);
  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);

  const columns = useMemo(() => getColumns(user), [user]);

  const units = data?.businessUnits || data || [];

  return (
    <Table
      data={units}
      columns={columns}
      enableSorting={true}
      isLoading={isLoading || isFetching}
      totalPages={data?.totalPages}
      totalCount={data?.totalItems}
      pagination={pagination}
      setPagination={setPagination}
      sorting={sorting}
      setSorting={setSorting}
      rowSelection={rowSelection}
      setRowSelection={setRowSelection}
      search={searchQuery}
      setSearch={setSearchQuery}
      toolbar={
        <TableToolbarFilters
          supportedFilters={data?.advanced_filters}
          filters={filters}
          setFilters={setFilters}
          isLoadingFilters={isLoading}
        />
      }
    />
  );
}

export default BusinessUnitsTable;
