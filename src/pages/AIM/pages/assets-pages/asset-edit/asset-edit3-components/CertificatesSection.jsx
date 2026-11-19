import { useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Lock } from 'lucide-react';
import SectionCard from './SectionCard';
import Table from '@/components/custom/table';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';

const CertificatesSection = ({ asset }) => {
    const certificates = asset?.certificates || [];

    const formatDate = (date) => {
        if (!date) return '—';
        return new Date(date).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const getStatusVariant = (status) => {
        if (!status) return 'secondary';
        const s = status.toLowerCase();
        if (s === 'valid') return 'success';
        if (s === 'expired') return 'destructive';
        return 'warning';
    };

    const columns = useMemo(
        () => [
            {
                id: 'commonName',
                accessorFn: (row) => row?.certificate?.common_name || '—',
                header: ({ column }) => (
                    <DataGridColumnHeader title="Common Name" column={column} />
                ),
                cell: ({ row }) => (
                    <span className="text-foreground font-medium text-sm">
                        {row.original?.certificate?.common_name || '—'}
                    </span>
                ),
                size: 200,
                meta: {
                    skeleton: <Skeleton className="h-7" />,
                },
            },
            {
                id: 'issuer',
                accessorFn: (row) => row?.certificate?.issuer_organization || row?.certificate?.issuer_cn || '—',
                header: ({ column }) => (
                    <DataGridColumnHeader title="Issuer" column={column} />
                ),
                cell: ({ row }) => (
                    <span className="text-xs text-muted-foreground max-w-[200px] truncate block">
                        {row.original?.certificate?.issuer_organization || row.original?.certificate?.issuer_cn || '—'}
                    </span>
                ),
                size: 200,
                meta: {
                    skeleton: <Skeleton className="h-7" />,
                },
            },
            {
                id: 'status',
                accessorFn: (row) => row?.certificate?.status || '—',
                header: ({ column }) => (
                    <DataGridColumnHeader title="Status" column={column} />
                ),
                cell: ({ row }) => (
                    <Badge variant={getStatusVariant(row.original?.certificate?.status)} appearance="outline">
                        {row.original?.certificate?.status || '—'}
                    </Badge>
                ),
                size: 100,
                meta: {
                    skeleton: <Skeleton className="h-7" />,
                },
            },
            {
                id: 'validFrom',
                accessorFn: (row) => row?.certificate?.not_before,
                header: ({ column }) => (
                    <DataGridColumnHeader title="Valid From" column={column} />
                ),
                cell: ({ row }) => (
                    <span className="text-xs text-muted-foreground">
                        {formatDate(row.original?.certificate?.not_before)}
                    </span>
                ),
                size: 120,
                meta: {
                    skeleton: <Skeleton className="h-7" />,
                },
            },
            {
                id: 'validUntil',
                accessorFn: (row) => row?.certificate?.not_after,
                header: ({ column }) => (
                    <DataGridColumnHeader title="Valid Until" column={column} />
                ),
                cell: ({ row }) => (
                    <span className="text-xs text-muted-foreground">
                        {formatDate(row.original?.certificate?.not_after)}
                    </span>
                ),
                size: 120,
                meta: {
                    skeleton: <Skeleton className="h-7" />,
                },
            },
            {
                id: 'altNames',
                accessorFn: (row) => row?.certificate?.alt_names,
                header: ({ column }) => (
                    <div className="text-right w-full">
                        <DataGridColumnHeader title="Alt Names" column={column} />
                    </div>
                ),
                cell: ({ row }) => {
                    const altNames = row.original?.certificate?.alt_names || [];
                    return (
                        <div className="flex flex-wrap gap-1 justify-end w-full">
                            {altNames.length > 0 ? (
                                <>
                                    {altNames.slice(0, 3).map((name, i) => (
                                        <Badge key={i} variant="secondary" appearance="outline">
                                            {name}
                                        </Badge>
                                    ))}
                                    {altNames.length > 3 && (
                                        <Badge variant="secondary" appearance="outline">
                                            +{altNames.length - 3}
                                        </Badge>
                                    )}
                                </>
                            ) : (
                                <span className="text-xs text-muted-foreground">—</span>
                            )}
                        </div>
                    );
                },
                size: 200,
                meta: {
                    cellClassName: 'text-right',
                    skeleton: <Skeleton className="h-7 ml-auto" />,
                },
            },
        ],
        []
    );

    if (certificates.length === 0) return null;

    return (
        <SectionCard
            icon={<Lock className="size-4" />}
            iconColor="text-green-500"
            title="SSL Certificates"
            toolbar={
                <Badge variant="secondary" appearance="outline" size="sm">
                    {certificates.length} certs
                </Badge>
            }
        >
            <div className="overflow-x-auto">
                <Table
                    data={certificates}
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

export default CertificatesSection;
