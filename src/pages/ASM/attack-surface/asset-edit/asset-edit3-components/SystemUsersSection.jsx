import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
import SectionCard from './SectionCard';
import Table from '@/components/custom/table';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * System Users section – table with Username, UID, Shell, Groups.
 */
const SystemUsersSection = ({ asset }) => {
    const users = asset?.workstation?.users || [];

    const columns = useMemo(
        () => [
            {
                id: 'username',
                accessorFn: (row) => row?.username,
                header: ({ column }) => (
                    <DataGridColumnHeader title="Username" column={column} />
                ),
                cell: ({ row }) => (
                    <span className="font-medium text-foreground">
                        {row.original?.username}
                    </span>
                ),
                size: 150,
                meta: {
                    skeleton: <Skeleton className="h-7" />,
                },
            },
            {
                id: 'uid',
                accessorFn: (row) => row?.uid,
                header: ({ column }) => (
                    <DataGridColumnHeader title="UID" column={column} />
                ),
                cell: ({ row }) => (
                    <Badge variant="warning" appearance="outline">
                        {row.original?.uid}
                    </Badge>
                ),
                size: 100,
                meta: {
                    skeleton: <Skeleton className="h-7" />,
                },
            },
            {
                id: 'shell',
                accessorFn: (row) => row?.shell || '—',
                header: ({ column }) => (
                    <DataGridColumnHeader title="Shell" column={column} />
                ),
                cell: ({ row }) => (
                    <span className="text-xs font-mono text-green-500">
                        {row.original?.shell || '—'}
                    </span>
                ),
                size: 150,
                meta: {
                    skeleton: <Skeleton className="h-7" />,
                },
            },
            {
                id: 'groups',
                accessorFn: (row) => row?.groups,
                header: ({ column }) => (
                    <div className="text-right w-full">
                        <DataGridColumnHeader title="Groups" column={column} />
                    </div>
                ),
                cell: ({ row }) => (
                    <div className="flex flex-wrap gap-1 justify-end w-full">
                        {row.original?.groups && row.original.groups.length > 0 ? (
                            row.original.groups.map((group, i) => (
                                <Badge key={i} variant="secondary" appearance="outline">
                                    {group}
                                </Badge>
                            ))
                        ) : (
                            <span className="text-muted-foreground">—</span>
                        )}
                    </div>
                ),
                size: 200,
                meta: {
                    cellClassName: 'text-right',
                    skeleton: <Skeleton className="h-7 ml-auto" />,
                },
            },
        ],
        []
    );

    if (users.length === 0) return null;

    return (
        <SectionCard
            icon={<Users className="size-4" />}
            iconColor="text-teal-500"
            title="System Users"
            toolbar={
                <Badge variant="secondary" appearance="outline" size="sm">
                    {users.length}
                </Badge>
            }
        >
            <div className="overflow-x-auto">
                <Table
                    data={users}
                    columns={columns}
                    enableSearch={false}
                    showPagination={false}
                    cardHeading={false}
                    className="border-0 shadow-none p-0"
                />
            </div>
        </SectionCard>
    );
};

export default SystemUsersSection;
