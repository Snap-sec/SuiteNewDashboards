import { useState } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Panel, PanelState } from "./panel";
import { formatNumber } from "./format";

const PLOT_X = 38;
const PLOT_Y = 8;
const CELL = 48;
const PLOT_SIZE = CELL * 5;

function cellTone(likelihood, impact) {
  const score = likelihood * impact;

  if (score >= 17) {
    return { fill: "var(--destructive)", opacity: 0.24 };
  }
  if (score >= 10) {
    return { fill: "var(--high)", opacity: 0.22 };
  }
  if (score >= 5) {
    return { fill: "var(--warning)", opacity: 0.18 };
  }
  return { fill: "var(--muted)", opacity: 0.55 };
}

function bubbleStyle(severity) {
  if (severity === "Critical") {
    return {
      fill: "var(--destructive)",
      fillOpacity: 0.22,
      stroke: "var(--destructive)",
    };
  }
  return {
    fill: "var(--high)",
    fillOpacity: 0.24,
    stroke: "var(--high)",
  };
}

function MatrixSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="grid grid-cols-5 gap-1">
        {Array.from({ length: 25 }).map((_, index) => (
          <Skeleton key={index} className="h-9 w-full" />
        ))}
      </div>
      <div className="flex flex-col gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-4 w-full" />
        ))}
      </div>
    </div>
  );
}

export function RiskMatrix({
  data,
  status,
  onRetry,
  onEmptyAction,
  className,
}) {
  const [activeId, setActiveId] = useState(data.items[0]?.id);
  const active =
    data.items.find((item) => item.id === activeId) ?? data.items[0];
  const maxOpen = Math.max(...data.items.map((item) => item.open), 1);

  return (
    <Panel
      title="Risk matrix"
      description="Likelihood × business impact."
      help="Bubble size shows open exposures. Cell shading shows combined risk."
      className={className}
    >
      <PanelState
        state={status}
        skeleton={<MatrixSkeleton />}
        onRetry={onRetry}
        onEmptyAction={onEmptyAction}
        emptyTitle="No scored exposures"
        emptyDescription="Run discovery to score exposures by likelihood and business impact."
      >
        <div className="flex flex-1 flex-col gap-2">
          <div className="mx-auto w-full max-w-[340px]">
            <svg
              viewBox="0 0 300 296"
              role="group"
              aria-label="Risk matrix. Five business units plotted by likelihood and business impact."
              className="h-auto w-full"
            >
              <text
                x={PLOT_X + PLOT_SIZE / 2}
                y={292}
                textAnchor="middle"
                fontSize={11}
                fill="var(--muted-foreground)"
              >
                Business impact →
              </text>
              <text
                x={10}
                y={PLOT_Y + PLOT_SIZE / 2}
                textAnchor="middle"
                fontSize={11}
                fill="var(--muted-foreground)"
                transform={`rotate(-90 10 ${PLOT_Y + PLOT_SIZE / 2})`}
              >
                Likelihood →
              </text>

              {Array.from({ length: 5 }).map((_, impactIndex) => {
                const impact = impactIndex + 1;
                return Array.from({ length: 5 }).map((_, likelihoodIndex) => {
                  const likelihood = likelihoodIndex + 1;
                  const tone = cellTone(likelihood, impact);
                  const x = PLOT_X + impactIndex * CELL;
                  const y = PLOT_Y + (4 - likelihoodIndex) * CELL;

                  return (
                    <rect
                      key={`${impact}-${likelihood}`}
                      x={x}
                      y={y}
                      width={CELL}
                      height={CELL}
                      fill={tone.fill}
                      fillOpacity={tone.opacity}
                      stroke="var(--border)"
                      strokeWidth={1}
                    />
                  );
                });
              })}

              {[1, 2, 3, 4, 5].map((tick) => (
                <text
                  key={`impact-${tick}`}
                  x={PLOT_X + (tick - 0.5) * CELL}
                  y={PLOT_Y + PLOT_SIZE + 15}
                  textAnchor="middle"
                  fontSize={11}
                  fill="var(--muted-foreground)"
                >
                  {tick}
                </text>
              ))}
              {[1, 2, 3, 4, 5].map((tick) => (
                <text
                  key={`likelihood-${tick}`}
                  x={PLOT_X - 10}
                  y={PLOT_Y + (5 - tick + 0.5) * CELL + 4}
                  textAnchor="end"
                  fontSize={11}
                  fill="var(--muted-foreground)"
                >
                  {tick}
                </text>
              ))}

              {data.items.map((item) => {
                const radius = 8 + Math.sqrt(item.open / maxOpen) * 10;
                const cx = PLOT_X + (item.impact - 0.5) * CELL;
                const cy = PLOT_Y + (5 - item.likelihood + 0.5) * CELL;
                const isActive = active?.id === item.id;
                const style = bubbleStyle(item.severity);

                return (
                  <g
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`${item.label}: impact ${item.impact}, likelihood ${item.likelihood}, ${item.open} open exposures, ${item.critical} critical`}
                    onMouseEnter={() => setActiveId(item.id)}
                    onFocus={() => setActiveId(item.id)}
                    onClick={() => setActiveId(item.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setActiveId(item.id);
                      }
                    }}
                    className="cursor-pointer focus-visible:outline-none"
                  >
                    <circle
                      cx={cx}
                      cy={cy}
                      r={radius}
                      fill={style.fill}
                      fillOpacity={style.fillOpacity}
                      stroke={style.stroke}
                      strokeWidth={isActive ? 2.5 : 1.5}
                    />
                    <text
                      x={cx}
                      y={cy + 4}
                      textAnchor="middle"
                      fontSize={11}
                      fontWeight={600}
                      fill="var(--foreground)"
                    >
                      {item.short}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex flex-col gap-0.5">
            {data.items.map((item) => {
              const style = bubbleStyle(item.severity);
              const isActive = active?.id === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onMouseEnter={() => setActiveId(item.id)}
                  onFocus={() => setActiveId(item.id)}
                  onClick={() => setActiveId(item.id)}
                  className={cn(
                    "flex items-center gap-2 px-1 py-1.5 text-left transition-colors",
                    isActive && "bg-muted/60",
                  )}
                >
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: style.stroke }}
                    aria-hidden="true"
                  />
                  <span className="min-w-0 flex-1 truncate text-xs text-foreground">
                    {item.label}
                  </span>
                  <span className="shrink-0 text-[11px] text-muted-foreground tabular-nums">
                    {item.likelihood}×{item.impact}
                  </span>
                  <span className="w-14 shrink-0 text-end text-[11px] text-muted-foreground tabular-nums">
                    {formatNumber(item.open)} open
                  </span>
                  <span className="w-10 shrink-0 text-end text-[11px] text-muted-foreground tabular-nums">
                    {item.critical} crit
                  </span>
                </button>
              );
            })}
          </div>

          <p className="border-t border-border pt-2 text-[11px] text-muted-foreground">
            Bubble size = open exposures. Hover or focus for detail.
          </p>
        </div>
      </PanelState>
    </Panel>
  );
}
