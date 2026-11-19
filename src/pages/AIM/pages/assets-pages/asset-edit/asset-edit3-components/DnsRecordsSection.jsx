import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';
import SectionCard from './SectionCard';
import Table from '@/components/custom/table';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';

const DnsRecordsSection = ({ asset }) => {
    const dnsRecords = asset?.dns || [];
    if (dnsRecords.length === 0) return null;

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
                id: 'value',
                accessorFn: (row) => row?.value || '—',
                header: ({ column }) => (
                    <DataGridColumnHeader title="Value" column={column} />
                ),
                cell: ({ row }) => (
                    <span className="text-sm font-medium text-foreground">
                        {row.original?.value || '—'}
                    </span>
                ),
                size: 200,
                meta: {
                    skeleton: <Skeleton className="h-7" />,
                },
            },
            {
                id: 'recordType',
                accessorFn: (row) => row?.dns?.record_type || '—',
                header: ({ column }) => (
                    <DataGridColumnHeader title="Record Type" column={column} />
                ),
                cell: ({ row }) => (
                    <span>{row.original?.dns?.record_type || '—'}</span>
                ),
                size: 120,
                meta: {
                    skeleton: <Skeleton className="h-7" />,
                },
            },
            {
                id: 'resolvedFrom',
                accessorFn: (row) => row?.dns?.resolved_from || '—',
                header: ({ column }) => (
                    <DataGridColumnHeader title="Resolved From" column={column} />
                ),
                cell: ({ row }) => (
                    <span>{row.original?.dns?.resolved_from || '—'}</span>
                ),
                size: 150,
                meta: {
                    skeleton: <Skeleton className="h-7" />,
                },
            },
            {
                id: 'thirdParty',
                accessorFn: (row) => row?.dns?.is_third_party ? 'Yes' : 'No',
                header: ({ column }) => (
                    <DataGridColumnHeader title="Third Party" column={column} />
                ),
                cell: ({ row }) => (
                    <span>{row.original?.dns?.is_third_party ? 'Yes' : 'No'}</span>
                ),
                size: 100,
                meta: {
                    skeleton: <Skeleton className="h-7" />,
                },
            },
            {
                id: 'lastChecked',
                accessorFn: (row) => row?.dns?.lastChecked,
                header: ({ column }) => (
                    <DataGridColumnHeader title="Last Checked" column={column} />
                ),
                cell: ({ row }) => (
                    <span className="text-muted-foreground text-xs">
                        {formatDate(row.original?.dns?.lastChecked)}
                    </span>
                ),
                size: 180,
                meta: {
                    skeleton: <Skeleton className="h-7" />,
                },
            },
        ],
        []
    );

    return (
        <SectionCard
            icon={<FileText className="size-4" />}
            iconColor="text-indigo-500"
            title="DNS Records"
            toolbar={
                <Badge variant="secondary" appearance="outline" size="sm">
                    {dnsRecords.length} records
                </Badge>
            }
        >
            <div className="overflow-x-auto">
                <Table
                    data={dnsRecords}
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

export default DnsRecordsSection;
