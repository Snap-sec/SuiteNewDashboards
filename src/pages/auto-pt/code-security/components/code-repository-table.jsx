import { Code2, GitBranch, MoreHorizontal } from 'lucide-react';
import { SiBitbucket } from 'react-icons/si';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import { DateFormatter } from '@/components/custom/date-formatter';
import { StatusBadge } from '@/components/custom/status-badge';
import Table from '@/components/custom/table';

const severities = [
  { key: 'critical', label: 'Critical', short: 'C', color: 'bg-red-600' },
  { key: 'high', label: 'High', short: 'H', color: 'bg-orange-500' },
  { key: 'medium', label: 'Medium', short: 'M', color: 'bg-yellow-400' },
  { key: 'low', label: 'Low', short: 'L', color: 'bg-blue-500' },
  { key: 'info', label: 'Info', short: 'I', color: 'bg-slate-400' },
];

function repositoryLink(project) {
  return `/apt/pentests/${project._id || project.id}?type=code-security`;
}

function getSourceCode(project) {
  return (
    project.source_code ||
    project.project_config?.source_code ||
    project.pentest_config?.source_code ||
    project.target_config?.source_code ||
    {}
  );
}

function ProviderIcon({ project }) {
  const provider = String(getSourceCode(project).provider || '').toLowerCase();
  const logos = {
    github: '/new-adapter-logos/github.svg',
    gitlab: '/new-adapter-logos/gitlab.svg',
    azure: '/new-adapter-logos/azure.svg',
    'azure-devops': '/new-adapter-logos/azure.svg',
    azure_devops: '/new-adapter-logos/azure.svg',
  };
  if (logos[provider])
    return (
      <img
        src={logos[provider]}
        alt={provider}
        className="size-5 object-contain"
      />
    );
  if (provider === 'bitbucket')
    return (
      <SiBitbucket className="size-5 text-blue-500" aria-label="Bitbucket" />
    );
  return (
    <Code2 className="size-4" aria-label={provider || 'Code repository'} />
  );
}

function textColumn(id, header, accessorFn, size = 150) {
  return {
    id,
    header,
    accessorFn,
    cell: ({ row }) => (
      <span
        className="block max-w-[220px] truncate text-sm"
        title={String(row.getValue(id) ?? '')}
      >
        {String(row.getValue(id) ?? '').replace(/_/g, ' ') || '—'}
      </span>
    ),
    size,
    enableSorting: false,
    meta: { headerTitle: header, skeleton: <Skeleton className="h-5 w-20" /> },
  };
}

function dateColumn(id, header, fallback = '—') {
  return {
    id,
    header,
    accessorFn: (project) => project[id],
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-sm">
        <DateFormatter date={row.getValue(id)} fallback={fallback} />
      </span>
    ),
    size: 170,
    enableSorting: false,
    meta: { headerTitle: header, skeleton: <Skeleton className="h-5 w-24" /> },
  };
}

function getRepositoryBranch(project) {
  const config =
    project.project_config ||
    project.pentest_config ||
    project.target_config ||
    project.config ||
    project.configuration ||
    {};
  return (
    project.source_code?.branch ||
    config.source_code?.branch ||
    project.source_config?.branch ||
    config.source_config?.branch ||
    project.branch ||
    project.default_branch
  );
}

function getLastScanAt(project) {
  const scan = project.last_scan;
  return (
    scan?.createdAt ||
    scan?.updatedAt ||
    (typeof scan === 'string' ? scan : null) ||
    project.last_scan_at ||
    project.latestScan?.createdAt
  );
}

function RepositoryActions({ project }) {
  const href = repositoryLink(project);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          mode="icon"
          aria-label={`Actions for ${project.name || 'repository'}`}
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link to={`${href}&tab=scan-history`}>Scan History</Link>
        </DropdownMenuItem>
        <AuthorityGuard forbidRoles={['Auditor']}>
          <DropdownMenuItem asChild>
            <Link to={`${href}&tab=settings`}>Settings</Link>
          </DropdownMenuItem>
        </AuthorityGuard>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function VulnerabilityBreakdown({ project }) {
  const raw = project.vuln_counts ?? project.vulnerabilities;
  const counts = Array.isArray(raw) ? raw[0] : raw;
  if (!counts || !Object.keys(counts).length)
    return <span className="text-muted-foreground">—</span>;
  const active = severities.filter(({ key }) => Number(counts[key]) > 0);
  if (!active.length)
    return (
      <span className="text-muted-foreground">
        {Number(counts.total) > 0
          ? `${counts.total} total`
          : 'No vulnerabilities'}
      </span>
    );
  return (
    <div className="flex flex-wrap items-center gap-2">
      {active.map(({ key, label, short, color }) => (
        <Badge
          key={key}
          variant="secondary"
          className="gap-1.5 whitespace-nowrap"
          title={`${label}: ${counts[key]}`}
          aria-label={`${counts[key]} ${label.toLowerCase()} vulnerabilities`}
        >
          <span className={`size-1.5 shrink-0 rounded-full ${color}`} />
          {counts[key]} {short}
        </Badge>
      ))}
    </div>
  );
}

const columns = [
  {
    id: 'repository',
    header: 'Repository',
    accessorFn: (row) => row.name,
    cell: ({ row: { original: project } }) => (
      <Link
        to={repositoryLink(project)}
        state={{
          projectName: project.name,
          name: project.name,
          type: 'code-security',
        }}
        className="flex min-w-0 items-center gap-2.5 text-sm font-medium text-mono hover:text-primary"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-accent">
          <ProviderIcon project={project} />
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="max-w-[300px] truncate" title={project.name}>
            {project.name || 'Untitled Code Project'}
          </span>
          {project.description && (
            <span
              className="max-w-[300px] truncate text-xs font-normal text-muted-foreground"
              title={project.description}
            >
              {project.description}
            </span>
          )}
        </span>
      </Link>
    ),
    size: 300,
    enableSorting: false,
    meta: { skeleton: <Skeleton className="h-8 w-48" /> },
  },
  {
    id: 'branch',
    header: 'Branch',
    accessorFn: getRepositoryBranch,
    cell: ({ row }) => {
      const branch = row.getValue('branch');
      return branch ? (
        <span className="flex items-center gap-1.5 text-sm">
          <GitBranch className="size-3.5 shrink-0 text-muted-foreground" />
          <span className="max-w-[180px] truncate" title={branch}>
            {branch}
          </span>
        </span>
      ) : (
        <span className="text-muted-foreground">—</span>
      );
    },
    size: 160,
    enableSorting: false,
    meta: { skeleton: <Skeleton className="h-5 w-20" /> },
  },
  {
    id: 'last_scan_status',
    header: 'Last Scan Status',
    accessorFn: (project) =>
      project.last_scan_status ||
      project.last_scan?.status ||
      project.latestScan?.status ||
      project.status ||
      'Not Scanned',
    cell: ({ row }) => (
      <StatusBadge status={row.getValue('last_scan_status')} />
    ),
    size: 160,
    enableSorting: false,
    meta: { skeleton: <Skeleton className="h-5 w-24" /> },
  },
  // textColumn('scan_type', 'Scan Type', (project) =>
  //   project.scan_type?.toUpperCase(),
  // ),
  textColumn(
    'frequency',
    'Frequency',
    (project) => project.scan_config?.frequency,
  ),
  // textColumn('env', 'Environment', (project) => project.env),
  {
    id: 'vuln_counts',
    header: 'Vulnerability Breakdown',
    accessorFn: (project) => project.vuln_counts ?? project.vulnerabilities,
    cell: ({ row }) => <VulnerabilityBreakdown project={row.original} />,
    size: 200,
    enableSorting: false,
    meta: { skeleton: <Skeleton className="h-5 w-40" /> },
  },
  {
    id: 'last_scan_at',
    header: 'Last Scan At',
    accessorFn: getLastScanAt,
    cell: ({ row }) => {
      const date = row.getValue('last_scan_at');
      return (
        <span className="whitespace-nowrap text-sm">
          <DateFormatter date={date} fallback="Never Scanned" />
        </span>
      );
    },
    size: 170,
    enableSorting: false,
    meta: { skeleton: <Skeleton className="h-5 w-24" /> },
  },
  dateColumn('future_scan', 'Next Scan', 'Not scheduled'),
  dateColumn('createdAt', 'Created At'),
  dateColumn('updatedAt', 'Updated At'),
  textColumn(
    'provider',
    'Provider',
    (project) => getSourceCode(project).provider,
  ),
  textColumn(
    'source_type',
    'Source Type',
    (project) => getSourceCode(project).type,
  ),
  textColumn('notes', 'Notes', (project) => project.notes, 220),
  {
    id: 'actions',
    header: () => null,
    cell: ({ row }) => <RepositoryActions project={row.original} />,
    size: 60,
    enableSorting: false,
    enableHiding: false,
    meta: {
      cellClassName: 'text-center',
      skeleton: <Skeleton className="size-7" />,
    },
  },
];

export default function CodeRepositoryTable(props) {
  return (
    <Table
      {...props}
      columns={columns}
      initialColumnVisibility={{
        future_scan: false,
        createdAt: false,
        updatedAt: false,
        provider: false,
        source_type: false,
        notes: false,
      }}
      searchPlaceholder="Search repos..."
    />
  );
}
