import { useState } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Panel, PanelState } from "./panel";

const TONE_BAR = {
  critical: "bg-destructive",
  high: "bg-high",
  warning: "bg-warning",
  neutral: "bg-muted-foreground/55",
  muted: "bg-muted-foreground/20",
};

const TONE_DOT = {
  critical: "bg-destructive",
  high: "bg-high",
  warning: "bg-warning",
  neutral: "bg-muted-foreground/55",
  muted: "bg-muted-foreground/20",
};

function RunwaySkeleton() {
  return (
    <div className="flex flex-1 flex-col justify-center gap-5">
      <div className="flex items-start justify-between gap-4">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-8 w-24" />
      </div>
      <Skeleton className="h-2 w-full rounded-full" />
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-3 w-20" />
        ))}
      </div>
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
    </div>
  );
}

export function RemediationRunway({
  data,
  status,
  onRetry,
  onEmptyAction,
  className,
}) {
  const total = data.buckets.reduce((sum, bucket) => sum + bucket.value, 0);
  const [activeLabel, setActiveLabel] = useState(data.buckets[0]?.label);
  const active =
    data.buckets.find((bucket) => bucket.label === activeLabel) ??
    data.buckets[0];

  return (
    <Panel
      title="Remediation runway"
      description="Critical and high findings by time to SLA."
      help="Shows how quickly the active critical and high workload reaches its remediation deadline."
      className={className}
      contentClassName="justify-center"
    >
      <PanelState
        state={status}
        skeleton={<RunwaySkeleton />}
        onRetry={onRetry}
        onEmptyAction={onEmptyAction}
        emptyTitle="No SLA-tracked findings"
        emptyDescription="Run discovery to build the remediation clock."
      >
        <div className="flex flex-1 flex-col justify-center gap-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold leading-none text-foreground tabular-nums">
                  {data.pastSla}
                </span>
                <span className="text-xs text-muted-foreground">
                  critical past SLA
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {data.dueToday} due today
              </span>
            </div>
            <div className="text-end">
              <p className="text-xs text-muted-foreground">MTTR</p>
              <p className="text-sm font-medium tabular-nums">{data.mttr}d</p>
              <p className="text-[11px] text-muted-foreground">
                target ≤ {data.target}d
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div
              className="flex h-2 gap-0.5"
              role="img"
              aria-label={`SLA distribution across ${total} critical and high findings: ${data.buckets
                .map(
                  (bucket) => `${bucket.value} ${bucket.label.toLowerCase()}`,
                )
                .join(", ")}.`}
            >
              {data.buckets.map((bucket) => (
                <span
                  key={bucket.label}
                  className={cn(
                    "h-full min-w-[2px] rounded-full",
                    TONE_BAR[bucket.tone] ?? TONE_BAR.muted,
                  )}
                  style={{ width: `${(bucket.value / total) * 100}%` }}
                  title={`${bucket.label}: ${bucket.value}`}
                />
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-1">
              {data.buckets.map((bucket) => {
                const isActive = active?.label === bucket.label;

                return (
                  <button
                    key={bucket.label}
                    type="button"
                    onMouseEnter={() => setActiveLabel(bucket.label)}
                    onFocus={() => setActiveLabel(bucket.label)}
                    onClick={() => setActiveLabel(bucket.label)}
                    className={cn(
                      "flex items-center gap-1.5 px-1.5 py-1 text-[11px] text-muted-foreground transition-colors",
                      isActive && "bg-muted/60 text-foreground",
                    )}
                  >
                    <span
                      className={cn(
                        "size-2 rounded-full",
                        TONE_DOT[bucket.tone] ?? TONE_DOT.muted,
                      )}
                      aria-hidden="true"
                    />
                    {bucket.label}
                    <span className="font-medium text-foreground tabular-nums">
                      {bucket.value}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <p className="min-h-8 border-t border-border pt-2 text-xs leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">
              {active?.label}:
            </span>{" "}
            {active?.detail}
          </p>

          <p className="border-t border-border pt-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Insight:</span>{" "}
            {data.insight}
          </p>
        </div>
      </PanelState>
    </Panel>
  );
}
