import { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Download,
  Globe,
  Calendar,
  Users,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Building2,
  Tag,
  FileText,
  Clock,
  XCircle,
} from 'lucide-react';

// ─── Static Report Data ───────────────────────────────────────────────────────
const REPORT_DATA = {
  orgDetails: { name: 'Test Org', website: 'https://snapsec.co' },
  assessmentDetails: {
    title: 'Post-Remediation Validation & Re-testing – Q4',
    description: 'Validation of fixes implemented for vulnerabilities identified throughout the year.',
    state: 'Scheduled',
    type: 'greyBox',
    category: 'Penetration Testing',
    securityAssessmentType: 'Web Application',
    startDate: '2025-12-27T06:06:38.018Z',
    updatedAt: '2026-04-22T17:58:05.601Z',
    collaborators: [
      { name: 'Shoaib Wani', email: 'shoaib+staging@snapsec.co' },
      { name: 'MALIK ISLAM', email: 'maliktow012@gmail.com' },
    ],
    vendorName: 'Riot Valorant',
    vendorLogoUrl: 'https://img.icons8.com/?size=100&id=A46L2EnTYpnL&format=png&color=000000',
  },
  severityDistribution: { none: 0, low: 12, medium: 8, high: 1, critical: 2 },
  statusDistribution: {
    inReview: 2, inProgress: 4, fixedInStaging: 5, resolved: 4,
    retest: 0, unresolved: 0, falsePositive: 4, notApplicable: 0, duplicate: 0,
  },
  severityOpenCloseCounts: {
    critical: { open: 1, closed: 1 },
    high:     { open: 0, closed: 1 },
    medium:   { open: 4, closed: 3 },
    low:      { open: 1, closed: 8 },
  },
  slaCompliance: {
    met: 15,
    atRisk: 3,
    breached: 5,
  },
  openVulns: 6,
  closedVulns: 13,
  averageCvss: 3.39,
  totalVulns: 23,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

const SEV = {
  critical: { label: 'Critical', color: '#fb7185', bg: 'bg-muted', text: 'text-foreground',         bar: 'bg-rose-400' },
  high:     { label: 'High',     color: '#fbbf24', bg: 'bg-muted', text: 'text-muted-foreground',   bar: 'bg-amber-400' },
  medium:   { label: 'Medium',   color: '#facc15', bg: 'bg-muted', text: 'text-muted-foreground',   bar: 'bg-yellow-400' },
  low:      { label: 'Low',      color: '#38bdf8', bg: 'bg-muted', text: 'text-muted-foreground/60', bar: 'bg-sky-400' },
};

const PRINT_STYLE = `
@media print {
  body * { visibility: hidden !important; }
  #vuln-report-root, #vuln-report-root * { visibility: visible !important; }
  #vuln-report-root { position: absolute; left: 0; top: 0; width: 100%; }
  #print-action-bar { display: none !important; }
  .no-print { display: none !important; }
  @page { margin: 12mm 14mm; size: A4; }
}
`;

// ─── Donut Chart ──────────────────────────────────────────────────────────────
function SeverityDonut({ distribution }) {
  const sevKeys = ['critical', 'high', 'medium', 'low'];
  const total = sevKeys.reduce((a, k) => a + (distribution[k] || 0), 0) || 1;
  let cumulative = 0;

  const segments = sevKeys.map((k) => {
    const count = distribution[k] || 0;
    const pct = count / total;
    const start = cumulative * 2 * Math.PI - Math.PI / 2;
    cumulative += pct;
    const end = cumulative * 2 * Math.PI - Math.PI / 2;
    const r = 60, cx = 70, cy = 70;
    const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end),   y2 = cy + r * Math.sin(end);
    const largeArc = pct > 0.5 ? 1 : 0;
    if (count === 0) return null;
    if (count === total) return <circle key={k} cx={cx} cy={cy} r={r} fill={SEV[k].color} />;
    return (
      <path
        key={k}
        d={`M${cx},${cy} L${x1},${y1} A${r},${r},0,${largeArc},1,${x2},${y2} Z`}
        fill={SEV[k].color}
      />
    );
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <svg width="140" height="140" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r="60" fill="#f1f5f9" />
          {segments}
          <circle cx="70" cy="70" r="38" className="fill-background" />
          <text x="70" y="65" textAnchor="middle" fontSize="24" fontWeight="600" className="fill-foreground" letterSpacing="-0.05em">{total}</text>
          <text x="70" y="82" textAnchor="middle" fontSize="9" className="fill-muted-foreground" fontWeight="500" letterSpacing="0.05em">FINDINGS</text>
        </svg>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 w-full">
        {sevKeys.map((k) => {
          const count = distribution[k] || 0;
          const pct = total ? Math.round((count / total) * 100) : 0;
          return (
            <div key={k} className="flex items-center gap-2">
              <span className="size-3 rounded-sm shrink-0" style={{ backgroundColor: SEV[k].color }} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground capitalize font-medium">{k}</span>
                  <span className="text-xs font-semibold text-foreground tabular-nums">{count}</span>
                </div>
                <div className="h-1 w-full rounded-full bg-muted overflow-hidden mt-1">
                  <div className={`h-full rounded-full ${SEV[k].bar}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Open vs Closed ───────────────────────────────────────────────────────────
function OpenClosedPanel({ counts, openTotal, closedTotal }) {
  const sevKeys = ['critical', 'high', 'medium', 'low'];
  const grandTotal = openTotal + closedTotal || 1;

  return (
    <div className="flex flex-col gap-4">
      {/* Big numbers */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-muted/40 border border-border/40 p-3 text-center flex flex-col items-center justify-center">
          <p className="text-3xl font-semibold text-foreground tracking-tight tabular-nums">{openTotal}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5 font-medium">Open</p>
        </div>
        <div className="rounded-lg bg-muted/40 border border-border/40 p-3 text-center flex flex-col items-center justify-center">
          <p className="text-3xl font-semibold text-foreground tracking-tight tabular-nums">{closedTotal}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5 font-medium">Closed</p>
        </div>
      </div>

      {/* Stacked progress bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-muted-foreground font-medium">Closure Rate</span>
          <span className="text-xs font-semibold text-foreground">
            {Math.round((closedTotal / grandTotal) * 100)}%
          </span>
        </div>
        <div className="flex h-2 w-full rounded-full overflow-hidden bg-muted/60">
          <div
            className="h-full bg-emerald-400 transition-all"
            style={{ width: `${(closedTotal / grandTotal) * 100}%` }}
          />
          <div
            className="h-full bg-amber-400/80 transition-all"
            style={{ width: `${(openTotal / grandTotal) * 100}%` }}
          />
        </div>
        <div className="flex items-center gap-4 mt-2">
          <span className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
            <span className="inline-block size-1.5 rounded-full bg-emerald-400" /> Closed
          </span>
          <span className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
            <span className="inline-block size-1.5 rounded-full bg-amber-400" /> Open
          </span>
        </div>
      </div>

      <Separator />

      {/* Per-severity breakdown */}
      <div className="flex flex-col gap-2">
        {sevKeys.map((k) => {
          const { open, closed } = counts[k] || { open: 0, closed: 0 };
          const rowTotal = open + closed || 1;
          return (
            <div key={k} className="flex items-center gap-3">
              <span className={`text-xs font-medium w-14 shrink-0 capitalize text-muted-foreground`}>{k}</span>
              <div className="flex flex-1 h-1.5 rounded-full overflow-hidden bg-muted">
                {closed > 0 && (
                  <div
                    className="bg-emerald-400"
                    style={{ width: `${(closed / rowTotal) * 100}%` }}
                  />
                )}
                {open > 0 && (
                  <div
                    className={`${SEV[k].bar}`}
                    style={{ width: `${(open / rowTotal) * 100}%` }}
                  />
                )}
              </div>
              <span className="text-xs font-semibold text-foreground w-10 text-right tabular-nums">
                {open + closed}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Status Panel ─────────────────────────────────────────────────────────────
function StatusPanel({ statusDistribution }) {
  const statuses = [
    { key: 'resolved',       label: 'Resolved',         color: 'bg-emerald-400',           icon: CheckCircle2, variant: 'success' },
    { key: 'fixedInStaging', label: 'Fixed in Staging', color: 'bg-emerald-300',           icon: CheckCircle2, variant: 'success' },
    { key: 'inReview',       label: 'In Review',        color: 'bg-indigo-400',            icon: Clock,        variant: 'info' },
    { key: 'inProgress',     label: 'In Progress',      color: 'bg-purple-400',            icon: Clock,        variant: 'info' },
    { key: 'falsePositive',  label: 'False Positive',   color: 'bg-slate-300',             icon: XCircle,      variant: 'secondary' },
    { key: 'unresolved',     label: 'Unresolved',       color: 'bg-rose-400',              icon: AlertTriangle, variant: 'destructive' },
  ];

  const total = statuses.reduce((a, s) => a + (statusDistribution[s.key] || 0), 0) || 1;

  // Stacked bar data (light pastel)
  const colorMap = {
    resolved: '#34d399', fixedInStaging: '#6ee7b7', inReview: '#818cf8',
    inProgress: '#c084fc', falsePositive: '#cbd5e1', unresolved: '#fb7185',
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Stacked mega bar */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs text-muted-foreground font-medium">Status Distribution</span>
          <span className="text-xs text-foreground font-semibold tracking-tight">{total} total</span>
        </div>
        <div className="flex h-6 w-full rounded-lg overflow-hidden">
          {statuses.map(({ key }) => {
            const count = statusDistribution[key] || 0;
            if (!count) return null;
            return (
              <div
                key={key}
                style={{ width: `${(count / total) * 100}%`, backgroundColor: colorMap[key] }}
                className="flex items-center justify-center"
                title={key}
              >
                {count >= 2 && (
                  <span className="text-[9px] font-bold text-white/90">{count}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* Individual rows */}
      <div className="flex flex-col gap-2.5">
        {statuses.map(({ key, label, color, icon: Icon, variant }) => {
          const count = statusDistribution[key] || 0;
          const pct = Math.round((count / total) * 100);
          return (
            <div key={key} className="flex items-center gap-3">
              <div className="flex items-center gap-2 w-36 shrink-0">
                <Icon size={12} className="text-muted-foreground shrink-0" />
                <span className="text-xs text-muted-foreground truncate">{label}</span>
              </div>
              <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
                <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
              </div>
              <div className="flex items-center gap-1.5 w-14 justify-end shrink-0">
                <span className="text-xs font-semibold text-foreground tabular-nums">{count}</span>
                <span className="text-[10px] text-muted-foreground font-medium">({pct}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── SLA Compliance ───────────────────────────────────────────────────────────
function SLACompliancePanel({ slaCompliance }) {
  const { met, atRisk, breached } = slaCompliance;
  const total = met + atRisk + breached || 1;
  const metrics = [
    { label: 'Met SLA', value: met,        color: '#4ade80', barClass: 'bg-green-400' },
    { label: 'At Risk', value: atRisk,     color: '#facc15', barClass: 'bg-yellow-400' },
    { label: 'Breached',value: breached,   color: '#fb7185', barClass: 'bg-rose-400' },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Big numbers */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-muted/40 border border-border/40 p-3 text-center flex flex-col items-center justify-center">
          <p className="text-3xl font-semibold text-foreground tracking-tight tabular-nums">{met}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5 font-medium">Within SLA</p>
        </div>
        <div className="rounded-lg bg-muted/40 border border-border/40 p-3 text-center flex flex-col items-center justify-center">
          <p className="text-3xl font-semibold text-foreground tracking-tight tabular-nums">{breached}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5 font-medium">Out of SLA</p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-muted-foreground font-medium">SLA Adherence Rate</span>
          <span className="text-xs font-semibold text-foreground">
            {Math.round((met / total) * 100)}%
          </span>
        </div>
        <div className="flex h-2 w-full rounded-full overflow-hidden bg-muted/60">
          {metrics.map((m) => {
            if (!m.value) return null;
            return (
              <div
                key={m.label}
                style={{ width: `${(m.value / total) * 100}%`, backgroundColor: m.color }}
                className="h-full transition-all"
              />
            );
          })}
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-2.5">
        {metrics.map((m) => {
          const pct = Math.round((m.value / total) * 100);
          return (
            <div key={m.label} className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground font-medium w-16 shrink-0">{m.label}</span>
              <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                <div className={`h-full rounded-full ${m.barClass} transition-all`} style={{ width: `${pct}%` }} />
              </div>
              <div className="flex items-center gap-1.5 w-14 justify-end shrink-0">
                <span className="text-xs font-semibold text-foreground tabular-nums">{m.value}</span>
                <span className="text-[10px] text-muted-foreground font-medium">({pct}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AssessmentReportPage() {
  const d = REPORT_DATA;
  const { assessmentDetails: ad, orgDetails: org } = d;

  const typeLabel = ad.type === 'greyBox' ? 'Grey Box' : ad.type === 'blackBox' ? 'Black Box' : 'White Box';
  const remediationRate = Math.round((d.closedVulns / d.totalVulns) * 100);

  // Risk posture score (0–100) — weighted composite
  const riskScore = Math.round(
    100 -
      ((d.severityDistribution.critical * 30 +
        d.severityDistribution.high * 20 +
        d.severityDistribution.medium * 8 +
        d.severityDistribution.low * 2) /
        (d.totalVulns * 30)) *
        100 *
        (d.openVulns / d.totalVulns)
  );

  const riskLabel = riskScore >= 75 ? 'Good' : riskScore >= 50 ? 'Fair' : 'At Risk';
  const riskColor = riskScore >= 75 ? 'text-emerald-500' : riskScore >= 50 ? 'text-amber-500' : 'text-rose-500';
  const riskRingColor = riskScore >= 75 ? '#34d399' : riskScore >= 50 ? '#fbbf24' : '#fb7185';

  return (
    <div className="absolute inset-0 z-50 overflow-auto min-h-screen bg-muted/20 p-6">
      <style>{PRINT_STYLE}</style>

      {/* ── Report document ── */}
      <div id="vuln-report-root" className="max-w-5xl mx-auto flex flex-col gap-6">

        {/* ══ Cover Header ════════════════════════════════════════════════ */}
        <Card className="overflow-hidden border-0 shadow-sm">
          <div className="bg-foreground p-6">
            <div className="flex items-start justify-between gap-6">
              {/* Left */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded bg-background/20 flex items-center justify-center">
                    <Building2 size={15} className="text-background" />
                  </div>
                  <span className="text-xs text-background/60 uppercase tracking-widest font-semibold">
                    Executive Summary
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-background leading-tight">{ad.title}</h2>
                  <p className="text-sm text-background/65 mt-1.5 max-w-lg leading-relaxed">
                    {ad.description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 pt-1">
                  {[
                    { icon: Tag,        label: ad.category },
                    { icon: ShieldAlert,label: ad.securityAssessmentType },
                    { icon: FileText,   label: typeLabel },
                    { icon: Calendar,   label: fmt(ad.startDate) },
                    { icon: Users,      label: ad.collaborators.map(c => c.name).join(', ') },
                  ].map(({ icon: Icon, label }) => (
                    <span key={label} className="flex items-center gap-1.5 text-xs text-background/60">
                      <Icon size={11} />
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right: vendor + org */}
              <div className="shrink-0 flex flex-col items-end gap-3">
                {ad.vendorLogoUrl && (
                  <img
                    src={ad.vendorLogoUrl}
                    alt={ad.vendorName}
                    className="size-14 rounded-xl bg-background/15 object-contain p-1.5"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                )}
                <div className="text-right">
                  <p className="text-[10px] text-background/50 uppercase tracking-wider">Conducted by</p>
                  <p className="text-sm font-bold text-background">{ad.vendorName}</p>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-background/50">
                  <Globe size={10} />
                  {org.website}
                </div>
              </div>
            </div>
          </div>

          {/* sub-bar */}
          <div className="px-6 py-2.5 bg-muted/50 border-t border-border flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Report generated: <span className="font-medium text-foreground">{fmt(new Date().toISOString())}</span>
            </span>
            <Badge variant="secondary" size="sm">{ad.state}</Badge>
          </div>
        </Card>

        {/* ══ Risk Score + KPI Row ════════════════════════════════════════ */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {/* Risk Score Card — spans 1 col */}
          <Card className="sm:col-span-1 flex flex-col items-center justify-center p-4 gap-2">
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor" className="text-muted/60" strokeWidth="5" />
              <circle
                cx="40" cy="40" r="34"
                fill="none"
                stroke={riskRingColor}
                strokeWidth="5"
                strokeDasharray={`${(riskScore / 100) * 213.6} 213.6`}
                strokeLinecap="round"
                transform="rotate(-90 40 40)"
              />
              <text x="40" y="38" textAnchor="middle" fontSize="20" fontWeight="600" fill={riskRingColor} className="tracking-tight">{riskScore}</text>
              <text x="40" y="52" textAnchor="middle" fontSize="8" className="fill-muted-foreground font-medium">/ 100</text>
            </svg>
            <div className="text-center mt-1">
              <p className={`text-sm font-semibold tracking-tight ${riskColor}`}>{riskLabel}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5 font-medium">Risk Posture</p>
            </div>
          </Card>

          {/* KPIs */}
          {[
            { label: 'Total Findings',    value: d.totalVulns,             icon: ShieldAlert },
            { label: 'Open Findings',     value: d.openVulns,              icon: AlertTriangle },
            { label: 'Remediated',        value: d.closedVulns,            icon: CheckCircle2 },
            { label: 'Avg. CVSS',         value: d.averageCvss.toFixed(2), icon: TrendingUp },
          ].map(({ label, value, icon: Icon }) => (
            <Card key={label}>
              <CardContent className="p-4 flex flex-col justify-between h-full gap-2">
                <div className={`size-8 rounded-md bg-muted/40 flex items-center justify-center`}>
                  <Icon size={16} className="text-muted-foreground" />
                </div>
                <div>
                  <p className={`text-3xl font-semibold tabular-nums text-foreground tracking-tight`}>{value}</p>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">{label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ══ Remediation Bar ═════════════════════════════════════════════ */}
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span className="text-sm font-medium text-foreground tracking-tight">Overall Remediation Rate</span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">{remediationRate}% Complete</span>
              </div>
              <span className="text-xs text-muted-foreground font-medium">
                {d.closedVulns} closed · {d.openVulns} open of {d.totalVulns} total
              </span>
            </div>
            <div className="h-2 w-full rounded-full overflow-hidden flex bg-muted/60">
              <div
                className="h-full bg-emerald-400 transition-all"
                style={{ width: `${remediationRate}%` }}
              />
              <div
                className="h-full bg-amber-400/80"
                style={{ width: `${100 - remediationRate}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* ══ Four Main Charts ════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* 1 — Severity Distribution */}
          <Card>
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-sm font-medium tracking-tight text-foreground">Severity Distribution</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Breakdown of findings by risk level
              </p>
            </CardHeader>
            <CardContent className="px-5 pb-5 pt-0">
              <SeverityDonut distribution={d.severityDistribution} />
            </CardContent>
          </Card>

          {/* 2 — Open vs Closed */}
          <Card>
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-sm font-medium tracking-tight text-foreground">Open vs. Closed by Severity</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Remediation progress per severity tier
              </p>
            </CardHeader>
            <CardContent className="px-5 pb-5 pt-0">
              <OpenClosedPanel
                counts={d.severityOpenCloseCounts}
                openTotal={d.openVulns}
                closedTotal={d.closedVulns}
              />
            </CardContent>
          </Card>

          {/* 3 — Status Breakdown */}
          <Card>
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-sm font-medium tracking-tight text-foreground">Workflow Status Breakdown</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Current resolution pipeline state
              </p>
            </CardHeader>
            <CardContent className="px-5 pb-5 pt-0">
              <StatusPanel statusDistribution={d.statusDistribution} />
            </CardContent>
          </Card>

          {/* 4 — SLA Compliance */}
          <Card>
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-sm font-medium tracking-tight text-foreground">SLA Compliance</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Performance against remediation timeframes
              </p>
            </CardHeader>
            <CardContent className="px-5 pb-5 pt-0">
              <SLACompliancePanel slaCompliance={d.slaCompliance} />
            </CardContent>
          </Card>

        </div>

        {/* ══ Footer ══════════════════════════════════════════════════════ */}
        <div className="flex items-center justify-between py-3 border-t border-border text-xs text-muted-foreground">
          <span>
            Prepared by <span className="font-medium text-foreground">SnapSec VM</span> · {fmt(new Date().toISOString())}
          </span>
          <span className="font-medium text-foreground">{org.name} · <span className="font-normal text-muted-foreground">Confidential</span></span>
        </div>
      </div>
    </div>
  );
}
