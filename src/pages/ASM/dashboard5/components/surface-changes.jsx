import { useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Cloud,
  Globe2,
  Network,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Panel, PanelState } from "./panel";
import { formatNumber } from "./format";

const TYPE_ICONS = {
  "New asset": Globe2,
  "New exposure": ShieldAlert,
  Cloud,
  Resolved: CheckCircle2,
  DNS: Network,
};

const SEVERITY_DOT = {
  Critical: "bg-destructive",
  High: "bg-high",
  Medium: "bg-warning",
  Resolved: "bg-primary",
};

function ChangesSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex gap-6 border-b border-border pb-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-5 w-24" />
        ))}
      </div>
      <div className="flex flex-col gap-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex gap-3">
            <Skeleton className="size-6 shrink-0 rounded-md" />
            <div className="flex flex-1 flex-col gap-1.5">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SurfaceChanges({
  data,
  status,
  onRetry,
  onEmptyAction,
  className,
}) {
  const [expandedId, setExpandedId] = useState(data.events[0]?.id);

  return (
    <Panel
      title="Latest surface changes"
      description="Last 48 hours across the external estate."
      help="New assets, new exposure and resolved findings from continuous discovery."
      className={className}
    >
      <PanelState
        state={status}
        skeleton={<ChangesSkeleton />}
        onRetry={onRetry}
        onEmptyAction={onEmptyAction}
        emptyTitle="No surface changes"
        emptyDescription="Run discovery to start tracking external surface changes."
      >
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-border pb-3">
            <span className="flex items-baseline gap-1.5">
              <span className="text-sm font-semibold tabular-nums">
                {formatNumber(data.summary.newAssets)}
              </span>
              <span className="text-xs text-muted-foreground">new assets</span>
            </span>
            <span className="flex items-baseline gap-1.5">
              <span className="text-sm font-semibold tabular-nums">
                {formatNumber(data.summary.newExposures)}
              </span>
              <span className="text-xs text-muted-foreground">
                new exposures
              </span>
            </span>
            <span className="flex items-baseline gap-1.5">
              <span className="text-sm font-semibold tabular-nums">
                {formatNumber(data.summary.resolved)}
              </span>
              <span className="text-xs text-muted-foreground">resolved</span>
            </span>
          </div>

          <ol className="relative flex flex-col">
            <span
              className="absolute start-3 top-3 bottom-3 w-px bg-border"
              aria-hidden="true"
            />
            {data.events.map((event) => {
              const Icon = TYPE_ICONS[event.type] ?? Globe2;
              const expanded = expandedId === event.id;

              return (
                <li key={event.id} className="relative">
                  <button
                    type="button"
                    aria-expanded={expanded}
                    onClick={() => setExpandedId(expanded ? null : event.id)}
                    className="group flex w-full items-start gap-3 py-2.5 text-left"
                  >
                    <span className="relative z-10 flex size-6 shrink-0 items-center justify-center rounded-md border border-border bg-card text-muted-foreground">
                      <Icon className="size-3.5" aria-hidden="true" />
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex min-w-0 items-center gap-1.5">
                          <span
                            className={cn(
                              "size-1.5 shrink-0 rounded-full",
                              SEVERITY_DOT[event.severity] ??
                                "bg-muted-foreground",
                            )}
                            aria-hidden="true"
                          />
                          <span className="truncate text-sm font-medium text-foreground">
                            {event.title}
                          </span>
                        </span>
                        <span className="shrink-0 text-[11px] text-muted-foreground">
                          {event.time}
                        </span>
                      </div>
                      <span className="truncate text-xs text-muted-foreground">
                        {event.asset} · {event.businessUnit}
                      </span>
                      {expanded && (
                        <span className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                          {event.detail}
                        </span>
                      )}
                    </div>
                    {expanded ? (
                      <ChevronUp
                        className="mt-1 size-3.5 shrink-0 text-muted-foreground"
                        aria-hidden="true"
                      />
                    ) : (
                      <ChevronDown
                        className="mt-1 size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ol>

          <p className="mt-auto border-t border-border pt-2 text-xs text-muted-foreground">
            Showing the six most recent changes. Expand a row for the event
            detail.
          </p>
        </div>
      </PanelState>
    </Panel>
  );
}
