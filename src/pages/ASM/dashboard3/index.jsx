import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDownRight,
  CalendarRange,
  Download,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ATTENTION_ITEMS,
  ASSET_COLORS,
  BUSINESS_UNITS,
  FINDINGS,
  LATEST,
  RANGE_OPTIONS,
  RISK_DRIVERS,
  SURFACE_MIX,
  getRange,
} from "./data";
import {
  BarSkeleton,
  DonutSkeleton,
  ListSkeleton,
  MetricStrip,
  Panel,
  PanelState,
  RiskSkeleton,
  ScoreGauge,
  TrendSkeleton,
} from "./components";
import { DistributionBar, SeverityDonut, TrendChart } from "./charts";
import { FindingsTable } from "./findings-table";
import { FindingSheet } from "./finding-sheet";

const EXPOSURE_COLORS = ["#F43F5E", "#F97316", "#F59E0B", "#8B5CF6", "#0EA5E9"];

const number = (value) => Number(value).toLocaleString("en-US");

function getInitialStatus() {
  const demo = new URLSearchParams(window.location.search).get("demo");

  return ["loading", "empty", "error"].includes(demo) ? demo : "ready";
}

export function CisoAttackSurfaceDashboard() {
  const [status, setStatus] = useState(getInitialStatus);
  const [rangeKey, setRangeKey] = useState("90d");
  const [selectedFinding, setSelectedFinding] = useState(null);
  const timerRef = useRef(null);

  const range = useMemo(() => getRange(rangeKey), [rangeKey]);

  useEffect(() => {
    return () => window.clearTimeout(timerRef.current);
  }, []);

  const load = (message) => {
    window.clearTimeout(timerRef.current);
    setStatus("loading");
    timerRef.current = window.setTimeout(() => {
      setStatus("ready");
      if (message) {
        toast.success(message, {
          description: "2,847 assets checked · last scan 09:42 UTC.",
        });
      }
    }, 700);
  };

  const handleRefresh = () => load("Attack surface refreshed");
  const handleDiscovery = () => load("Discovery scan started");

  const handleExport = () => {
    const rows = [
      ["ID", "Finding", "Asset", "Severity", "CVSS", "SLA", "Owner", "Status"],
      ...FINDINGS.map((finding) => [
        finding.id,
        finding.title,
        finding.asset,
        finding.severity,
        finding.cvss.toFixed(1),
        finding.sla.label,
        finding.owner.name,
        finding.status,
      ]),
    ];
    const csv = rows
      .map((row) =>
        row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","),
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "attack-surface-priority-findings.csv";
    link.click();
    URL.revokeObjectURL(url);

    toast.success("Export ready", {
      description: `${FINDINGS.length} findings saved as CSV.`,
    });
  };

  const openAttention = (item) => {
    const finding = FINDINGS.find((entry) => entry.id === item.id);
    if (finding) setSelectedFinding(finding);
  };

  const scrollToFindings = () => {
    document
      .getElementById("priority-findings")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 p-4">
      <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="flex min-w-0 flex-col gap-2">
          <h1 className="text-xl font-medium leading-none text-mono">
            External attack surface
          </h1>
          <p className="text-sm text-secondary-foreground">
            CISO view of external exposure, remediation, and business-unit risk.
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span>{number(LATEST.assets)} assets</span>
            <span
              className="size-1 shrink-0 rounded-full bg-muted-foreground/40"
              aria-hidden="true"
            />
            <span>{LATEST.domains} domains</span>
            <span
              className="size-1 shrink-0 rounded-full bg-muted-foreground/40"
              aria-hidden="true"
            />
            <span>{LATEST.subsidiaries} subsidiaries</span>
            <span
              className="size-1 shrink-0 rounded-full bg-muted-foreground/40"
              aria-hidden="true"
            />
            <span>Last scan 09:42 UTC</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={rangeKey} onValueChange={setRangeKey}>
            <SelectTrigger
              className="w-[152px]"
              aria-label="Select reporting period"
            >
              <CalendarRange className="size-4 opacity-60" aria-hidden="true" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RANGE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            mode="icon"
            aria-label="Refresh attack surface data"
            onClick={handleRefresh}
            disabled={status === "loading"}
          >
            <RefreshCw
              className={status === "loading" ? "animate-spin" : undefined}
              aria-hidden="true"
            />
          </Button>

          <Button type="button" variant="outline" onClick={handleExport}>
            <Download aria-hidden="true" />
            Export
          </Button>
        </div>
      </header>

      <MetricStrip
        state={status}
        onRetry={() => load()}
        onEmptyAction={handleDiscovery}
      />

      <section
        aria-label="Exposure analysis"
        className="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-6"
      >
        <Panel
          title="Exposure trend"
          help="Open findings by severity across the selected reporting period."
        >
          <PanelState
            state={status}
            skeleton={<TrendSkeleton />}
            onRetry={() => load()}
            onEmptyAction={handleDiscovery}
            emptyDescription="Run discovery to collect the first exposure trend."
          >
            <TrendChart range={range} />
          </PanelState>
        </Panel>

        <Panel
          title="Risk posture"
          help="Weighted score from exposure, exploitability, business criticality, and SLA age."
        >
          <PanelState
            state={status}
            skeleton={<RiskSkeleton />}
            onRetry={() => load()}
            onEmptyAction={handleDiscovery}
            emptyDescription="Run discovery to calculate the external exposure score."
          >
            <div className="flex flex-1 flex-col gap-5">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <ScoreGauge value={LATEST.score} />
                <div className="flex min-w-0 flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="size-2 rounded-full bg-high"
                      aria-hidden="true"
                    />
                    <span className="text-sm font-medium">Elevated</span>
                  </div>
                  <p className="text-sm leading-relaxed text-secondary-foreground">
                    Residual risk is concentrated in{" "}
                    <span className="font-medium text-foreground">
                      exposed admin consoles
                    </span>{" "}
                    and{" "}
                    <span className="font-medium text-foreground">
                      public cloud storage
                    </span>
                    . Nine critical findings are past SLA.
                  </p>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <ArrowDownRight className="size-3.5" aria-hidden="true" />6
                    points better than the prior quarter
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3.5">
                {RISK_DRIVERS.map((driver) => (
                  <div key={driver.label} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="truncate text-sm">{driver.label}</span>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {driver.detail}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted"
                        aria-hidden="true"
                      >
                        <div
                          className="h-full rounded-full bg-high"
                          style={{ width: `${driver.value}%` }}
                        />
                      </div>
                      <span className="w-8 text-end text-xs text-muted-foreground tabular-nums">
                        {driver.value}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </PanelState>
        </Panel>

        <Panel
          title="Severity mix"
          help="Distribution of all open findings by severity."
        >
          <PanelState
            state={status}
            skeleton={<DonutSkeleton />}
            onRetry={() => load()}
            onEmptyAction={handleDiscovery}
            emptyDescription="Run discovery to populate the severity mix."
          >
            <div className="flex flex-1 flex-col justify-center">
              <SeverityDonut />
            </div>
          </PanelState>
        </Panel>
      </section>

      <section
        aria-label="Surface analysis"
        className="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-6"
      >
        <Panel
          title="Asset composition"
          help="Discoverable assets grouped by asset class."
        >
          <PanelState
            state={status}
            skeleton={<BarSkeleton />}
            onRetry={() => load()}
            onEmptyAction={handleDiscovery}
            emptyDescription="Run discovery to map the external asset base."
          >
            <DistributionBar data={SURFACE_MIX} colors={ASSET_COLORS} />
          </PanelState>
        </Panel>

        <Panel
          title="Exposure by business unit"
          help="Open exposures grouped by the business unit that owns the asset."
        >
          <PanelState
            state={status}
            skeleton={<BarSkeleton bars={5} />}
            onRetry={() => load()}
            onEmptyAction={handleDiscovery}
            emptyDescription="Assign asset ownership to see business-unit exposure."
          >
            <DistributionBar data={BUSINESS_UNITS} colors={EXPOSURE_COLORS} />
          </PanelState>
        </Panel>

        <Panel
          title="Immediate attention"
          help="Highest-impact exposures that are past or closest to their SLA."
        >
          <PanelState
            state={status}
            skeleton={<ListSkeleton rows={3} />}
            onRetry={() => load()}
            onEmptyAction={() => load("Queue refreshed")}
            emptyTitle="Nothing needs attention"
            emptyDescription="No critical exposure is currently past SLA."
            emptyActionLabel="Refresh queue"
          >
            <div className="flex flex-1 flex-col">
              {ATTENTION_ITEMS.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => openAttention(item)}
                  className={`-mx-2 flex items-start justify-between gap-3 px-2 py-3 text-left transition-colors hover:bg-muted/50 ${
                    index > 0 ? "border-t border-border" : ""
                  }`}
                >
                  <div className="flex min-w-0 flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`size-2 shrink-0 rounded-full ${
                          item.severity === "Critical"
                            ? "bg-destructive"
                            : "bg-high"
                        }`}
                        aria-hidden="true"
                      />
                      <span className="text-xs text-muted-foreground">
                        {item.severity} · {item.id}
                      </span>
                    </div>
                    <span className="truncate text-sm font-medium">
                      {item.title}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {item.asset}
                    </span>
                  </div>
                  <span
                    className={`shrink-0 pt-0.5 text-xs font-medium ${
                      item.sla.includes("over")
                        ? "text-destructive"
                        : "text-high"
                    }`}
                  >
                    {item.sla}
                  </span>
                </button>
              ))}

              <div className="mt-auto pt-4">
                <Button
                  type="button"
                  variant="dim"
                  mode="link"
                  size="sm"
                  onClick={scrollToFindings}
                >
                  Review all {LATEST.criticalPastSla} SLA breaches
                </Button>
              </div>
            </div>
          </PanelState>
        </Panel>
      </section>

      <div id="priority-findings" className="min-w-0">
        <FindingsTable
          findings={FINDINGS}
          state={status}
          onRetry={() => load()}
          onDiscover={handleDiscovery}
          onInspect={setSelectedFinding}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Evaluated {LATEST.updated} · Meridian Capital Group · {range.label}
      </p>

      <FindingSheet
        finding={selectedFinding}
        onClose={() => setSelectedFinding(null)}
      />
    </div>
  );
}

export default CisoAttackSurfaceDashboard;
