import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';
import SectionCard from './SectionCard';
import Table from '@/components/custom/table';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';

const OpenPortsSection = ({ asset }) => {
    const ports = asset?.associatedAssets?.filter((a)=> a?.type === "port") || [];    

    const formatDate = (date) => {
        if (!date) return '—';
        return new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        });
    };

    const columns = useMemo(
        () => [
            {
                id: 'port',
                accessorFn: (row) => row?.value,
                header: ({ column }) => (
                    <DataGridColumnHeader title="Port" column={column} />
                ),
                cell: ({ row }) => (
                    <Badge variant="primary" appearance="outline" size="sm">
                        {row.original?.value}
                    </Badge>
                ),
                size: 100,
                meta: {
                    skeleton: <Skeleton className="h-7" />,
                },
            },
            {
                id: 'status',
                accessorFn: (row) => row?.port_status || 'unknown',
                header: ({ column }) => (
                    <DataGridColumnHeader title="Status" column={column} />
                ),
                cell: ({ row }) => (
                    <Badge
                        variant={row.original?.properties?.port_status === 'open' ? 'warning' : 'success'}
                        appearance="outline"
                    >
                        {row.original?.properties?.port_status || 'unknown'}
                    </Badge>
                ),
                size: 130,
                meta: {
                    skeleton: <Skeleton className="h-7" />,
                },
            },
            {
                id: 'version',
                accessorFn: (row) => row?.security?.open_vulns || 0,
                header: ({ column }) => (
                    <DataGridColumnHeader title="Version" column={column} />
                ),
                cell: ({ row }) => (
                    <span>
                        {row.original?.properties?.port_service_version || 0}
                    </span>
                ),
                size: 150,
                meta: {
                    skeleton: <Skeleton className="h-7" />,
                },
            },
            {
                id: 'service',
                accessorFn: (row) => row?.properties?.port_service || 'unknown',
                header: ({ column }) => (
                    <DataGridColumnHeader title="Service" column={column} />
                ),
                cell: ({ row }) => (
                    <span className="text-sm text-foreground">
                        {row.original?.properties?.port_service || 'unknown'}
                    </span>
                ),
                size: 150,
                meta: {
                    skeleton: <Skeleton className="h-7" />,
                },
            },
            {
                id: 'protocol',
                accessorFn: (row) => row?.properties?.port_protocol || 'unknown',
                header: ({ column }) => (
                    <DataGridColumnHeader title="Protocol" column={column} />
                ),
                cell: ({ row }) => (
                    <span className="text-sm text-foreground">
                        {row.original?.properties?.port_protocol || 'unknown'}
                    </span>
                ),
                size: 150,
                meta: {
                    skeleton: <Skeleton className="h-7" />,
                },
            },
        ],
        []
    );

    if (ports.length === 0) return null;

    return (
        <SectionCard
            icon={<Shield className="size-4" />}
            iconColor="text-orange-500"
            title="Open Ports"
            toolbar={
                <Badge variant="secondary" appearance="outline" size="sm">
                    {ports.length} ports
                </Badge>
            }
        >
                <Table
                    data={ports}
                    columns={columns}
                    enableSearch={false}
                    showPagination={ports.length > 10}
                    manualPagination={false}
                    cardHeading={false}
                    className="border-0 shadow-none p-0"
                />

        </SectionCard>
    );
};

export default OpenPortsSection;
