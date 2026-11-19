import React, { useEffect, useState, useRef } from "react";
import appConfig from "@/config/appConfig";
import { useSearchParams } from "react-router-dom";
import { useReportReady } from "@/hooks/use-report-ready";
import { pdfDebug } from '@/lib/pdf-debug';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
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
import { cn } from "@/lib/utils";

// ─── External Config ──────────────────────────────────────────────────────────
const EXTERNAL_CONFIG = {};
const externalApiUrl = `${appConfig.BASE_URL}/csm/api/reports/data/executive`;
const internalApiUrl = `http://vm/api/reports/data/executive`;

// ─── Theme Configurations ─────────────────────────────────────────────────────
const SEV = {
  critical: { label: 'Critical', color: '#fb7185', bg: 'bg-muted', text: 'text-foreground', bar: 'bg-rose-400' },
  high: { label: 'High', color: '#fbbf24', bg: 'bg-muted', text: 'text-muted-foreground', bar: 'bg-amber-400' },
  medium: { label: 'Medium', color: '#facc15', bg: 'bg-muted', text: 'text-muted-foreground', bar: 'bg-yellow-400' },
  low: { label: 'Low', color: '#38bdf8', bg: 'bg-muted', text: 'text-muted-foreground/60', bar: 'bg-sky-400' },
  none: { label: 'None', color: '#94a3b8', bg: 'bg-muted', text: 'text-muted-foreground/40', bar: 'bg-slate-400' },
};

const PRINT_STYLE = `
@media print {
  body { background: white !important; margin: 0 !important; padding: 0 !important; }
  .report-page { 
    page-break-after: always !important; 
    height: 297mm !important; 
    width: 210mm !important;
    margin: 0 auto !important;
    box-shadow: none !important;
    border: none !important;
    visibility: visible !important;
    position: relative !important;
    overflow: hidden !important;
  }
  .report-page:last-child { page-break-after: auto !important; }
  .no-print { display: none !important; }
  #vuln-report-root { width: 100% !important; margin: 0 !important; padding: 0 !important; }
  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
}

@page {
  size: A4;
  margin: 0;
}
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(d) {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch (e) {
    return '—';
  }
}

// ─── Layout components ───────────────────────────────────────────────────────
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ExecutiveReport Error caught by boundary:", error, errorInfo);
    pdfDebug.error(error, { errorInfo, context: "ErrorBoundary" });
    window.isPdfReady = true;
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-20 text-center bg-white min-h-screen">
          <h1 className="text-2xl font-bold text-red-600">Something went wrong while rendering the report.</h1>
          <p className="mt-4 text-muted-foreground">The PDF generation will proceed with the available data.</p>
          <pre className="mt-4 p-4 bg-gray-100 rounded text-left overflow-auto max-w-4xl mx-auto text-[10px]">
            {JSON.stringify(this.state.error, null, 2)}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const PrintLayout = ({ children, className = "" }) => (
  <div
    className={`bg-white font-sans relative report-page p-10 flex flex-col gap-5 overflow-hidden ${className}`}
    style={{
      height: "297mm",
      width: "210mm",
      minHeight: "297mm",
      maxHeight: "297mm",
    }}
  >
    {children}
  </div>
);

// ─── Severity Distribution Panel ─────────────────────────────────────────────
function SeverityDonut({ distribution, total }) {
  const sevKeys = ['critical', 'high', 'medium', 'low'];
  const grandTotal = total || 1;
  let cumulative = 0;

  const segments = sevKeys.map((k) => {
    const count = distribution[k] || 0;
    if (count === 0) return null;
    const pct = count / grandTotal;
    const start = cumulative * 2 * Math.PI - Math.PI / 2;
    cumulative += pct;
    const end = cumulative * 2 * Math.PI - Math.PI / 2;
    const r = 60, cx = 70, cy = 70;
    const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end), y2 = cy + r * Math.sin(end);
    const largeArc = pct > 0.5 ? 1 : 0;

    if (count === grandTotal) return <circle key={k} cx={cx} cy={cy} r={r} fill={SEV[k].color} />;

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
        <svg width="130" height="130" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r="60" fill="#f1f5f9" />
          {segments}
          <circle cx="70" cy="70" r="38" className="fill-white" />
          <text x="70" y="65" textAnchor="middle" fontSize="24" fontWeight="700" className="fill-slate-900" letterSpacing="-0.05em">{grandTotal}</text>
          <text x="70" y="82" textAnchor="middle" fontSize="9" className="fill-slate-400" fontWeight="600" letterSpacing="0.05em">FINDINGS</text>
        </svg>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-3 w-full">
        {sevKeys.map((k) => {
          const count = distribution[k] || 0;
          const pct = grandTotal ? Math.round((count / grandTotal) * 100) : 0;
          return (
            <div key={k} className="flex items-center gap-2">
              <span className="size-3 rounded-[3px] shrink-0" style={{ backgroundColor: SEV[k].color }} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium capitalize">{k}</span>
                  <span className="text-xs font-bold text-slate-900 tabular-nums">{count}</span>
                </div>
                <div className="h-1 w-full rounded-full bg-slate-100 overflow-hidden mt-1">
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

// ─── Open vs Closed Panel ────────────────────────────────────────────────────
function OpenClosedPanel({ counts, openTotal, closedTotal }) {
  const sevKeys = ['critical', 'high', 'medium', 'low'];
  const grandTotal = openTotal + closedTotal || 1;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-center">
          <p className="text-2xl font-bold text-slate-900 tabular-nums">{openTotal}</p>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Open</p>
        </div>
        <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-center">
          <p className="text-2xl font-bold text-slate-900 tabular-nums">{closedTotal}</p>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Closed</p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] text-slate-400 font-bold">Closure Rate</span>
          <span className="text-[11px] font-bold text-slate-900">{Math.round((closedTotal / grandTotal) * 100)}%</span>
        </div>
        <div className="flex h-2 w-full rounded-full overflow-hidden bg-slate-100">
          <div className="h-full bg-emerald-400" style={{ width: `${(closedTotal / grandTotal) * 100}%` }} />
          <div className="h-full bg-amber-400" style={{ width: `${(openTotal / grandTotal) * 100}%` }} />
        </div>
        <div className="flex items-center gap-4 mt-2">
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
            <span className="size-2 rounded-full bg-emerald-400" /> Closed
          </span>
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
            <span className="size-2 rounded-full bg-amber-400" /> Open
          </span>
        </div>
      </div>

      <Separator className="my-1" />

      <div className="flex flex-col gap-2.5">
        {sevKeys.map((k) => {
          const { open = 0, closed = 0 } = counts[k] || {};
          const rowTotal = open + closed || 1;
          return (
            <div key={k} className="flex items-center gap-3">
              <span className="text-[11px] font-bold w-14 shrink-0 capitalize text-slate-400">{k}</span>
              <div className="flex flex-1 h-1.5 rounded-full overflow-hidden bg-slate-100">
                {closed > 0 && <div className="bg-emerald-400" style={{ width: `${(closed / rowTotal) * 100}%` }} />}
                {open > 0 && <div className={`${SEV[k].bar}`} style={{ width: `${(open / rowTotal) * 100}%` }} />}
              </div>
              <span className="text-[11px] font-bold text-slate-900 w-6 text-right">{open + closed}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Status Breakdown Panel ──────────────────────────────────────────────────
function StatusPanel({ statusDistribution }) {
  const statuses = [
    { key: 'resolved', label: 'Resolved', color: 'bg-emerald-400', icon: CheckCircle2 },
    { key: 'fixedInStaging', label: 'Fixed in Staging', color: 'bg-emerald-300', icon: CheckCircle2 },
    { key: 'inReview', label: 'In Review', color: '#818cf8', icon: Clock },
    { key: 'inProgress', label: 'In Progress', color: '#c084fc', icon: Clock },
    { key: 'falsePositive', label: 'False Positive', color: '#cbd5e1', icon: XCircle },
    { key: 'unresolved', label: 'Unresolved', color: '#fb7185', icon: AlertTriangle },
  ];

  const total = Object.values(statusDistribution).reduce((a, b) => a + b, 0) || 1;
  const colorMap = {
    resolved: '#34d399', fixedInStaging: '#6ee7b7', inReview: '#818cf8',
    inProgress: '#c084fc', falsePositive: '#cbd5e1', unresolved: '#fb7185',
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] text-slate-400 font-bold">Status Distribution</span>
          <span className="text-[11px] text-slate-900 font-bold">{total} total</span>
        </div>
        <div className="flex h-7 w-full rounded-lg overflow-hidden shadow-sm">
          {statuses.map(({ key }) => {
            const count = statusDistribution[key] || 0;
            if (!count) return null;
            return (
              <div
                key={key}
                style={{ width: `${(count / total) * 100}%`, backgroundColor: colorMap[key] }}
                className="flex items-center justify-center border-r border-white/10 last:border-0"
              >
                {count >= 1 && <span className="text-[10px] font-bold text-white">{count}</span>}
              </div>
            );
          })}
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-3">
        {statuses.map(({ key, label, color, icon: Icon }) => {
          const count = statusDistribution[key] || 0;
          const pct = Math.round((count / total) * 100);
          return (
            <div key={key} className="flex items-center gap-4">
              <div className="flex items-center gap-2 w-40 shrink-0">
                <Icon size={12} className="text-slate-400" />
                <span className="text-[11px] font-medium text-slate-500">{label}</span>
              </div>
              <div className="flex-1 h-2.5 rounded-full bg-slate-50 overflow-hidden">
                <div className={`h-full rounded-full ${typeof color === 'string' && color.startsWith('bg') ? color : ''}`}
                  style={!color.startsWith('bg') ? { backgroundColor: color, width: `${pct}%` } : { width: `${pct}%` }} />
              </div>
              <div className="flex items-center gap-1.5 w-16 justify-end shrink-0">
                <span className="text-[11px] font-bold text-slate-900 tabular-nums">{count}</span>
                <span className="text-[10px] text-slate-400 font-medium">({pct}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── SLA Panel ───────────────────────────────────────────────────────────────
function SLACompliancePanel({ slaCompliance }) {
  const { met = 0, atRisk = 0, breached = 0 } = slaCompliance || {};
  const total = met + atRisk + breached || 1;
  const adherence = Math.round((met / total) * 100);

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-center">
          <p className="text-2xl font-bold text-slate-900">{met}</p>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Within SLA</p>
        </div>
        <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-center">
          <p className="text-2xl font-bold text-slate-900">{breached}</p>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Out of SLA</p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] text-slate-400 font-bold">SLA Adherence Rate</span>
          <span className="text-[11px] font-bold text-slate-900">{adherence}%</span>
        </div>
        <div className="flex h-2 w-full rounded-full overflow-hidden bg-slate-100">
          <div className="h-full bg-emerald-400" style={{ width: `${adherence}%` }} />
          {atRisk > 0 && <div className="h-full bg-amber-400" style={{ width: `${(atRisk / total) * 100}%` }} />}
          {breached > 0 && <div className="h-full bg-rose-400" style={{ width: `${(breached / total) * 100}%` }} />}
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-3">
        {[
          { label: 'Met SLA', value: met, color: 'bg-emerald-400' },
          { label: 'At Risk', value: atRisk, color: 'bg-amber-400' },
          { label: 'Breached', value: breached, color: 'bg-rose-400' },
        ].map((m) => {
          const pct = Math.round((m.value / total) * 100);
          return (
            <div key={m.label} className="flex items-center gap-4">
              <span className="text-[11px] font-medium text-slate-500 w-20 shrink-0">{m.label}</span>
              <div className="flex-1 h-1.5 rounded-full bg-slate-50 overflow-hidden">
                <div className={`h-full rounded-full ${m.color}`} style={{ width: `${pct}%` }} />
              </div>
              <div className="flex items-center gap-1.5 w-16 justify-end shrink-0">
                <span className="text-[11px] font-bold text-slate-900">{m.value}</span>
                <span className="text-[10px] text-slate-400 font-medium">({pct}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Page 1 ─────────────────────────────────────────────────────────────
const PageOne = ({ metrics }) => {
  const { ad, org, orgLogoSrc, vendorLogoSrc, totalVulns, openVulns, closedVulns, averageCvss, riskScore, riskLabel, riskColor, riskRingColor, remediationRate, severityDistribution, severityOpenCloseCounts, typeLabel } = metrics;

  return (
    <PrintLayout>
      {/* ══ Cover Header ════════════════════════════════════════════════ */}
      <Card className="overflow-hidden border-0 shadow-sm rounded-2xl">
        <div className="bg-[#1a1a1a] p-7">
          <div className="flex items-start justify-between gap-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded bg-white/10 flex items-center justify-center">
                  <Building2 size={14} className="text-white" />
                </div>
                <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold">
                  Executive Summary
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white leading-tight">{ad.title}</h2>
                <p className="text-sm text-white/50 mt-1.5 max-w-lg leading-relaxed">
                  {ad.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-4 pt-1">
                {[
                  { icon: Tag, label: ad.category },
                  { icon: ShieldAlert, label: ad.securityAssessmentType },
                  { icon: FileText, label: typeLabel },
                  { icon: Calendar, label: fmt(ad.startDate) },
                  { icon: Users, label: ad.collaborators?.map(c => c.name).join(', ') || "Security Team" },
                ].map(({ icon: Icon, label }) => (
                  <span key={label} className="flex items-center gap-1.5 text-[11px] text-white/50 font-medium">
                    <Icon size={12} className="text-white/30" />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            <div className="shrink-0 flex flex-col items-end gap-3">
              {vendorLogoSrc && (
                <img src={vendorLogoSrc} alt="Vendor" className="size-12 rounded-xl bg-white/10 object-contain p-2" />
              )}
              <div className="text-right">
                <p className="text-[9px] text-white/30 uppercase tracking-wider font-bold">Conducted by</p>
                <p className="text-sm font-bold text-white">{ad.vendorName || "SnapSec"}</p>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-white/30">
                <Globe size={11} />
                {org.website?.replace(/^https?:\/\//, '')}
              </div>
            </div>
          </div>
        </div>
        <div className="px-7 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-medium">
            Report generated: <span className="text-slate-900 font-bold">{fmt(new Date().toISOString())}</span>
          </span>
          <Badge variant="secondary" className="px-3 py-0.5 rounded-md font-bold bg-slate-100 text-slate-500 border-0">{ad.state || "Completed"}</Badge>
        </div>
      </Card>

      {/* ══ Risk Score + KPI Row ════════════════════════════════════════ */}
      <div className="grid grid-cols-5 gap-4">
        <Card className="flex flex-col items-center justify-center p-4 gap-2 border shadow-none bg-white">
          <div className="relative size-16">
            <svg className="size-full" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="34" fill="none" stroke="#f1f5f9" strokeWidth="5" />
              <circle
                cx="40" cy="40" r="34" fill="none" stroke={riskRingColor} strokeWidth="5"
                strokeDasharray={`${(riskScore / 100) * 213.6} 213.6`}
                strokeLinecap="round" transform="rotate(-90 40 40)"
              />
              <text x="40" y="38" textAnchor="middle" fontSize="20" fontWeight="700" fill={riskRingColor} className="tracking-tight">{riskScore}</text>
              <text x="40" y="52" textAnchor="middle" fontSize="8" className="fill-slate-400 font-bold">/ 100</text>
            </svg>
          </div>
          <div className="text-center mt-1">
            <p className={`text-[12px] font-bold leading-none ${riskColor}`}>{riskLabel}</p>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1">Risk Posture</p>
          </div>
        </Card>

        {[
          { label: 'Total Findings', value: totalVulns, icon: ShieldAlert },
          { label: 'Open Findings', value: openVulns, icon: AlertTriangle },
          { label: 'Remediated', value: closedVulns, icon: CheckCircle2 },
          { label: 'Avg. CVSS', value: Number(averageCvss).toFixed(2), icon: TrendingUp },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label} className="border shadow-none bg-white">
            <CardContent className="p-4 flex flex-col justify-between h-full gap-3">
              <div className="size-8 rounded-lg bg-slate-50 flex items-center justify-center">
                <Icon size={16} className="text-slate-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900 leading-none">{value}</p>
                <p className="text-[11px] text-slate-400 font-medium mt-1">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ══ Remediation Rate ════════════════════════════════════════════ */}
      <Card className="border shadow-none bg-white">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <span className="text-[13px] font-bold text-slate-900">Overall Remediation Rate</span>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{remediationRate}% Complete</span>
            </div>
            <span className="text-[11px] text-slate-400 font-bold">
              {closedVulns} closed · {openVulns} open of {totalVulns} total
            </span>
          </div>
          <div className="h-2 w-full rounded-full overflow-hidden flex bg-slate-100">
            <div className="h-full bg-emerald-400" style={{ width: `${remediationRate}%` }} />
            <div className="h-full bg-amber-400/80" style={{ width: `${100 - remediationRate}%` }} />
          </div>
        </CardContent>
      </Card>

      {/* Main Charts */}
      <div className="grid grid-cols-2 gap-5 flex-1">
        <Card className="border shadow-none bg-white flex flex-col overflow-hidden">
          <CardHeader className="p-5 pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-900">Severity Distribution</CardTitle>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Breakdown by risk level</span>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-0 flex-1 flex items-center justify-center">
            <div className="w-full">
              <SeverityDonut distribution={severityDistribution} total={totalVulns} />
            </div>
          </CardContent>
        </Card>

        <Card className="border shadow-none bg-white flex flex-col overflow-hidden">
          <CardHeader className="p-5 pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-900">Open vs. Closed by Severity</CardTitle>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Progress per severity tier</span>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-0 flex-1 flex flex-col justify-center">
            <OpenClosedPanel counts={severityOpenCloseCounts} openTotal={openVulns} closedTotal={closedVulns} />
          </CardContent>
        </Card>
      </div>

      {/* Footer P1 */}
      <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100 text-[11px] text-slate-400">
        <span>Prepared by <span className="font-bold text-slate-900">SnapSec VM</span> · {fmt(new Date().toISOString())}</span>
        <span>{org.name || "Organization"} · <span className="font-medium">Confidential</span></span>
      </div>
    </PrintLayout>
  );
};

// ─── Main Page 2 ─────────────────────────────────────────────────────────────
const PageTwo = ({ metrics }) => {
  const { org, statusDistribution, slaCompliance } = metrics;

  return (
    <PrintLayout>
      <div className="flex flex-col gap-6 flex-1 pt-4">
        <Card className="border shadow-none bg-white">
          <CardHeader className="p-6 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-900">Workflow Status Breakdown</CardTitle>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Current resolution pipeline state</span>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-0">
            <StatusPanel statusDistribution={statusDistribution} />
          </CardContent>
        </Card>

        <Card className="border shadow-none bg-white">
          <CardHeader className="p-6 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold text-slate-900">SLA Compliance</CardTitle>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Performance against remediation timeframes</span>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-0">
            <SLACompliancePanel slaCompliance={slaCompliance} />
          </CardContent>
        </Card>
      </div>

      {/* Footer P2 */}
      <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100 text-[11px] text-slate-400">
        <span>Prepared by <span className="font-bold text-slate-900">SnapSec VM</span> · {fmt(new Date().toISOString())}</span>
        <span>{org.name || "Organization"} · <span className="font-medium">Confidential</span></span>
      </div>
    </PrintLayout>
  );
};

// ─── Root Component ──────────────────────────────────────────────────────────
const ExecutiveReport = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setErr] = useState(false);
  const [params] = useSearchParams();
  const hasFetched = useRef(false);

  useEffect(() => {
    pdfDebug.pageLoaded();
  }, []);

  useEffect(() => {
    let viewMode = params.get("view_mode");
    let forceExternal = params.get("force_external_api") === "true";
    if (viewMode === "web" || forceExternal) {
      EXTERNAL_CONFIG.BASE_URL = externalApiUrl;
    } else {
      EXTERNAL_CONFIG.BASE_URL = internalApiUrl;
    }

    async function fetchReportData() {
      pdfDebug.dataFetchStarted();
      try {
        const searchParams = new URLSearchParams();
        searchParams.set("assessmentId", params.get("assessmentId"));
        searchParams.set("accessToken", params.get("accessToken"));
        const url = `${EXTERNAL_CONFIG.BASE_URL}?${searchParams.toString()}`;
        const response = await fetch(url, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
        if (!response.ok) throw new Error("Fetch Failed");
        const json = await response.json();
        setReportData(json.data);
        pdfDebug.dataFetchCompleted(json.data);
      } catch (err) {
        console.error(err);
        setErr(true);
        pdfDebug.error(err, { context: "fetchReportData" });
      } finally {
        setLoading(false);
      }
    }
    if (!hasFetched.current) { fetchReportData(); hasFetched.current = true; }
  }, [params]);

  // CRITICAL: Explicitly handle PDF readiness and document title
  // Without window.isPdfReady = true, many PDF engines only capture the first page or time out.
  useEffect(() => {
    if (reportData) {
      const name = reportData.assessment_name || reportData.assessmentDetails?.name || "Executive Report";
      document.title = name;

      // Delay slightly to ensure fonts and charts have rendered
      const timer = setTimeout(() => {
        window.isPdfReady = true;
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [reportData]);

  const { statusMessage } = useReportReady({ loading, data: reportData, error, options: { readyDelay: 2000 } });

  if (loading) {
    return (
      <div className="w-full bg-slate-50 flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center p-12 bg-white shadow-xl rounded-3xl border border-slate-100">
          <div className="relative size-12 mb-4">
            <div className="absolute inset-0 border-3 border-indigo-50 rounded-full"></div>
            <div className="absolute inset-0 border-3 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-lg font-bold text-slate-900">Generating Report...</p>
          <p className="text-[11px] text-slate-400 mt-1 uppercase font-bold tracking-wider">{statusMessage}</p>
        </div>
      </div>
    );
  }

  if (!reportData || Object.keys(reportData).length === 0) {
    return (
      <div className="w-full bg-slate-50 flex items-center justify-center min-h-screen p-6">
        <Card className="max-w-md w-full p-8 text-center bg-white shadow-xl rounded-3xl border border-slate-100">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Data Unavailable</h2>
          <p className="text-slate-500 font-medium text-sm">Please ensure metrics have been generated for this assessment.</p>
        </Card>
      </div>
    );
  }

  const {
    orgDetails = {},
    assessmentDetails = {},
    severityDistribution = {},
    statusDistribution = {},
    severityOpenCloseCounts = {},
    slaCompliance = {},
    averageCvss = 0,
    assessment_name = "",
    collaborators = []
  } = reportData;

  // Robust data normalization to prevent Page 2 rendering failures
  const ad = {
    ...assessmentDetails,
    title: assessmentDetails.title || assessmentDetails.name || assessment_name || "Security Assessment",
    collaborators: assessmentDetails.collaborators || collaborators || []
  };

  const website_url = orgDetails?.website ? (orgDetails.website.startsWith('http') ? new URL(orgDetails.website).hostname : orgDetails.website) : "";
  const orgLogoSrc = orgDetails?.logo || (website_url ? `https://img.logo.dev/${website_url}?token=pk_YDuXMfwrRe2kQtBuzc3Etg` : null);
  const vendorLogoSrc = assessmentDetails?.vendorId?.logo_url || 'https://suite.snapsec.co/media/logos/snapsec.svg';

  const totalVulns = Object.values(severityDistribution || {}).reduce((a, b) => a + b, 0) || 0;
  const openVulns = (statusDistribution?.fixedInStaging || 0) + (statusDistribution?.inReview || 0) + (statusDistribution?.inProgress || 0) + (statusDistribution?.retest || 0) + (statusDistribution?.unresolved || 0);
  const closedVulns = (statusDistribution?.duplicate || 0) + (statusDistribution?.resolved || 0) + (statusDistribution?.falsePositive || 0) + (statusDistribution?.notApplicable || 0);
  const remediationRate = totalVulns > 0 ? Math.round((closedVulns / totalVulns) * 100) : 0;
  const riskScore = totalVulns > 0 ? Math.max(0, Math.round(100 - (((severityDistribution?.critical || 0) * 30 + (severityDistribution?.high || 0) * 20 + (severityDistribution?.medium || 0) * 8 + (severityDistribution?.low || 0) * 2) / (totalVulns * 30)) * 100 * (openVulns / totalVulns))) : 100;
  const riskLabel = riskScore >= 75 ? 'Good' : riskScore >= 50 ? 'Fair' : 'At Risk';
  const riskColor = riskScore >= 75 ? 'text-emerald-500' : riskScore >= 50 ? 'text-amber-500' : 'text-rose-500';
  const riskRingColor = riskScore >= 75 ? '#34d399' : riskScore >= 50 ? '#fbbf24' : '#fb7185';
  const typeLabel = assessmentDetails.type === 'greyBox' ? 'Grey Box' : assessmentDetails.type === 'blackBox' ? 'Black Box' : 'White Box';

  const metrics = {
    ad,
    org: orgDetails,
    orgLogoSrc,
    vendorLogoSrc,
    totalVulns,
    openVulns,
    closedVulns,
    averageCvss,
    riskScore,
    riskLabel,
    riskColor,
    riskRingColor,
    remediationRate,
    severityDistribution: severityDistribution || {},
    statusDistribution: statusDistribution || {},
    severityOpenCloseCounts: severityOpenCloseCounts || {},
    slaCompliance: slaCompliance || {},
    typeLabel
  };

  return (
    <ErrorBoundary>
      <div className="absolute inset-0 z-50 overflow-auto min-h-screen bg-slate-100 py-12 flex flex-col items-center gap-8 print:p-0 print:bg-white print:gap-0">
        <style>{PRINT_STYLE}</style>
        <div id="vuln-report-root" className="flex flex-col items-center">
          <PageOne metrics={metrics} />
          <PageTwo metrics={metrics} />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ExecutiveReport;
