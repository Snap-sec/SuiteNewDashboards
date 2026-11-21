import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Panel, PanelState } from "./panel";

function WatchlistSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 border-b border-border py-3 last:border-b-0"
        >
          <Skeleton className="h-3 w-5" />
          <Skeleton className="size-1.5 rounded-full" />
          <div className="flex flex-1 flex-col gap-1.5">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-4 w-10" />
        </div>
      ))}
    </div>
  );
}

export function CriticalWatchlist({
  data,
  totalCritical,
  status,
  onRetry,
  onEmptyAction,
  onInspect,
  className,
}) {
  return (
    <Panel
      title="Top 5 critical exposures"
      description="Ranked by risk score, exploitability and business impact."
      help="Open a finding to review evidence, ownership and the remediation path."
      className={className}
    >
      <PanelState
        state={status}
        skeleton={<WatchlistSkeleton />}
        onRetry={onRetry}
        onEmptyAction={onEmptyAction}
        emptyTitle="No critical exposures"
        emptyDescription="Run discovery to surface the highest-risk external findings."
      >
        <div className="flex flex-1 flex-col">
          {data.map((exposure) => (
            <button
              key={exposure.id}
              type="button"
              onClick={() => onInspect(exposure)}
              className="group -mx-2 flex w-[calc(100%+1rem)] items-center gap-3 border-b border-border px-2 py-3 text-left transition-colors last:border-b-0 hover:bg-muted/50"
            >
              <span className="w-5 shrink-0 text-[11px] text-muted-foreground tabular-nums">
                {String(exposure.rank).padStart(2, "0")}
              </span>
              <span
                className={cn(
                  "size-1.5 shrink-0 rounded-full",
                  exposure.sla.overdue ? "bg-destructive" : "bg-high",
                )}
                aria-hidden="true"
              />
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="truncate text-sm font-medium text-foreground">
                  {exposure.title}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {exposure.asset}
                </span>
              </div>
              <span className="hidden w-24 shrink-0 truncate text-xs text-muted-foreground sm:block">
                {exposure.businessUnit}
              </span>
              <span className="w-14 shrink-0 text-end text-sm font-semibold tabular-nums">
                {exposure.riskScore}
                <span className="text-[11px] font-normal text-muted-foreground">
                  /100
                </span>
              </span>
              <span
                className={cn(
                  "w-16 shrink-0 text-end text-[11px] font-medium",
                  exposure.sla.overdue
                    ? "text-destructive"
                    : "text-muted-foreground",
                )}
              >
                {exposure.sla.label}
              </span>
              <ArrowUpRight
                className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                aria-hidden="true"
              />
            </button>
          ))}

          <p className="mt-auto border-t border-border pt-2 text-xs text-muted-foreground">
            Showing {data.length} of {totalCritical} critical exposures. The
            complete queue is available in Exposures.
          </p>
        </div>
      </PanelState>
    </Panel>
  );
}
