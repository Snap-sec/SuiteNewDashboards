import { useState } from "react";
import { ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Panel, PanelState } from "./panel";

const GAUGE_SIZE = 240;
const CENTER = GAUGE_SIZE / 2;
const ARC_LENGTH = 75;

const RING_RADII = [80, 63, 46];

function RiskSkeleton() {
  return (
    <div className="flex flex-1 flex-col items-center gap-5">
      <Skeleton className="size-56 rounded-full" />
      <div className="flex w-full flex-col gap-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-7 w-full" />
        ))}
      </div>
      <Skeleton className="h-8 w-full" />
    </div>
  );
}

function Ring({ value, color, radius, width, dimmed }) {
  const filled = ARC_LENGTH * (value / 100);

  return (
    <g opacity={dimmed ? 0.18 : 1}>
      <circle
        cx={CENTER}
        cy={CENTER}
        r={radius}
        fill="none"
        stroke="var(--muted)"
        strokeWidth={width}
        strokeOpacity={0.7}
        pathLength="100"
        strokeDasharray={`${ARC_LENGTH} ${100 - ARC_LENGTH}`}
        strokeLinecap="round"
        transform={`rotate(135 ${CENTER} ${CENTER})`}
      />
      <circle
        cx={CENTER}
        cy={CENTER}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={width}
        pathLength="100"
        strokeDasharray={`${filled} ${100 - filled}`}
        strokeLinecap="round"
        transform={`rotate(135 ${CENTER} ${CENTER})`}
      />
    </g>
  );
}

export function RiskRadial({
  data,
  status,
  onRetry,
  onEmptyAction,
  className,
}) {
  const [activeId, setActiveId] = useState(null);
  const active = data.components.find((component) => component.id === activeId);

  const clearActive = () => setActiveId(null);

  return (
    <Panel
      title="Overall risk"
      description="Weighted external exposure index."
      help="Overall score is driven by exposure volume, exploitability and business impact."
      className={className}
      contentClassName="justify-center"
    >
      <PanelState
        state={status}
        skeleton={<RiskSkeleton />}
        onRetry={onRetry}
        onEmptyAction={onEmptyAction}
        emptyTitle="No risk score available"
        emptyDescription="Run discovery to calculate the external risk score."
      >
        <div className="flex flex-1 flex-col items-center gap-5">
          <div
            className="relative flex size-60 items-center justify-center"
            role="img"
            aria-label={`Overall risk ${data.score} out of 100, ${data.band}. Exposure ${data.components[0]?.value}, exploitability ${data.components[1]?.value}, business impact ${data.components[2]?.value}.`}
          >
            <svg
              viewBox={`0 0 ${GAUGE_SIZE} ${GAUGE_SIZE}`}
              className="size-60"
            >
              <Ring
                value={data.score}
                color="var(--high)"
                radius={100}
                width={10}
              />
              {data.components.map((component, index) => (
                <Ring
                  key={component.id}
                  value={component.value}
                  color={component.color}
                  radius={RING_RADII[index]}
                  width={7}
                  dimmed={activeId !== null && activeId !== component.id}
                />
              ))}
            </svg>

            <div className="absolute flex flex-col items-center gap-1">
              <span className="text-4xl font-bold leading-none text-foreground tabular-nums">
                {data.score}
              </span>
              <span className="text-xs text-muted-foreground">out of 100</span>
              <span className="mt-1 flex items-center gap-1.5 text-xs">
                <span
                  className="size-1.5 rounded-full bg-high"
                  aria-hidden="true"
                />
                <span className="font-medium text-foreground">{data.band}</span>
              </span>
            </div>
          </div>

          <div className="flex w-full flex-col gap-0.5">
            {data.components.map((component) => {
              const isActive = activeId === component.id;

              return (
                <button
                  key={component.id}
                  type="button"
                  onMouseEnter={() => setActiveId(component.id)}
                  onMouseLeave={clearActive}
                  onFocus={() => setActiveId(component.id)}
                  onBlur={clearActive}
                  onClick={() => setActiveId(isActive ? null : component.id)}
                  className={cn(
                    "flex items-center gap-2 px-2 py-1.5 text-left transition-colors",
                    isActive && "bg-muted/60",
                  )}
                >
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: component.color }}
                    aria-hidden="true"
                  />
                  <span className="min-w-0 flex-1 truncate text-xs text-secondary-foreground">
                    {component.label}
                  </span>
                  <span className="text-sm font-medium tabular-nums">
                    {component.value}
                  </span>
                  <span className="w-7 text-end text-[11px] text-muted-foreground">
                    /100
                  </span>
                </button>
              );
            })}
          </div>

          <p className="min-h-8 border-t border-border pt-2 text-xs leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">Insight:</span>{" "}
            {active?.detail ?? data.insight}
          </p>

          <div className="flex w-full items-center justify-between gap-2 border-t border-border pt-2">
            <span className="text-[11px] text-muted-foreground">
              Coverage confidence {data.coverage}%
            </span>
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <ArrowDownRight className="size-3" aria-hidden="true" />
              {Math.abs(data.delta)} pts better than prior quarter
            </span>
          </div>
        </div>
      </PanelState>
    </Panel>
  );
}
