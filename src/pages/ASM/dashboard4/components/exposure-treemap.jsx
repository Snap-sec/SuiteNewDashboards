import { useState } from "react";
import { ResponsiveContainer, Treemap } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Panel, PanelState } from "./panel";
import { formatNumber } from "./format";

function cellOpacity(risk) {
  return 0.07 + (risk / 100) * 0.62;
}

function TreemapCell(props) {
  const {
    x,
    y,
    width,
    height,
    name,
    value,
    critical,
    short,
    risk,
    id,
    depth,
    activeId,
    onActivate,
  } = props;

  if (!width || !height || !id || depth === 0) return null;

  const safeRisk = Number.isFinite(risk) ? risk : 0;
  const active = activeId === id;
  const showLabel = width > 70 && height > 28;
  const showValue = width > 70 && height > 46;

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={`${name}: ${formatNumber(value)} open exposures, ${critical} critical, density ${safeRisk} out of 100`}
      onFocus={() => onActivate(id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onActivate(id);
        }
      }}
      className="cursor-pointer focus-visible:outline-none"
    >
      <rect
        x={x + 0.5}
        y={y + 0.5}
        width={Math.max(width - 1, 0)}
        height={Math.max(height - 1, 0)}
        rx={4}
        fill="var(--high)"
        fillOpacity={cellOpacity(safeRisk)}
        stroke={active ? "var(--foreground)" : "var(--background)"}
        strokeWidth={active ? 2 : 1}
      />
      {showLabel && (
        <text
          x={x + 8}
          y={y + 18}
          fontSize={11}
          fontWeight={500}
          fill="var(--foreground)"
        >
          {short}
        </text>
      )}
      {showValue && (
        <text x={x + 8} y={y + 34} fontSize={11} fill="var(--muted-foreground)">
          {formatNumber(value)} open
        </text>
      )}
      <title>
        {name}: {formatNumber(value)} open exposures, {critical} critical
      </title>
    </g>
  );
}

function TreemapSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-3">
      <div className="grid h-[260px] grid-cols-4 grid-rows-3 gap-1.5">
        <Skeleton className="col-span-2 row-span-2 h-full w-full" />
        <Skeleton className="h-full w-full" />
        <Skeleton className="h-full w-full" />
        <Skeleton className="h-full w-full" />
        <Skeleton className="h-full w-full" />
        <Skeleton className="col-span-2 h-full w-full" />
        <Skeleton className="h-full w-full" />
        <Skeleton className="h-full w-full" />
      </div>
      <Skeleton className="h-4 w-full" />
    </div>
  );
}

export function ExposureTreemap({
  data,
  status,
  onRetry,
  onEmptyAction,
  className,
}) {
  const highestRisk = data.reduce(
    (highest, item) => (item.risk > highest.risk ? item : highest),
    data[0],
  );
  const [activeId, setActiveId] = useState(highestRisk?.id);
  const active = data.find((item) => item.id === activeId) ?? highestRisk;

  return (
    <Panel
      title="Exposure concentration"
      description="Open exposures by business unit and asset class."
      help="Tile area is open exposures. Shading is exposure density relative to the asset base."
      className={className}
    >
      <PanelState
        state={status}
        skeleton={<TreemapSkeleton />}
        onRetry={onRetry}
        onEmptyAction={onEmptyAction}
        emptyTitle="No exposure concentration"
        emptyDescription="Run discovery to see where exposure concentrates."
      >
        <div
          role="group"
          className="flex flex-1 flex-col gap-3"
          aria-label="Treemap of open exposures by business unit and asset class"
        >
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <Treemap
                data={data}
                dataKey="value"
                nameKey="name"
                aspectRatio={4 / 3}
                stroke="var(--background)"
                fill="transparent"
                isAnimationActive={false}
                content={(props) => (
                  <TreemapCell
                    {...props}
                    activeId={activeId}
                    onActivate={setActiveId}
                  />
                )}
                onMouseEnter={(node) => setActiveId(node.id)}
                onClick={(node) => setActiveId(node.id)}
              />
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-2">
            <span className="text-xs text-muted-foreground">
              {active?.businessUnit} · {active?.assetClass}
            </span>
            <span className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground tabular-nums">
                {formatNumber(active?.value ?? 0)}
              </span>{" "}
              open ·{" "}
              <span className="font-medium text-foreground tabular-nums">
                {active?.critical ?? 0}
              </span>{" "}
              critical
            </span>
            <span className="text-xs text-muted-foreground tabular-nums">
              Density {active?.risk ?? 0}/100
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
            <span>Lower density</span>
            <span className="flex gap-0.5" aria-hidden="true">
              {[0.07, 0.22, 0.36, 0.5, 0.66].map((opacity) => (
                <span
                  key={opacity}
                  className="size-2.5 rounded-[2px] bg-high"
                  style={{ opacity }}
                />
              ))}
            </span>
            <span>Higher density</span>
          </div>

          <div className="sr-only">
            {data.map((item) => (
              <p key={item.id}>
                {item.name}: {item.value} open exposures, {item.critical}{" "}
                critical, risk {item.risk} out of 100.
              </p>
            ))}
          </div>
        </div>
      </PanelState>
    </Panel>
  );
}
