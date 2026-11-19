import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridTableRowSelect, DataGridTableRowSelectAll } from '@/components/ui/data-grid-table';
import { Skeleton } from '@/components/ui/skeleton';
import AdapterIcon from '@/components/common/profile-image';
import GetAssetTypeInfo from '@/components/custom/asset-icons';
import { DateFormatter } from '@/components/custom/date-formatter.jsx';
import Table from '@/components/custom/table';
import { CustomTooltip } from '@/components/custom/tooltip';
import VulnCountBadge from '@/components/custom/vuln-count-badge.jsx';
import { Profile } from '@/components/custom/profile.jsx';
import {
  useDecommissionAimGlobalAssetMutation,
  useReactivateAimAssetMutation,
} from '@/services/asset-inventory/assets/assetsApi';
import ReasonModal from '../../asset-edit/components/reason-modal.jsx';
import { formatDate } from '@/lib/helpers.js';
import TableToolbarFilters from '@/components/common/table-toolbar-filters.jsx';
import AuthorityGuard from '../../../../../../components/custom/authority-guard/AuthorityGuard.jsx';
import { useAuth } from '@/auth/context/auth-context';


function getAdvancedSearchColumns(handleDecommission, isDecommissioning, handleReactivate, isReactivating, isAuditor = false) {
  return [
    ...(!isAuditor
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
            meta: { cellClassName: '' },
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
            <Badge variant="secondary" className={"capitalize"} title={GetAssetTypeInfo(row?.original?.type)?.label}>
              {GetAssetTypeInfo(row?.original?.type)?.icon}
            </Badge>
            <Link
              to={`/assetinventory/asset-edit/${row.original._id}`}
              className="text-secondary-foreground font-medium hover:text-primary break-words truncate overflow-hidden whitespace-nowrap"
              title={row?.original?.value}
            >
              {row?.original?.value}
            </Link>
            {row.original.is_new && (
              <Badge variant="primary" appearance="outline" size="sm">New</Badge>
            )}
          </div>
          <span className="text-sm text-muted-foreground truncate w-50" title={row.original.name}>
            {row.original.name}
          </span>
        </div>
      ),
      enableSorting: false,
      size: 200,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'type',
      accessorFn: (row) => row.type,
      header: ({ column }) => <DataGridColumnHeader title="Type" column={column} />,
      cell: ({ row }) => (
        <Badge variant="secondary" className="capitalize inline-flex items-center gap-1.5 whitespace-nowrap">
          {GetAssetTypeInfo(row?.original?.type)?.icon}
          {GetAssetTypeInfo(row?.original?.type)?.label}
        </Badge>
      ),
      size: 130,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'source',
      header: ({ column }) => <DataGridColumnHeader title="Source" column={column} />,
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          {row.original?.adapters?.map((adapter, idx) => (
            <CustomTooltip key={idx} text={adapter.title || 'Adapter'}>
              <div>
                <AdapterIcon src={adapter.logo} size={24} variant="logo" />
              </div>
            </CustomTooltip>
          ))}
        </div>
      ),
      size: 100,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'vulnerabilities',
      header: ({ column }) => <DataGridColumnHeader title="Active Vulns" column={column} />,
      cell: ({ row }) => (
        <VulnCountBadge
          score={row.original.security?.vulnerability_stats?.total}
          data={row.original.security}
        />
      ),
      size: 120,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'owner',
      header: ({ column }) => <DataGridColumnHeader title="Owner" column={column} />,
      cell: ({ row }) => {
        const owner = row?.original?.owner;
        if (owner?.user?.email) {
          return (
            <Profile
              email={owner.user.email}
              name={`${owner.user.firstName}`}
              // role={owner.user.role}
            />
          );
        }
        return <span className="text-muted-foreground text-xs">No owner</span>;
      },
      size: 200,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'detected',
      header: ({ column }) => <DataGridColumnHeader title="Last Detected" column={column} />,
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <span className="text-[12px] whitespace-nowrap">
            <DateFormatter date={row.original.last_detected} mode="relative" />
          </span>
          {/* <span className="text-[10px] text-muted-foreground">
            {formatDate(new Date(row.original.createdAt))}
          </span> */}
        </div>
      ),
      size: 110,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'actions',
      header: () => null,
      cell: ({ row }) => (
        <AuthorityGuard forbidRoles={['Auditor']}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <ReasonModal
              onDecommission={(reason) => handleDecommission(row.original._id, reason)}
              trigger={<DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={(e) => e.preventDefault()}>Decommission</DropdownMenuItem>}
            />
          </DropdownMenuContent>
        </DropdownMenu>
        </AuthorityGuard>
      ),
      size: 50,
    }
  ];
}


const AdvancedSearchList = ({
  data,
  isLoading,
  tableDetails,
  filters,
  setFilters,
  supportedFilters,
  isFetching
}) => {
  const [decommission] = useDecommissionAimGlobalAssetMutation();
  const [reactivate] = useReactivateAimAssetMutation();

  const {
    pagination,
    searchQuery,
    sorting,
    setPagination,
    setSearchQuery,
    setSorting,
    rowSelection,
    setRowSelection
  } = tableDetails;

  const handleDecommission = (assetId, reason) => {
    toast.promise(decommission({ assetId, reason: reason }).unwrap(), {
      loading: 'Decommissioning asset...',
      success: 'Asset decommissioned!',
      error: 'Failed to decommission.',
    });
  };

  const handleReactivate = (assetId, reason) => {
    toast.promise(reactivate({ assetId, reason: reason }).unwrap(), {
      loading: 'Reactivating asset...',
      success: 'Asset reactivated!',
      error: 'Failed to reactivate.',
    });
  };

  const { user } = useAuth();
  const isAuditor = user?.role === 'Auditor';

  const columns = React.useMemo(
    () => getAdvancedSearchColumns(handleDecommission, false, handleReactivate, false, isAuditor),
    [isAuditor]
  );

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
      <Table
        data={data?.assets || []}
        columns={columns}
        enableSorting={true}
        isLoading={isLoading || isFetching}
        totalPages={data?.pagination?.totalPages}
        totalCount={data?.pagination?.total}
        pagination={pagination}
        setPagination={setPagination}
        sorting={sorting}
        setSorting={setSorting}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        // search={searchQuery}
        // setSearch={setSearchQuery}
        manualPagination={true}
        enableSearch={!filters} // Disable if using LabeledSearch
        cardHeading={false}
        toolbar={
          supportedFilters && (
            <TableToolbarFilters
              supportedFilters={supportedFilters}
              filters={filters}
              setFilters={setFilters}
              isLoadingFilters={isLoading}
            />
          )
        }
      />
    </div>
  );
};

export default AdvancedSearchList;
