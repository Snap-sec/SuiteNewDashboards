import React from 'react';
import { Link } from 'react-router-dom';
import { Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import {
  DataGridTableRowSelect,
  DataGridTableRowSelectAll,
} from '@/components/ui/data-grid-table';
import { Skeleton } from '@/components/ui/skeleton';
import { DateFormatter } from '@/components/custom/date-formatter.jsx';
import { Profile } from '@/components/custom/profile.jsx';
import { StatusCodeBadge } from '@/components/custom/status-code-badge.jsx';
import { CustomTooltip } from '@/components/custom/tooltip';
import VulnCountBadge from '@/components/custom/vuln-count-badge.jsx';
import AuthorityGuard from '../../../../../../components/custom/authority-guard/AuthorityGuard';

export function getApplicationsColumns(NewUrl) {
  return [
    {
      accessorKey: '_id',
      accessorFn: (row) => row._id,
      header: () => (
        <AuthorityGuard forbidRoles={['Auditor']}>
          <DataGridTableRowSelectAll />
        </AuthorityGuard>
      ),
      cell: ({ row }) => (
        <AuthorityGuard forbidRoles={['Auditor']}>
          <DataGridTableRowSelect row={row} />
        </AuthorityGuard>
      ),
      enableSorting: false,
      enableHiding: false,
      enableResizing: false,
      size: 51,
      meta: {
                cellClassName: '',
                skeleton: <Skeleton className="h-7" />,
            },
    },
    {
      id: 'assetValue',
      accessorFn: (row) => row.value,
      header: ({ column }) => (
        <DataGridColumnHeader title="Asset Value" column={column} />
      ),
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="flex flex-row gap-2 items-center">
            <Link
              to={`/assetinventory/asset-edit/${row.original._id}?asset=${NewUrl}`}
              className="text-secondary-foreground font-medium hover:text-primary break-words truncate overflow-hidden whitespace-nowrap max-w-40"
              title={row?.original?.application?.domain}
            >
              {row?.original?.application?.name || 'N/A'}
            </Link>
            {(() => {
              const createdDate = new Date(row.original.createdAt);
              const currentDate = new Date();
              const daysDifference = Math.floor(
                (currentDate - createdDate) / (1000 * 60 * 60 * 24),
              );
              return daysDifference < 5 ? (
                <div>
                  <Badge variant="primary" appearance="outline" size="sm">
                    New
                  </Badge>
                </div>
              ) : null;
            })()}
          </div>

          {/* <span
                        className="text-sm text-muted-foreground truncate overflow-hidden whitespace-nowrap w-50"
                        title={row?.original?.application?.domain}
                    >
                        {row?.original?.application?.domain}
                    </span> */}
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
      id: 'domainName',
      accessorFn: (row) => row.value,
      header: ({ column }) => (
        <DataGridColumnHeader title="Domain Name" column={column} />
      ),
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span
            className="truncate overflow-hidden whitespace-nowrap w-50"
            title={row?.original?.application?.domain}
          >
            {row?.original?.application?.domain}
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
      id: 'hosting',
      accessorFn: (row) => row.associatedAssets,
      header: ({ column }) => (
        <DataGridColumnHeader title="Hosting" column={column} />
      ),
      cell: ({ row }) => <span>{row?.original?.application?.appType}</span>,
      size: 110,
      enableSorting: false,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'http_status',
      header: ({ column }) => (
        <DataGridColumnHeader title="HTTP Response Status" column={column} />
      ),
      cell: ({ row }) => {
        const subdomains = row?.original?.associated_subdomain_items || [];
        if (subdomains.length === 0)
          return <span className="text-muted-foreground">-</span>;

        const first = subdomains[0];
        return (
          <div className="flex items-center gap-2">
            <StatusCodeBadge status={first.status_code} />
          </div>
        );
      },
      size: 150,
      enableSorting: false,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'reachability',
      header: ({ column }) => (
        <DataGridColumnHeader title="Reachability" column={column} />
      ),
      cell: ({ row }) => {
        const subdomains = row?.original?.associated_subdomain_items || [];
        let reachability = subdomains[0]?.reachability;

        // FALLBACK DUMMY DATA FOR PREVIEW (Remove once DB is synced)
        if (subdomains.length === 0) {
          const dummyReachability = [true, false, true];
          const index = typeof row.index === 'number' ? row.index : 0;
          reachability = dummyReachability[index % dummyReachability.length];
        }

        if (reachability === undefined)
          return <span className="text-muted-foreground">-</span>;

        return (
          <div className="flex items-center gap-1.5">
            <Badge
              variant={reachability ? 'success' : 'destructive'}
              appearance="outline"
            >
              {reachability ? 'Internal' : 'External'}
            </Badge>
          </div>
        );
      },
      size: 120,
      enableSorting: false,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'properties.vulnerabilityStats.total',
      accessorFn: (row) => row?.original?.security?.vulnerability_stats?.total,
      header: ({ column }) => (
        <DataGridColumnHeader title="Vuln Count" column={column} />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          <VulnCountBadge
            score={row?.original?.security?.vulnerability_stats?.total}
            data={row?.original?.security}
          />
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
      id: 'tags',
      accessorFn: (row) => row.tags,
      header: ({ column }) => (
        <DataGridColumnHeader title="Tags" column={column} />
      ),
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
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'owner',
      accessorFn: (row) => row.owner?.name,
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
            <div className="max-w-full overflow-hidden">
              <Profile
                email={owner?.user?.email || ''}
                name={
                  owner?.user?.firstName ||
                  owner?.user?.email?.split('@')[0]
                }
                // role={owner?.user?.role}
              />
            </div>
          );
        }
        if (teamName)
          return <span className="text-sm font-medium">{teamName}</span>;
        if (departmentName)
          return <span className="text-sm font-medium">{departmentName}</span>;
        return <span className="text-muted-foreground">No owner</span>;
      },
      enableSorting: false,
      size: 200,
      meta: {
                cellClassName: '',
                skeleton: <Skeleton className="h-7" />,
            },
    },
    {
      id: 'total_associated_assets',
      accessorFn: (row) => row.total_associated_assets,
      header: ({ column }) => (
        <DataGridColumnHeader title="Associations" column={column} />
      ),
      cell: ({ row }) => (
        <span>
          {row?.original?.total_associated_assets}
          {row?.original?.total_associated_assets === 1 ? ' Asset' : ' Assets'}
        </span>
      ),
      size: 110,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'last_detected',
      accessorFn: (row) => row.last_detected,
      header: ({ column }) => (
        <DataGridColumnHeader title="Detected On" column={column} />
      ),
      cell: ({ row }) => (
        <div className="flex flex-col gap-1.5">
          <span className="text-[12px] whitespace-nowrap">
            <DateFormatter date={row.original.last_detected} mode="relative" />
          </span>
          {/* <span className="text-[10px] whitespace-nowrap text-muted-foreground">
                        First Detected{' '}
                        <DateFormatter date={row.original.createdAt} mode="relative" />
                    </span> */}
                </div>
            ),
            enableSorting: true,
            size: 120,
            meta: {
                cellClassName: '',
                skeleton: <Skeleton className="h-7"  />,
            },
        },
    ];
}
