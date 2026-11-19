import React from 'react';
import {
  Building2,
  MapPin,
  Globe,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Activity,
  Target,
  ShieldAlert,
  Briefcase
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// ─── Data Payload ─────────────────────────────────────────────────────────────
const REPORT_DATA = {
  orgDetails: {
    name: "Test Org",
    website: "https://snapsec.co",
    logo: "https://snapsec.co"
  },
  vulnStats: {
    aggCvss: 2.5,
    totalVulns: 490,
    openVulns: 241,
    closedVulns: 173,
    severityDistribution: {
      critical: 3,
      high: 10,
      medium: 210,
      low: 263
    },
    statusDistribution: {
      resolved: 96,
      fixedInStaging: 86,
      inReview: 81,
      inProgress: 74,
      falsePositive: 76,
      unresolved: 1,
    }
  },
  assessmentMetrics: {
    total: 58,
    completed: 22,
    pending: 36,
    byType: {
      greyBox: 29,
      whiteBox: 25,
      blackBox: 4
    },
    byState: {
      "Not Configured": 5,
      "Pending": 9,
      "Running": 12,
      "Scheduled": 10,
      "Completed": 22
    }
  },
  vulnDistribution12Months: [
    { month: "May 25", open: 14, closed: 24 },
    { month: "Jun 25", open: 20, closed: 25 },
    { month: "Jul 25", open: 19, closed: 21 },
    { month: "Aug 25", open: 22, closed: 16 },
    { month: "Sep 25", open: 27, closed: 9 },
    { month: "Oct 25", open: 26, closed: 17 },
    { month: "Nov 25", open: 16, closed: 21 },
    { month: "Dec 25", open: 18, closed: 22 },
    { month: "Jan 26", open: 25, closed: 21 },
    { month: "Feb 26", open: 17, closed: 27 },
    { month: "Mar 26", open: 17, closed: 21 },
    { month: "Apr 26", open: 15, closed: 11 }
  ],
  top5: [
    {
      title: "Credit Card Data Logged in Plaintext",
      cvssScore: "9.4",
      state: "Triaged",
      affectedAssets: [{ assetName: "docs.bugcrowd.com" }, { assetName: "test.bugcrowd.com" }]
    },
    {
      title: "Supply Chain Attack via Payment SDK",
      cvssScore: "9.4",
      state: "Triaged",
      affectedAssets: [{ assetName: "static.bugcrowd.com" }, { assetName: "staging.bugcrowd.com" }]
    },
    {
      title: "Vulnerable Third-Party Payment Library",
      cvssScore: "8.6",
      state: "Fixed In Staging",
      affectedAssets: [{ assetName: "staging.bugcrowd.com" }, { assetName: "api.bugcrowd.com" }, { assetName: "support.bugcrowd.com" }]
    },
    {
      title: "SQL Injection in Payment Processing Endpoint",
      cvssScore: "8.2",
      state: "In Review",
      affectedAssets: [{ assetName: "files.bugcrowd.com" }, { assetName: "cdn.bugcrowd.com" }]
    },
    {
      title: "[DUPLICATE] SQL Injection in Payment Processing Endpoint",
      cvssScore: "8.2",
      state: "In Review",
      affectedAssets: [{ assetName: "files.bugcrowd.com" }, { assetName: "cdn.bugcrowd.com" }]
    }
  ],
  slaMetrics: {
    withinSla: 86,
    atRisk: 0,
    breached: 155
  },
  severityOpenCloseCounts: {
    critical: { open: 2, closed: 1 },
    high: { open: 8, closed: 2 },
    medium: { open: 97, closed: 113 },
    low: { open: 134, closed: 129 },
  },
  cweDistribution: [
    { cwe: "CWE-79", name: "Cross-site Scripting", count: 85 },
    { cwe: "CWE-20", name: "Improper Input Validation", count: 64 },
    { cwe: "CWE-119", name: "Memory Buffer Bounds", count: 52 },
    { cwe: "CWE-89", name: "SQL Injection", count: 48 },
    { cwe: "CWE-287", name: "Improper Authentication", count: 39 },
    { cwe: "CWE-200", name: "Exposure of Sensitive Information", count: 35 },
    { cwe: "CWE-416", name: "Use After Free", count: 31 },
    { cwe: "CWE-352", name: "CSRF", count: 28 },
    { cwe: "CWE-22", name: "Path Traversal", count: 26 },
    { cwe: "CWE-78", name: "OS Command Injection", count: 22 }
  ]
};

// ─── Theme Configurations ─────────────────────────────────────────────────────
const SEV = {
  critical: { label: 'Critical', color: '#fb7185', bg: 'bg-rose-500/10', text: 'text-rose-600', bar: 'bg-rose-400' },
  high: { label: 'High', color: '#fbbf24', bg: 'bg-amber-500/10', text: 'text-amber-600', bar: 'bg-amber-400' },
  medium: { label: 'Medium', color: '#facc15', bg: 'bg-yellow-500/10', text: 'text-yellow-600', bar: 'bg-yellow-400' },
  low: { label: 'Low', color: '#38bdf8', bg: 'bg-sky-500/10', text: 'text-sky-600', bar: 'bg-sky-400' },
};

const SEV_SCORE_THRESHOLDS = [
  { min: 9.0, max: 10.0, key: 'critical' },
  { min: 7.0, max: 8.9, key: 'high' },
  { min: 4.0, max: 6.9, key: 'medium' },
  { min: 0.1, max: 3.9, key: 'low' },
];

function getSevObj(score) {
  const num = parseFloat(score);
  const found = SEV_SCORE_THRESHOLDS.find(t => num >= t.min && num <= t.max);
  return found ? SEV[found.key] : SEV.low;
}

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

// ─── Components ───────────────────────────────────────────────────────────────

function OpenClosedPanel({ counts }) {
  const severities = ['critical', 'high', 'medium', 'low'];

  return (
    <div className="space-y-4">
      {severities.map(key => {
        const { open, closed } = counts[key] || { open: 0, closed: 0 };
        const color = SEV[key].color;
        const total = (open + closed) || 1;
        const openPct = (open / total) * 100;
        const closedPct = (closed / total) * 100;

        return (
          <div key={key} className="flex items-center gap-3">
            <div className={`w-16 text-xs font-semibold capitalize ${SEV[key].text}`}>{key}</div>
            <div className="flex-1 h-3 rounded-full overflow-hidden bg-muted/60 flex">
              <div
                className="h-full transition-all"
                style={{ width: `${closedPct}%`, backgroundColor: '#34d399' }}
              />
              <div
                className="h-full transition-all"
                style={{ width: `${openPct}%`, backgroundColor: color }}
              />
            </div>
            <div className="flex gap-1.5 text-[11px] font-semibold text-right tabular-nums items-center">
              <span className="text-emerald-500 w-5 text-right">{closed}</span>
              <span className="text-muted-foreground mx-0.5">/</span>
              <span style={{ color }} className="w-5 text-left">{open}</span>
            </div>
          </div>
        );
      })}

      <div className="flex justify-end gap-3 mt-4 pt-2 border-t text-[10px] uppercase font-bold tracking-widest text-muted-foreground mr-1">
        <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-emerald-400" /> Closed</span>
        <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-slate-300" /> Open</span>
      </div>
    </div>
  );
}

function TopCWEPanel({ distribution }) {
  const max = Math.max(...distribution.map(d => d.count), 1);
  return (
    <div className="flex flex-col gap-3">
      {distribution.slice(0, 10).map((item, i) => (
        <div key={i} className="flex items-center gap-3 text-xs">
          <div className="w-16 font-semibold text-muted-foreground shrink-0">{item.cwe}</div>
          <div className="flex-1 flex items-center gap-2">
            <div className="flex-1 h-2 rounded-full overflow-hidden bg-muted/60 relative">
              <div className="absolute top-0 bottom-0 left-0 bg-indigo-400 rounded-full" style={{ width: `${(item.count / max) * 100}%` }} />
            </div>
            <div className="w-6 text-right font-bold tabular-nums text-foreground shrink-0">{item.count}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SeverityPanel({ distribution }) {
  const total = Object.values(distribution).reduce((a, b) => a + b, 0) || 1;
  const metrics = ['critical', 'high', 'medium', 'low'].map(key => ({
    key,
    label: SEV[key].label,
    value: distribution[key] || 0,
    color: SEV[key].color,
    bar: SEV[key].bar
  }));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex h-3 w-full rounded-full overflow-hidden bg-muted/60">
        {metrics.map((m) => {
          if (!m.value) return null;
          return <div key={m.key} style={{ width: `${(m.value / total) * 100}%`, backgroundColor: m.color }} className="h-full transition-all border-r border-background/20 last:border-0" />;
        })}
      </div>
      <div className="grid grid-cols-2 gap-3 mt-2">
        {metrics.map((m) => {
          const pct = Math.round((m.value / total) * 100);
          return (
            <div key={m.key} className="flex justify-between items-center border rounded-lg p-2 bg-background/50">
              <div className="flex items-center gap-2">
                <div className="size-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                <span className="text-xs font-semibold capitalize text-foreground">{m.label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold tabular-nums tracking-tight">{m.value}</span>
                <span className="text-[10px] text-muted-foreground font-medium">({pct}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Trend12MonthChart({ data }) {
  // Find max value for scaling
  const maxVal = Math.max(...data.map(d => Math.max(d.open, d.closed, 1)));

  return (
    <div className="h-48 w-full flex items-end justify-between gap-1 pt-4">
      {data.map((d, i) => {
        const heightOpen = `${(d.open / maxVal) * 100}%`;
        const heightClosed = `${(d.closed / maxVal) * 100}%`;

        return (
          <div key={i} className="flex flex-col items-center flex-1 h-full justify-end group">
            <div className="flex items-end gap-0.5 md:gap-1 w-full h-[140px] px-0.5 md:px-1 fade-in">
              {/* Closed Bar */}
              <div className="w-1/2 flex items-end justify-center h-full relative">
                <div
                  className="w-full bg-emerald-400 rounded-t-sm transition-all duration-500 group-hover:opacity-80"
                  style={{ height: heightClosed }}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-emerald-600 bg-background/90 px-1 py-0.5 rounded shadow-sm border border-border/50 backdrop-blur-md z-10 pointer-events-none">{d.closed}</div>
                </div>
              </div>
              {/* Open Bar */}
              <div className="w-1/2 flex items-end justify-center h-full relative">
                <div
                  className="w-full bg-amber-400 rounded-t-sm transition-all duration-500 group-hover:opacity-80"
                  style={{ height: heightOpen }}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-amber-600 bg-background/90 px-1 py-0.5 rounded shadow-sm border border-border/50 backdrop-blur-md z-10 pointer-events-none">{d.open}</div>
                </div>
              </div>
            </div>
            <span className="text-[9px] md:text-[10px] text-muted-foreground mt-2 font-medium tracking-tight whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
              {d.month}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main View ────────────────────────────────────────────────────────────────
export default function OrgExecutiveReport() {
  const d = REPORT_DATA;
  const v = d.vulnStats;
  const am = d.assessmentMetrics;

  const remediationRate = Math.round((v.closedVulns / v.totalVulns) * 100) || 0;

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
                    Organization Level
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-background leading-tight">Executive Security Posture Report</h2>
                </div>
                <div className="flex flex-wrap gap-3 pt-1">
                  <span className="flex items-center gap-1.5 text-xs text-background/60">
                    <Building2 size={11} />
                    {d.orgDetails.name}
                  </span>
                  {d.orgDetails.website && (
                    <span className="flex items-center gap-1.5 text-xs text-background/60">
                      <Globe size={11} />
                      {d.orgDetails.website.replace('https://', '')}
                    </span>
                  )}
                </div>
              </div>

              {/* Right */}
              <div className="shrink-0 flex flex-col items-end gap-3 text-right">
                <p className="text-[10px] text-background/50 uppercase tracking-wider">Classification</p>
                <p className="text-sm font-bold text-background tracking-widest">RESTRICTED</p>
              </div>
            </div>
          </div>

          {/* sub-bar */}
          <div className="px-6 py-2.5 bg-muted/50 border-t border-border flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Report generated: <span className="font-medium text-foreground">{new Date().toLocaleDateString('en-GB')}</span>
            </span>
          </div>
        </Card>

        {/* ══ Overview KPIs ══════════════════════════════════════════════════ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="shadow-sm border-border">
            <CardContent className="p-4 md:p-5 flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-widest font-semibold text-muted-foreground mb-1">Assessments</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-semibold tracking-tight tabular-nums text-foreground">{am.total}</p>
                </div>
              </div>
              <div className="size-8 md:size-10 rounded-md md:rounded-full bg-muted/40 md:bg-indigo-500/10 flex items-center justify-center md:border md:border-indigo-500/20">
                <Target size={16} className="text-muted-foreground md:text-indigo-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border">
            <CardContent className="p-4 md:p-5 flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-widest font-semibold text-muted-foreground mb-1">Total Vulns</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-semibold tracking-tight tabular-nums text-foreground">{v.totalVulns}</p>
                </div>
              </div>
              <div className="size-8 md:size-10 rounded-md md:rounded-full bg-muted/40 md:bg-sky-500/10 flex items-center justify-center md:border md:border-sky-500/20">
                <ShieldAlert size={16} className="text-muted-foreground md:text-sky-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border">
            <CardContent className="p-4 md:p-5 flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-widest font-semibold text-muted-foreground mb-1">Open Vulns</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-semibold tracking-tight tabular-nums text-foreground">{v.openVulns}</p>
                </div>
              </div>
              <div className="size-8 md:size-10 rounded-md md:rounded-full bg-muted/40 md:bg-amber-500/10 flex items-center justify-center md:border md:border-amber-500/20">
                <AlertTriangle size={16} className="text-muted-foreground md:text-amber-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border">
            <CardContent className="p-4 md:p-5 flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-widest font-semibold text-muted-foreground mb-1">Avg CVSS</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-semibold tracking-tight tabular-nums text-foreground">{v.aggCvss.toFixed(1)}</p>
                </div>
              </div>
              <div className="size-8 md:size-10 rounded-md md:rounded-full bg-muted/40 md:bg-rose-500/10 flex items-center justify-center md:border md:border-rose-500/20">
                <Activity size={16} className="text-muted-foreground md:text-rose-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ══ Charts Row 1 ═══════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trend Chart (Takes 2 columns) */}
          <Card className="shadow-sm col-span-1 lg:col-span-2">
            <CardHeader className="p-5 pb-0">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold tracking-tight">12 Month Vulnerability Trend</CardTitle>
                  <CardDescription className="text-xs mt-1">Findings identified vs fixed over time</CardDescription>
                </div>
                <div className="flex gap-4">
                  <span className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                    <span className="size-2 rounded-full bg-amber-400" /> Open
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                    <span className="size-2 rounded-full bg-emerald-400" /> Closed
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5 pt-0">
              <Trend12MonthChart data={d.vulnDistribution12Months} />
            </CardContent>
          </Card>

          {/* Assessment Breakdown */}
          <Card className="shadow-sm">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-sm font-semibold tracking-tight">Assessment Portfolio</CardTitle>
              <CardDescription className="text-xs mt-1">Active coverage operations</CardDescription>
            </CardHeader>
            <CardContent className="px-5 pb-5 pt-0 flex flex-col gap-5">
              {/* By type */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 text-center">Operation Type</p>
                <div className="flex h-3 w-full rounded-full overflow-hidden bg-muted/60">
                  <div style={{ width: `${(am.byType.greyBox / am.total) * 100}%` }} className="h-full bg-slate-400 border-r border-background" />
                  <div style={{ width: `${(am.byType.whiteBox / am.total) * 100}%` }} className="h-full bg-slate-200 border-r border-background" />
                  <div style={{ width: `${(am.byType.blackBox / am.total) * 100}%` }} className="h-full bg-slate-800" />
                </div>
                <div className="flex justify-between mt-2 px-1">
                  <div className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-slate-400" /> <span className="text-[10px] font-medium text-muted-foreground">Grey ({am.byType.greyBox})</span></div>
                  <div className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-slate-200" /> <span className="text-[10px] font-medium text-muted-foreground">White ({am.byType.whiteBox})</span></div>
                  <div className="flex items-center gap-1.5"><span className="size-1.5 rounded-full bg-slate-800" /> <span className="text-[10px] font-medium text-muted-foreground">Black ({am.byType.blackBox})</span></div>
                </div>
              </div>

              <Separator />

              {/* By status text list */}
              <div className="space-y-2">
                {[
                  { k: "Completed", v: am.byState["Completed"], c: "bg-emerald-400" },
                  { k: "Running", v: am.byState["Running"], c: "bg-indigo-400" },
                  { k: "Pending/Scheduled", v: (am.byState["Pending"] + am.byState["Scheduled"]), c: "bg-amber-400" }
                ].map(s => (
                  <div key={s.k} className="flex justify-between items-center text-xs p-2 rounded-md hover:bg-muted/40 border border-transparent hover:border-border/50">
                    <span className="font-medium text-muted-foreground flex items-center gap-2">
                      <span className={`size-2 rounded-full ${s.c}`} />
                      {s.k}
                    </span>
                    <span className="font-semibold text-foreground tracking-tight tabular-nums">{s.v}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ══ Charts Row 2 ═══════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Severity Overview */}
          <Card className="shadow-sm">
            <CardHeader className="p-5 pb-4">
              <CardTitle className="text-sm font-semibold tracking-tight">Organization Profile by Severity</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5 pt-0">
              <SeverityPanel distribution={v.severityDistribution} />
            </CardContent>
          </Card>

          {/* Remediation & SLA overview */}
          <Card className="shadow-sm flex flex-col justify-between">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-sm font-semibold tracking-tight">Remediation Efficiency</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5 pt-0 flex-1 flex flex-col">

              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-foreground tracking-tight">Global Remediation Rate</span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">{remediationRate}%</span>
              </div>
              <div className="h-2 w-full rounded-full overflow-hidden flex bg-muted/60 mb-6">
                <div className="h-full bg-emerald-400 transition-all" style={{ width: `${remediationRate}%` }} />
                <div className="h-full bg-amber-400/80" style={{ width: `${100 - remediationRate}%` }} />
              </div>

              <Separator className="mb-4" />

              <div className="grid grid-cols-3 gap-2">
                {[
                  { title: "Met SLA", value: d.slaMetrics.withinSla, color: "text-emerald-500" },
                  { title: "At Risk", value: d.slaMetrics.atRisk, color: "text-amber-500" },
                  { title: "Breached", value: d.slaMetrics.breached, color: "text-rose-500" },
                ].map((s, i) => (
                  <div key={i} className="text-center p-3 rounded-lg border bg-muted/20">
                    <p className={`text-2xl font-bold tracking-tight ${s.color} tabular-nums mb-1`}>{s.value}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{s.title}</p>
                  </div>
                ))}
              </div>

            </CardContent>
          </Card>
        </div>

        {/* ══ Row 3: Open/Closed & CWEs ════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Open vs Closed by Severity */}
          <Card className="shadow-sm">
            <CardHeader className="p-5 pb-4">
              <CardTitle className="text-sm font-semibold tracking-tight">Open vs. Closed by Severity</CardTitle>
              <CardDescription className="text-xs mt-1">Resolution progress across risk tiers</CardDescription>
            </CardHeader>
            <CardContent className="px-5 pb-5 pt-0">
              <OpenClosedPanel counts={d.severityOpenCloseCounts} />
            </CardContent>
          </Card>

          {/* Top 10 CWEs */}
          <Card className="shadow-sm">
            <CardHeader className="p-5 pb-4">
              <CardTitle className="text-sm font-semibold tracking-tight">Top 10 CWEs</CardTitle>
              <CardDescription className="text-xs mt-1">Most frequently identified weakness categories</CardDescription>
            </CardHeader>
            <CardContent className="px-5 pb-5 pt-0">
              <TopCWEPanel distribution={d.cweDistribution} />
            </CardContent>
          </Card>
        </div>
        {/* ══ Footer ══════════════════════════════════════════════════════ */}
        <div className="flex items-center justify-between py-3 border-t border-border text-xs text-muted-foreground mt-4">
          <span>
            Prepared by <span className="font-medium text-foreground">SnapSec Executive Summary</span> · {new Date().toLocaleDateString('en-GB')}
          </span>
          <span className="font-medium text-foreground">{d.orgDetails.name} · <span className="font-normal text-muted-foreground">Confidential</span></span>
        </div>

      </div>
    </div>
  );
}
