import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import useDebounce from '@/hooks/use-debounce';
import { useGetVmVulnsQuery } from '@/services/vm/vulnerabilityApi';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import { DateFormatter } from '@/components/custom/date-formatter';
import SeverityLabel from '@/components/custom/severity-label';
import { StateLabels } from '@/components/custom/state-labels';
import Table from '@/components/custom/table';
import { Profile } from '../../../../../../components/custom/profile';
import GetAssetTypeInfo from '@/components/custom/asset-icons';
import { CustomTooltip } from '@/components/custom/tooltip';


export default function VulnsTab({ campaignId }) {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading, isFetching } =
    useGetVmVulnsQuery(
      {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: debouncedSearch || undefined,
        remediation_campaign_id: campaignId,
      },
      {
        skip: !campaignId,
      }
    );

  useEffect(() => {
    setPagination((p) => ({ ...p, pageIndex: 0 }));
  }, [debouncedSearch]);

  const vulns = data?.userVulns || data?.data?.userVulns || data?.items || data?.data?.items || data?.data || [];
  const totalCount = data?.totalItems || data?.data?.totalItems || data?.total || data?.data?.total || data?.count || data?.data?.count || 0;
  const totalPages = data?.totalPages || data?.data?.totalPages || 0;

  const columns = useMemo(
    () => [
      {
        id: 'title',
        header: ({ column }) => (
          <DataGridColumnHeader title="Title" column={column} />
        ),
        accessorFn: (row) => row.cve || row.title,
        cell: ({ row }) => {
          return (
            <Link
              to={`/vm/vulnerability-report?id=${row?.original?._id}&assessmentId=${row?.original?.assessmentId?._id || row?.original?.assessmentId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="leading-none font-medium text-sm text-mono hover:text-primary"
            >
              <div className="flex flex-col gap-1 lg:gap-2.5">
                <div className="flex items-center gap-1">
                  <p>
                    {row.original.title.length > 50
                      ? `${row.original.title.substring(0, 50)}...`
                      : row.original.title}
                  </p>
                </div>
              </div>
            </Link>
          );
        },
        meta: {
          cellClassName: 'max-w-[400px]',
          skeleton: <Skeleton className="h-14 w-full" />,
        },
      },
      {
        id: 'assetName',
        header: ({ column }) => (
          <DataGridColumnHeader title="Asset Name" column={column} />
        ),
        accessorFn: (row) => {
          const firstAsset = Array.isArray(row.affectedAssets)
            ? row.affectedAssets[0]
            : row.affectedAssets;
          return (
            firstAsset?.assetName || firstAsset?.value || firstAsset?.name || ''
          );
        },
        cell: ({ row }) => {
          const firstAsset = Array.isArray(row.original?.affectedAssets)
            ? row.original.affectedAssets[0]
            : row.original?.affectedAssets;
          const assetName =
            firstAsset?.assetName || firstAsset?.value || firstAsset?.name;
          const assetType = firstAsset?.type;

          if (!assetName) {
            return (
              <span className="text-muted-foreground text-sm font-medium pl-1">
                -
              </span>
            );
          }

          const { icon, label } = GetAssetTypeInfo(assetType);

          return (
            <div className="flex items-center gap-2 truncate max-w-[250px]">
              {icon && (
                <CustomTooltip text={label || assetType}>
                  <div
                    data-testid="asset-type"
                    className="flex gap-1 items-center bg-accent p-1.5 rounded-md shrink-0"
                  >
                    <span className="text-muted-foreground [&>svg]:w-3.5 [&>svg]:h-3.5">
                      {icon}
                    </span>
                  </div>
                </CustomTooltip>
              )}
              <span className="truncate font-medium text-sm text-mono">
                {assetName}
              </span>
            </div>
          );
        },
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
        cell: ({ row }) => {
          const ownerName = row.original.assigneeDetails?.firstName
            ? `${row.original.assigneeDetails?.firstName}`
            : row.original?.assignee?.name;

          if (ownerName) {
            return (
              <Profile
                name={ownerName}
                // role={row.original.assigneeDetails?.role || ' '}
                email={
                  row.original?.assigneeDetails?.email ||
                  row.original?.assignee?.email
                }
              />
            );
          }

          return (
            <span className="text-muted-foreground text-sm font-medium pl-1">
              No Owner
            </span>
          );
        },

        enableSorting: false,
        size: 60,
        meta: {
          cellClassName: '',
          skeleton: <Skeleton className="h-7" />,
        },
      },
      {
        id: 'severity',
        header: ({ column }) => (
          <DataGridColumnHeader title="Severity" column={column} />
        ),
        accessorFn: (row) => row.severity,
        cell: ({ row }) => {
          const rawSeverity =
            row.original.severity || row.original.cvssRating || 'Low';
          const severity =
            rawSeverity.charAt(0).toUpperCase() +
            rawSeverity.slice(1).toLowerCase();
          return <SeverityLabel severity={severity} />;
        },
        size: 30,
        meta: {
          cellClassName: '',
          skeleton: <Skeleton className="h-7" />,
        },
      },
      {
        id: 'state',
        header: ({ column }) => (
          <DataGridColumnHeader title="State" column={column} />
        ),
        accessorFn: (row) => row.state,
        cell: ({ row }) => <StateLabels state={row.original.state} />,
        size:30,
        meta: {
          cellClassName: '',
          skeleton: <Skeleton className="h-7" />,
        },
      },
      // {
      //   id: 'vulnerableComponent',
      //   header: ({ column }) => (
      //     <DataGridColumnHeader title="Vulnerable Component" column={column} />
      //   ),
      //   accessorFn: (row) => row.vulnerableComponent || '-',
      //   cell: ({ row }) => (
      //     <span>
      //       {row?.original?.vulnerableComponent?.name +
      //         ' ' +
      //         row?.original?.vulnerableComponent?.value || '-'}
      //     </span>
      //   ),
      //   size: 60,
      //   meta: {
      //     cellClassName: '',
      //     skeleton: <Skeleton className="h-7" />,
      //   },
      // },
    ],
    [],
  );

  return (
    <Table
      data={vulns}
      columns={columns || []}
      search={search}
      setSearch={setSearch}
      manualPagination={true}
      manualSorting={false}
      showPagination={true}
      cardHeading={true}
      isLoading={isLoading || isFetching}
      pagination={pagination}
      setPagination={setPagination}
      totalCount={totalCount}
      totalPages={totalPages}
      grid
    />
  );
}