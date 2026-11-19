import {
  Card,
  CardHeader,
  CardTitle,
  CardTable,
  CardToolbar,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

// ─── Raw Data ─────────────────────────────────────────────────────────────────

const ASSESSMENTS = [
  {
    id: '69d6094909236700131c66ca',
    title: 'Backlog Issues',
    category: 'Penetration Testing',
    state: 'Running',
    type: 'greyBox',
    scope: 'N/A',
    startDate: '2026-04-08',
    endDate: null,
    totalVulns: 2,
    openVulns: 2,
    resolvedVulns: 0,
    remediationProgress: 0,
    vulnMetrics: { critical: 0, high: 1, medium: 1, low: 0, info: 0 },
    collaborators: 8,
    department: 'Engineering',
  },
  {
    id: '69d508163404f100120b4dbf',
    title: 'API Gateway Migration (Kong)',
    category: 'Penetration Testing',
    state: 'Completed',
    type: 'greyBox',
    scope: 'N/A',
    startDate: '2026-04-07',
    endDate: '2026-04-09',
    totalVulns: 7,
    openVulns: 7,
    resolvedVulns: 0,
    remediationProgress: 0,
    vulnMetrics: { critical: 0, high: 1, medium: 6, low: 0, info: 0 },
    collaborators: 7,
    department: '—',
  },
  {
    id: '69d4a8ea52970200127b00b2',
    title: 'Dagster',
    category: 'Penetration Testing',
    state: 'Completed',
    type: 'greyBox',
    scope: 'Full Application',
    startDate: '2026-04-07',
    endDate: '2026-04-07',
    totalVulns: 3,
    openVulns: 3,
    resolvedVulns: 0,
    remediationProgress: 0,
    vulnMetrics: { critical: 0, high: 1, medium: 0, low: 2, info: 0 },
    collaborators: 8,
    department: 'Engineering',
  },
  {
    id: '69b0051afbba310012095b66',
    title: 'HR Offboarding — PT',
    category: 'Penetration Testing',
    state: 'Not Configured',
    type: 'greyBox',
    scope: 'https://offboarding.internal.hala.com/',
    startDate: null,
    endDate: null,
    totalVulns: 0,
    openVulns: 0,
    resolvedVulns: 0,
    remediationProgress: 0,
    vulnMetrics: { critical: 0, high: 0, medium: 0, low: 0, info: 0 },
    collaborators: 3,
    department: '—',
  },
  {
    id: '69a9457ac3a8ba00124d8eae',
    title: 'Red Team — Feb 2026',
    category: 'Red Team Exercises',
    state: 'Completed',
    type: 'greyBox',
    scope: 'Whole environment',
    startDate: '2026-03-05',
    endDate: '2026-04-05',
    totalVulns: 12,
    openVulns: 10,
    resolvedVulns: 1,
    remediationProgress: 17,
    vulnMetrics: { critical: 1, high: 3, medium: 7, low: 1, info: 0 },
    collaborators: 13,
    department: 'Engineering',
  },
  {
    id: '69a00ba959449200127055f9',
    title: 'APIs Exposed via Kong Gateway',
    category: 'Penetration Testing',
    state: 'Completed',
    type: 'greyBox',
    scope: 'gateway-stg.hala.com',
    startDate: '2026-02-26',
    endDate: '2026-03-05',
    totalVulns: 10,
    openVulns: 10,
    resolvedVulns: 0,
    remediationProgress: 0,
    vulnMetrics: { critical: 0, high: 5, medium: 5, low: 0, info: 0 },
    collaborators: 11,
    department: '—',
  },
  {
    id: '69899b00b628180012db3493',
    title: 'EDD Request Issue',
    category: 'Penetration Testing',
    state: 'Completed',
    type: 'greyBox',
    scope: 'N/A',
    startDate: null,
    endDate: '2026-02-11',
    totalVulns: 1,
    openVulns: 1,
    resolvedVulns: 0,
    remediationProgress: 0,
    vulnMetrics: { critical: 0, high: 1, medium: 0, low: 0, info: 0 },
    collaborators: 37,
    department: 'Engineering',
  },
  {
    id: '697f0997864e7a0012cc9956',
    title: 'Checkmarx',
    category: 'SCA (Software Composition Analysis)',
    state: 'Not Configured',
    type: 'greyBox',
    scope: 'All Github Repos',
    startDate: null,
    endDate: null,
    totalVulns: 0,
    openVulns: 0,
    resolvedVulns: 0,
    remediationProgress: 0,
    vulnMetrics: { critical: 0, high: 0, medium: 0, low: 0, info: 0 },
    collaborators: 44,
    department: 'Engineering',
  },
];

// ─── CSV Export ───────────────────────────────────────────────────────────────

function downloadCSV() {
  const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const headers = ['Title', 'Category', 'State', 'Scope', 'Start', 'End', 'Total Vulns', 'Open', 'Resolved', 'Critical', 'High', 'Medium', 'Low', 'Remediation %', 'Department'];
  const rows = ASSESSMENTS.map((a) => [
    a.title, a.category, a.state, a.scope,
    a.startDate ?? '—', a.endDate ?? '—',
    a.totalVulns, a.openVulns, a.resolvedVulns,
    a.vulnMetrics.critical, a.vulnMetrics.high, a.vulnMetrics.medium, a.vulnMetrics.low,
    a.remediationProgress, a.department,
  ]);
  const lines = [headers.map(escape).join(','), ...rows.map((r) => r.map(escape).join(','))];
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'security-assessments.csv'; a.click();
  URL.revokeObjectURL(url);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATE_STYLES = {
  'Completed':      'bg-green-50 text-green-700 border-green-200',
  'Running':        'bg-blue-50 text-blue-700 border-blue-200',
  'Not Configured': 'bg-gray-100 text-gray-500 border-gray-200',
  'Paused':         'bg-yellow-50 text-yellow-700 border-yellow-200',
};

const CATEGORY_STYLES = {
  'Penetration Testing':                  'bg-violet-50 text-violet-700 border-violet-200',
  'Red Team Exercises':                   'bg-red-50 text-red-700 border-red-200',
  'SCA (Software Composition Analysis)':  'bg-orange-50 text-orange-700 border-orange-200',
  'SAST (Static Application Security Testing)': 'bg-sky-50 text-sky-700 border-sky-200',
};

function StateBadge({ state }) {
  const cls = STATE_STYLES[state] ?? 'bg-muted text-muted-foreground border-border';
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${cls}`}>
      {state}
    </span>
  );
}

function CategoryBadge({ category }) {
  const cls = CATEGORY_STYLES[category] ?? 'bg-muted text-muted-foreground border-border';
  const short = {
    'Penetration Testing': 'Pentest',
    'Red Team Exercises': 'Red Team',
    'SCA (Software Composition Analysis)': 'SCA',
    'SAST (Static Application Security Testing)': 'SAST',
  }[category] ?? category;
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${cls}`}>
      {short}
    </span>
  );
}

function SevDot({ count, color }) {
  if (!count) return <span className="text-muted-foreground tabular-nums">—</span>;
  return <span className={`tabular-nums font-medium ${color}`}>{count}</span>;
}

// ─── KPI Cards ────────────────────────────────────────────────────────────────

function KpiCard({ label, value, sub }) {
  return (
    <Card>
      <CardContent className="p-5 flex flex-col gap-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-2xl font-semibold tabular-nums">{value}</p>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      </CardContent>
    </Card>
  );
}

// ─── Assessments Table ────────────────────────────────────────────────────────

function AssessmentsTable() {
  const totalVulns = ASSESSMENTS.reduce((s, a) => s + a.totalVulns, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">All Security Assessments</CardTitle>
        <CardToolbar>
          <span
            data-slot="badge"
            className="inline-flex items-center justify-center border font-medium rounded-md px-[0.45rem] h-6 min-w-6 gap-1.5 text-xs"
          >
            {ASSESSMENTS.length} Assessments
          </span>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={downloadCSV}>
            <Download size={14} />
            Export CSV
          </Button>
        </CardToolbar>
      </CardHeader>
      <CardTable>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-64">Assessment</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Scope</TableHead>
              <TableHead className="text-center">Total</TableHead>
              <TableHead className="text-center text-red-500">Crit</TableHead>
              <TableHead className="text-center text-orange-500">High</TableHead>
              <TableHead className="text-center text-yellow-600">Med</TableHead>
              <TableHead className="text-center text-blue-500">Low</TableHead>
              <TableHead className="text-center">Remediation</TableHead>
              <TableHead>Department</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ASSESSMENTS.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium max-w-64">
                  <div className="truncate" title={a.title}>{a.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 font-normal">
                    {a.startDate ? `Started ${a.startDate}` : 'Not started'}
                    {a.endDate ? ` · Ended ${a.endDate}` : ''}
                  </div>
                </TableCell>
                <TableCell><CategoryBadge category={a.category} /></TableCell>
                <TableCell><StateBadge state={a.state} /></TableCell>
                <TableCell>
                  <span className="text-xs text-muted-foreground max-w-40 truncate block" title={a.scope}>
                    {a.scope === 'N/A' || !a.scope ? '—' : a.scope}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span
                    data-slot="badge"
                    className="inline-flex items-center justify-center border font-medium rounded-md px-[0.45rem] h-6 min-w-6 gap-1.5 text-xs"
                  >
                    {a.totalVulns} Risks
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <SevDot count={a.vulnMetrics.critical} color="text-red-600" />
                </TableCell>
                <TableCell className="text-center">
                  <SevDot count={a.vulnMetrics.high} color="text-orange-500" />
                </TableCell>
                <TableCell className="text-center">
                  <SevDot count={a.vulnMetrics.medium} color="text-yellow-600" />
                </TableCell>
                <TableCell className="text-center">
                  <SevDot count={a.vulnMetrics.low} color="text-blue-500" />
                </TableCell>
                <TableCell className="text-center min-w-32">
                  {a.totalVulns > 0 ? (
                    <div className="flex flex-col gap-1 items-center">
                      <Progress value={a.remediationProgress} className="h-1.5 w-24" />
                      <span className="text-xs text-muted-foreground">{a.remediationProgress}%</span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{a.department}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardTable>
    </Card>
  );
}

// ─── State × Category Breakdown Table ────────────────────────────────────────

const STATES   = ['Running', 'Completed', 'Not Configured'];
const CATS     = [...new Set(ASSESSMENTS.map((a) => a.category))];

function BreakdownTable() {
  // build matrix: cat → state → count
  const matrix = {};
  CATS.forEach((c) => {
    matrix[c] = {};
    STATES.forEach((s) => { matrix[c][s] = 0; });
  });
  ASSESSMENTS.forEach((a) => {
    if (matrix[a.category] && STATES.includes(a.state)) {
      matrix[a.category][a.state]++;
    }
  });

  const catTotals = CATS.map((c) => STATES.reduce((s, st) => s + matrix[c][st], 0));
  const stateTotals = STATES.map((s) => CATS.reduce((sum, c) => sum + matrix[c][s], 0));
  const grand = stateTotals.reduce((a, b) => a + b, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Assessments by Category &amp; State</CardTitle>
        <CardToolbar>
          <span
            data-slot="badge"
            className="inline-flex items-center justify-center border font-medium rounded-md px-[0.45rem] h-6 min-w-6 gap-1.5 text-xs"
          >
            {grand} Risks
          </span>
        </CardToolbar>
      </CardHeader>
      <CardTable>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-64">Category</TableHead>
              {STATES.map((s) => (
                <TableHead key={s} className="text-center whitespace-nowrap">{s}</TableHead>
              ))}
              <TableHead className="text-center">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {CATS.map((cat, i) => (
              <TableRow key={cat}>
                <TableCell className="font-medium"><CategoryBadge category={cat} /></TableCell>
                {STATES.map((s) => (
                  <TableCell key={s} className="text-center tabular-nums">
                    {matrix[cat][s] || <span className="text-muted-foreground">—</span>}
                  </TableCell>
                ))}
                <TableCell className="text-center">
                  <span
                    data-slot="badge"
                    className="inline-flex items-center justify-center border font-medium rounded-md px-[0.45rem] h-6 min-w-6 gap-1.5 text-xs"
                  >
                    {catTotals[i]} Risks
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardTable>
    </Card>
  );
}

// ─── Vulnerability Summary Table ──────────────────────────────────────────────

function VulnSummaryTable() {
  const totals = { critical: 0, high: 0, medium: 0, low: 0, info: 0, total: 0, open: 0, resolved: 0 };
  ASSESSMENTS.forEach((a) => {
    totals.critical += a.vulnMetrics.critical;
    totals.high     += a.vulnMetrics.high;
    totals.medium   += a.vulnMetrics.medium;
    totals.low      += a.vulnMetrics.low;
    totals.info     += a.vulnMetrics.info ?? 0;
    totals.total    += a.totalVulns;
    totals.open     += a.openVulns;
    totals.resolved += a.resolvedVulns;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Vulnerability Summary by Assessment</CardTitle>
        <CardToolbar>
          <span
            data-slot="badge"
            className="inline-flex items-center justify-center border font-medium rounded-md px-[0.45rem] h-6 min-w-6 gap-1.5 text-xs"
          >
            {totals.total} Risks
          </span>
        </CardToolbar>
      </CardHeader>
      <CardTable>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-64">Assessment</TableHead>
              <TableHead className="text-center">Total</TableHead>
              <TableHead className="text-center">Open</TableHead>
              <TableHead className="text-center">Resolved</TableHead>
              <TableHead className="text-center text-red-500">Critical</TableHead>
              <TableHead className="text-center text-orange-500">High</TableHead>
              <TableHead className="text-center text-yellow-600">Medium</TableHead>
              <TableHead className="text-center text-blue-500">Low</TableHead>
              <TableHead className="text-center">Progress</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ASSESSMENTS.filter((a) => a.totalVulns > 0).map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium">{a.title}</TableCell>
                <TableCell className="text-center">
                  <span
                    data-slot="badge"
                    className="inline-flex items-center justify-center border font-medium rounded-md px-[0.45rem] h-6 min-w-6 gap-1.5 text-xs"
                  >
                    {a.totalVulns} Risks
                  </span>
                </TableCell>
                <TableCell className="text-center tabular-nums">{a.openVulns}</TableCell>
                <TableCell className="text-center tabular-nums">{a.resolvedVulns}</TableCell>
                <TableCell className="text-center"><SevDot count={a.vulnMetrics.critical} color="text-red-600" /></TableCell>
                <TableCell className="text-center"><SevDot count={a.vulnMetrics.high} color="text-orange-500" /></TableCell>
                <TableCell className="text-center"><SevDot count={a.vulnMetrics.medium} color="text-yellow-600" /></TableCell>
                <TableCell className="text-center"><SevDot count={a.vulnMetrics.low} color="text-blue-500" /></TableCell>
                <TableCell className="text-center min-w-32">
                  <div className="flex flex-col gap-1 items-center">
                    <Progress value={a.remediationProgress} className="h-1.5 w-24" />
                    <span className="text-xs text-muted-foreground">{a.remediationProgress}%</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardTable>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Metrics4Page() {
  const total        = ASSESSMENTS.length;
  const completed    = ASSESSMENTS.filter((a) => a.state === 'Completed').length;
  const running      = ASSESSMENTS.filter((a) => a.state === 'Running').length;
  const notConfigured= ASSESSMENTS.filter((a) => a.state === 'Not Configured').length;
  const totalVulns   = ASSESSMENTS.reduce((s, a) => s + a.totalVulns, 0);
  const totalOpen    = ASSESSMENTS.reduce((s, a) => s + a.openVulns, 0);
  const totalCritHigh= ASSESSMENTS.reduce((s, a) => s + a.vulnMetrics.critical + a.vulnMetrics.high, 0);
  const avgRemediation = Math.round(
    ASSESSMENTS.filter((a) => a.totalVulns > 0).reduce((s, a) => s + a.remediationProgress, 0) /
    (ASSESSMENTS.filter((a) => a.totalVulns > 0).length || 1)
  );

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-foreground">Security Exercises</h1>
        <p className="text-sm text-muted-foreground">
          Consolidated view of penetration tests, red team exercises, and security scans.
        </p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <KpiCard label="Total Assessments"  value={total}           sub={null} />
        <KpiCard label="Completed"          value={completed}       sub="exercises" />
        <KpiCard label="Running"            value={running}         sub="in progress" />
        <KpiCard label="Not Configured"     value={notConfigured}   sub="pending setup" />
        <KpiCard label="Total Findings"     value={totalVulns}      sub="across all exercises" />
        <KpiCard label="Open Findings"      value={totalOpen}       sub="unresolved" />
        <KpiCard label="Crit + High"        value={totalCritHigh}   sub="high-priority findings" />
        <KpiCard label="Avg Remediation"    value={`${avgRemediation}%`} sub="across active" />
      </div>

      {/* Breakdown table */}
      <BreakdownTable />

      {/* Full assessment list */}
      <AssessmentsTable />

      {/* Vulnerability deep-dive */}
      <VulnSummaryTable />
    </div>
  );
}
