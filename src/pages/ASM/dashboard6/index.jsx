import { toast } from "sonner";
import { useGetAsmAssetsQuery } from "@/services/asm/attackSurfaceApi";
import response from "./data/response.json";
import { ExposureMatrix } from "./components/exposure-matrix";
import { ExposurePressure } from "./components/exposure-pressure";
import { PageHead } from "./components/page-head";
import { PriorityQueue } from "./components/priority-queue";
import { RemediationBoard } from "./components/remediation-board";
import { RiskScore } from "./components/risk-score";
import { ScanPulse } from "./components/scan-pulse";
import { StatStrip } from "./components/stat-strip";
import { SurfaceChanges } from "./components/surface-changes";
import "./styles.css";

export function SurfaceCommandDashboard() {
  const { data: subdomainsData, isLoading: subdomainsLoading } =
    useGetAsmAssetsQuery({
      limit: 10,
      page: 1,
      search: "",
      sortOrder: "desc",
      sortField: "createdAt",
      type: "subdomain",
    });

  const handleScan = () => {
    toast.success("Discovery scan queued", {
      description:
        "Northwind Labs · results usually arrive in about 20 minutes.",
    });
  };

  const metricsData = subdomainsData?.metrics || {
    total: 41,
    live: 39,
    external: 41,
    with_open_ports: 0,
    alerts: 0,
  };

  return (
    <div className="surface-command w-full min-w-0">
      <div className="sc-content">
        <PageHead
          workspace={response.workspace}
          updated={response.updatedLabel}
          onScan={handleScan}
        />

        <StatStrip
          metrics={metricsData}
          isLoading={subdomainsLoading && !subdomainsData?.metrics}
        />

        <section className="primary-grid" aria-label="Posture overview">
          <ExposurePressure data={response.exposurePressure} />
          <RiskScore data={response.riskScore} />
          <ScanPulse data={response.scanPulse} />
        </section>

        <div className="split-grid">
          <ExposureMatrix data={response.exposureMatrix} />
          <PriorityQueue data={response.priorityQueue} />
        </div>

        <div className="split-grid">
          <RemediationBoard data={response.remediationBoard} />
          <SurfaceChanges data={response.surfaceChanges} />
        </div>
      </div>
    </div>
  );
}

export default SurfaceCommandDashboard;
