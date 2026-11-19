import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Server } from 'lucide-react';
import Table from '@/components/custom/table';
import SectionCard from './SectionCard';

/**
 * System Services section – searchable service table
 * with columns: #, Service Name, Status, Enabled.
 */
const SystemServicesSection = ({ asset }) => {
    const servicesData = useMemo(
        () => asset?.workstation?.services || [],
        [asset?.workstation?.services]
    );
    const [search, setSearch] = useState('');

    if (servicesData.length === 0) return null;

    const filteredData = useMemo(() => {
        if (!search) return servicesData;
        return servicesData.filter((s) =>
            s?.name?.toLowerCase().includes(search.toLowerCase())
        );
    }, [servicesData, search]);

    const columns = useMemo(
        () => [
            {
                header: '#',
                accessorKey: '_index',
                cell: ({ row }) => (
                    <span className="text-muted-foreground text-xs">{row.index + 1}</span>
                ),
                size: 50,
            },
            {
                header: 'Service Name',
                accessorKey: 'name',
                cell: ({ row }) => (
                    <span className="font-medium text-sm text-foreground">{row.original.name}</span>
                ),
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: ({ row }) => {
                    const status = row.original.status?.toLowerCase();
                    const variant =
                        status === 'running'
                            ? 'success'
                            : status === 'exited'
                                ? 'warning'
                                : status === 'dead'
                                    ? 'destructive'
                                    : status === 'inactive'
                                        ? 'info'
                                        : 'secondary';
                    return (
                        <Badge variant={variant} appearance="outline">
                            {row.original.status || '—'}
                        </Badge>
                    );
                },
            },
            {
                header: 'Enabled',
                accessorKey: 'enabled',
                cell: ({ row }) => {
                    const val = row.original.enabled;
                    return (
                        <Badge
                            variant={val === 'enabled' ? 'success' : 'secondary'}
                            appearance="outline"
                        >
                            {val || 'Disabled'}
                        </Badge>
                    );
                },
            },
        ],
        []
    );

    return (
        <SectionCard
            icon={<Server className="size-4" />}
            iconColor="text-violet-500"
            title="System Services"
            toolbar={
                <Badge variant="secondary" appearance="outline" size="sm">{servicesData.length} total</Badge>
            }
        >
            <Table
                data={filteredData}
                columns={columns}
                enableSearch={true}
                search={search}
                setSearch={setSearch}
                searchPlaceholder="Search services..."
                manualPagination={false}
                showPagination={true}
                className="border-none shadow-none rounded-none"
                cardHeading={true}
            />
        </SectionCard>
    );
};

export default SystemServicesSection;
