import React from "react";
import Metrics from "@/pages/ASM/attack-surface/subdomains/components/metrics";

export function StatStrip({ metrics, isLoading }) {
  const defaultMetrics = {
    total: 41,
    live: 39,
    external: 41,
    with_open_ports: 0,
    alerts: 0,
  };

  return <Metrics metrics={metrics || defaultMetrics} isLoading={isLoading} />;
}

export default StatStrip;
