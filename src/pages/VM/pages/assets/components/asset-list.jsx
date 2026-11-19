import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import {
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from '@/components/ui/data-grid-table';
import { Skeleton } from '@/components/ui/skeleton';
import { Profile } from '@/components/custom/profile';
import Table from '@/components/custom/table';
import useStore from '../store';
import ActionsCell from './ui/actions-cell';
import RemediationProgress from './ui/remediation-progress';
import VulnerabilitiesBadges from './ui/vulnerabilities-badges';
import { Star } from 'lucide-react';
import TableToolbarFilters from '@/components/common/table-toolbar-filters';
import { CustomTooltip } from '@/components/custom/tooltip';
import GetAssetTypeInfo from '@/components/custom/asset-icons';
const getRiskScoreVariant = (score) => {
  if (!score) return 'secondary';
  if (score >= 7) return 'destructive';
  if (score >= 4) return 'warning';
  return 'success';
};

const CertificateCell = ({ row }) => {
  const certificate = row?.original?.certificate;
  const status = certificate?.status;
  const formattedStatus = status
    ? status.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase())
    : 'Unknown';

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        {(() => {
          const { icon, label } = GetAssetTypeInfo(row.original.type);
          const important = row.original.assetId?.important;
          if (!icon && !important) return null;
          return (
            <CustomTooltip text={label}>
              <div
                className="flex items-center gap-1 bg-accent p-1.5 rounded-md shrink-0"
                data-testid="asset-type-icon"
              >
                {icon && (
                  <span className="text-muted-foreground [&>svg]:w-3.5 [&>svg]:h-3.5">
                    {icon}
                  </span>
                )}
                {important && <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />}
              </div>
            </CustomTooltip>
          );
        })()}
        <Link
          to={`/vm/vulnerabilities?filters=asset:${row.original.value}`}
          className=" font-medium hover:text-primary break-words truncate overflow-hidden whitespace-nowrap max-w-48"
          title={certificate?.subject || row.original.value}
        >
          {certificate?.subject || row.original.value}
        </Link>

        <div className="flex items-center gap-2">
          {status && (
            <Badge
              variant={
                status === 'valid'
                  ? 'success'
                  : status === 'about_to_expire'
                    ? 'warning'
                    : 'destructive'
              }
              appearance="outline"
              className="text-[10px] h-4 px-1 py-0"
            >
              {formattedStatus}
            </Badge>
          )}
        </div>
      </div>


      <span className="text-[10px] text-muted-foreground truncate" title={row.original.value}>
        {certificate?.issuer_organization && `${certificate.issuer_organization} • `}SN:{' '}
        {row.original.value}
      </span>
    </div>
  );
};

function getColumns(isLoading) {
  return [
    // {
    //   accessorKey: '_id',
    //   header: () => <DataGridTableRowSelectAll />,
    //   cell: ({ row }) => <DataGridTableRowSelect row={row} />,
    //   enableSorting: false,
    //   enableHiding: false,
    //   size: 51,
    //   meta: {
    //     cellClassName: '',
    //     skeleton: <Skeleton className="h-7" />,
    //   },
    // },
    {
      id: 'assetName',
      accessorFn: (row) => row.value || 'Unnamed Asset',
      header: ({ column }) => (
        <DataGridColumnHeader title="Asset Name" column={column} />
      ),
      cell: ({ row }) => {
        // if (row.original.type === 'certificate') {
        //   return <CertificateCell row={row} />;
        // }
        return (
          <div className="max-w-[250px]">
            <Link
              title={row.original.value}
              to={`/vm/vulnerabilities?filters=asset:${row.original.value}`}
              className="flex items-center gap-2 truncate font-medium text-sm text-mono hover:text-primary break-words whitespace-normal"
            >
              {(() => {
                const { icon, label } = GetAssetTypeInfo(row.original.type);
                const important = row.original.assetId?.important;
                if (!icon && !important) return null;
                return (
                  <CustomTooltip text={label}>
                    <div
                      data-testid="asset-type"
                      className="flex gap-1 items-center bg-accent p-1.5 rounded-md shrink-0"
                    >
                      {icon && (
                        <span className="text-muted-foreground [&>svg]:w-3.5 [&>svg]:h-3.5">
                          {icon}
                        </span>
                      )}
                      {important && (
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                      )}
                    </div>
                  </CustomTooltip>
                );
              })()}
              {row.original.value}
            </Link>
          </div>
        );
      },
      enableSorting: false,
      size: 250,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'owner',
      accessorFn: (row) => row.owner || 'Unassigned',
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
                owner?.user?.firstName + ' ' + owner?.user?.lastName ||
                owner?.user?.email?.split('@')[0]
              }
              role={owner?.user?.userRole || owner?.user?.role}
            />
          );
        }
        if (teamName) {
          return <span className="text-sm font-medium">{teamName}</span>;
        }
        if (departmentName) {
          return (
            <span className="text-sm font-medium">{departmentName}</span>
          );
        }
        return <span className="text-muted-foreground">No owner</span>;
      },
      enableSorting: false,
      size: 120,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    // {
    //   id: 'autoRiskScore',
    //   accessorFn: (row) => row.risk?.autoRiskScore?.score || 0,
    //   header: ({ column }) => (
    //     <DataGridColumnHeader title="Risk Score" column={column} />
    //   ),
    //   cell: ({ row }) => (
    //     <Badge
    //       variant={getRiskScoreVariant(
    //         row.original?.assetId?.risk?.autoRiskScore?.score,
    //       )}
    //       appearance="outline"
    //       className="font-medium"
    //     >
    //       {row.original?.assetId?.risk?.autoRiskScore?.score || 0}
    //     </Badge>
    //   ),
    //   enableSorting: true,
    //   size: 80,
    //   meta: {
    //     cellClassName: 'text-left',
    //     skeleton: <Skeleton className="h-7" />,
    //   },
    // },

    {
      id: 'TotalVulns',
      accessorFn: (row) => row.vulnerabilities?.length || 0,
      header: ({ column }) => (
        <DataGridColumnHeader title="Total Open Vulns" column={column} />
      ),
      cell: ({ row }) =>
        isLoading ? (
          <Skeleton className="h-7" />
        ) : (
          <span>{row.original?.security?.open_vulns || "-"}</span>
        ),
      enableSorting: true,
      size: 80,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },

    {
      id: 'security.vulnerability_stats.total',
      accessorFn: (row) => row.vulnerabilities?.length || 0,
      header: ({ column }) => (
        <DataGridColumnHeader title="Breakdown" column={column} />
      ),
      cell: ({ row }) =>
        isLoading ? (
          <Skeleton className="h-7" />
        ) : (
          <VulnerabilitiesBadges
            vulnerabilities={{
              low: row.original?.security?.severity_distribution?.low_open || 0,
              high: row.original?.security?.severity_distribution?.high_open || 0,
              critical: row.original?.security?.severity_distribution?.critical_open || 0,
              medium: row.original?.security?.severity_distribution?.med_open || 0,
              info: row.original?.security?.severity_distribution?.none_open || 0,
            }}
            assetName={row.original.value}
          />
        ),
      enableSorting: false,
      size: 170,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'security.remediation_progress',
      accessorFn: (row) => row.remediationProgress || 0,
      header: ({ column }) => (
        <DataGridColumnHeader title="Remediation Progress" column={column} />
      ),
      cell: ({ row }) => (
        <div className="w-[180px]">
          <RemediationProgress
            progress={Math.round(row?.original?.security?.remediation_progress || 0)}
          />
        </div>
      ),
      enableSorting: true,
      size: 130,
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
      cell: ({ row }) => <div>
        <ActionsCell row={row} />
      </div>,
      enableSorting: false,
      size: 60,
      meta: {
        cellClassName: 'text-center',
        skeleton: <Skeleton className="h-7" />,
      },
    },
  ];
}

function AssetList({ data, isLoading, isFetching }) {
  const pagination = useStore((state) => state.pagination);
  const searchQuery = useStore((state) => state.searchQuery);
  const sorting = useStore((state) => state.sorting);
  const setPagination = useStore((state) => state.setPagination);
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const setSorting = useStore((state) => state.setSorting);
  const filters = useStore((state) => state.filters);
  const setFilters = useStore((state) => state.setFilters);


  const columns = getColumns(isLoading);

  return (
    <Table
      data={data?.assets}
      columns={columns}
      isLoading={isLoading || isFetching}
      totalPages={data?.pagination?.totalPages}
      totalCount={data?.pagination?.total}
      pagination={pagination}
      setPagination={setPagination}
      sorting={sorting}
      setSorting={setSorting}
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
      enableSorting={true}
    />
  );
}

export default AssetList;
