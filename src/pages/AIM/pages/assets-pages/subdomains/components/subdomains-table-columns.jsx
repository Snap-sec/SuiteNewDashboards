import React from 'react';
import { Link } from 'react-router-dom';
import { Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridTableRowSelect, DataGridTableRowSelectAll } from '@/components/ui/data-grid-table';
import { Skeleton } from '@/components/ui/skeleton';
import AdapterIcon from '@/components/common/profile-image';
import { DateFormatter } from '@/components/custom/date-formatter.jsx';
import { StatusCodeBadge } from '@/components/custom/status-code-badge.jsx';
import { CustomTooltip } from '@/components/custom/tooltip';
import VulnCountBadge from '@/components/custom/vuln-count-badge.jsx';
import { Profile } from '@/components/custom/profile.jsx';
import EnvironmentLabel from '@/components/custom/environment-label.jsx';
import AuthorityGuard from '../../../../../../components/custom/authority-guard/AuthorityGuard';

export function getSubdomainsColumns(NewUrl) {
    return [
        {
            accessorKey: '_id',
            accessorFn: (row) => row._id,
            header: () => <AuthorityGuard forbidRoles={['Auditor']}><DataGridTableRowSelectAll /></AuthorityGuard>,
            cell: ({ row }) => <AuthorityGuard forbidRoles={['Auditor']}><DataGridTableRowSelect row={row} /></AuthorityGuard>,
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
                    <div className="flex gap-2">
                        <Link
                            to={`/assetinventory/asset-edit/${row.original._id}?asset=${NewUrl}`}
                            className="text-secondary-foreground font-medium hover:text-primary break-words truncate overflow-hidden whitespace-nowrap max-w-40"
                        >
                            {row.original.value}
                        </Link>
                        {row?.original?.is_new && (
                            <div>
                                <Badge variant="primary" appearance="outline" size="sm">
                                    New
                                </Badge>
                            </div>
                        )}
                    </div>
                </div>
            ),
            enableSorting: false,
            size: 200,
            meta: {
                cellClassName: '',
                skeleton: <Skeleton className="h-7 w-full" />,
            },
        },
        {
            id: 'subdomain.status_code',
            accessorFn: (row) => row.status,
            header: ({ column }) => (
                <DataGridColumnHeader title="Status" column={column} />
            ),
            cell: ({ row }) => (
                <div className='w-[100px]'>
                    {row.original?.subdomain?.status_code}
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
            id: 'security.vulnerability_stats.total',
            accessorFn: (row) => row.risk?.autoRiskScore?.factors.vulnerabilityScore,
            header: ({ column }) => (
                <DataGridColumnHeader title="Vulnerabilities" column={column} />
            ),
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
                const visibleTags = tags.slice(0, 3);
                const remainingCount = tags.length - 3;
                return (
                    <div className="flex flex-wrap gap-1 max-w-[180px]">
                        {visibleTags.map((tag, idx) => {
                            const tagName = typeof tag === 'string' ? tag : (tag?.value || tag?.name || tag?.label || tag);
                            return (
                                <Badge key={idx} variant="secondary" appearance="light" size="sm" className="text-[11px] px-1.5 py-0 inline-flex items-center gap-1">
                                    <Tag className="size-3 shrink-0" />
                                    <span>{tagName}</span>
                                </Badge>
                            );
                        })}
                        {remainingCount > 0 && (
                            <Badge variant="secondary" appearance="light" size="sm" className="text-[11px] px-1.5 py-0">
                                +{remainingCount}
                            </Badge>
                        )}
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
            id: 'is_internal',
            accessorFn: (row) => row.risk?.exposure,
            header: ({ column }) => (
                <DataGridColumnHeader title="Reachability" column={column} />
            ),
            cell: ({ row }) => (
                <div className="flex items-center gap-1.5">
                    <Badge
                        variant={row?.original?.is_internal ? 'success' : 'destructive'}
                        appearance="outline"
                    >
                        {row?.original?.is_internal ? 'Internal' : 'External'}
                    </Badge>
                </div>
            ),
            enableSorting: false,
            size: 120,
            meta: {
                cellClassName: '',
                skeleton: <Skeleton className="h-7" />,
            },
        },
        {
            id: 'environment',
            accessorFn: (row) => row.environment,
            header: ({ column }) => (
                <DataGridColumnHeader title="Environment" column={column} />
            ),
            cell: ({ row }) => (
                <EnvironmentLabel environment={row?.original?.environment} />
            ),
            enableSorting: false,
            size: 120,
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
                                name={owner?.user?.firstName || owner?.user?.email?.split('@')[0]}
                            // role={owner?.user?.role}
                            />
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
                        <DateFormatter date={row?.original?.createdAt} mode="relative" />
                    </span> */}
                </div>
            ),
            enableSorting: true,
            size: 140,
            meta: {
                cellClassName: '',
                skeleton: <Skeleton className="h-7" />,
            },
        },
    ];
}
