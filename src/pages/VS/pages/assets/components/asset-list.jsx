import { useMemo } from 'react';
import { Link } from 'react-router';
import { useAuth } from '@/auth/context/auth-context';
import { Badge } from '@/components/ui/badge';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import {
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from '@/components/ui/data-grid-table';
import { Skeleton } from '@/components/ui/skeleton';
import GetAssetTypeInfo from '@/components/custom/asset-icons';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import { Profile } from '@/components/custom/profile';
import Table from '@/components/custom/table';
import { VulnerabilityLables } from '@/components/custom/vulnerability-labels';
import TableToolbarFilters from '../../../../../components/common/table-toolbar-filters.jsx';
import AuthorityGuard from '../../../../../components/custom/authority-guard/AuthorityGuard.jsx';
import { formatDateTime, timeAgo } from '../../../../../lib/helpers';
import useStore from '../store';
import DeleteAssetGroupAction from './actions/delete-asset-group';
import RunImmediateScanAction from './actions/run-immediate-scan';
import AddGroupButton from './add-group-button';
import BulkUpdateFloatingBar from './bulk-update-floating-bar.jsx';
import ActionsCell from './ui/actions-cell';
import RemediationProgress from './ui/remediation-progress';
import VulnerabilitiesBadges from './ui/vulnerabilities-badges';

// Helper function for risk score variant
const getRiskScoreVariant = (score) => {
  if (!score) return 'secondary';
  if (score >= 7) return 'destructive';
  if (score >= 4) return 'warning';
  return 'success';
};

function getColumns() {
  const userJSON = localStorage.getItem('user');
  const localUser = userJSON ? JSON.parse(userJSON) : null;
  const isAuditor = localUser?.role?.toLowerCase() === 'auditor';

  const severityMap = {
    critical: 'C',
    high: 'H',
    medium: 'M',
    info: 'L',
  };

  return [
    ...(isAuditor ? [] : [{
      accessorKey: '_id',
      header: () => <DataGridTableRowSelectAll />,
      cell: ({ row }) => <DataGridTableRowSelect row={row} />,
      enableSorting: false,
      enableHiding: false,
      size: 30,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7 w-full" />,
      },
    }]),
    {
      id: 'assetName',
      accessorFn: (row) => row.value || 'Unnamed Asset',
      header: ({ column }) => (
        <DataGridColumnHeader title="Asset Name" column={column} />
      ),
      cell: ({ row }) => {
        const assetName = row.original.value || 'Unnamed Asset';
        return (
          <div className="flex items-center gap-2 min-w-0 max-w-[280px]">
            <Badge variant="secondary" appearance="outline" className="shrink-0">
              {GetAssetTypeInfo(row.original.type).icon}
              {/* {GetAssetTypeInfo(row.original.type).label} */}
            </Badge>
            <span className="font-medium truncate min-w-0">
              <Link
                to={`/vs/vulns?filters=value:${row?.original?.value}`}
                className="text-[13px] truncate block"
                title={assetName}
              >
                {assetName}
              </Link>
            </span>
          </div>
        );
      },
      enableSorting: false,
      size: 150,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7 w-full" />,
      },
    },

    {
      id: 'groups',
      accessorFn: (row) => row.groups || '+',
      header: ({ column }) => (
        <DataGridColumnHeader title="Groups" column={column} />
      ),
      cell: ({ row }) => (
        <div className="text-secondary-foreground font-normal leading-tight flex gap-1 items-center flex-wrap">
          {row.original?.groups?.length
            ? row.original?.groups?.slice(0, 2).map((g) => {
              return (
                <Badge
                  key={g._id}
                  className=" flex items-center justify-center"
                >
                  {g.name}

                  <AuthorityGuard forbidRoles={['Auditor']}>
                    <DeleteAssetGroupAction
                      assetId={row.original?._id}
                      groupId={row.original?.groupId[0]}
                    />
                  </AuthorityGuard>
                </Badge>
              );
            })
            : ''}
          {row.original?.groups?.length > 2 && (
            <div className="flex flex-wrap gap-2">
              <DetailedHoverPopover
                popoverTitle="Groups"
                width="max-w-[500px]"
                height="max-h-[500px]"
                buttonText={`+${row.original?.groups?.length - 2} more`}
                popoverContent={
                  <div className="flex flex-wrap gap-1">
                    {row.original?.groups?.slice(2).map((g) => (
                      <Badge
                        key={g._id}
                        className="m-0.5 h-fit w-fit flex items-center justify-center"
                      >
                        {g.name}
                        <AuthorityGuard forbidRoles={['Auditor']}>
                          <DeleteAssetGroupAction
                            assetId={row.original?._id}
                            groupId={g._id}
                          />
                        </AuthorityGuard>
                      </Badge>
                    ))}
                  </div>
                }
              />
            </div>
          )}
          <AuthorityGuard forbidRoles={['Auditor']}>
            <AddGroupButton
              assetId={row.original?._id}
              groups={row?.original?.groups}
            />
          </AuthorityGuard>
        </div>
      ),
      enableSorting: false,
      size: 220,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7 w-full" />,
      },
    },
    {
      id: 'vulnerabilities',
      accessorFn: (row) => row.vulnerabilities?.length || 0,
      header: ({ column }) => (
        <DataGridColumnHeader title="Vulnerabilities" column={column} />
      ),
      cell: ({ row }) => {
        const items = Object.entries(severityMap)
          .map(([key, label]) => ({
            label,
            number:
              row?.original?.vulnerabilities?.find(
                (v) => v?.severity?.toLowerCase() === key,
              )?.count || 0,
          }))
          .filter((item) => item.number > 0);

        return (
          <div className="flex items-center min-h-8">
            {items.length > 0 ? (
              <VulnerabilityLables items={items} />
            ) : (
              <span className="text-muted-foreground ml-2">
                No Active Vulnerabilities
              </span>
            )}
          </div>
        );
      },
      enableSorting: true,
      size: 170,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7 w-full" />,
      },
    },
    {
      id: 'lastScanned',
      accessorFn: (row) => row.lastScanned || 'Never Scanned',
      header: ({ column }) => (
        <DataGridColumnHeader title="Last Scanned" column={column} />
      ),
      cell: ({ row }) => (
        <span className="text-secondary-foreground font-normal leading-tight">
          {row?.original?.lastScan
            ? timeAgo(row.original.lastScan)
            : 'Never Scanned'}
        </span>
      ),
      enableSorting: false,
      size: 100,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7 w-full" />,
      },
    },
    {
      id: 'actions',
      header: ({ column }) => <DataGridColumnHeader title="" column={column} />,
      cell: ({ row }) => (
        <AuthorityGuard forbidRoles={['Auditor']}>
          <RunImmediateScanAction assetId={row.original._id} />
        </AuthorityGuard>
      ),
      enableSorting: false,
      size: 50,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7 w-full" />,
      },
    },
  ];
}

function AssetList({ data, isLoading, isFetching }) {
  const { user } = useAuth();
  const isAuditor = user?.role?.toLowerCase() === 'auditor';

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

  const columns = useMemo(() => getColumns(isAuditor), [isAuditor]);
  const selectedRowsCount = Object.keys(rowSelection).length;

  return (
    <>
      <Table
        data={data?.assets}
        columns={columns}
        searchPlaceholder="Search Assets...."
        isLoading={isLoading || isFetching}
        totalPages={Math.ceil(data?.total / pagination.pageSize)}
        totalCount={data?.total}
        pagination={pagination}
        setPagination={setPagination}
        sorting={sorting}
        setSorting={setSorting}
        search={searchQuery}
        setSearch={setSearchQuery}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        toolbar={
          <TableToolbarFilters
            supportedFilters={data?.advanced_filters}
            isLoadingFilters={isLoading}
            filters={filters}
            setFilters={setFilters}
          />
        }
        enableSorting={true}
      />
      {selectedRowsCount > 1 && <BulkUpdateFloatingBar />}
    </>
  );
}

export default AssetList;
