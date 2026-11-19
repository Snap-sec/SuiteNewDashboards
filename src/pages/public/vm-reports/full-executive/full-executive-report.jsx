import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { pdfDebug } from "@/lib/pdf-debug";
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

import appConfig from "@/config/appConfig";
import { useReportReady } from "@/hooks/use-report-ready";

// ─── Theme Configurations ─────────────────────────────────────────────────────
const SEV = {
  critical: { label: 'Critical', color: '#fb7185', bg: 'bg-rose-500/10', text: 'text-rose-600', bar: 'bg-rose-400' },
  high: { label: 'High', color: '#fbbf24', bg: 'bg-amber-500/10', text: 'text-amber-600', bar: 'bg-amber-400' },
  medium: { label: 'Medium', color: '#facc15', bg: 'bg-yellow-500/10', text: 'text-yellow-600', bar: 'bg-yellow-400' },
  low: { label: 'Low', color: '#38bdf8', bg: 'bg-sky-500/10', text: 'text-sky-600', bar: 'bg-sky-400' },
};

const PRINT_STYLE = `
@media print {
  .report-page { page-break-after: always !important; height: 297mm !important; }
  .report-page:last-child { page-break-after: auto !important; }
}
`;

// ─── Layout components ───────────────────────────────────────────────────────
const PrintLayout = ({ children, className = "" }) => (
  <div
    className={`bg-white font-sans relative report-page p-10 overflow-hidden ${className}`}
    style={{
      minHeight: "297mm",
      width: "210mm",
      maxHeight: "297mm",
    }}
  >
    {children}
  </div>
);

// ─── Manual Panels (From OrgExecutiveReport) ──────────────────────────────────

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
              <div className="h-full transition-all" style={{ width: `${closedPct}%`, backgroundColor: '#34d399' }} />
              <div className="h-full transition-all" style={{ width: `${openPct}%`, backgroundColor: color }} />
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
  const dist = distribution || [];
  const max = Math.max(...dist.map(d => d.count), 1);
  return (
    <div className="flex flex-col gap-3">
      {dist.slice(0, 10).map((item, i) => (
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
  const dist = data || [];
  const maxVal = Math.max(...dist.map(d => Math.max(d.open, d.closed, 1)));
  return (
    <div className="h-48 w-full flex items-end justify-between gap-1 pt-4">
      {dist.map((d, i) => {
        const heightOpen = `${(d.open / maxVal) * 100}%`;
        const heightClosed = `${(d.closed / maxVal) * 100}%`;
        return (
          <div key={i} className="flex flex-col items-center flex-1 h-full justify-end group">
            <div className="flex items-end gap-0.5 md:gap-1 w-full h-[140px] px-0.5 md:px-1 fade-in">
              <div className="w-1/2 flex items-end justify-center h-full relative">
                <div className="w-full bg-emerald-400 rounded-t-sm transition-all duration-500" style={{ height: heightClosed }} />
              </div>
              <div className="w-1/2 flex items-end justify-center h-full relative">
                <div className="w-full bg-amber-400 rounded-t-sm transition-all duration-500" style={{ height: heightOpen }} />
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

// ─── Report Pages ─────────────────────────────────────────────────────────────

const PageOne = ({ data }) => {
  const d = data;
  const org = d?.orgDetails || {};
  const v = d; 
  const am = {
    total: d?.totalVulns || 0,
    byType: { greyBox: 29, whiteBox: 25, blackBox: 4 },
    byState: { "Completed": 22, "Running": 12, "Pending": 9, "Scheduled": 10 }
  };

  let website_url = "";
  if (org?.website) {
    if (org.website.startsWith('http://') || org.website.startsWith('https://')) {
      try {
        website_url = new URL(org.website).hostname;
      } catch (e) {
        website_url = org.website;
      }
    } else {
      website_url = org.website;
    }
  }
  const orgLogoSrc = org?.logo || (website_url ? `https://img.logo.dev/${website_url}?token=pk_YDuXMfwrRe2kQtBuzc3Etg` : null);
  const vendorLogoSrc = 'https://suite.snapsec.co/media/logos/snapsec.svg';

  return (
    <PrintLayout>
      {/* ══ Cover Header ════════════════════════════════════════════════ */}
      <Card className="overflow-hidden border-0 shadow-sm mb-6">
        <div className="bg-foreground p-6">
          <div className="flex items-start justify-between gap-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                {orgLogoSrc ? (
                  <img src={orgLogoSrc} alt="Organization Logo" className="size-7 rounded bg-white object-contain p-1" />
                ) : (
                  <div className="size-7 rounded bg-background/20 flex items-center justify-center">
                    <Building2 size={15} className="text-background" />
                  </div>
                )}
                <span className="text-xs text-background/60 uppercase tracking-widest font-semibold">Organization Level</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-background leading-tight">Executive Security Posture Report</h2>
              </div>
              <div className="flex flex-wrap gap-3 pt-1">
                <span className="flex items-center gap-1.5 text-xs text-background/60">
                  <Building2 size={11} /> {org.name || "Client"}
                </span>
                {org.website && (
                  <span className="flex items-center gap-1.5 text-xs text-background/60">
                    <Globe size={11} /> {org.website.replace('https://', '')}
                  </span>
                )}
              </div>
            </div>
            <div className="shrink-0 flex flex-col items-end gap-3 text-right">
              {vendorLogoSrc && (
                <img src={vendorLogoSrc} alt="Vendor" className="size-12 rounded-xl bg-white/10 object-contain p-2" />
              )}
              <div className="text-right">
                <p className="text-[9px] text-background/50 uppercase tracking-wider font-bold">Conducted by</p>
                <p className="text-xs font-bold text-background mb-1">SnapSec</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-background/50 uppercase tracking-wider">Classification</p>
                <p className="text-sm font-bold text-background tracking-widest">RESTRICTED</p>
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 py-2.5 bg-muted/50 border-t border-border flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Report generated: <span className="font-medium text-foreground">{new Date().toLocaleDateString('en-GB')}</span>
          </span>
        </div>
      </Card>

      {/* ══ Overview KPIs ══════════════════════════════════════════════════ */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Vulns", val: d?.totalVulns || 0, icon: ShieldAlert, col: "text-sky-600", bg: "bg-sky-500/10" },
          { label: "Open Vulns", val: d?.openVulns || 0, icon: AlertTriangle, col: "text-amber-600", bg: "bg-amber-500/10" },
          { label: "Resolved", val: d?.closedVulns || 0, icon: CheckCircle2, col: "text-emerald-600", bg: "bg-emerald-500/10" },
          { label: "Avg CVSS", val: (d?.cvssScore || 0).toFixed(1), icon: Activity, col: "text-rose-600", bg: "bg-rose-500/10" },
        ].map((kpi, i) => (
          <Card key={i} className="shadow-sm border-border">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-widest font-semibold text-muted-foreground mb-1">{kpi.label}</p>
                <p className="text-3xl font-semibold tracking-tight tabular-nums text-foreground">{kpi.val}</p>
              </div>
              <div className={`size-10 rounded-full ${kpi.bg} flex items-center justify-center border border-border`}>
                <kpi.icon size={16} className={kpi.col} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ══ 12 Month Trend ═══════════════════════════════════════════════════ */}
      <Card className="shadow-sm mb-6">
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
          <Trend12MonthChart data={d?.vulnDistribution12Months} />
        </CardContent>
      </Card>

      {/* ══ Assessment Portfolio ═════════════════════════════════════════════ */}
      <Card className="shadow-sm">
        <CardHeader className="p-5 pb-3">
          <CardTitle className="text-sm font-semibold tracking-tight">Assessment Portfolio</CardTitle>
          <CardDescription className="text-xs mt-1">Active coverage operations</CardDescription>
        </CardHeader>
        <CardContent className="px-5 pb-5 pt-0 flex flex-col gap-5">
          <div className="space-y-2">
            {[
              { k: "Completed", v: "84%", c: "bg-emerald-400" },
              { k: "Running", v: "12%", c: "bg-indigo-400" },
              { k: "Pending/Scheduled", v: "4%", c: "bg-amber-400" }
            ].map(s => (
              <div key={s.k} className="flex justify-between items-center text-xs p-2 rounded-md border border-border/50">
                <span className="font-medium text-muted-foreground flex items-center gap-2">
                  <span className={`size-2 rounded-full ${s.c}`} /> {s.k}
                </span>
                <span className="font-semibold text-foreground tracking-tight tabular-nums">{s.v}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="absolute bottom-10 left-10 right-10 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-t pt-4">
         <span>SnapSec Executive Summary</span>
         <span>{org.name || "Client"} · Confidential</span>
      </div>
    </PrintLayout>
  );
};

const PageTwo = ({ data }) => {
  const d = data;
  const org = d?.orgDetails || {};
  const severityDistribution = {
    critical: d?.criticalOpen || 0,
    high: d?.highOpen || 0,
    medium: d?.medOpen || 0,
    low: d?.lowOpen || 0,
  };
  const severityOpenCloseCounts = {
    critical: { open: d?.criticalOpen || 0, closed: d?.criticalClosed || 0 },
    high: { open: d?.highOpen || 0, closed: d?.highClosed || 0 },
    medium: { open: d?.medOpen || 0, closed: d?.medClosed || 0 },
    low: { open: d?.lowOpen || 0, closed: d?.lowClosed || 0 },
  };
  const remediationRate = Math.round((d?.closedVulns / d?.totalVulns) * 100) || 0;

  return (
    <PrintLayout>
      <div className="grid grid-cols-2 gap-6 mb-6">
        <Card className="shadow-sm">
          <CardHeader className="p-5 pb-4">
            <CardTitle className="text-sm font-semibold tracking-tight">Organization Profile by Severity</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-0">
            <SeverityPanel distribution={severityDistribution} />
          </CardContent>
        </Card>

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
              <div className="h-full bg-emerald-400" style={{ width: `${remediationRate}%` }} />
            </div>
            <Separator className="mb-4" />
            <div className="grid grid-cols-3 gap-2">
              {[
                { title: "Met SLA", value: "86", color: "text-emerald-500" },
                { title: "At Risk", value: "0", color: "text-amber-500" },
                { title: "Breached", value: "14", color: "text-rose-500" },
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

      <div className="grid grid-cols-2 gap-6 mb-6">
        <Card className="shadow-sm">
          <CardHeader className="p-5 pb-4">
            <CardTitle className="text-sm font-semibold tracking-tight">Open vs. Closed by Severity</CardTitle>
            <CardDescription className="text-xs mt-1">Resolution progress across risk tiers</CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-0">
            <OpenClosedPanel counts={severityOpenCloseCounts} />
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="p-5 pb-4">
            <CardTitle className="text-sm font-semibold tracking-tight">Top 10 CWEs</CardTitle>
            <CardDescription className="text-xs mt-1">Most frequently identified weakness categories</CardDescription>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-0">
            <TopCWEPanel distribution={d?.cweDistribution} />
          </CardContent>
        </Card>
      </div>

      <div className="absolute bottom-10 left-10 right-10 flex items-center justify-between py-3 border-t border-border text-xs text-muted-foreground mt-4">
        <span>Prepared by <span className="font-medium text-foreground">SnapSec Executive Summary</span> · {new Date().toLocaleDateString('en-GB')}</span>
        <span>{org.name || "Client"} · <span className="font-medium text-foreground">Confidential</span></span>
      </div>
    </PrintLayout>
  );
};

// ----------------------
// Main Export
// ----------------------
export default function FullExecutiveReport({ initialData } = {}) {
  const [reportData, setReportData] = useState(initialData);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState(false);
  const [params] = useSearchParams();

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
    async function fetchReport() {
      setLoading(true);
      pdfDebug.dataFetchStarted();
      try {
        const assessmentId = params.get("assessmentId");
        const searchParams = new URLSearchParams();
        if (assessmentId && assessmentId !== "null" && assessmentId !== "undefined") {
          searchParams.set("assessmentId", assessmentId);
        }
        searchParams.set("accessToken", params.get("accessToken"));
        const url = `${EXTERNAL_CONFIG.BASE_URL}?${searchParams.toString()}`;
        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!response.ok) throw new Error("Fetch failed");
        const json = await response.json();
        setReportData(json.data);
        pdfDebug.dataFetchCompleted(json.data);
      } catch (err) {
        setError(true);
        pdfDebug.error(err, { context: "fetchReport" });
      } finally {
        setLoading(false);
      }
    }
    if (!initialData) fetchReport();
  }, [params, initialData]);

  const { statusMessage } = useReportReady({
    loading,
    data: reportData,
    error,
    options: { readyDelay: 3000 }
  });

  if (loading) {
    return (
      <div className="w-full bg-muted/20 flex items-center justify-center min-h-screen font-sans">
        <div className="flex flex-col items-center p-12 bg-white shadow-2xl rounded-3xl border">
          <div className="relative size-16 mb-6">
            <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-xl text-foreground font-black tracking-tight">Generating Intelligence...</p>
        </div>
      </div>
    );
  }

  if (!reportData || Object.keys(reportData).length === 0) {
    return (
      <div className="w-full bg-rose-50 flex items-center justify-center min-h-screen font-sans">
        <Card className="max-w-xl w-full shadow-2xl border-rose-100 overflow-hidden rounded-3xl p-12 text-center">
            <AlertTriangle size={48} className="text-rose-500 mx-auto mb-6" />
            <h1 className="text-2xl font-black text-rose-900 mb-2">No Data Available</h1>
            <p className="text-rose-700/70 font-medium">Please ensure the assessment has been completed and metrics are generated.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-[#f8fafc] py-12 print:py-0 print:bg-white">
      <style>{PRINT_STYLE}</style>
      <div className="shadow-[0_0_80px_rgba(0,0,0,0.08)] print:shadow-none space-y-0">
        <PageOne data={reportData} />
        <PageTwo data={reportData} />
      </div>
    </div>
  );
}

const EXTERNAL_CONFIG = {};
const externalApiUrl = `${appConfig.BASE_URL}/csm/api/reports/data/fullexec`;
const internalApiUrl = `http://vm/api/reports/data/fullexec`;
