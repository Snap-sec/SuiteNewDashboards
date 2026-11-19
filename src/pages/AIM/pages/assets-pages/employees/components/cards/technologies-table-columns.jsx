import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridTableRowSelect, DataGridTableRowSelectAll } from '@/components/ui/data-grid-table';
import { Skeleton } from '@/components/ui/skeleton';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import { timeAgo } from '@/lib/helpers.js';

export function getTechnologiesColumns(NewUrl) {
    return [
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
                                <div className="text-[10px] inline-flex items-center whitespace-nowrap justify-center border border-transparent font-medium focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 [&_svg]:-ms-px [&_svg]:shrink-0 rounded-md px-[0.45rem] h-4.5 min-w-6 gap-1.5 text-xs [&_svg]:size-3.5 text-[var(--color-primary-accent,var(--color-blue-700))] bg-[var(--color-primary-soft,var(--color-blue-50))] dark:bg-[var(--color-primary-soft,var(--color-blue-950))] dark:text-[var(--color-primary-soft,var(--color-blue-600))]">
                                    New
                                </div>
                            ) : null;
                        })()}
                    </div>
                </div>
            ),
            enableSorting: false,
            size: 100,
            meta: {
                cellClassName: '',
                skeleton: <Skeleton className="h-7" />,
            },
        },
        {
            id: 'properties.domain',
            accessorFn: (row) => row.risk?.autoRiskScore?.score,
            header: ({ column }) => (
                <DataGridColumnHeader title="Found On" column={column} />
            ),
            cell: ({ row }) => {
                const links = row?.original?.links || [];
                return (
                    <div className="flex items-center gap-1.5">
                        <span className="truncate max-w-[120px]" title={row?.original?.links?.[0]?.value}>
                            {row?.original?.links?.[0]?.value || 'N/A'}
                        </span>
                        {links.length > 0 && (
                            <div className="flex items-center gap-1">
                                {links.length > 1 && (
                                    <DetailedHoverPopover
                                        popoverTitle="Associated Assets"
                                        buttonText={`+${links.length - 1}`}
                                        popoverContent={
                                            <div className="flex items-center flex-wrap gap-1">
                                                {links.slice(1).map((link) => (
                                                    <Badge
                                                        variant="secondary"
                                                        key={link._id}
                                                        to={`/assetinventory/asset-edit/${link._id}?asset=${link.type || NewUrl}`}
                                                    >
                                                        {link.value}
                                                    </Badge>
                                                ))}
                                            </div>
                                        }
                                    />
                                )}
                            </div>
                        )}
                    </div>
                );
            },
            enableSorting: false,
            size: 150,
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
            cell: () => <span className="text-muted-foreground">No owner</span>,
            enableSorting: false,
            size: 60,
            meta: { cellClassName: '' },
        },
        {
            id: 'totalAssets',
            accessorFn: (row) => row.total_associated_assets,
            header: ({ column }) => (
                <DataGridColumnHeader title="Total Assets" column={column} />
            ),
            cell: ({ row }) => (
                <span>
                    {row?.original?.total_associated_assets}
                    {row?.original?.total_associated_assets === 1 ? ' Asset' : ' Assets'}
                </span>
            ),
            size: 80,
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
                        <span className="text-[12px]">Last Found {lastFoundDate ? timeAgo(lastFoundDate) : 'N/A'}</span>
                        <span className="text-[10px]">First Found {timeAgo(createdDate)}</span>
                    </div>
                );
            },
            enableSorting: true,
            size: 180,
            meta: {
                cellClassName: '',
                skeleton: <Skeleton className="h-7" />,
            },
        },
    ];
}
