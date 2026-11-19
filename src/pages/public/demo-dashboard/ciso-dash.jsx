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
import DonutChart from '@/components/custom/charts/reui/donut-chart';
import ReBarChart from '@/components/custom/charts/reui/bar-chart';
import ReAreaChart from '@/components/custom/charts/reui/area-chart';
import {
  Shield,
  ShieldAlert,
  Clock,
  Globe,
  Server,
  ScanLine,
  Download,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const ORG_SCORE = 72;

const VULN_SUMMARY = {
  total: 147,
  critical: 8,
  high: 31,
  medium: 62,
  low: 34,
  info: 12,
  open: 89,
  resolved: 58,
};

const SOURCE_DISTRIBUTION = [
  { source: 'SAST', critical: 2, high: 8, medium: 18, low: 12, total: 40 },
  { source: 'DAST', critical: 4, high: 14, medium: 26, low: 10, total: 54 },
  { source: 'SCA', critical: 1, high: 5, medium: 12, low: 8, total: 26 },
  { source: 'Manual PT', critical: 1, high: 4, medium: 6, low: 4, total: 15 },
  { source: 'Red Team', critical: 0, high: 0, medium: 0, low: 0, total: 12 },
];

const EXPOSURE_DATA = {
  exposed: 23,
  secured: 89,
  total: 112,
};

const SCAN_TIMELINE = [
  { month: 'May 2025', scans: 12, findings: 34 },
  { month: 'Jun 2025', scans: 18, findings: 45 },
  { month: 'Jul 2025', scans: 15, findings: 28 },
  { month: 'Aug 2025', scans: 22, findings: 52 },
  { month: 'Sep 2025', scans: 20, findings: 38 },
  { month: 'Oct 2025', scans: 25, findings: 41 },
  { month: 'Nov 2025', scans: 19, findings: 29 },
  { month: 'Dec 2025', scans: 28, findings: 55 },
  { month: 'Jan 2026', scans: 31, findings: 48 },
  { month: 'Feb 2026', scans: 27, findings: 36 },
  { month: 'Mar 2026', scans: 34, findings: 42 },
  { month: 'Apr 2026', scans: 30, findings: 39 },
];

const BUSINESS_APPS = [
  { name: 'Customer Portal', department: 'Engineering', open: 14, resolved: 28, critical: 2, high: 5, medium: 4, low: 3, remediation: 67 },
  { name: 'Payment Gateway', department: 'Finance', open: 8, resolved: 12, critical: 1, high: 3, medium: 3, low: 1, remediation: 60 },
  { name: 'Internal HR Suite', department: 'HR', open: 5, resolved: 18, critical: 0, high: 2, medium: 2, low: 1, remediation: 78 },
  { name: 'Mobile Banking App', department: 'Product', open: 11, resolved: 6, critical: 3, high: 4, medium: 3, low: 1, remediation: 35 },
  { name: 'API Gateway (Kong)', department: 'Platform', open: 7, resolved: 10, critical: 0, high: 3, medium: 2, low: 2, remediation: 59 },
  { name: 'CI/CD Pipeline', department: 'DevOps', open: 3, resolved: 9, critical: 0, high: 1, medium: 1, low: 1, remediation: 75 },
  { name: 'Data Analytics Platform', department: 'Data', open: 6, resolved: 4, critical: 1, high: 2, medium: 2, low: 1, remediation: 40 },
];

const ASSETS = [
  { name: 'portal.acme.com', type: 'Domain', status: 'Exposed', lastScan: '2026-04-10', vulns: 14 },
  { name: 'api.acme.com', type: 'Domain', status: 'Secured', lastScan: '2026-04-09', vulns: 7 },
  { name: '10.0.1.50', type: 'IP', status: 'Exposed', lastScan: '2026-04-08', vulns: 5 },
  { name: 'AWS us-east-1 (prod)', type: 'Cloud', status: 'Secured', lastScan: '2026-04-10', vulns: 9 },
  { name: 'payments.acme.com', type: 'Domain', status: 'Exposed', lastScan: '2026-04-07', vulns: 8 },
  { name: '10.0.2.100', type: 'IP', status: 'Secured', lastScan: '2026-04-06', vulns: 2 },
  { name: 'GCP europe-west1', type: 'Cloud', status: 'Secured', lastScan: '2026-04-10', vulns: 4 },
  { name: 'mobile-api.acme.com', type: 'Domain', status: 'Exposed', lastScan: '2026-04-09', vulns: 11 },
  { name: 'staging.acme.com', type: 'Domain', status: 'Secured', lastScan: '2026-04-05', vulns: 3 },
  { name: 'Azure westus2 (DR)', type: 'Cloud', status: 'Secured', lastScan: '2026-04-04', vulns: 1 },
  { name: '192.168.1.25', type: 'IP', status: 'Exposed', lastScan: '2026-04-03', vulns: 6 },
  { name: 'hr.internal.acme.com', type: 'Domain', status: 'Secured', lastScan: '2026-04-10', vulns: 5 },
];

// ─── Score Ring SVG ───────────────────────────────────────────────────────────

function ScoreRing({ score, size = 200, strokeWidth = 14 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const remaining = circumference - progress;

  const getColor = (s) => {
    if (s >= 80) return { stroke: '#22c55e', text: 'text-green-500', label: 'Strong', bg: 'from-green-500/10 to-emerald-500/5' };
    if (s >= 60) return { stroke: '#f59e0b', text: 'text-amber-500', label: 'Moderate', bg: 'from-amber-500/10 to-yellow-500/5' };
    return { stroke: '#ef4444', text: 'text-red-500', label: 'Critical', bg: 'from-red-500/10 to-rose-500/5' };
  };

  const c = getColor(score);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--border)"
            strokeWidth={strokeWidth}
            opacity={0.3}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={c.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={`${progress} ${remaining}`}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-5xl font-bold tabular-nums ${c.text}`}>{score}</span>
          <span className="text-xs text-muted-foreground font-medium mt-0.5">out of 100</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <div className={`h-2 w-2 rounded-full`} style={{ backgroundColor: c.stroke }} />
        <span className={`text-sm font-medium ${c.text}`}>{c.label} Security Posture</span>
      </div>
    </div>
  );
}

// ─── Dimension Score Bar ──────────────────────────────────────────────────────

function DimensionScore({ label, score, icon: Icon, color }) {
  const getBarColor = (s) => {
    if (s >= 80) return 'bg-green-500';
    if (s >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${color}`}>
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-foreground">{label}</span>
          <span className="text-xs font-semibold tabular-nums text-foreground">{score}%</span>
        </div>
        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${getBarColor(score)}`}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({ label, value, sub, icon: Icon, trend, trendValue }) {
  return (
    <Card>
      <CardContent className="p-5 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground font-medium">{label}</p>
          {Icon && (
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted">
              <Icon size={15} className="text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="flex items-end gap-2">
          <p className="text-2xl font-semibold tabular-nums text-foreground">{value}</p>
          {trend && (
            <div className={`flex items-center gap-0.5 text-xs font-medium mb-0.5 ${trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
              {trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {trendValue}
            </div>
          )}
        </div>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      </CardContent>
    </Card>
  );
}

// ─── Severity Dot ─────────────────────────────────────────────────────────────

function SevDot({ count, color }) {
  if (!count) return <span className="text-muted-foreground tabular-nums">—</span>;
  return <span className={`tabular-nums font-medium ${color}`}>{count}</span>;
}

// ─── Status Badge Style Map ───────────────────────────────────────────────────

const STATUS_STYLES = {
  Exposed: 'bg-red-50 text-red-700 border-red-200',
  Secured: 'bg-green-50 text-green-700 border-green-200',
};

const TYPE_STYLES = {
  Domain: 'bg-blue-50 text-blue-700 border-blue-200',
  IP: 'bg-violet-50 text-violet-700 border-violet-200',
  Cloud: 'bg-sky-50 text-sky-700 border-sky-200',
  App: 'bg-orange-50 text-orange-700 border-orange-200',
};

function StatusBadge({ status }) {
  const cls = STATUS_STYLES[status] ?? 'bg-muted text-muted-foreground border-border';
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${cls}`}>
      {status}
    </span>
  );
}

function TypeBadge({ type }) {
  const cls = TYPE_STYLES[type] ?? 'bg-muted text-muted-foreground border-border';
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${cls}`}>
      {type}
    </span>
  );
}

// ─── CSV Export ───────────────────────────────────────────────────────────────

function downloadAssetsCSV() {
  const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const headers = ['Asset', 'Type', 'Status', 'Last Scan', 'Vulnerabilities'];
  const rows = ASSETS.map((a) => [a.name, a.type, a.status, a.lastScan, a.vulns]);
  const lines = [headers.map(escape).join(','), ...rows.map((r) => r.map(escape).join(','))];
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'eagleview-assets.csv'; a.click();
  URL.revokeObjectURL(url);
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CisoDashPage() {
  // Computed KPIs
  const mttr = 4.2;
  const scanCoverage = Math.round((ASSETS.filter(a => a.lastScan >= '2026-04-01').length / ASSETS.length) * 100);

  // Severity donut data
  const sevDonutData = [
    { name: 'Critical', value: VULN_SUMMARY.critical, fill: '#ef4444' },
    { name: 'High', value: VULN_SUMMARY.high, fill: '#f97316' },
    { name: 'Medium', value: VULN_SUMMARY.medium, fill: '#eab308' },
    { name: 'Low', value: VULN_SUMMARY.low, fill: '#3b82f6' },
    { name: 'Info', value: VULN_SUMMARY.info, fill: '#8b5cf6' },
  ];

  // Exposure donut data
  const exposureDonutData = [
    { name: 'Exposed', value: EXPOSURE_DATA.exposed, fill: '#ef4444' },
    { name: 'Secured', value: EXPOSURE_DATA.secured, fill: '#22c55e' },
  ];

  // Source bar chart data
  const sourceBarData = SOURCE_DISTRIBUTION.map((s) => ({
    name: s.source,
    findings: s.total,
    fill: { SAST: '#3b82f6', DAST: '#f97316', SCA: '#8b5cf6', 'Manual PT': '#22c55e', 'Red Team': '#ef4444' }[s.source],
  }));

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* ─── Page Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-foreground">EagleView — Security Posture</h1>
        <p className="text-sm text-muted-foreground">
          Holistic security posture score and insights for your organization. Last evaluated: April 11, 2026.
        </p>
      </div>

      {/* ─── Hero: Score Ring + Dimension Breakdown ──────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="p-6 flex flex-col items-center justify-center gap-4">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Organization Score</p>
            <ScoreRing score={ORG_SCORE} size={190} strokeWidth={14} />
            <p className="text-xs text-muted-foreground text-center">
              Aggregated from 6 cybersecurity dimensions
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">Security Dimension Breakdown</CardTitle>
            <CardToolbar>
              <span
                data-slot="badge"
                className="inline-flex items-center justify-center border font-medium rounded-md px-[0.45rem] h-6 min-w-6 gap-1.5 text-xs"
              >
                6 Dimensions
              </span>
            </CardToolbar>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            <DimensionScore label="Vulnerability Management" score={68} icon={ShieldAlert} color="bg-red-100 text-red-600" />
            <DimensionScore label="Asset Coverage" score={79} icon={Server} color="bg-blue-100 text-blue-600" />
            <DimensionScore label="Exposure Control" score={75} icon={Globe} color="bg-amber-100 text-amber-600" />
            <DimensionScore label="Scan Frequency" score={82} icon={ScanLine} color="bg-green-100 text-green-600" />
            <DimensionScore label="Remediation Velocity" score={58} icon={Clock} color="bg-violet-100 text-violet-600" />
            <DimensionScore label="Compliance Posture" score={70} icon={Shield} color="bg-sky-100 text-sky-600" />
          </CardContent>
        </Card>
      </div>

      {/* ─── KPI Row ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KpiCard label="Total Vulnerabilities" value={VULN_SUMMARY.total} icon={ShieldAlert} sub="across all sources" trend="down" trendValue="12%" />
        <KpiCard label="Critical + High" value={VULN_SUMMARY.critical + VULN_SUMMARY.high} icon={AlertTriangle} sub="requires immediate action" trend="down" trendValue="8%" />
        <KpiCard label="MTTR (Days)" value={mttr} icon={Clock} sub="mean time to remediate" trend="down" trendValue="0.6d" />
        <KpiCard label="Exposed Assets" value={EXPOSURE_DATA.exposed} icon={Globe} sub={`of ${EXPOSURE_DATA.total} total assets`} trend="down" trendValue="3" />
        <KpiCard label="Total Assets" value={EXPOSURE_DATA.total} icon={Server} sub="domains, IPs, cloud" trend="up" trendValue="5" />
        <KpiCard label="Scan Coverage" value={`${scanCoverage}%`} icon={ScanLine} sub="scanned this month" trend="up" trendValue="7%" />
      </div>

      {/* ─── Vulnerability + Source Distribution ──────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6 items-stretch">
        <DonutChart
          data={sevDonutData}
          title="Vulnerability Severity"
          centerValue={String(VULN_SUMMARY.total)}
          centerLabel="Total Findings"
          height={240}
          className="lg:col-span-1"
          titleBadge={
            <span
              data-slot="badge"
              className="inline-flex items-center justify-center border font-medium rounded-md px-[0.45rem] h-6 min-w-6 gap-1.5 text-xs"
            >
              {VULN_SUMMARY.open} Open
            </span>
          }
        />
        <div className="lg:col-span-2">
          <ReBarChart
            data={sourceBarData}
            xKey="name"
            keys={[{ key: 'findings', label: 'Findings' }]}
            distributed
            colors={['#3b82f6', '#f97316', '#8b5cf6', '#22c55e', '#ef4444']}
            title="Findings by Source"
            height={240}
            titleBadge={
              <span
                data-slot="badge"
                className="inline-flex items-center justify-center border font-medium rounded-md px-[0.45rem] h-6 min-w-6 gap-1.5 text-xs"
              >
                {SOURCE_DISTRIBUTION.reduce((s, d) => s + d.total, 0)} Total
              </span>
            }
          />
        </div>
      </div>

      {/* ─── Exposure + Scan Activity ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6 items-stretch">
        <DonutChart
          data={exposureDonutData}
          title="Asset Exposure Status"
          centerValue={String(EXPOSURE_DATA.total)}
          centerLabel="Total Assets"
          height={240}
          className="lg:col-span-1"
          titleBadge={
            <span
              data-slot="badge"
              className="inline-flex items-center justify-center border font-medium rounded-md px-[0.45rem] h-6 min-w-6 gap-1.5 text-xs text-red-600"
            >
              {EXPOSURE_DATA.exposed} Exposed
            </span>
          }
        />
        <div className="lg:col-span-2">
          <ReAreaChart
            data={SCAN_TIMELINE}
            xKey="month"
            keys={[
              { key: 'scans', label: 'Scans' },
              { key: 'findings', label: 'Findings' },
            ]}
            colors={['#3b82f6', '#f97316']}
            title="Scan Activity (12 Months)"
            height={240}
            xTickFormatter={(v) => v.split(' ')[0]}
            titleBadge={
              <span
                data-slot="badge"
                className="inline-flex items-center justify-center border font-medium rounded-md px-[0.45rem] h-6 min-w-6 gap-1.5 text-xs"
              >
                {SCAN_TIMELINE.reduce((s, d) => s + d.scans, 0)} Total Scans
              </span>
            }
          />
        </div>
      </div>

      {/* ─── Business Application Bugs ────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Business Application Security</CardTitle>
          <CardToolbar>
            <span
              data-slot="badge"
              className="inline-flex items-center justify-center border font-medium rounded-md px-[0.45rem] h-6 min-w-6 gap-1.5 text-xs"
            >
              {BUSINESS_APPS.length} Applications
            </span>
          </CardToolbar>
        </CardHeader>
        <CardTable>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-56">Application</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-center">Open</TableHead>
                <TableHead className="text-center">Resolved</TableHead>
                <TableHead className="text-center text-red-500">Crit</TableHead>
                <TableHead className="text-center text-orange-500">High</TableHead>
                <TableHead className="text-center text-yellow-600">Med</TableHead>
                <TableHead className="text-center text-blue-500">Low</TableHead>
                <TableHead className="text-center">Remediation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {BUSINESS_APPS.map((app) => (
                <TableRow key={app.name}>
                  <TableCell className="font-medium">{app.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{app.department}</TableCell>
                  <TableCell className="text-center tabular-nums">{app.open}</TableCell>
                  <TableCell className="text-center tabular-nums">{app.resolved}</TableCell>
                  <TableCell className="text-center"><SevDot count={app.critical} color="text-red-600" /></TableCell>
                  <TableCell className="text-center"><SevDot count={app.high} color="text-orange-500" /></TableCell>
                  <TableCell className="text-center"><SevDot count={app.medium} color="text-yellow-600" /></TableCell>
                  <TableCell className="text-center"><SevDot count={app.low} color="text-blue-500" /></TableCell>
                  <TableCell className="text-center min-w-32">
                    <div className="flex flex-col gap-1 items-center">
                      <Progress value={app.remediation} className="h-1.5 w-24" />
                      <span className="text-xs text-muted-foreground">{app.remediation}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardTable>
      </Card>

      {/* ─── All Organization Assets ──────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">All Organization Assets</CardTitle>
          <CardToolbar>
            <span
              data-slot="badge"
              className="inline-flex items-center justify-center border font-medium rounded-md px-[0.45rem] h-6 min-w-6 gap-1.5 text-xs"
            >
              {ASSETS.length} Assets
            </span>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={downloadAssetsCSV}>
              <Download size={14} />
              Export CSV
            </Button>
          </CardToolbar>
        </CardHeader>
        <CardTable>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-56">Asset</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Scanned</TableHead>
                <TableHead className="text-center">Vulnerabilities</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ASSETS.map((asset) => (
                <TableRow key={asset.name}>
                  <TableCell className="font-medium">{asset.name}</TableCell>
                  <TableCell><TypeBadge type={asset.type} /></TableCell>
                  <TableCell><StatusBadge status={asset.status} /></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{asset.lastScan}</TableCell>
                  <TableCell className="text-center">
                    <span
                      data-slot="badge"
                      className="inline-flex items-center justify-center border font-medium rounded-md px-[0.45rem] h-6 min-w-6 gap-1.5 text-xs"
                    >
                      {asset.vulns}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardTable>
      </Card>
    </div>
  );
}
