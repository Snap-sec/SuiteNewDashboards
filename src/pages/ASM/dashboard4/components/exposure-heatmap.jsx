import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Panel, PanelState } from "./panel";

const HEAT_STEPS = [0.08, 0.24, 0.4, 0.58, 0.74, 0.86];

function heatColor(value, max) {
  const ratio = Math.min(value / max, 1);
  const opacity = 0.05 + ratio * 0.9;
  return `rgba(249, 115, 22, ${opacity.toFixed(3)})`;
}

function shortWeek(week) {
  return week
    .replace("Sep ", "9/")
    .replace("Oct ", "10/")
    .replace("Nov ", "11/");
}

function HeatmapSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="grid grid-cols-[64px_repeat(10,minmax(0,1fr))] gap-1">
        <span />
        {Array.from({ length: 10 }).map((_, index) => (
          <Skeleton key={`head-${index}`} className="h-3 w-full" />
        ))}
        {Array.from({ length: 5 }).map((_, row) => (
          <div key={row} className="contents">
            <Skeleton className="h-3 w-14 self-center" />
            {Array.from({ length: 10 }).map((_, col) => (
              <Skeleton key={col} className="h-7 w-full" />
            ))}
          </div>
        ))}
      </div>
      <Skeleton className="h-4 w-2/3" />
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
  const flatCells = useMemo(
    () =>
      data.rows.flatMap((row) =>
        row.values.map((value, weekIndex) => ({
          businessUnit: row.businessUnit,
          value,
          weekIndex,
          week: data.weeks[weekIndex],
        })),
      ),
    [data.rows, data.weeks],
  );

  const highest = flatCells.reduce(
    (current, cell) => (cell.value > current.value ? cell : current),
    flatCells[0],
  );
  const [active, setActive] = useState(highest);
  const activeCell = active ?? highest;

  return (
    <Panel
      title="Exposure heatmap"
      description="Weekly new exposures by business unit."
      help="Darker cells indicate more newly discovered exposure in that week."
      className={className}
    >
      <PanelState
        state={status}
        skeleton={<HeatmapSkeleton />}
        onRetry={onRetry}
        onEmptyAction={onEmptyAction}
        emptyTitle="No weekly exposure data"
        emptyDescription="Run discovery to build the weekly exposure heatmap."
      >
        <div className="flex flex-1 flex-col gap-3">
          <div
            role="group"
            aria-label="Weekly new exposures heatmap by business unit"
            className="grid items-center gap-1"
            style={{
              gridTemplateColumns: `64px repeat(${data.weeks.length}, minmax(0, 1fr))`,
            }}
          >
            <span />
            {data.weeks.map((week) => (
              <span
                key={week}
                className="text-center text-[11px] text-muted-foreground"
              >
                {shortWeek(week)}
              </span>
            ))}

            {data.rows.map((row) => (
              <div key={row.businessUnit} className="contents">
                <span className="truncate pe-1 text-xs text-muted-foreground">
                  {row.businessUnit}
                </span>
                {row.values.map((value, weekIndex) => {
                  const cell = {
                    businessUnit: row.businessUnit,
                    value,
                    weekIndex,
                    week: data.weeks[weekIndex],
                  };
                  const isActive =
                    activeCell?.businessUnit === cell.businessUnit &&
                    activeCell?.weekIndex === weekIndex;

                  return (
                    <button
                      key={`${row.businessUnit}-${weekIndex}`}
                      type="button"
                      title={`${row.businessUnit} · week of ${cell.week} · ${value} new exposures`}
                      aria-label={`${row.businessUnit}, week of ${cell.week}: ${value} new exposures`}
                      onMouseEnter={() => setActive(cell)}
                      onFocus={() => setActive(cell)}
                      onClick={() => setActive(cell)}
                      className={cn(
                        "h-7 w-full rounded-[2px] transition-colors",
                        isActive && "ring-2 ring-foreground/50",
                      )}
                      style={{
                        backgroundColor: heatColor(value, data.max),
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          <div className="flex min-h-4 flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-muted-foreground">
              {activeCell?.businessUnit} · week of {activeCell?.week} ·{" "}
              <span className="font-medium text-foreground tabular-nums">
                {activeCell?.value ?? 0}
              </span>{" "}
              new exposures
            </span>
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span>Lower</span>
              <span className="flex gap-0.5" aria-hidden="true">
                {HEAT_STEPS.map((opacity) => (
                  <span
                    key={opacity}
                    className="size-2.5 rounded-[2px]"
                    style={{
                      backgroundColor: `rgba(249, 115, 22, ${opacity})`,
                    }}
                  />
                ))}
              </span>
              <span>Higher</span>
            </div>
          </div>

          <p className="border-t border-border pt-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Insight:</span>{" "}
            {data.insight}
          </p>
        </div>
      </PanelState>
    </Panel>
  );
}
