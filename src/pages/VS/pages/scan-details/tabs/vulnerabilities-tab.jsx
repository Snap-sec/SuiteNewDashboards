import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Link2, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import {
    DataGridTableRowSelect,
    DataGridTableRowSelectAll,
} from '@/components/ui/data-grid-table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CustomTooltip } from '@/components/custom/tooltip';
import { DateFormatter } from '@/components/custom/date-formatter';
import SeverityLabel from '@/components/custom/severity-label';
import { StateLabels } from '@/components/custom/state-labels';
import Table from '@/components/custom/table';
import { useGetVsVulnsQuery, useGetVsConfigQuery, useSendVsToVmMutation } from '@/services/vs/vsApi';
import useStore from './store';
import useVulnStore from '../../vulnerabilities/store';
import VulnInfo from '../../vulnerabilities/components/vuln-info';
import TableToolbar from './components/table-toolbar';
import ScanVulnActionCell from './components/ui/scan-vuln-action-cell';
import { EmptyScreen } from '@/components/common/empty-screen';
import AuthorityGuard from '../../../../../components/custom/authority-guard/AuthorityGuard';

function VulnTitle({ row }) {
    const setSelectedVuln = useVulnStore((state) => state.setSelectedVuln);
    const setShowInfo = useVulnStore((state) => state.setShowInfo);

    return (
        <div
            className="flex flex-col gap-1 hover:text-primary cursor-pointer"
            onClick={() => {
                setShowInfo(true);
                setSelectedVuln(row.original);
            }}
        >
            <p>{row.original.title || row.original._raw?.info?.name || '-'}</p>
        </div>
    );
}

function VMTicketCell({ row }) {
    const [sendToVm, { isLoading: isSyncing }] = useSendVsToVmMutation();
    const { data: config } = useGetVsConfigQuery();

    const isConfigured = !!config?.assessmentId;

    const handleSingleSync = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isConfigured) {
            toast.error(
                'Assessment ID not configured. Please set it in integrations.',
            );
            return;
        }

        toast.promise(sendToVm({ vulnIds: [row?._id] }).unwrap(), {
            loading: 'Sending to VM...',
            success: 'Sent successfully',
            error: (err) => err?.data?.message || 'Failed to send to VM',
        });
    };

    if (row?.sentToVm) {
        return (
            <Badge className="text-[11px] h-fit" variant="secondary" appearance="outline">
                <Link
                    className="w-full flex gap-2 items-center"
                    target="_blank"
                    to={`/vm/vulnerability-report?id=${row?.universalVulnId}&assessmentId=${row?.assessmentId}`}
                >
                    View Ticket
                    <Link2 size={12} />
                </Link>
            </Badge>
        );
    }

    return (
        <CustomTooltip
            text={
                isConfigured
                    ? 'Send to VM'
                    : 'Assessment ID not configured. Please set it in integrations.'
            }
        >
            <span>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-[11px] flex gap-1.5 items-center border-dashed"
                    onClick={handleSingleSync}
                    disabled={isSyncing || !isConfigured}
                >
                    <RefreshCcw size={12} className={isSyncing ? 'animate-spin' : ''} />
                    Send to VM
                </Button>
            </span>
        </CustomTooltip>
    );
}

function getColumns() {
    return [
        {
            id: 'title',
            accessorFn: (row) => row.title || row.name,
            header: ({ column }) => (
                <DataGridColumnHeader title="Title" column={column} />
            ),
            cell: ({ row }) => (
                <div className="leading-none font-medium text-sm text-mono">
                    <VulnTitle row={row} />
                </div>
            ),
            enableSorting: false,
            size: 300,
            meta: {
                skeleton: <Skeleton className="h-7" />,
            },
        },
        {
            id: 'target',
            accessorFn: (row) => row.matched_at || 'Unknown',
            header: ({ column }) => (
                <DataGridColumnHeader title="Target" column={column} />
            ),
            cell: ({ row }) => (
                <div
                    className="text-sm truncate max-w-[200px]"
                    title={row.original.matched_at || '-'}
                >
                    {row.original.matched_at || '-'}
                </div>
            ),
            enableSorting: false,
            size: 200,
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
            size: 130,
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
            size: 130,
            meta: {
                skeleton: <Skeleton className="h-7" />,
            },
        },
        {
            id: 'severity_number',
            accessorFn: (row) => row.severity,
            header: ({ column }) => (
                <DataGridColumnHeader title="Severity" column={column} />
            ),
            cell: ({ row }) => <SeverityLabel severity={row.original.severity} />,
            enableSorting: true,
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
            enableSorting: true,
            size: 100,
            meta: {
                skeleton: <Skeleton className="h-7" />,
            },
        },
        {
            id: 'vm ticket',
            accessorFn: (row) => row.createdAt || 'Unassigned',
            header: ({ column }) => (
                <DataGridColumnHeader title="VM Ticket" column={column} />
            ),
            cell: ({ row }) => <VMTicketCell row={row.original} />,
            enableSorting: false,
            size: 110,
            meta: {
                cellClassName: '',
                skeleton: <Skeleton className="h-7" />,
            },
        },
        {
            id: 'actions',
            header: ({ column }) => (
                <DataGridColumnHeader title="" column={column} />
            ),
            cell: ({ row }) => (
                <AuthorityGuard forbidRoles={['Auditor']}>
                    <ScanVulnActionCell row={row} />
                </AuthorityGuard>
            ),
            enableSorting: false,
            size: 50,
            meta: {
                cellClassName: 'text-center',
                skeleton: <Skeleton className="h-7" />,
            },
        },
    ];
}

export function VulnerabilitiesTab({ scanId, status }) {
    const navigate = useNavigate();

    // Use the shared vulnerabilities store
    const pagination = useStore((state) => state.pagination);
    const setPagination = useStore((state) => state.setPagination);
    const searchQuery = useStore((state) => state.searchQuery);
    const setSearchQuery = useStore((state) => state.setSearchQuery);
    const filters = useStore((state) => state.filters);
    const sorting = useStore((state) => state.sorting);
    const setSorting = useStore((state) => state.setSorting);
    const rowSelection = useStore((state) => state.rowSelection);
    const setRowSelection = useStore((state) => state.setRowSelection);

    // Reset pagination when search or filters change
    useEffect(() => {
        setPagination(() => ({ pageIndex: 0, pageSize: 25 }));
    }, [searchQuery, filters]);

    // Fetch vulnerabilities with scan filter
    const { data, isLoading, isFetching } = useGetVsVulnsQuery({
        search: searchQuery,
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        scan: scanId,
        ...filters,
        ...(sorting?.length && sorting[0]
            ? { sortBy: sorting[0]?.id, sortAs: sorting[0]?.desc ? 'desc' : 'asc' }
            : {}),
    });

    const columns = getColumns();

    // Show empty state when no vulnerabilities are available (not during a search or filter)
    if (!isLoading && !isFetching && !searchQuery && Object.keys(filters || {}).length === 0 && (!data?.vulns || data?.vulns?.length === 0)) {
        if (status === 'running') {
            return (
                <EmptyScreen
                    title="No Vulnerabilities Detected"
                    subTitle="No vulnerabilities have been detected so far. The scan is still running, so feel free to check back shortly for the final results."
                    engage={
                        <Button onClick={() => navigate('/vs/scans')}>
                            Goto Scans
                        </Button>
                    }
                />
            );
        }

        if (status === 'completed') {
            return (
                <EmptyScreen
                    title="No Vulnerabilities Were Detected During the Scan"
                    subTitle=""
                    engage={
                        <Button onClick={() => navigate('/vs/scans')}>
                            Goto Scans
                        </Button>
                    }
                />
            );
        }
    }

    return (
        <>

            <Table
                data={data?.vulns}
                columns={columns}
                enableSorting={true}
                searchPlaceholder="Search Vulnerabilities..."
                isLoading={isLoading || isFetching}
                totalPages={Math.ceil(data?.total / pagination.pageSize) || 1}
                totalCount={data?.total}
                pagination={pagination}
                setPagination={setPagination}
                sorting={sorting}
                setSorting={setSorting}
                search={searchQuery}
                setSearch={setSearchQuery}
                rowSelection={rowSelection}
                grid
                setRowSelection={setRowSelection}
                toolbar={<TableToolbar supportedFilters={data?.filters} />}
            />
            <VulnInfo />
        </>
    );
}
