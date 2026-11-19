import React from 'react';
import { Link } from 'react-router-dom';
import { Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridTableRowSelect, DataGridTableRowSelectAll } from '@/components/ui/data-grid-table';
import { Skeleton } from '@/components/ui/skeleton';
import GetAssetTypeInfo from '@/components/custom/asset-icons';
import { Profile } from '@/components/custom/profile.jsx';
import { timeAgo } from '@/lib/helpers.js';
import AuthorityGuard from '../../../../../../components/custom/authority-guard/AuthorityGuard';

export function getObjectStoragesColumns(NewUrl) {
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
                <DataGridColumnHeader title="Asset" column={column} />
            ),
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <div className="flex flex-col">
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
                    <span className="text-sm text-muted-foreground truncate overflow-hidden whitespace-nowrap w-50" title={row.original.name}>
                        {row.original.name}
                    </span>
                </div>
            ),
            enableSorting: false,
            size: 170,
            meta: {
                cellClassName: '',
                skeleton: <Skeleton className="h-7" />,
            },
        },
        {
            id: 'CompartmentName',
            accessorFn: (row) => row.decommissionedReason,
            header: ({ column }) => (
                <DataGridColumnHeader title="Compartment Name" column={column} />
            ),
            cell: ({ row }) => (
                <div
                    title={row?.original?.object_storage?.compartmentName || ''}
                    className="flex items-center gap-1.5 text-[12px] break-words truncate overflow-hidden whitespace-nowrap"
                >
                    {row?.original?.object_storage?.compartmentName || ''}
                </div>
            ),
            enableSorting: false,
            size: 120,
            meta: {
                cellClassName: '',
                skeleton: <Skeleton className="h-7" />,
            },
        },
        // {
        //     id: 'type',
        //     accessorFn: (row) => row.type,
        //     header: ({ column }) => (
        //         <DataGridColumnHeader title="Type" column={column} />
        //     ),
        //     cell: ({ row }) => (
        //         <Badge variant="secondary" className="capitalize">
        //             {GetAssetTypeInfo(row?.original?.type)?.icon}
        //             {GetAssetTypeInfo(row?.original?.type)?.label}
        //         </Badge>
        //     ),
        //     size: 120,
        //     meta: { skeleton: <Skeleton className="h-7" /> },
        // },
        {
            id: 'Provider',
            accessorFn: (row) => row.adapters[0]?.adapterName,
            header: ({ column }) => (
                <DataGridColumnHeader title="Provider" column={column} />
            ),
            cell: ({ row }) => (
                <div className="flex items-center gap-1.5">
                    {row?.original?.object_storage?.provider || 'N/A'}
                </div>
            ),
            enableSorting: false,
            size: 70,
            meta: {
                cellClassName: '',
                skeleton: <Skeleton className="h-7" />,
            },
        },
        {
            id: 'Region',
            accessorFn: (row) => row.adapters[0]?.adapterName,
            header: ({ column }) => (
                <DataGridColumnHeader title="Region" column={column} />
            ),
            cell: ({ row }) => (
                <div className="flex items-center gap-1.5">
                    {row?.original?.object_storage?.region || 'N/A'}
                </div>
            ),
            enableSorting: false,
            size: 70,
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
            cell: ({ row }) => {
                const createdDate = new Date(row?.original?.createdAt);
                const lastFoundDate = row?.original?.last_detected ? new Date(row.original?.last_detected) : null;
                return (
                    <div className="flex flex-col gap-2">
                        <span className="text-[12px]">{lastFoundDate ? timeAgo(lastFoundDate) : 'N/A'}</span>
                        {/* <span className="text-[10px]">First Found {timeAgo(createdDate)}</span> */}
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
    ];
}
