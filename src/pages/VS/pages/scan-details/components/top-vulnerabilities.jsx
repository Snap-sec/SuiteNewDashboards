import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import { DateFormatter } from '@/components/custom/date-formatter';
import SeverityLabel from '@/components/custom/severity-label';
import { StateLabels } from '@/components/custom/state-labels';
import Table from '@/components/custom/table';
import VulnInfo from '../../vulnerabilities/components/vuln-info';
import useVulnStore from '../../vulnerabilities/store';

function TopVulnerabilities({ data, isLoading }) {
    // Use the data directly - API already returns proper structure
    const top5Vulns = data?.top_5_vulnerabilities || [];

    const setSelectedVuln = useVulnStore((state) => state.setSelectedVuln);
    const setShowInfo = useVulnStore((state) => state.setShowInfo);

    const columns = [
        {
            id: 'title',
            accessorFn: (row) => row.title,
            header: ({ column }) => (
                <DataGridColumnHeader title="Title" column={column} />
            ),
            cell: ({ row }) => (
                <div
                    className="flex flex-col gap-1 cursor-pointer hover:text-primary"
                    onClick={() => {
                        setSelectedVuln(row.original);
                        setShowInfo(true);
                    }}
                >
                    <p className="font-medium text-sm text-mono">{row.original.title || '-'}</p>
                    <p className="text-xs text-secondary-foreground">
                        {row.original.matched_at || 'Unknown'}
                    </p>
                </div>
            ),
            enableSorting: false,
            size: 400,
            meta: {
                skeleton: <Skeleton className="h-7" />,
            },
        },
        {
            id: 'state',
            accessorFn: (row) => row.state || 'Unknown',
            header: ({ column }) => (
                <DataGridColumnHeader title="State" column={column} />
            ),
            cell: ({ row }) => <StateLabels state={row.original.state || 'open'} />,
            enableSorting: false,
            size: 100,
            meta: {
                skeleton: <Skeleton className="h-7" />,
            },
        },
        {
            id: 'scanner',
            accessorFn: (row) => row.scannerId?.name || 'Unknown',
            header: ({ column }) => (
                <DataGridColumnHeader title="Scanner" column={column} />
            ),
            cell: ({ row }) => (
                <StateLabels
                    state={row.original.scannerId?.name}
                    className="text-[11px]"
                />
            ),
            enableSorting: false,
            size: 100,
            meta: {
                skeleton: <Skeleton className="h-7" />,
            },
        },
        {
            id: 'severity',
            accessorFn: (row) => row.severity,
            header: ({ column }) => (
                <DataGridColumnHeader title="Severity" column={column} />
            ),
            cell: ({ row }) => <SeverityLabel severity={row.original.severity} />,
            enableSorting: false,
            size: 100,
            meta: {
                skeleton: <Skeleton className="h-7" />,
            },
        },
        {
            id: 'createdAt',
            accessorFn: (row) => row.createdAt,
            header: ({ column }) => (
                <DataGridColumnHeader title="Reported On" column={column} />
            ),
            cell: ({ row }) => <DateFormatter date={row.original.createdAt} />,
            enableSorting: false,
            size: 120,
            meta: {
                skeleton: <Skeleton className="h-7" />,
            },
        },
    ];

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Top 5 Vulnerabilities</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <Table
                        data={top5Vulns}
                        columns={columns}
                        enableSorting={false}
                        isLoading={isLoading}
                        totalPages={1}
                        totalCount={top5Vulns.length}
                        pagination={{ pageIndex: 0, pageSize: 5 }}
                        setPagination={() => { }}
                        className="border-none p-0"
                        enableSearch={false}
                        cardHeading={false}
                        showColumnVisibility={false}
                        grid
                    />
                </CardContent>
            </Card>

            <VulnInfo />
        </>
    );
}

export default TopVulnerabilities;
