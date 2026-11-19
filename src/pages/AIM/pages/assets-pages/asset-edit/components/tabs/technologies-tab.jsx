import { Badge } from '@/components/ui/badge';
import Table from '@/components/custom/table';
import { Cpu, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useMemo } from 'react';
import { EmptyScreen } from '../../../../../../../components/common/empty-screen';

export function TechnologiesTab({ asset }) {
    const data = asset?.technologies || [];

    if (!data.length) {
        return <EmptyScreen />;
    }

    const columns = useMemo(() => [
        {
            header: "Technology",
            accessorKey: "technology.name",
            cell: ({ row }) => {
                const tech = row.original.technology;
                return (
                    <div className="flex flex-col gap-0.5 max-w-[300px]">
                        <div className="flex items-center gap-2">
                            <Cpu className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="font-medium">{tech?.name || row.original.value}</span>
                        </div>
                        {tech?.description && (
                            <span className="text-[11px] text-muted-foreground line-clamp-1">
                                {tech.description}
                            </span>
                        )}
                    </div>
                );
            }
        },
        {
            header: "Category",
            accessorKey: "technology.category",
            cell: ({ row }) => (
                <Badge variant="secondary" className="capitalize text-[10px] py-0 px-1.5 h-5">
                    {row.original.technology?.category || 'General'}
                </Badge>
            )
        },
        {
            header: "Status",
            accessorKey: "security.vulnerability_stats.total",
            cell: ({ row }) => {
                const stats = row.original.security?.vulnerability_stats;
                const totalVulns = stats?.total || 0;

                if (totalVulns > 0) {
                    return (
                        <div className="flex items-center gap-2">
                            <Badge variant="destructive" className="gap-1 px-1.5 h-5 text-[10px]">
                                <ShieldAlert className="h-2.5 w-2.5" />
                                {totalVulns} Vulnerabilities
                            </Badge>
                        </div>
                    );
                }
                return (
                    <Badge variant="success" appearance="outline">
                        <CheckCircle2 className="h-2.5 w-2.5" />
                        Healthy
                    </Badge>
                );
            }
        },
        {
            header: "Adapters",
            accessorKey: "adapters",
            cell: ({ row }) => (
                <div className="flex flex-wrap gap-1">
                    {row.original.adapters?.map((adapter, i) => (
                        <Badge key={i} variant="outline" className="text-[10px] py-0 px-1.5 h-5 uppercase">
                            {adapter}
                        </Badge>
                    ))}
                </div>
            )
        },
        {
            header: "Last Detected",
            accessorKey: "last_detected",
            cell: ({ row }) => {
                const date = row.original.last_detected;
                return (
                    <span className="text-xs text-muted-foreground">
                        {date ? new Date(date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        }) : 'Never'}
                    </span>
                );
            }
        }
    ], []);

    return (
        <div className="flex flex-col gap-4">
            <Table
                data={data}
                columns={columns}
                enableSearch={true}
                searchPlaceholder="Search technologies..."
                manualPagination={false}
                showPagination={true}
                className="border-none shadow-none"
            />
        </div>
    );
}

