import { Filter, RotateCcw } from "lucide-react";

export function AssetFilters({
  filterOptions,
  selectedFilters,
  onFilterChange,
  onResetFilters,
}) {
  const { environments = [], cloudProviders = [], severities = [], statuses = [] } =
    filterOptions || {};

  const activeCount =
    (selectedFilters.environment ? 1 : 0) +
    (selectedFilters.cloud ? 1 : 0) +
    (selectedFilters.severity ? 1 : 0) +
    (selectedFilters.status ? 1 : 0) +
    (selectedFilters.onlyExposed ? 1 : 0);

  return (
    <aside
      className="flex flex-col gap-3 w-72 shrink-0 sticky top-4 max-h-[calc(100vh-130px)]"
      aria-label="Asset filters"
    >
      {/* Filters Summary & Reset - Pinned at top */}
      <div className="flex items-center justify-between px-1 shrink-0">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground uppercase tracking-wider">
          <Filter className="size-3.5 text-primary" />
          Filters {activeCount > 0 && `(${activeCount})`}
        </span>
        {activeCount > 0 && (
          <button
            type="button"
            className="flex items-center gap-1 text-[11px] text-primary hover:underline font-medium"
            onClick={onResetFilters}
          >
            <RotateCcw className="size-3" />
            Reset all
          </button>
        )}
      </div>

      {/* Scrollable Filter Cards Container to accommodate more filters */}
      <div className="flex flex-col gap-3.5 overflow-y-auto pr-1 pb-4">
        {/* Filter Card 1: Environment & Cloud */}
        <div className="card border border-border bg-card rounded-xl shadow-xs">
          <div className="card-head px-3.5 py-2.5 border-b border-border">
            <h3 className="card-title text-xs font-semibold text-foreground">
              Environment & Cloud
            </h3>
          </div>
          <div className="card-body p-3.5 flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-medium text-muted-foreground">Environment</span>
              <div className="flex flex-wrap gap-1.5">
                {environments.map((env) => {
                  const isSelected = selectedFilters.environment === env;
                  return (
                    <button
                      key={env}
                      type="button"
                      onClick={() =>
                        onFilterChange("environment", isSelected ? null : env)
                      }
                      className={`text-[11px] px-2.5 py-1 rounded-md border transition-colors ${
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary font-medium"
                          : "bg-muted/40 text-secondary-foreground border-border hover:bg-muted"
                      }`}
                    >
                      {env}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-1.5 pt-2.5 border-t border-border">
              <span className="text-[11px] font-medium text-muted-foreground">Cloud Provider</span>
              <div className="flex flex-col gap-1">
                {cloudProviders.map((cloud) => {
                  const isSelected = selectedFilters.cloud === cloud;
                  return (
                    <label
                      key={cloud}
                      className="flex items-center justify-between text-xs text-secondary-foreground cursor-pointer hover:text-foreground py-0.5"
                    >
                      <span className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() =>
                            onFilterChange("cloud", isSelected ? null : cloud)
                          }
                          className="rounded border-border text-primary size-3.5 focus:ring-0"
                        />
                        {cloud}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Filter Card 2: Exposure & Risk Severity */}
        <div className="card border border-border bg-card rounded-xl shadow-xs">
          <div className="card-head px-3.5 py-2.5 border-b border-border">
            <h3 className="card-title text-xs font-semibold text-foreground">
              Exposure & Risk
            </h3>
          </div>
          <div className="card-body p-3.5 flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-medium text-muted-foreground">Severity Level</span>
              <div className="flex flex-wrap gap-1.5">
                {severities.map((sev) => {
                  const isSelected = selectedFilters.severity === sev;
                  const isCrit = sev === "Critical";
                  const isHigh = sev === "High";

                  return (
                    <button
                      key={sev}
                      type="button"
                      onClick={() =>
                        onFilterChange("severity", isSelected ? null : sev)
                      }
                      className={`text-[11px] px-2.5 py-1 rounded-md border transition-colors ${
                        isSelected
                          ? isCrit
                            ? "bg-destructive text-destructive-foreground border-destructive font-medium"
                            : isHigh
                              ? "bg-high text-white border-high font-medium"
                              : "bg-primary text-primary-foreground border-primary font-medium"
                          : "bg-muted/40 text-secondary-foreground border-border hover:bg-muted"
                      }`}
                    >
                      {sev}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2.5 border-t border-border">
              <label className="flex items-center gap-2 text-xs text-secondary-foreground cursor-pointer select-none hover:text-foreground">
                <input
                  type="checkbox"
                  checked={selectedFilters.onlyExposed || false}
                  onChange={(e) =>
                    onFilterChange("onlyExposed", e.target.checked ? true : null)
                  }
                  className="rounded border-border text-primary size-3.5 focus:ring-0"
                />
                <span className="font-medium text-foreground">Only assets with exposures</span>
              </label>
            </div>
          </div>
        </div>

        {/* Filter Card 3: Asset Status & Monitoring */}
        <div className="card border border-border bg-card rounded-xl shadow-xs">
          <div className="card-head px-3.5 py-2.5 border-b border-border">
            <h3 className="card-title text-xs font-semibold text-foreground">
              Asset Status
            </h3>
          </div>
          <div className="card-body p-3.5 flex flex-col gap-2">
            {statuses.map((st) => {
              const isSelected = selectedFilters.status === st;
              return (
                <label
                  key={st}
                  className="flex items-center justify-between text-xs text-secondary-foreground cursor-pointer hover:text-foreground py-0.5"
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() =>
                        onFilterChange("status", isSelected ? null : st)
                      }
                      className="rounded border-border text-primary size-3.5 focus:ring-0"
                    />
                    {st}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {st === "Active" ? "1,048" : st === "Monitored" ? "182" : "54"}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}

export default AssetFilters;
