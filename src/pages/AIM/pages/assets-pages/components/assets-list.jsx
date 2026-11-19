import React from 'react';
import { Archive, ArchiveRestore, MoreHorizontal, Tag } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useDecommissionAimGlobalAssetMutation, useAimStageForDecommissionMutation, useUpdateAimAssetMutation } from '@/services/asset-inventory/assets/assetsApi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridTableRowSelect, DataGridTableRowSelectAll } from '@/components/ui/data-grid-table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import AdapterIcon from '@/components/common/profile-image';
import GetAssetTypeInfo from '@/components/custom/asset-icons';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { DateFormatter } from '@/components/custom/date-formatter.jsx';
import Table from '@/components/custom/table';
import EmptyScreen from '../assets-empty-screen';
import TableToolbarFilters from '../../../../../components/common/table-toolbar-filters.jsx';
import AuthorityGuard from '../../../../../components/custom/authority-guard/AuthorityGuard.jsx';
import { Profile } from '../../../../../components/custom/profile.jsx';
import { CustomTooltip } from '../../../../../components/custom/tooltip';
import VulnCountBadge from '../../../../../components/custom/vuln-count-badge.jsx';
import { formatDate } from '../../../../../lib/helpers.js';
import { useAuth } from '@/auth/context/auth-context';
import { getApisColumns } from '../apis/components/apis-table-columns.jsx';
import { getApplicationsColumns } from '../applications/components/applications-table-columns.jsx';
import ReasonModal from '../asset-edit/components/reason-modal.jsx';
import { getCertificatesColumns } from '../certificates/components/certificates-table-columns.jsx';
import { getIpsColumns } from '../ip-addresses/components/ips-table-columns.jsx';
import { getObjectStoragesColumns } from '../object-storages/components/object-storages-table-columns.jsx';
import { getRegistriesColumns } from '../registries/components/registries-table-columns.jsx';
import { getRepositoriesColumns } from '../repositories/components/repositories-table-columns.jsx';
import { getServersColumns } from '../servers/components/servers-table-columns.jsx';
// Per-asset-type column definitions
import { getSubdomainsColumns } from '../subdomains/components/subdomains-table-columns.jsx';
import { getWorkstationsColumns } from '../workstations/components/workstations-table-columns.jsx';


/** Returns the default/fallback columns used for generic pages
 *  (decomissioned, staged, advance-search, employees, workstations, etc.) */
function getDefaultColumns(NewUrl, decommissionFn, isDecommissioning, restoreFn, isRestoring, isAuditor = false) {
  const pathname = window.location.pathname;
  const isStagedPage = ['/caim/assets/staged', '/assetinventory/assets/staged'].includes(pathname);
  const isDecommissionedPage = pathname === '/assetinventory/assets/decomissioned';
  const isServersPage = pathname.includes('/servers');

  return [
    ...(pathname === '/assetinventory/advance-search'
      ? [
        {
          accessorKey: '_id',
          accessorFn: (row) => row._id,
          header: () => <DataGridTableRowSelectAll />,
          cell: ({ row }) => <DataGridTableRowSelect row={row} />,
          enableSorting: false,
          enableHiding: false,
          enableResizing: false,
          size: 51,
          meta: {
            cellClassName: '',
            skeleton: <Skeleton className="h-7" />,
          },
        },
      ]
      : []),
    {
      id: 'assetValue',
      accessorFn: (row) => row.value,
      header: ({ column }) => <DataGridColumnHeader title="Asset" column={column} />,
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="flex flex-row gap-2">
            {!isServersPage && (
              <Badge variant="secondary" className={"capitalize"} title={GetAssetTypeInfo(row?.original?.type)?.label}>
                {GetAssetTypeInfo(row?.original?.type)?.icon}
                {/* {GetAssetTypeInfo(row?.original?.type)?.label} */}
              </Badge>
            )}
            <Link
              to={`/assetinventory/asset-edit/${row.original._id}?asset=${NewUrl}`}
              className="text-secondary-foreground font-medium hover:text-primary break-words truncate overflow-hidden whitespace-nowrap"
              title={row?.original?.value}
            >
              {row?.original?.value}
            </Link>
            {(() => {
              const createdDate = new Date(row.original.createdAt);
              const currentDate = new Date();
              const daysDifference = Math.floor((currentDate - createdDate) / (1000 * 60 * 60 * 24));
              return daysDifference < 5 ? (
                <div>
                  <Badge variant="primary" appearance="outline" size="sm">
                    New
                  </Badge>
                </div>
              ) : null;
            })()}
          </div>
          <span
            className="text-sm text-muted-foreground truncate overflow-hidden whitespace-nowrap w-50"
            title={row.original.name}
          >
            {row.original.name}
          </span>
          {/* {row.original.type === 'server' && row.original.server?.public_ip?.length > 0 && (
            <span
              className="text-xs text-muted-foreground truncate overflow-hidden whitespace-nowrap w-50"
            >
              {row.original.server.public_ip}
            </span>
          )} */}
          {pathname === '/assetinventory/assets/employees' && row.original?.employee?.name && (
            <span
              className="text-xs text-muted-foreground truncate overflow-hidden whitespace-nowrap w-50"
              title={row.original?.employee?.name}
            >
              {row.original?.employee?.name}
            </span>
          )}
        </div>
      ),
      enableSorting: false,
      size: 170,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },

    ...(!(['/assetinventory/assets/decomissioned', '/assetinventory/assets/staged', '/caim/assets/staged'].includes(pathname))
      ? [
        {
          id: 'source',
          accessorFn: (row) => row.adapters?.[0]?.adapterName,
          header: ({ column }) => <DataGridColumnHeader title="Source" column={column} />,
          cell: ({ row }) => (
            <div className="flex items-center gap-1">
              {row.original?.adapters?.length > 0
                ? row.original.adapters.map((adapter, idx) => (
                  <CustomTooltip
                    key={idx}
                    text={adapter.name || adapter.adapterName || adapter.title || 'Adapter'}
                  >
                    <div>
                      <AdapterIcon src={adapter.logo} size={24} variant="logo" />
                    </div>
                  </CustomTooltip>
                ))
                : '-'}
            </div>
          ),
          enableSorting: false,
          size: 70,
          meta: {
            cellClassName: '',
            skeleton: <Skeleton className="h-7" />,
          },
        },
      ]
      : []),
    {
      id: 'properties.vulnerabilityStats.total',
      accessorFn: (row) => row.risk?.autoRiskScore?.factors.vulnerabilityScore,
      header: ({ column }) => <DataGridColumnHeader title="Active Vulns" column={column} />,
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <VulnCountBadge
            score={row.original.security?.vulnerability_stats?.total}
            data={row.original.security}
          />
        </div>
      ),
      enableSorting: true,
      size: 120,
      meta: { cellClassName: '', skeleton: <Skeleton className="h-7" /> },
    },
    {
      id: 'tags',
      accessorFn: (row) => row.tags,
      header: ({ column }) => <DataGridColumnHeader title="Tags" column={column} />,
      cell: ({ row }) => {
        const tags = row.original?.tags;
        if (!tags || !Array.isArray(tags) || tags.length === 0) {
          return <span className="text-muted-foreground">-</span>;
        }
        return (
          <div className="flex flex-wrap gap-1 max-w-[180px]">
            {tags.map((tag, idx) => {
              const tagName = typeof tag === 'string' ? tag : (tag?.value || tag?.name || tag?.label || tag);
              return (
                <Badge key={idx} variant="secondary" appearance="light" size="sm" className="text-[11px] px-1.5 py-0 inline-flex items-center gap-1">
                  <Tag className="size-3 shrink-0" />
                  <span>{tagName}</span>
                </Badge>
              );
            })}
          </div>
        );
      },
      enableSorting: false,
      size: 140,
      meta: { cellClassName: '', skeleton: <Skeleton className="h-7" /> },
    },
    {
      id: 'owner',
      accessorFn: (row) => row.owner?.name,
      header: ({ column }) => <DataGridColumnHeader title="Owner" column={column} />,
      cell: ({ row }) => {
        const owner = row?.original?.owner;
        const userName = owner?.user?.email;
        const teamName = owner?.team?.name;
        const departmentName = owner?.department?.name;
        if (userName) {
          return (
            <div className="max-w-full overflow-hidden">
              <Profile
                email={owner?.user?.email || ''}
                name={owner?.user?.firstName || owner?.user?.email?.split('@')[0]}
                role={owner?.user?.role} />
            </div>
          );
        }
        if (teamName) return <span className="text-sm font-medium">{teamName}</span>;
        if (departmentName) return <span className="text-sm font-medium">{departmentName}</span>;
        return <span className="text-muted-foreground">No owner</span>;
      },
      enableSorting: false,
      size: 180,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    ...((isStagedPage || isDecommissionedPage)
      ? [
        {
          id: 'staged_by',
          header: ({ column }) => <DataGridColumnHeader title="Staged By" column={column} />,
          cell: ({ row }) => {
            const user = row.original.staged_by;
            if (!user) return <span className="text-muted-foreground">-</span>;
            return (
              <div className="max-w-full overflow-hidden">
                <Profile
                  email={user.email || ''}
                  name={user.name?.split(' ')[0]}
                  role={user.role}
                />
              </div>
            );
          },
          size: 180,
          meta: {
            cellClassName: '',
            skeleton: <Skeleton className="h-7" />,
          },
        },
        ...(isDecommissionedPage
          ? [
            {
              id: 'decommissioned_by',
              header: ({ column }) => <DataGridColumnHeader title="Decommissioned By" column={column} />,
              cell: ({ row }) => {
                const user = row.original.decommissioned_by;
                if (!user) return <span className="text-muted-foreground">-</span>;
                return (
                  <div className="max-w-full overflow-hidden">
                    <Profile
                      email={user.email || ''}
                      name={user.name || user.email?.split('@')[0]}
                      role={user.role}
                    />
                  </div>
                );
              },
              size: 180,
              meta: {
                cellClassName: '',
                skeleton: <Skeleton className="h-7" />,
              },
            },
          ]
          : []),
      ]
      : []),
    ...(!(['/assetinventory/assets/decomissioned', '/assetinventory/assets/staged', '/caim/assets/staged'].includes(pathname))
      ? [
        // {
        //   id: 'businessUnits',
        //   accessorFn: (row) => row.businessUnits,
        //   header: ({ column }) => <DataGridColumnHeader title="Business Unit" column={column} />,
        //   cell: ({ row }) => {
        //     const bus = row?.original?.businessUnits;
        //     if (!bus || bus.length === 0) return <span className="text-muted-foreground">None</span>;
        //     return (
        //       <div className="flex flex-col gap-0.5">
        //         {bus.map((bu, i) => (
        //           <span key={i} className="text-xs font-medium">{bu.name}</span>
        //         ))}
        //       </div>
        //     );
        //   },
        //   enableSorting: false,
        //   size: 150,
        //   meta: { cellClassName: '', skeleton: <Skeleton className="h-7" /> },
        // },
        {
          id: 'total_associated_assets',
          accessorFn: (row) => row.total_associated_assets,
          header: ({ column }) => <DataGridColumnHeader title="Associations" column={column} />,
          cell: ({ row }) => (
            <span>
              {row?.original?.total_associated_assets}
              {row?.original?.total_associated_assets === 1 ? ' Asset' : ' Assets'}
            </span>
          ),
          size: 110,
          meta: { cellClassName: '', skeleton: <Skeleton className="h-7" /> },
        },
      ]
      : []),
    ...(['/caim/assets/staged', '/assetinventory/assets/staged', '/assetinventory/assets/decomissioned'].includes(pathname)
      ? [
        {
          id: 'reason',
          accessorFn: (row) => row.reason,
          header: ({ column }) => <DataGridColumnHeader title="Reason" column={column} />,
          cell: ({ row }) => {
            const reason = row?.original?.reason;
            return reason ? (
              <div className="truncate text-sm" title={reason}>
                {reason}
              </div>
            ) : (
              <span className="text-muted-foreground text-sm">-</span>
            );
          },
          enableSorting: false,
          size: 180,
          meta: { cellClassName: '', skeleton: <Skeleton className="h-7" /> },
        },
      ]
      : []),
    ...(isStagedPage
      ? [
        {
          id: 'approvals',
          header: ({ column }) => <DataGridColumnHeader title="Approvals" column={column} />,
          cell: ({ row }) => {
            const stats = row.original.approval_stats;
            if (!stats || stats.total === 0) return <span className="text-muted-foreground">-</span>;
            return (
              <Badge variant="secondary" className="font-mono">
                {stats.accepted}/{stats.total}
              </Badge>
            );
          },
          size: 100,
          meta: { cellClassName: '', skeleton: <Skeleton className="h-7" /> },
        },
      ]
      : []),
    {
      id: 'last_detected',
      accessorFn: (row) => row.last_detected,
      header: ({ column }) => {
        const isStaged = ['/caim/assets/staged', '/assetinventory/assets/staged'].includes(pathname);
        const title = isStaged ? 'Staged At' : isDecommissionedPage ? 'Decommissioned On' : 'Detected On';
        return <DataGridColumnHeader title={title} column={column} />;
      },
      cell: ({ row }) => {
        const isStaged = ['/caim/assets/staged', '/assetinventory/assets/staged'].includes(pathname);
        const rawDate = isStaged
          ? row.original.staged_at
          : isDecommissionedPage
            ? row.original.decommissioned_at
            : row.original.last_detected;
        const date = rawDate ? new Date(rawDate) : null;
        if (isStaged || isDecommissionedPage) {
          return (
            <div className="flex flex-col gap-2">
              <span className="text-[12px]">
                {formatDate(date)}
              </span>
            </div>
          );
        }
        return (
          <div className="flex flex-col gap-1.5">
            <span className="text-[12px] whitespace-nowrap">
              Last Detected <DateFormatter date={row.original.last_detected} mode="relative" />
            </span>
            <span className="text-[10px] whitespace-nowrap text-muted-foreground">
              First Detected <DateFormatter date={row?.original?.createdAt} mode="relative" />
            </span>
          </div>
        );
      },
      enableSorting: true,
      size: 140,
      meta: { cellClassName: '', skeleton: <Skeleton className="h-7" /> },
    },
    ...(isStagedPage && !isAuditor
      ? [
        {
          id: 'Action',
          header: ({ column }) => <DataGridColumnHeader title="" column={column} />,
          cell: ({ row }) => (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem asChild>
                  <ButtonWithConfirm
                    disabled={isRestoring}
                    variant="ghost"
                    confirm={true}
                    onConfirm={() => restoreFn(row.original._id, "Asset restored to active state")}
                    confirmTitle="Restore Asset"
                    confirmVariant="info"
                    dialog="Are you sure you want to restore this asset to active state?"
                    className="w-full justify-start !font-normal !hover:bg-transparent cursor-pointer !text-inherit px-2 py-1.5 text-sm h-8"
                  >
                    Restore
                  </ButtonWithConfirm>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to={`/assetinventory/asset-edit/${row.original._id}?tab=approvals`}
                    className="cursor-pointer"
                  >
                    Approvals
                  </Link>
                </DropdownMenuItem>

              </DropdownMenuContent>
            </DropdownMenu>
          ),
          enableSorting: false,
          size: 70,
          meta: {
            cellClassName: '',
            skeleton: <Skeleton className="h-7" />,
          },
        },
      ]
      : []),
    ...(isDecommissionedPage && !isAuditor
      ? [
        {
          id: 'ReactivateAction',
          header: ({ column }) => <DataGridColumnHeader title="" column={column} />,
          cell: ({ row }) => (
            <AuthorityGuard forbidRoles={['Auditor']}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                  <ReasonModal
                    onDecommission={(reason) => restoreFn(row.original._id, reason)}
                    title="Restore Asset"
                    description="Please provide a reason for restoring this asset"
                    trigger={
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="cursor-pointer"
                        disabled={isRestoring}
                      >
                        Restore
                      </DropdownMenuItem>
                    }
                  />
                </DropdownMenuContent>
              </DropdownMenu>
            </AuthorityGuard>
          ),
          enableSorting: false,
          size: 70,
          meta: {
            cellClassName: '',
            skeleton: <Skeleton className="h-7" />,
          },
        },
      ]
      : []),
  ];
}

/** Selects the correct column set based on the current URL pathname. */
function getColumns(NewUrl, decommissionFn, isDecommissioning, restoreFn, isRestoring, isAuditor = false) {
  const pathname = window.location.pathname;

  if (pathname === '/assetinventory/assets/subdomains') return getSubdomainsColumns(NewUrl);
  if (pathname === '/assetinventory/assets/apis') return getApisColumns(NewUrl);
  if (pathname === '/assetinventory/assets/ips') return getIpsColumns(NewUrl);
  if (pathname === '/assetinventory/assets/repositories') return getRepositoriesColumns(NewUrl);
  if (pathname === '/assetinventory/assets/applications') return getApplicationsColumns(NewUrl);
  if (pathname === '/assetinventory/assets/certificates') return getCertificatesColumns(NewUrl);
  if (pathname === '/assetinventory/assets/object-storage') return getObjectStoragesColumns(NewUrl);
  if (pathname === '/assetinventory/assets/registries') return getRegistriesColumns(NewUrl);
  if (pathname === '/assetinventory/assets/workstation') return getWorkstationsColumns(NewUrl);
  if (['/caim/assets/servers', '/assetinventory/assets/servers'].includes(pathname)) return getServersColumns(NewUrl);

  // Fallback: generic columns for decommissioned, staged, advance-search, employees, workstations, etc.
  return getDefaultColumns(NewUrl, decommissionFn, isDecommissioning, restoreFn, isRestoring, isAuditor);
}

const AssetsList = ({
  assetsData,
  assetsLoading,
  assetsFetching,
  tableDetails,
  handleLabels,
  handleSearch,
  filters,
  setFilters,
}) => {
  const { user } = useAuth();
  const isAuditor = user?.role === 'Auditor';

  const [stageForDecommission, { isLoading: isStaging }] = useAimStageForDecommissionMutation();
  const [decommissionGlobalAsset, { isLoading: isDecommissioning }] = useDecommissionAimGlobalAssetMutation();
  const [updateAimAsset, { isLoading: isRestoring }] = useUpdateAimAssetMutation();

  const { pagination, searchQuery, sorting, setPagination, setSearchQuery, setSorting, rowSelection, setRowSelection } =
    tableDetails;

  const location = useLocation();
  const NewUrl = location.pathname.split('/').pop();

  // Clear row selection on route change
  React.useEffect(() => {
    setRowSelection({});
  }, [location.pathname, setRowSelection]);



  const handleDecommission = (assetId, reason) => {
    toast.promise(decommissionGlobalAsset({ assetId, reason: reason }).unwrap(), {
      loading: 'Decommissioning asset...',
      success: 'Asset decommissioned successfully.',
      error: (err) => err?.data?.message || 'Failed to decommission asset.',
    });
  };

  const handleRestore = (assetId, reason = '') => {
    toast.promise(updateAimAsset({ id: assetId, body: { state: 'active', reason: reason } }).unwrap(), {
      loading: 'Restoring asset...',
      success: 'Asset restored successfully.',
      error: (err) => err?.data?.message || 'Failed to restore asset.',
    });
  };

  const columns = getColumns(NewUrl, handleDecommission, isDecommissioning, handleRestore, isRestoring, isAuditor);
  
  const hasSeenAssets = React.useRef(false);
  if (assetsData?.pagination?.total > 0) {
    hasSeenAssets.current = true;
  }

  const hasActiveFilters = Boolean(searchQuery) || (filters && Object.keys(filters).length > 0);

  if (!assetsLoading && !assetsFetching && !assetsData?.pagination?.total && !hasActiveFilters && !hasSeenAssets.current) {
    return (
      <EmptyScreen
        title={'No assets have been detected so far.'}
        subTitle={'Please connect the adapter to begin populating your inventory.'}
      />
    );
  }

  return (
    <div>
      <Table
        data={assetsData?.assets || []}
        columns={columns}
        enableSorting={true}
        isLoading={assetsLoading || assetsFetching}
        totalPages={assetsData?.pagination?.totalPages}
        pagination={pagination}
        setPagination={setPagination}
        sorting={sorting}
        totalCount={assetsData?.pagination?.total}
        setSorting={setSorting}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        search={searchQuery}
        setSearch={setSearchQuery}
        toolbar={
          window.location.pathname !== '/assetinventory/advance-search' && (
            <TableToolbarFilters
              supportedFilters={assetsData?.advanced_filters}
              filters={filters}
              setFilters={setFilters}
              isLoadingFilters={assetsLoading}
            />
          )
        }
        manualPagination={true}
        grid
        enableSearch={
          window.location.pathname === '/assetinventory/advance-search'
            ? false
            : true
        }
      />
    </div>
  );
};

export default AssetsList;