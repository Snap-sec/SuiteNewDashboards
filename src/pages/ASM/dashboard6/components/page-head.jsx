import { Radar } from "lucide-react";

export function PageHead({
  workspace = "Northwind Labs",
  updated = "Updated 4 min ago",
  onScan,
}) {
  return (
    <header className="page-head">
      <div className="flex flex-col gap-1.5 min-w-0">
        <h1 className="page-title text-xl font-medium tracking-tight text-mono">
          Surface command
        </h1>
        <p className="page-sub text-sm text-secondary-foreground">
          Continuous attack surface intelligence, active exposure pressure, and remediation velocity for {workspace}.
        </p>
      </div>

      <div className="page-actions">
        <button type="button" className="btn btn-primary" onClick={onScan}>
          <Radar className="icon icon-14" aria-hidden="true" />
          New scan
        </button>
      </div>
    </header>
  );
}

export default PageHead;
