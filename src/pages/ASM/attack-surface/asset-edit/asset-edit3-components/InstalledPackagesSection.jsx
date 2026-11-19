import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Package } from 'lucide-react';
import Table from '@/components/custom/table';
import SectionCard from './SectionCard';

/**
 * Installed Packages section – searchable packages table
 * with columns: #, Name, Version, Architecture.
 */
const InstalledPackagesSection = ({ asset }) => {
    const packageData = useMemo(
        () => asset?.workstation?.packages || [],
        [asset?.workstation?.packages]
    );
    const [search, setSearch] = useState('');

    if (packageData.length === 0) return null;

    const filteredData = useMemo(() => {
        if (!search) return packageData;
        return packageData.filter(
            (p) =>
                p?.name?.toLowerCase().includes(search.toLowerCase()) ||
                p?.version?.toLowerCase().includes(search.toLowerCase())
        );
    }, [packageData, search]);

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
                header: 'Name',
                accessorKey: 'name',
                cell: ({ row }) => (
                    <span className="font-medium text-sm text-foreground">{row.original.name}</span>
                ),
            },
            {
                header: 'Version',
                accessorKey: 'version',
                cell: ({ row }) => (
                    <span className="font-mono text-xs text-green-500">
                        {row.original.version || '—'}
                    </span>
                ),
            },
            {
                header: 'Architecture',
                accessorKey: 'architecture',
                cell: ({ row }) => {
                    const arch = row.original.architecture;
                    if (!arch) return '—';
                    return (
                        <Badge
                            variant={arch?.toLowerCase() === 'amd64' ? 'primary' : 'secondary'}
                            appearance="outline"
                        >
                            {arch}
                        </Badge>
                    );
                },
            },
        ],
        []
    );

    return (
        <SectionCard
            icon={<Package className="size-4" />}
            iconColor="text-pink-500"
            title="Installed Packages"
            toolbar={
                <Badge variant="secondary" appearance="outline" size="sm">{packageData.length} total</Badge>
            }
        >
            <Table
                data={filteredData}
                columns={columns}
                enableSearch={true}
                search={search}
                setSearch={setSearch}
                searchPlaceholder="Search packages..."
                manualPagination={false}
                showPagination={true}
                className="border-none shadow-none rounded-none"
                cardHeading={true}
            />
        </SectionCard>
    );
};

export default InstalledPackagesSection;
