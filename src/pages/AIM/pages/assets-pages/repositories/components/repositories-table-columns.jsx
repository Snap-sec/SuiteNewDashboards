import React from 'react';
import { Link } from 'react-router-dom';
import { Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridTableRowSelect, DataGridTableRowSelectAll } from '@/components/ui/data-grid-table';
import { Skeleton } from '@/components/ui/skeleton';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import VulnCountBadge from '@/components/custom/vuln-count-badge.jsx';
import { Profile } from '@/components/custom/profile.jsx';
import { timeAgo } from '@/lib/helpers.js';
import { DateFormatter } from '@/components/custom/date-formatter.jsx';
import AuthorityGuard from '../../../../../../components/custom/authority-guard/AuthorityGuard';

export function getRepositoriesColumns(NewUrl) {
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
                <DataGridColumnHeader title="Repository" column={column} />
            ),
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <div className="flex gap-2 items-center">
                        <Link
                            to={`/assetinventory/asset-edit/${row.original._id}?asset=${NewUrl}`}
                            className="text-secondary-foreground font-medium hover:text-primary break-words truncate overflow-hidden whitespace-nowrap"
                            title={row.original?.repository?.fullName}
                        >
                            {row.original?.repository?.fullName || row.original?.repository?.name || row.original.value}
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
                    {/* <span
                        className="text-xs text-muted-foreground truncate overflow-hidden whitespace-nowrap max-w-[200px]"
                        title={row.original?.repository?.fullName}
                    >
                        {row.original?.repository?.fullName || 'No description'}
                    </span> */}
                </div>
            ),
            enableSorting: false,
            size: 220,
            meta: {
                cellClassName: '',
                skeleton: <Skeleton className="h-7" />,
            },
        },
        {
            id: 'visibility',
            accessorFn: (row) => row.repository?.visibility,
            header: ({ column }) => (
                <DataGridColumnHeader title="Visibility" column={column} />
            ),
            cell: ({ row }) => (
                <Badge
                    variant={row.original?.repository?.isPrivate ? 'success' : 'destructive'}
                    appearance="outline"
                >
                    {row.original?.repository?.visibility === 'public' ? 'Public' : 'Private'}
                </Badge>
            ),
            enableSorting: false,
            size: 100,
            meta: {
                cellClassName: '',
                skeleton: <Skeleton className="h-7" />,
            },
        },
        {
            id: 'repository.language',
            accessorFn: (row) => row.repository?.language,
            header: ({ column }) => (
                <DataGridColumnHeader title="Language" column={column} />
            ),
            cell: ({ row }) => {
                const languages = row.original?.repository?.languages || row.original?.repository?.language;
                let langList = [];
                if (languages) {
                    if (typeof languages === 'string') {
                        langList = [languages];
                    } else {
                        langList = Object.keys(languages);
                    }
                }
                const firstLang = langList[0];
                const restLangs = langList.slice(1);
                return (
                    <div className="flex items-center gap-1">
                        {firstLang ? (
                            <Badge variant="secondary" appearance="outline">{firstLang}</Badge>
                        ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                        )}
                        {restLangs.length > 0 && (
                            <DetailedHoverPopover
                                popoverTitle="Languages"
                                buttonText={`+${restLangs.length}`}
                                popoverContent={restLangs.map((lang) => (
                                    <Badge key={lang} className="m-0.5" variant="secondary" appearance="outline">
                                        {lang}
                                    </Badge>
                                ))}
                            />
                        )}
                    </div>
                );
            },
            enableSorting: false,
            size: 120,
            meta: {
                cellClassName: '',
                skeleton: <Skeleton className="h-7" />,
            },
        },
        {
            id: 'repository.isArchived',
            accessorFn: (row) => row.repository?.isArchived,
            header: ({ column }) => (
                <DataGridColumnHeader title="Status" column={column} />
            ),
            cell: ({ row }) => (
                <Badge
                    variant={row.original?.repository?.isArchived ? 'secondary' : 'success'}
                    appearance="outline"
                >
                    {row.original?.repository?.isArchived ? 'Archived' : 'Active'}
                </Badge>
            ),
            enableSorting: false,
            size: 100,
            meta: {
                cellClassName: '',
                skeleton: <Skeleton className="h-7" />,
            },
        },
        {
            id: 'security.vulnerability_stats.total',
            accessorFn: (row) => row.security?.vulnerability_stats?.total,
            header: ({ column }) => (
                <DataGridColumnHeader title="Vulnerabilities" column={column} />
            ),
            cell: ({ row }) => (
                <div className="flex items-center gap-1.5">
                    <VulnCountBadge
                        score={row.original?.security?.vulnerability_stats?.total}
                        data={row.original?.security}
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
                        <Profile
                            email={owner?.user?.email || ''}
                            name={owner?.user?.firstName || owner?.user?.email?.split('@')[0]}
                            />
                    );
                }
                if (teamName) return <span className="text-sm font-medium">{teamName}</span>;
                if (departmentName) return <span className="text-sm font-medium">{departmentName}</span>;
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
            id: 'repository.lastPush',
            accessorFn: (row) => row.repository?.lastPush,
            header: ({ column }) => (
                <DataGridColumnHeader title="Last Push" column={column} />
            ),
            cell: ({ row }) => {
                const lastPushDate = row.original?.repository?.lastPush
                    ? new Date(row.original?.repository?.lastPush)
                    : null;
                return (
                    <div className="flex flex-col">
                        <span className="text-sm">{lastPushDate ? timeAgo(lastPushDate) : '-'}</span>
                    </div>
                );
            },
            enableSorting: true,
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
                skeleton: <Skeleton className="h-7" />,
            },
        },
    ];
}
