import React from 'react';
import { Link } from 'react-router-dom';
import { Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridTableRowSelect, DataGridTableRowSelectAll } from '@/components/ui/data-grid-table';
import { Skeleton } from '@/components/ui/skeleton';
import { DateFormatter } from '@/components/custom/date-formatter.jsx';
import { Profile } from '@/components/custom/profile.jsx';
import AuthorityGuard from '../../../../../../components/custom/authority-guard/AuthorityGuard';

export function getCertificatesColumns(NewUrl) {
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
                skeleton: <Skeleton className="h-7 w-full" />,
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
                            {row.original.certificate?.common_name || row.original.value}
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
            id: 'status',
            accessorFn: (row) => row.value,
            header: ({ column }) => (
                <DataGridColumnHeader title="Status" column={column} />
            ),
            cell: ({ row }) => {
                const status = row?.original?.certificate?.status;
                const formattedStatus = status
                    ? status.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase())
                    : 'Unknown';
                return (
                    <Badge
                        variant={
                            status === 'valid'
                                ? 'success'
                                : status === 'about_to_expire'
                                    ? 'warning'
                                    : 'destructive'
                        }
                        appearance="outline"
                    >
                        {formattedStatus}
                    </Badge>
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
            id: 'IssueBy',
            accessorFn: (row) => row.value,
            header: ({ column }) => (
                <DataGridColumnHeader title="Issue By" column={column} />
            ),
            cell: ({ row }) => (
                <p className="w-50 truncate text-xs">
                    {row?.original?.certificate?.issuer_organization}
                </p>
            ),
            enableSorting: false,
            size: 150,
            meta: {
                cellClassName: '',
                skeleton: <Skeleton className="h-7" />,
            },
        },
        {
            id: 'certificate.not_before',
            accessorFn: (row) => row.adapters[0]?.name,
            header: ({ column }) => (
                <DataGridColumnHeader title="Valid From" column={column} />
            ),
            cell: ({ row }) => {
                const dateValue = row?.original?.certificate?.not_before;
                if (!dateValue) return <span className="text-muted-foreground">N/A</span>;
                const date = new Date(dateValue);
                return (
                    <div className="flex flex-col">
                        <span className="text-sm">{date.toLocaleDateString()}</span>
                        {/* <span className="text-xs text-muted-foreground">{date.toLocaleTimeString()}</span> */}
                    </div>
                );
            },
            enableSorting: true,
            size: 120,
            meta: {
                cellClassName: '',
                skeleton: <Skeleton className="h-7" />,
            },
        },
        {
            id: 'certificate.not_after',
            accessorFn: (row) => row.adapters[0]?.name,
            header: ({ column }) => (
                <DataGridColumnHeader title="Valid Till" column={column} />
            ),
            cell: ({ row }) => {
                const dateValue = row?.original?.certificate?.not_after;
                if (!dateValue) return <span className="text-muted-foreground">N/A</span>;
                const date = new Date(dateValue);
                return (
                    <div className="flex flex-col">
                        <span className="text-sm">{date.toLocaleDateString()}</span>
                        {/* <span className="text-xs text-muted-foreground">{date.toLocaleTimeString()}</span> */}
                    </div>
                );
            },
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
            size: 180,
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
