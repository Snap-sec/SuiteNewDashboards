import { useEffect, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import response from "./data/response.json";
import { formatNumber } from "./components/format";
import { CriticalWatchlist } from "./components/critical-watchlist";
import { ExposureHeatmap } from "./components/exposure-heatmap";
import { FindingSheet } from "./components/finding-sheet";
import { RemediationRunway } from "./components/remediation-runway";
import { RiskRadial } from "./components/risk-radial";
import { SurfaceChanges } from "./components/surface-changes";
import { SurfaceTrend } from "./components/surface-trend";

function getInitialStatus() {
  const demo = new URLSearchParams(window.location.search).get("demo");

  return ["loading", "empty", "error"].includes(demo) ? demo : "ready";
}

export function CisoRiskBriefing() {
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
  const { meta } = response;

  return (
    <div className="flex w-full min-w-0 flex-col gap-6 p-4">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex min-w-0 flex-col gap-2">
          <h1 className="text-xl font-medium leading-none text-mono">
            External attack surface
          </h1>
          <p className="text-sm text-secondary-foreground">
            CISO risk briefing for {meta.company}.
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span
                className="size-1.5 rounded-full bg-high"
                aria-hidden="true"
              />
              {meta.riskBand}
            </span>
            <span
              className="size-1 shrink-0 rounded-full bg-muted-foreground/40"
              aria-hidden="true"
            />
            <span>{formatNumber(meta.externalAssets)} assets</span>
            <span
              className="size-1 shrink-0 rounded-full bg-muted-foreground/40"
              aria-hidden="true"
            />
            <span>{formatNumber(meta.openExposures)} open exposures</span>
            <span
              className="size-1 shrink-0 rounded-full bg-muted-foreground/40"
              aria-hidden="true"
            />
            <span>{meta.criticalExposures} critical</span>
            <span
              className="size-1 shrink-0 rounded-full bg-muted-foreground/40"
              aria-hidden="true"
            />
            <span>{meta.pastSla} past SLA</span>
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

      <section
        aria-label="Overall risk and attack surface trajectory"
        className="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6"
      >
        <RiskRadial
          className="min-w-0 lg:col-span-4"
          data={response.risk}
          status={status}
          onRetry={() => load()}
          onEmptyAction={handleDiscovery}
        />
        <SurfaceTrend
          className="min-w-0 lg:col-span-8"
          data={response.trend}
          status={status}
          onRetry={() => load()}
          onEmptyAction={handleDiscovery}
        />
      </section>

      <section
        aria-label="Critical exposure detail and asset distribution"
        className="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6"
      >
        <CriticalWatchlist
          className="min-w-0 lg:col-span-7"
          data={response.criticalExposures}
          totalCritical={meta.criticalExposures}
          status={status}
          onRetry={() => load()}
          onEmptyAction={handleDiscovery}
          onInspect={setSelectedFinding}
        />
        <ExposureHeatmap
          className="min-w-0 lg:col-span-5"
          data={response.assetHeatmap}
          status={status}
          onRetry={() => load()}
          onEmptyAction={handleDiscovery}
        />
      </section>

      <section
        aria-label="Latest surface changes and remediation runway"
        className="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6"
      >
        <SurfaceChanges
          className="min-w-0 lg:col-span-8"
          data={response.surfaceChanges}
          status={status}
          onRetry={() => load()}
          onEmptyAction={handleDiscovery}
        />
        <RemediationRunway
          className="min-w-0 lg:col-span-4"
          data={response.remediation}
          status={status}
          onRetry={() => load()}
          onEmptyAction={handleDiscovery}
        />
      </section>

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

export default CisoRiskBriefing;
