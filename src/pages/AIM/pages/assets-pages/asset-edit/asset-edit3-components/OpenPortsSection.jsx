import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';
import SectionCard from './SectionCard';
import Table from '@/components/custom/table';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';

const OpenPortsSection = ({ asset }) => {
    const ports = asset?.ports || [];

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
                id: 'environment',
                accessorFn: (row) => row?.environment || 'unknown',
                header: ({ column }) => (
                    <DataGridColumnHeader title="Environment" column={column} />
                ),
                cell: ({ row }) => (
                    <Badge
                        variant={row.original?.environment === 'unknown' ? 'warning' : 'success'}
                        appearance="outline"
                    >
                        {row.original?.environment || 'unknown'}
                    </Badge>
                ),
                size: 130,
                meta: {
                    skeleton: <Skeleton className="h-7" />,
                },
            },
            {
                id: 'vulnerabilities',
                accessorFn: (row) => row?.security?.open_vulns || 0,
                header: ({ column }) => (
                    <DataGridColumnHeader title="Vulnerabilities" column={column} />
                ),
                cell: ({ row }) => (
                    <Badge
                        variant={row.original?.security?.open_vulns > 0 ? 'destructive' : 'success'}
                        appearance="outline"
                    >
                        {row.original?.security?.open_vulns || 0} open
                    </Badge>
                ),
                size: 150,
                meta: {
                    skeleton: <Skeleton className="h-7" />,
                },
            },
            {
                id: 'associatedAssets',
                accessorFn: (row) => row?.total_associated_assets || 0,
                header: ({ column }) => (
                    <DataGridColumnHeader title="Associated Assets" column={column} />
                ),
                cell: ({ row }) => (
                    <span className="text-sm text-foreground">
                        {row.original?.total_associated_assets || 0}
                    </span>
                ),
                size: 150,
                meta: {
                    skeleton: <Skeleton className="h-7" />,
                },
            },
            {
                id: 'lastChecked',
                accessorFn: (row) => row?.port?.lastChecked,
                header: ({ column }) => (
                    <div className="text-right w-full">
                        <DataGridColumnHeader title="Last Checked" column={column} />
                    </div>
                ),
                cell: ({ row }) => (
                    <span className="text-muted-foreground text-xs block text-right w-full">
                        {formatDate(row.original?.port?.lastChecked)}
                    </span>
                ),
                size: 180,
                meta: {
                    cellClassName: 'text-right',
                    skeleton: <Skeleton className="h-7 ml-auto" />,
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
            <div className="overflow-x-auto">
                <Table
                    data={ports}
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

export default OpenPortsSection;
