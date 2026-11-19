import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Network } from 'lucide-react';
import SectionCard from './SectionCard';
import Table from '@/components/custom/table';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Network Interfaces section – tabular display of interfaces with MAC, IPv4, IPv6, MTU, State.
 */
const NetworkSection = ({ asset }) => {
    const interfaces = asset?.workstation?.network_interfaces || [];

    const getStateBadge = (state) => {
        if (!state) return '—';
        const s = state.toLowerCase();
        if (s === 'up') {
            return <Badge variant="success" appearance="outline">▲ up</Badge>;
        }
        if (s === 'down') {
            return <Badge variant="destructive" appearance="outline">▼ down</Badge>;
        }
        return <Badge variant="secondary" appearance="outline">{state}</Badge>;
    };

    const columns = useMemo(
        () => [
            {
                id: 'interface',
                accessorFn: (row) => row?.name || '—',
                header: ({ column }) => (
                    <DataGridColumnHeader title="Interface" column={column} />
                ),
                cell: ({ row }) => (
                    <span className="text-sm font-medium text-foreground">
                        {row.original?.name || '—'}
                    </span>
                ),
                size: 130,
                meta: {
                    skeleton: <Skeleton className="h-7" />,
                },
            },
            {
                id: 'mac',
                accessorFn: (row) => row?.mac || '—',
                header: ({ column }) => (
                    <DataGridColumnHeader title="MAC" column={column} />
                ),
                cell: ({ row }) => (
                    <span className="text-xs font-mono text-muted-foreground">
                        {row.original?.mac || '—'}
                    </span>
                ),
                size: 150,
                meta: {
                    skeleton: <Skeleton className="h-7" />,
                },
            },
            {
                id: 'ipv4',
                accessorFn: (row) => row?.ipv4 || '—',
                header: ({ column }) => (
                    <DataGridColumnHeader title="IPv4" column={column} />
                ),
                cell: ({ row }) => (
                    <span className="text-xs font-mono text-foreground">
                        {row.original?.ipv4 || '—'}
                    </span>
                ),
                size: 130,
                meta: {
                    skeleton: <Skeleton className="h-7" />,
                },
            },
            {
                id: 'ipv6',
                accessorFn: (row) => row?.ipv6 || '—',
                header: ({ column }) => (
                    <DataGridColumnHeader title="IPv6" column={column} />
                ),
                cell: ({ row }) => (
                    <span className="text-xs font-mono text-orange-400 max-w-[200px] truncate block">
                        {row.original?.ipv6 || '—'}
                    </span>
                ),
                size: 200,
                meta: {
                    skeleton: <Skeleton className="h-7" />,
                },
            },
            {
                id: 'mtu',
                accessorFn: (row) => row?.mtu || '—',
                header: ({ column }) => (
                    <div className="text-right w-full">
                        <DataGridColumnHeader title="MTU" column={column} />
                    </div>
                ),
                cell: ({ row }) => (
                    <span className="text-sm text-foreground block text-right w-full">
                        {row.original?.mtu || '—'}
                    </span>
                ),
                size: 80,
                meta: {
                    cellClassName: 'text-right',
                    skeleton: <Skeleton className="h-7 ml-auto" />,
                },
            },
            {
                id: 'state',
                accessorFn: (row) => row?.state || '—',
                header: ({ column }) => (
                    <div className="text-right w-full">
                        <DataGridColumnHeader title="State" column={column} />
                    </div>
                ),
                cell: ({ row }) => (
                    <div className="flex justify-end w-full">
                        {getStateBadge(row.original?.state)}
                    </div>
                ),
                size: 100,
                meta: {
                    cellClassName: 'text-right',
                    skeleton: <Skeleton className="h-7 ml-auto" />,
                },
            },
        ],
        []
    );

    if (interfaces.length === 0) return null;

    return (
        <SectionCard
            icon={<Network className="size-4" />}
            iconColor="text-purple-500"
            title="Network Interfaces"
        >
            <div className="overflow-x-auto">
                <Table
                    data={interfaces}
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

export default NetworkSection;
