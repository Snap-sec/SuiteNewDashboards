import { useEffect, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import response from "./data/response.json";
import { AttackTopology } from "./components/attack-topology";
import { ExposureHeatmap } from "./components/exposure-heatmap";
import { ExposureTreemap } from "./components/exposure-treemap";
import { FindingSheet } from "./components/finding-sheet";
import { FindingsTable } from "./components/findings-table";
import { MetricStrip } from "./components/metric-strip";
import { RiskMatrix } from "./components/risk-matrix";
import { SlaRunway } from "./components/sla-runway";

function getInitialStatus() {
  const demo = new URLSearchParams(window.location.search).get("demo");

  return ["loading", "empty", "error"].includes(demo) ? demo : "ready";
}

export function CisoAttackSurfaceCommand() {
  const [status, setStatus] = useState(getInitialStatus);
  const [selectedFinding, setSelectedFinding] = useState(null);
  const timerRef = useRef(null);

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

  const handleDiscovery = () => load("Discovery scan started");

  const openFindingById = (id) => {
    const finding = response.findings.find((item) => item.id === id);
    if (finding) setSelectedFinding(finding);
  };

  const scrollToFindings = () => {
    document
      .getElementById("priority-findings")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const { meta } = response;

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 p-4">
      <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="flex min-w-0 flex-col gap-2">
          <h1 className="text-xl font-medium leading-none text-mono">
            External attack surface
          </h1>
          <p className="text-sm text-secondary-foreground">
            CISO command view of exposure, attack paths and remediation
            pressure.
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span
                className="size-1.5 rounded-full bg-high"
                aria-hidden="true"
              />
              {meta.riskBand} exposure
            </span>
            <span
              className="size-1 shrink-0 rounded-full bg-muted-foreground/40"
              aria-hidden="true"
            />
            <span>{meta.openExposures} open exposures</span>
            <span
              className="size-1 shrink-0 rounded-full bg-muted-foreground/40"
              aria-hidden="true"
            />
            <span>{meta.criticalPastSla} critical past SLA</span>
            <span
              className="size-1 shrink-0 rounded-full bg-muted-foreground/40"
              aria-hidden="true"
            />
            <span>As of {meta.asOf}</span>
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="md"
          mode="icon"
          aria-label="Refresh attack surface data"
          title="Refresh data"
          onClick={() => load("Attack surface refreshed")}
          disabled={status === "loading"}
        >
          <RefreshCw
            className={status === "loading" ? "animate-spin" : undefined}
            aria-hidden="true"
          />
        </Button>
      </header>

      <MetricStrip
        metrics={response.metrics}
        status={status}
        onRetry={() => load()}
        onEmptyAction={handleDiscovery}
      />

      <section
        aria-label="Attack path and risk analysis"
        className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-12 xl:gap-6"
      >
        <AttackTopology
          className="min-w-0 xl:col-span-8"
          data={response.topology}
          findings={response.findings}
          status={status}
          onRetry={() => load()}
          onEmptyAction={handleDiscovery}
          onOpenFinding={setSelectedFinding}
        />
        <RiskMatrix
          className="min-w-0 xl:col-span-4"
          data={response.riskMatrix}
          status={status}
          onRetry={() => load()}
          onEmptyAction={handleDiscovery}
        />
      </section>

      <section
        aria-label="Exposure concentration and remediation"
        className="grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 xl:gap-6"
      >
        <ExposureTreemap
          className="min-w-0"
          data={response.treemap}
          status={status}
          onRetry={() => load()}
          onEmptyAction={handleDiscovery}
        />
        <ExposureHeatmap
          className="min-w-0"
          data={response.heatmap}
          status={status}
          onRetry={() => load()}
          onEmptyAction={handleDiscovery}
        />
        <SlaRunway
          className="min-w-0 md:col-span-2 xl:col-span-1"
          data={response.remediation}
          status={status}
          onRetry={() => load()}
          onEmptyAction={handleDiscovery}
          onOpenFinding={openFindingById}
          onOpenQueue={scrollToFindings}
        />
      </section>

      <div id="priority-findings" className="min-w-0">
        <FindingsTable
          findings={response.findings}
          status={status}
          onRetry={() => load()}
          onDiscover={handleDiscovery}
          onInspect={setSelectedFinding}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Evaluated {meta.asOf} · {meta.company} · {meta.period}
      </p>

      <FindingSheet
        finding={selectedFinding}
        onClose={() => setSelectedFinding(null)}
      />
    </div>
  );
}

export default CisoAttackSurfaceCommand;
