import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Activity } from 'lucide-react';
import Table from '@/components/custom/table';
import SectionCard from './SectionCard';

/**
 * Processes section – searchable process table
 * with columns: PID, PPID, Name, User, CPU%, Mem(MB), Started.
 */
const ProcessesSection = ({ asset }) => {
    const processData = useMemo(
        () => asset?.workstation?.processes || [],
        [asset?.workstation?.processes]
    );
    const [search, setSearch] = useState('');

    if (processData.length === 0) return null;

    const filteredData = useMemo(() => {
        if (!search) return processData;
        return processData.filter(
            (p) =>
                p?.name?.toLowerCase().includes(search.toLowerCase()) ||
                p?.user?.toLowerCase().includes(search.toLowerCase())
        );
    }, [processData, search]);

    const formatDate = (date) => {
        if (!date) return '—';
        return new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true,
        });
    };

    const columns = useMemo(
        () => [
            {
                header: 'PID',
                accessorKey: 'pid',
                cell: ({ row }) => (
                    <span className="font-mono text-xs text-foreground">{row.original.pid}</span>
                ),
                size: 70,
            },
            {
                header: 'PPID',
                accessorKey: 'ppid',
                cell: ({ row }) => (
                    <span className="font-mono text-xs text-muted-foreground">{row.original.ppid}</span>
                ),
                size: 70,
            },
            {
                header: 'Name',
                accessorKey: 'name',
                cell: ({ row }) => (
                    <span className="font-medium text-sm text-foreground">{row.original.name}</span>
                ),
            },
            {
                header: 'User',
                accessorKey: 'user',
                cell: ({ row }) => (
                    <Badge variant="destructive" appearance="outline">
                        {row.original.user || '—'}
                    </Badge>
                ),
                size: 100,
            },
            {
                header: 'CPU %',
                accessorKey: 'cpu',
                cell: ({ row }) => {
                    const val = row.original.cpu;
                    return (
                        <span className={`font-mono text-xs ${val > 0 ? 'text-green-500' : 'text-muted-foreground'}`}>
                            {val != null ? `${val}%` : '%'}
                        </span>
                    );
                },
                size: 80,
            },
            {
                header: 'MEM (MB)',
                accessorKey: 'memory',
                cell: ({ row }) => {
                    const val = row.original.memory;
                    return (
                        <span className={`font-mono text-xs ${val > 0 ? 'text-yellow-500' : 'text-muted-foreground'}`}>
                            {val != null ? val : '—'}
                        </span>
                    );
                },
                size: 90,
            },
            {
                header: 'Started',
                accessorKey: 'started',
                cell: ({ row }) => (
                    <span className="text-xs text-muted-foreground">
                        {formatDate(row.original.started)}
                    </span>
                ),
            },
        ],
        []
    );

    return (
        <SectionCard
            icon={<Activity className="size-4" />}
            iconColor="text-yellow-500"
            title="Processes"
            toolbar={
                <Badge variant="secondary" appearance="outline" size="sm">{processData.length} total</Badge>
            }
        >
            <Table
                data={filteredData}
                columns={columns}
                enableSearch={true}
                search={search}
                setSearch={setSearch}
                searchPlaceholder="Search processes..."
                manualPagination={false}
                showPagination={true}
                className="border-none shadow-none rounded-none"
                cardHeading={true}
            />
        </SectionCard>
    );
};

export default ProcessesSection;
