import { Badge } from '@/components/ui/badge';
import Table from '@/components/custom/table';
import { ShieldAlert, CheckCircle2, Server } from 'lucide-react';
import { useMemo } from 'react';
import { EmptyScreen } from '../../../../../../../components/common/empty-screen';

export function ServicesTab({ asset }) {
    const servicesData = useMemo(() => asset?.workstation?.services || [], [asset?.workstation?.services]);

    if (!asset?.workstation) {
        return <EmptyScreen />;
    }


    const columns = useMemo(() => [
        {
            header: "Service Name",
            accessorKey: "name",
            cell: ({ row }) => (
                <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                        <Server className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="font-medium">{row.original.name}</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground line-clamp-1">{row.original.desc}</span>
                </div>
            )
        },
        // {
        //     header: "Version",
        //     accessorKey: "version",
        //     cell: ({ row }) => <span className="font-mono text-xs">{row.original.version}</span>
        // },
        // {
        //     header: "Category",
        //     accessorKey: "category",
        //     cell: ({ row }) => (
        //         <Badge variant="secondary" className="capitalize text-[10px] py-0 px-1.5 h-5">
        //             {row.original.category}
        //         </Badge>
        //     )
        // },
        {
            header: "Status",
            accessorKey: "status",
            cell: ({ row }) => {
                const status = row.original.status?.toLowerCase();
                const isDead = status === 'dead' || status === 'stopped';

                return (
                    <Badge
                        variant={isDead ? "destructive" : "success"}
                        appearance="outline"
                        className="gap-1 px-1.5 h-5 text-[10px]"
                    >
                        {isDead ? (
                            <>
                                <ShieldAlert className="h-2.5 w-2.5" />
                                Dead
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="h-2.5 w-2.5" />
                                Running
                            </>
                        )}
                    </Badge>
                );
            }
        },
        // {
        //     header: "Port/Details",
        //     accessorKey: "size",
        //     cell: ({ row }) => <span className="text-xs text-muted-foreground">{row.original.size}</span>
        // },
        // {
        //     header: "Last Seen",
        //     accessorKey: "installed",
        //     cell: ({ row }) => <span className="text-xs text-muted-foreground">{row.original.installed}</span>
        // }
    ], []);

    return (
        <div className="flex flex-col gap-4">
            <Table
                data={servicesData}
                columns={columns}
                enableSearch={true}
                searchPlaceholder="Search services..."
                manualPagination={false}
                showPagination={true}
                className="border-none shadow-none"
            />
        </div>
    );
}
