import { useEffect, useMemo, useState } from 'react';
import { Globe } from 'lucide-react';
import useDebounce from '@/hooks/use-debounce';
import { useGetAssetGroupsQuery } from '@/services/asset-inventory/assets/assetGroupsApi';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import ApiErrorHandler from '@/components/common/api-error-handler';
import Table from '@/components/custom/table';
import { CustomTooltip } from '@/components/custom/tooltip';
import GetAssetTypeInfo from '@/components/custom/asset-icons';
import { AssetGroupActions, AssetGroupToolbar } from './asset-group-controls';
import AssetGroupDialog from './asset-group-dialog';
import RemediationProgress from './ui/remediation-progress';
import VulnerabilitiesBadges from './ui/vulnerabilities-badges';

export default function AssetGroupList() {
  const [dialog, setDialog] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState([]);

  const debouncedSearch = useDebounce(searchQuery, 300);
  const {
    currentData: groupsData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetAssetGroupsQuery({
    search: debouncedSearch,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    sortBy: sorting[0]?.id ?? 'createdAt',
    sort: sorting.length ? (sorting[0].desc ? 'desc' : 'asc') : 'desc',
  });

  useEffect(() => {
    if (
      groupsData &&
      pagination.pageIndex >= Math.max(groupsData.totalPages, 1)
    ) {
      setPagination((previous) => ({
        ...previous,
        pageIndex: Math.max(groupsData.totalPages - 1, 0),
      }));
    }
  }, [groupsData, pagination.pageIndex]);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setPagination((previous) => ({ ...previous, pageIndex: 0 }));
  };

  const handleSortingChange = (updater) => {
    setSorting(updater);
    setPagination((previous) => ({ ...previous, pageIndex: 0 }));
  };

  const handlePaginationChange = (updater) => {
    setPagination((previous) => {
      const next = typeof updater === 'function' ? updater(previous) : updater;
      return next.pageSize !== previous.pageSize
        ? { ...next, pageIndex: 0 }
        : next;
    });
  };

  const columns = useMemo(
    () => [
      {
        id: 'name',
        accessorFn: (row) => row.name,
        header: ({ column }) => (
          <DataGridColumnHeader title="Group Name" column={column} />
        ),
        cell: ({ row }) => {
          const typeCandidate =
            row.original.asset_type ||
            row.original.target_type ||
            row.original.type ||
            row.original.name;
          const { icon, label } = GetAssetTypeInfo(typeCandidate);
          return (
            <div className="flex items-center gap-2.5 max-w-[280px]">
              <CustomTooltip
                text={label || row.original.description || row.original.name}
              >
                <div
                  data-testid="asset-type"
                  className="flex gap-1 items-center bg-accent p-1.5 rounded-md shrink-0"
                >
                  {icon ? (
                    <span className="text-muted-foreground [&>svg]:w-3.5 [&>svg]:h-3.5">
                      {icon}
                    </span>
                  ) : row.original.icon ? (
                    <img
                      src={row.original.icon}
                      alt=""
                      className="w-3.5 h-3.5"
                    />
                  ) : (
                    <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                  )}
                </div>
              </CustomTooltip>
              <div className="flex flex-col min-w-0">
                <button
                  type="button"
                  // onClick={() =>
                  //   setDialog({ mode: 'members', group: row.original })
                  // }
                  className="font-medium text-sm text-mono truncate"
                  title={row.original.name}
                >
                  {row.original.name}
                </button>
                <span className="text-[11px] text-muted-foreground">
                  {row.original.asset_count ?? 0} assets
                </span>
              </div>
            </div>
          );
        },
        enableSorting: true,
        size: 260,
        meta: {
          cellClassName: '',
          skeleton: <Skeleton className="h-7" />,
        },
      },
      {
        id: 'vuln_counts.total',
        accessorFn: (row) => row.vuln_counts?.total ?? 0,
        header: ({ column }) => (
          <DataGridColumnHeader title="Total Vulns" column={column} />
        ),
        cell: ({ row }) =>
          isLoading ? (
            <Skeleton className="h-7" />
          ) : (
            <span className="font-medium text-sm">
              {row.original.vuln_counts?.total ?? 0}
            </span>
          ),
        enableSorting: true,
        size: 130,
        meta: {
          cellClassName: '',
          skeleton: <Skeleton className="h-7" />,
        },
      },
      {
        id: 'breakdown',
        header: ({ column }) => (
          <DataGridColumnHeader title="Breakdown" column={column} />
        ),
        cell: ({ row }) =>
          isLoading ? (
            <Skeleton className="h-7" />
          ) : (
            <VulnerabilitiesBadges
              vulnerabilities={
                row.original.vuln_counts ?? {
                  critical: 0,
                  high: 0,
                  medium: 0,
                  low: 0,
                  info: 0,
                }
              }
              assetName={row.original.name}
            />
          ),
        enableSorting: false,
        size: 180,
        meta: {
          cellClassName: '',
          skeleton: <Skeleton className="h-7" />,
        },
      },
      {
        id: 'remediation_progress',
        accessorFn: (row) => row.remediation_progress ?? 0,
        header: ({ column }) => (
          <DataGridColumnHeader title="Remediation Progress" column={column} />
        ),
        cell: ({ row }) =>
          isLoading ? (
            <Skeleton className="h-7" />
          ) : (
            <div className="w-[180px]">
              <RemediationProgress
                progress={row.original.remediation_progress ?? 0}
              />
            </div>
          ),
        enableSorting: true,
        size: 160,
        meta: {
          cellClassName: '',
          skeleton: <Skeleton className="h-7" />,
        },
      },
      // {
      //   id: 'actions',
      //   header: () => null,
      //   cell: ({ row }) => (
      //     <AssetGroupActions group={row.original} onAction={setDialog} />
      //   ),
      //   enableSorting: false,
      //   size: 60,
      //   meta: {
      //     cellClassName: 'text-center',
      //     skeleton: <Skeleton className="h-7 w-7 rounded-md mx-auto" />,
      //   },
      // },
    ],
    [setDialog, isLoading],
  );

  if (isError) return <ApiErrorHandler error={error} />;

  return (
    <div className="space-y-4">
      {dialog && (
        <AssetGroupDialog
          key={`${dialog.mode}-${dialog.group?._id ?? 'new'}`}
          {...dialog}
          onClose={() => setDialog(null)}
        />
      )}
      <div className="flex justify-end">
        <AssetGroupToolbar hideRefreshMetrics onCreate={() => setDialog({ mode: 'create' })} />
      </div>

      <Table
        data={groupsData?.data ?? []}
        columns={columns}
        isLoading={isLoading || isFetching}
        totalPages={groupsData?.totalPages ?? 1}
        totalCount={groupsData?.total ?? 0}
        pagination={pagination}
        setPagination={handlePaginationChange}
        sorting={sorting}
        setSorting={handleSortingChange}
        search={searchQuery}
        setSearch={handleSearchChange}
        searchPlaceholder="Search asset groups..."
        enableSorting={true}
        rightToolbar={<AssetGroupToolbar hideDefaults hideCreateGrp onCreate={() => setDialog({ mode: 'create' })} />}
      />
    </div>
  );
}
