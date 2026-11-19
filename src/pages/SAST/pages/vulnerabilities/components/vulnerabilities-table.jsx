import React, { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Play, Send, ExternalLink, Link2, RefreshCcw } from 'lucide-react';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import Table from '@/components/custom/table';
import TableToolbarFilters from '@/components/common/table-toolbar-filters';
import { EmptyScreen } from '@/components/common/empty-screen';
import { useSendSastVulnToVmMutation } from '@/services/sast/vulnerabilitiesApi';
import { toast } from 'sonner';
import SeverityLabel from '../../../../../components/custom/severity-label';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { CustomTooltip } from '@/components/custom/tooltip';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';

function SendToVM({ row, iconOnly = false, disableSync }) {
  const [sendToVm, { isLoading: isSending }] = useSendSastVulnToVmMutation();

  const item = row?.original || row;
  const isDisabled =
    disableSync !== undefined
      ? disableSync
      : item?.vm_configured === false ||
        item?.vmConfigured === false ||
        item?.projectId?.[0]?.vm_configuration_exists === false;

  const handleSendToVm = () => {
    const targetId = String(item?._id || item?.id || item?.vulnerabilityID || '');
    toast.promise(sendToVm({ vulnerabilityId: targetId }).unwrap(), {
      loading: 'Sending to VM',
      error: (err) => {
        return err?.data?.message || 'Failed to send to VM';
      },
      success: 'Vuln sent to VM successful',
    });
  };

  return item?.sentToVm ? (
    <Button
      className="cursor-pointer h-7 text-[11px] flex gap-1.5 items-center border-dashed"
      variant="outline"
      size="sm"
      onClick={() =>
        window.open(
          `/vm/vulnerability-report?id=${item?.universalVulnId}&assessmentId=${item?.assessmentId}`,
          '_blank',
        )
      }
    >
      <Link2 size={12} />
      View Ticket
    </Button>
  ) : (
    <AuthorityGuard forbidRoles={['Auditor']}>
      {isDisabled ? (
        <CustomTooltip text="Configure assessment in application setting">
          <span>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-[11px] flex gap-1.5 items-center border-dashed"
              disabled
            >
              <RefreshCcw size={12} />
              Send to VM
            </Button>
          </span>
        </CustomTooltip>
      ) : (
        <ButtonWithConfirm
          confirm={true}
          confirmTitle="Send to VM"
          dialog="Are you sure you want to send this vulnerability to Vulnerability Management (VM)? A new ticket will be created for centralized tracking, assessment, and remediation planning."
          confirmVariant="info"
          variant="outline"
          size="sm"
          className="h-7 text-[11px] flex gap-1.5 items-center border-dashed"
          onConfirm={() => handleSendToVm()}
          disabled={isSending}
        >
          <RefreshCcw size={12} className={isSending ? 'animate-spin' : ''} />
          Send to VM
        </ButtonWithConfirm>
      )}
    </AuthorityGuard>
  );
}

function getColumns(disableSync) {
  return [
    {
      id: 'vulnerabilityID',
      accessorFn: (row) => row.vulnerabilityID,
      header: ({ column }) => <DataGridColumnHeader title="Vulnerability ID" column={column} />,
      cell: ({ row }) => (
        <a
          href={row.original.primaryURL}
          target="_blank"
          rel="noreferrer"
          className="hover:underline font-medium"
        >
          <span>{row.original.vulnerabilityID}</span>
        </a>
      ),
      enableSorting: false,
      size: 180,
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'pkgName',
      accessorFn: (row) => row.pkgName,
      header: ({ column }) => <DataGridColumnHeader title="Package Name" column={column} />,
      cell: ({ row }) => (
        <span className="truncate block max-w-full font-medium" title={row.original.pkgName}>
          {row.original.pkgName}
        </span>
      ),
      enableSorting: false,
      size: 160,
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'installedVersion',
      accessorFn: (row) => row.installedVersion,
      header: ({ column }) => <DataGridColumnHeader title="Installed Version" column={column} />,
      cell: ({ row }) => {
        const ver = row.original.installedVersion || 'N/A';
        const formatted = ver.startsWith('v') ? ver : `v${ver}`;
        return <span>{formatted}</span>;
      },
      enableSorting: false,
      size: 140,
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'fixedVersion',
      accessorFn: (row) => row.fixedVersion,
      header: ({ column }) => <DataGridColumnHeader title="Fixed Version" column={column} />,
      cell: ({ row }) => {
        const ver = row.original.fixedVersion;
        if (!ver) return <span>N/A</span>;
        const formatted = ver.startsWith('v') ? ver : `v${ver}`;
        return <span>{formatted}</span>;
      },
      enableSorting: false,
      size: 140,
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'projectName',
      accessorFn: (row) => row.projectName,
      header: ({ column }) => <DataGridColumnHeader title="Project" column={column} />,
      cell: ({ row }) => (
        <span className="truncate block max-w-full" title={row.original.projectName}>
          {row.original.projectName || ''}
        </span>
      ),
      enableSorting: false,
      size: 160,
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'severity',
      accessorFn: (row) => row.severity,
      header: ({ column }) => <DataGridColumnHeader title="Severity" column={column} />,
      cell: ({ row }) => (
        <SeverityLabel severity={row.original.severity} score={row.original.cvssScore}/>
      ),
      enableSorting: false,
      size: 120,
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },

    {
      id: 'status',
      accessorFn: (row) => row.status,
      header: ({ column }) => <DataGridColumnHeader title="Status" column={column} />,
      cell: ({ row }) => (
        <Badge variant="secondary">
          {row.original.status || 'In review'}
        </Badge>
      ),
      enableSorting: false,
      size: 130,
      meta: {
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'vmTicket',
      accessorFn: (row) => row._id,
      header: ({ column }) => (
        <DataGridColumnHeader title="VM Ticket" column={column} />
      ),
      cell: ({ row }) => <SendToVM row={row.original} iconOnly={false} disableSync={disableSync} />,
      enableSorting: false,
      size: 140,
      meta: {
        cellClassName: '',
        skeleton: <Skeleton className="h-7" />,
      },
    },
    {
      id: 'actions',
      header: ({ column }) => <DataGridColumnHeader title="" column={column} />,
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" mode="icon" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem
                className="gap-2 cursor-pointer"
                onClick={() => window.open(row.original.primaryURL, '_blank')}
              >
                <span>View Advisory (NVD)</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableSorting: false,
      size: 60,
      meta: {
        cellClassName: 'text-center',
        skeleton: <Skeleton className="h-7" />,
      },
    },
  ];
}

export function VulnerabilitiesTable({
  vulnsList = [],
  advancedFilters,
  isLoading,
  searchQuery,
  setSearchQuery,
  filters = {},
  setFilters,
  availableProjects = [],
  availableEcosystems = [],
  totalCount,
  totalPages,
  pagination,
  setPagination,
  sorting,
  setSorting,
  handleRunScan,
  isScanning,
  disableSync,
}) {
  const columns = useMemo(
    () => getColumns(disableSync),
    [disableSync],
  );

  const supportedFilters = useMemo(() => {
    if (advancedFilters?.length) return advancedFilters;
    return [
      {
        key: 'severity',
        name: 'Severity',
        options: [
          { label: 'Critical', value: 'CRITICAL' },
          { label: 'High', value: 'HIGH' },
          { label: 'Medium', value: 'MEDIUM' },
          { label: 'Low', value: 'LOW' },
        ],
      },
      {
        key: 'projectName',
        name: 'Project',
        options: availableProjects.map((p) => ({ label: p, value: p })),
      },
      {
        key: 'status',
        name: 'Status',
        options: [
          { label: 'Patch Available', value: 'Patch Available' },
          { label: 'Vulnerable', value: 'Vulnerable' },
          { label: 'Fixed', value: 'Fixed' },
        ],
      },
      {
        key: 'ecosystem',
        name: 'Ecosystem',
        options: availableEcosystems.map((eco) => ({ label: eco.toUpperCase(), value: eco })),
      },
    ];
  }, [advancedFilters, availableProjects, availableEcosystems]);

  const toolbar = (
    <TableToolbarFilters
      supportedFilters={supportedFilters}
      filters={filters}
      setFilters={setFilters}
    />
  );

  if (!isLoading && vulnsList.length === 0 && !searchQuery && Object.keys(filters).length === 0) {
    return (
      <EmptyScreen
        title="No Vulnerabilities Found"
        subTitle="Run the security scanner on repository folders to discover open-source vulnerabilities."
        engage={
          <Button
            variant="outline"
            size="sm"
            className="mt-2 gap-2"
            disabled={isScanning}
            onClick={handleRunScan}
          >
            <Play className="size-3.5" />
            <span>Execute Security Scan</span>
          </Button>
        }
      />
    );
  }

  return (
    <Table
      data={vulnsList}
      columns={columns}
      enableSorting={true}
      isLoading={isLoading}
      totalCount={totalCount}
      totalPages={totalPages}
      pagination={pagination}
      setPagination={setPagination}
      sorting={sorting}
      setSorting={setSorting}
      search={searchQuery}
      searchPlaceholder="Search CVE, package..."
      setSearch={(val) => {
        setSearchQuery(val);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
      }}
      toolbar={toolbar}
      grid={true}
    />
  );
}
