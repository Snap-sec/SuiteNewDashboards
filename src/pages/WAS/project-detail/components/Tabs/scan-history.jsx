import { useMemo, useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { DateFormatter } from '@/components/custom/date-formatter';
import Table from '@/components/custom/table';
import { VulnerabilityLables } from '@/components/custom/vulnerability-labels';
import AuthorityGuard from '../../../../../components/custom/authority-guard/AuthorityGuard';
import { StatusBadge } from '../../../../../components/custom/status-badge';
import {
  useGetApisecProjectScanHistoryQuery,
  useStopScanMutation,
} from '../../../../../services/apisec/projectsApi';

function ScanHistory() {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSeverityClick = (item) => {
    const severityMap = {
      C: 'critical',
      H: 'high',
      M: 'medium',
      L: 'low',
      I: 'info',
    };
    const severity = severityMap[item.label];
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set('tab', 'Vulnerabilities');
      newParams.set('severity', severity);
      return newParams;
    });
  };

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const [hasActiveScan, setHasActiveScan] = useState(false);

  const {
    data: scanHistoryData,
    isLoading,
    error,
  } = useGetApisecProjectScanHistoryQuery(
    {
      projectId: params.id,
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    },
    {
      // Poll every 5 seconds if there's an active scan
      pollingInterval: hasActiveScan ? 5000 : 0,
      refetchOnMountOrArgChange: true,
    },
  );

  // Update hasActiveScan based on the returned data
  useMemo(() => {
    if (scanHistoryData?.data) {
      const active = scanHistoryData.data.some((scan) =>
        ['pending', 'queued', 'crawling', 'scanning'].includes(scan.status),
      );
      setHasActiveScan(active);
    }
  }, [scanHistoryData]);

  const [stopScan, { isLoading: isStopping }] = useStopScanMutation();

  const handleStopScan = (scanId) => {
    toast.promise(stopScan({ projectId: params.id, scanId }).unwrap(), {
      loading: 'Stopping Scan...',
      success: 'Scan stopped successfully',
      error: 'Failed to stop scan',
    });
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'status',
        header: ({ column }) => (
          <DataGridColumnHeader title="Status" column={column} />
        ),
        cell: ({ row }) => {
          const status = row.original.status;

          return <StatusBadge status={status} />;
        },
        enableSorting: false,
        meta: {
          skeleton: <Skeleton className="h-6" />,
        },
      },
      {
        accessorKey: 'total_requests',
        header: ({ column }) => (
          <DataGridColumnHeader title="Total Requests" column={column} />
        ),
        cell: ({ row }) => row.original?.metrics?.total_requests || 0,
        enableSorting: true,
        meta: {
          skeleton: <Skeleton className="h-6" />,
        },
      },
      {
        accessorKey: 'total_rules',
        header: ({ column }) => (
          <DataGridColumnHeader title="Total Rules" column={column} />
        ),
        cell: ({ row }) => row.original?.metrics?.total_rules || 0,
        enableSorting: true,
        meta: {
          skeleton: <Skeleton className="h-6" />,
        },
      },
      {
        accessorKey: 'total_vulns',
        header: ({ column }) => (
          <DataGridColumnHeader title="Total Vulnerabilities" column={column} />
        ),
        cell: ({ row }) => {
          const metrics = row.original?.metrics || {};
          const items = [
            {
              label: 'C',
              number: metrics.total_critical_vulns || 0,
              color: 'text-red-500',
            },
            {
              label: 'H',
              number: metrics.total_high_vulns || 0,
              color: 'text-orange-500',
            },
            {
              label: 'M',
              number: metrics.total_medium_vulns || 0,
              color: 'text-yellow-500',
            },
            {
              label: 'L',
              number: metrics.total_low_vulns || 0,
              color: 'text-blue-500',
            },
            {
              label: 'I',
              number: metrics.total_info_vulns || 0,
              color: 'text-gray-400',
            },
          ].filter((item) => item.number > 0);

          return (
            <div className="flex items-center">
              {items.length > 0 ? (
                <VulnerabilityLables
                  items={items}
                  onItemClick={handleSeverityClick}
                />
              ) : (
                <span className="text-muted-foreground ml-2">
                  No Vulnerabilities Found
                </span>
              )}
            </div>
          );
        },
        enableSorting: true,
        meta: {
          skeleton: <Skeleton className="h-6" />,
        },
      },
      {
        accessorKey: 'start_date',
        header: ({ column }) => (
          <DataGridColumnHeader title="Start Date" column={column} />
        ),
        cell: ({ getValue }) => <DateFormatter date={getValue()} />,
        enableSorting: true,
        meta: {
          skeleton: <Skeleton className="h-6" />,
        },
      },
      // {
      //     accessorKey: 'createdAt',
      //     header: ({ column }) => (
      //         <DataGridColumnHeader title="Created At" column={column} />
      //     ),
      //     cell: ({ getValue }) => <DateFormatter date={getValue()} />,
      //     enableSorting: true,
      //     meta: {
      //         skeleton: <Skeleton className="h-6" />,
      //     },
      // },
      {
        id: 'actions',
        header: ({ column }) => (
          <DataGridColumnHeader title="" column={column} />
        ),
        cell: ({ row }) => {
          const scan = row.original;
          const canCancel = [
            'pending',
            'queued',
            'crawling',
            'scanning',
          ].includes(scan.status);

          return (
            <AuthorityGuard forbidRoles={['Auditor']}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                  <ButtonWithConfirm
                    confirm
                    variant="ghost"
                    disabled={!canCancel || isStopping}
                    dialog={
                      <p>
                        Are you sure you want to cancel this scan? This will
                        stop the process immediately.
                      </p>
                    }
                    onConfirm={() => handleStopScan(scan._id)}
                    className="w-full justify-start px-2 py-1.5 h-auto font-normal text-sm rounded-md hover:bg-accent text-left bg-transparent"
                  >
                    Cancel Scan
                  </ButtonWithConfirm>
                </DropdownMenuContent>
              </DropdownMenu>
            </AuthorityGuard>
          );
        },
        size: 50,
      },
    ],
    [isStopping, params.id],
  );

  const data = scanHistoryData?.data || [];

  return (
    <div className="space-y-4">
      <Table
        grid
        data={data}
        columns={columns}
        isLoading={isLoading}
        pagination={pagination}
        enableSorting={true}
        setPagination={setPagination}
        totalCount={scanHistoryData?.total || data.length}
        totalPages={Math.ceil(
          (scanHistoryData?.total || data.length) / pagination.pageSize,
        )}
        enableSearch={false}
        cardHeading={false}
      />
    </div>
  );
}

export default ScanHistory;
