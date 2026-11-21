import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
      <div className="flex flex-wrap gap-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-3 w-20" />
        ))}
      </div>
      <div className="flex flex-col gap-3 border-t border-border pt-3">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  );
}

export function SlaRunway({
  data,
  status,
  onRetry,
  onEmptyAction,
  onOpenFinding,
  onOpenQueue,
  className,
}) {
  const total = data.buckets.reduce((sum, bucket) => sum + bucket.value, 0);

  return (
    <Panel
      title="SLA runway"
      description="Critical and high findings by time to SLA."
      help="Segments show how quickly the active workload reaches its remediation deadline."
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
              aria-label={`SLA distribution across ${total} findings: ${data.buckets
                .map(
                  (bucket) => `${bucket.value} ${bucket.label.toLowerCase()}`,
                )
                .join(", ")}.`}
            >
              {data.buckets.map((bucket) => (
                <span
                  key={bucket.label}
                  className={cn(
                    "h-full min-w-1 rounded-full",
                    TONE_BAR[bucket.tone] ?? TONE_BAR.muted,
                  )}
                  style={{ width: `${(bucket.value / total) * 100}%` }}
                  title={`${bucket.label}: ${bucket.value}`}
                />
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              {data.buckets.map((bucket) => (
                <span
                  key={bucket.label}
                  className="flex items-center gap-1.5 text-[11px] text-muted-foreground"
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
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1 border-t border-border pt-2">
            {data.breaches.map((breach) => (
              <button
                key={breach.id}
                type="button"
                onClick={() => onOpenFinding(breach.id)}
                className="group -mx-2 flex items-start justify-between gap-3 px-2 py-2 text-left transition-colors hover:bg-muted/60"
              >
                <div className="flex min-w-0 items-start gap-2">
                  <span
                    className={cn(
                      "mt-1.5 size-1.5 shrink-0 rounded-full",
                      breach.severity === "Critical"
                        ? "bg-destructive"
                        : "bg-high",
                    )}
                    aria-hidden="true"
                  />
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="truncate text-xs font-medium text-foreground">
                      {breach.title}
                    </span>
                    <span className="truncate text-[11px] text-muted-foreground">
                      {breach.asset}
                    </span>
                  </div>
                </div>
                <span className="flex shrink-0 items-center gap-1 pt-0.5 text-[11px] font-medium text-destructive">
                  {breach.over}
                  <ArrowUpRight
                    className="size-3 opacity-0 transition-opacity group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </span>
              </button>
            ))}
          </div>

          <Button
            type="button"
            variant="dim"
            mode="link"
            size="sm"
            onClick={onOpenQueue}
            className="self-start"
          >
            Open SLA queue
          </Button>
        </div>
      </PanelState>
    </Panel>
  );
}
