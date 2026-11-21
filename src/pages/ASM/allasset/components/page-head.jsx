import { Download, Radar, Search } from "lucide-react";

export function PageHead({
  workspace = "Northwind Labs",
  searchQuery,
  onSearchChange,
  onScan,
  onExport,
}) {
  return (
    <header className="page-head flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
      <div className="flex flex-col gap-1 min-w-0">
        <h1 className="page-title text-xl font-medium tracking-tight text-mono">
          All assets
        </h1>
        <p className="page-sub text-sm text-secondary-foreground">
          Centralized attack surface inventory and continuous exposure tracking across all perimeters for {workspace}.
        </p>
      </div>

      <div className="page-actions flex items-center gap-2.5">
        <div className="relative flex items-center">
          <Search className="absolute left-2.5 size-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            className="w-60 pl-8 pr-3 py-1.5 text-xs rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
            placeholder="Search hostname, IP, tech..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <button
          type="button"
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-foreground transition-colors shadow-xs font-medium"
          onClick={onExport}
          title="Export asset inventory"
        >
          <Download className="size-3.5 text-muted-foreground" aria-hidden="true" />
          Export
        </button>

        <button
          type="button"
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors shadow-xs"
          onClick={onScan}
        >
          <Radar className="size-3.5" aria-hidden="true" />
          Scan assets
        </button>
      </div>
    </header>
  );
}

export default PageHead;
