import { useState } from "react";
import { CheckCircle2, ChevronRight, Copy, Globe, Network, Server, Shield } from "lucide-react";
import { toast } from "sonner";

const TYPE_ICONS = {
  subdomains: Globe,
  ip: Network,
  server: Server,
  dns: Shield,
};

const SEVERITY_DOT = {
  Critical: "bg-destructive",
  High: "bg-high",
  Medium: "bg-warning",
  Low: "bg-muted-foreground",
  Clean: "bg-good",
};

export function AssetTable({ assets, totalCount, activeTab }) {
  const [selectedIds, setSelectedIds] = useState(new Set());

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard", { description: text });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === assets.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(assets.map((a) => a.id)));
    }
  };

  const toggleSelectOne = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  return (
    <div className="card border border-border bg-card rounded-xl shadow-xs flex-1 min-w-0 flex flex-col overflow-hidden">
      <div className="card-head px-4 py-3 flex items-center justify-between border-b border-border bg-card">
        <div className="card-titles">
          <h2 className="card-title text-sm font-semibold text-foreground">
            Asset inventory
          </h2>
        </div>
        <div className="card-tools flex items-center gap-2">
          {selectedIds.size > 0 && (
            <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-0.5 rounded">
              {selectedIds.size} selected
            </span>
          )}
          <span className="chip chip-neutral text-xs">
            {assets.length} displayed of {totalCount.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="card-body p-0 flex-1 min-w-0">
        <div className="remediation-table-wrap overflow-x-auto">
          <table className="remediation-table w-full">
            <thead>
              <tr className="bg-muted/30">
                <th scope="col" className="w-10 text-center pl-4 pr-1">
                  <input
                    type="checkbox"
                    checked={assets.length > 0 && selectedIds.size === assets.length}
                    onChange={toggleSelectAll}
                    className="rounded border-border text-primary size-3.5 focus:ring-0"
                    aria-label="Select all assets"
                  />
                </th>
                <th scope="col">Asset name</th>
                <th scope="col">Type</th>
                <th scope="col">Target / IP</th>
                <th scope="col">Environment</th>
                <th scope="col">Exposures</th>
                <th scope="col">Last scanned</th>
                <th scope="col">Status</th>
                <th scope="col" className="text-right pr-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {assets.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-muted-foreground text-xs">
                    No assets matching the current filters or search query.
                  </td>
                </tr>
              ) : (
                assets.map((asset) => {
                  const Icon = TYPE_ICONS[asset.type] || Globe;
                  const isChecked = selectedIds.has(asset.id);

                  return (
                    <tr
                      key={asset.id}
                      className={`hover:bg-muted/30 transition-colors ${
                        isChecked ? "bg-muted/50" : ""
                      }`}
                    >
                      <td className="w-10 text-center pl-4 pr-1">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectOne(asset.id)}
                          className="rounded border-border text-primary size-3.5 focus:ring-0"
                          aria-label={`Select ${asset.name}`}
                        />
                      </td>

                      {/* Asset name */}
                      <td>
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1.5 font-medium text-foreground">
                            <span className="font-mono text-xs font-semibold">{asset.name}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(asset.name)}
                              className="text-muted-foreground hover:text-foreground p-0.5"
                              title="Copy hostname"
                            >
                              <Copy className="size-3" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                            <span>{asset.id}</span>
                            <span>·</span>
                            <span>{asset.team}</span>
                          </div>
                        </div>
                      </td>

                      {/* Asset Type */}
                      <td>
                        <span className="inline-flex items-center gap-1.5 text-xs text-secondary-foreground font-medium">
                          <Icon className="size-3.5 text-muted-foreground" />
                          {asset.typeLabel}
                        </span>
                      </td>

                      {/* Target / IP */}
                      <td>
                        <div className="flex flex-col gap-0.5">
                          <code className="text-xs font-mono text-foreground">
                            {asset.ip}:{asset.port}
                          </code>
                          <span className="text-[10px] text-muted-foreground">
                            {asset.cloud}
                          </span>
                        </div>
                      </td>

                      {/* Environment */}
                      <td>
                        <span className="text-xs px-2 py-0.5 rounded border border-border bg-muted/40 text-secondary-foreground">
                          {asset.environment}
                        </span>
                      </td>

                      {/* Exposures */}
                      <td>
                        {asset.exposuresCount > 0 ? (
                          <div className="flex items-center gap-1.5">
                            <span className="chip chip-critical font-medium text-xs">
                              {asset.exposuresCount} {asset.exposuresCount === 1 ? "Exposure" : "Exposures"}
                            </span>
                            <span className={`size-1.5 rounded-full ${SEVERITY_DOT[asset.topSeverity] || "bg-muted-foreground"}`} title={`Top severity: ${asset.topSeverity}`} />
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-good font-medium bg-good-soft px-2 py-0.5 rounded">
                            <CheckCircle2 className="size-3" />
                            Clean
                          </span>
                        )}
                      </td>

                      {/* Last scanned */}
                      <td>
                        <span className="text-xs text-muted-foreground">
                          {asset.lastScanned}
                        </span>
                      </td>

                      {/* Status */}
                      <td>
                        <span className="inline-flex items-center gap-1.5 text-xs text-secondary-foreground">
                          <span className={`size-1.5 rounded-full ${asset.status === "Active" ? "bg-good" : "bg-muted-foreground"}`} />
                          {asset.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="text-right pr-4">
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                          onClick={() => toast.info(`Viewing details for ${asset.name}`)}
                        >
                          View <ChevronRight className="size-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card-foot px-4 py-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground bg-card">
        <span>
          Showing {assets.length} of {totalCount.toLocaleString()} total monitored assets
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-2.5 py-1 rounded-md border border-border bg-card hover:bg-muted text-foreground transition-colors disabled:opacity-40"
            disabled
          >
            Previous
          </button>
          <span className="px-2 py-1 font-mono font-medium text-foreground">1</span>
          <button
            type="button"
            className="px-2.5 py-1 rounded-md border border-border bg-card hover:bg-muted text-foreground transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssetTable;
