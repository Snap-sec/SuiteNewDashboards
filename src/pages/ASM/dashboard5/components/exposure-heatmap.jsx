import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Panel, PanelState } from "./panel";
import { formatNumber } from "./format";

const SEVERITIES = [
  { label: "Critical", color: "#DC2626", rgb: "220, 38, 38" },
  { label: "High", color: "#F97316", rgb: "249, 115, 22" },
  { label: "Medium", color: "#EAB308", rgb: "234, 179, 8" },
  { label: "Low", color: "#A1A1AA", rgb: "161, 161, 170" },
];

function HeatmapSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-2">
      <div className="grid grid-cols-[88px_repeat(4,minmax(38px,1fr))_40px] gap-1">
        <span />
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-6 w-full" />
        ))}
        {Array.from({ length: 6 }).map((_, row) => (
          <div key={row} className="contents">
            <Skeleton className="h-3 w-20 self-center" />
            {Array.from({ length: 5 }).map((_, col) => (
              <Skeleton key={col} className="h-8 w-full" />
            ))}
          </div>
        ))}
      </div>
      <Skeleton className="mt-2 h-4 w-2/3" />
    </div>
  );
}

export function ExposureHeatmap({
  data,
  status,
  onRetry,
  onEmptyAction,
  className,
}) {
  const columnMax = useMemo(
    () =>
      SEVERITIES.map((_, index) =>
        Math.max(...data.rows.map((row) => row.values[index]), 1),
      ),
    [data.rows],
  );

  const flatCells = useMemo(
    () =>
      data.rows.flatMap((row, rowIndex) =>
        row.values.map((value, columnIndex) => ({
          assetType: row.assetType,
          rowIndex,
          columnIndex,
          value,
          severity: SEVERITIES[columnIndex].label,
        })),
      ),
    [data.rows],
  );

  const highest = flatCells.reduce(
    (current, cell) => (cell.value > current.value ? cell : current),
    flatCells[0],
  );
  const [active, setActive] = useState(highest);
  const activeCell = active ?? highest;

  return (
    <Panel
      title="Exposure by asset type"
      description="Open exposures across severity classes."
      help="Color intensity is scaled within each severity column so asset-type concentration is visible."
      className={className}
    >
      <PanelState
        state={status}
        skeleton={<HeatmapSkeleton />}
        onRetry={onRetry}
        onEmptyAction={onEmptyAction}
        emptyTitle="No asset exposure data"
        emptyDescription="Run discovery to distribute exposure across asset types."
      >
        <div className="flex flex-1 flex-col gap-3">
          <div
            role="group"
            aria-label="Heatmap of open exposures by asset type and severity"
            className="grid items-center gap-1"
            style={{
              gridTemplateColumns:
                "minmax(88px,1.2fr) repeat(4,minmax(38px,1fr)) 40px",
            }}
          >
            <span />
            {SEVERITIES.map((severity, index) => (
              <span
                key={severity.label}
                className="flex flex-col items-center gap-0.5"
              >
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <span
                    className="size-1.5 rounded-full"
                    style={{ backgroundColor: severity.color }}
                    aria-hidden="true"
                  />
                  {severity.label}
                </span>
                <span className="text-[11px] text-muted-foreground tabular-nums">
                  {data.totals[index]}
                </span>
              </span>
            ))}
            <span className="text-end text-[11px] text-muted-foreground">
              Total
            </span>

            {data.rows.map((row, rowIndex) => (
              <div key={row.assetType} className="contents">
                <span className="truncate pe-1 text-xs text-muted-foreground">
                  {row.assetType}
                </span>
                {row.values.map((value, columnIndex) => {
                  const severity = SEVERITIES[columnIndex];
                  const ratio = value / columnMax[columnIndex];
                  const alpha = 0.08 + ratio * 0.58;
                  const isActive =
                    activeCell?.rowIndex === rowIndex &&
                    activeCell?.columnIndex === columnIndex;

                  return (
                    <button
                      key={`${row.assetType}-${severity.label}`}
                      type="button"
                      title={`${row.assetType} · ${severity.label}: ${value} open exposures`}
                      aria-label={`${row.assetType}, ${severity.label}: ${value} open exposures`}
                      onMouseEnter={() =>
                        setActive({
                          assetType: row.assetType,
                          rowIndex,
                          columnIndex,
                          value,
                          severity: severity.label,
                        })
                      }
                      onFocus={() =>
                        setActive({
                          assetType: row.assetType,
                          rowIndex,
                          columnIndex,
                          value,
                          severity: severity.label,
                        })
                      }
                      onClick={() =>
                        setActive({
                          assetType: row.assetType,
                          rowIndex,
                          columnIndex,
                          value,
                          severity: severity.label,
                        })
                      }
                      className={cn(
                        "h-8 w-full rounded-[2px] text-xs font-medium text-foreground tabular-nums transition-colors",
                        isActive && "ring-2 ring-foreground/50",
                      )}
                      style={{
                        backgroundColor: `rgba(${severity.rgb}, ${alpha.toFixed(3)})`,
                      }}
                    >
                      {value}
                    </button>
                  );
                })}
                <span className="text-end text-xs font-medium tabular-nums">
                  {formatNumber(
                    row.values.reduce((sum, value) => sum + value, 0),
                  )}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">
              {activeCell?.assetType}
            </span>{" "}
            · {activeCell?.severity} ·{" "}
            <span className="font-medium text-foreground tabular-nums">
              {activeCell?.value ?? 0}
            </span>{" "}
            open exposures
          </div>

          <p className="text-[11px] text-muted-foreground">
            Intensity is scaled within each severity column. Totals reconcile to{" "}
            {formatNumber(data.grandTotal)} open exposures.
          </p>
        </div>
      </PanelState>
    </Panel>
  );
}
