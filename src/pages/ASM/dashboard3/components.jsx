import { Fragment } from "react";
import { AlertCircle, CircleHelp, Inbox, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { METRICS } from "./data";

export function PanelTitle({ children, help }) {
  return (
    <div className="flex items-center gap-2">
      <h2 className="text-sm font-normal leading-none tracking-tight text-gray-500 dark:text-zinc-400">
        {children}
      </h2>
      {help && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              mode="icon"
              aria-label={`About ${children}`}
              className="opacity-60 hover:opacity-100"
            >
              <CircleHelp aria-hidden="true" />
            </Button>
          </TooltipTrigger>
          <TooltipContent variant="light" className="max-w-64 text-xs">
            {help}
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}

export function Panel({ title, help, children, className, contentClassName }) {
  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader>
        <PanelTitle help={help}>{title}</PanelTitle>
      </CardHeader>
      <CardContent
        className={cn("flex min-h-0 flex-1 flex-col", contentClassName)}
      >
        {children}
      </CardContent>
    </Card>
  );
}

export function PanelState({
  state,
  skeleton,
  onRetry,
  emptyTitle = "No data available",
  emptyDescription,
  emptyActionLabel = "Run discovery",
  onEmptyAction,
  children,
}) {
  if (state === "loading") {
    return skeleton;
  }

  if (state === "error") {
    return (
      <div
        className="flex flex-1 flex-col items-center justify-center gap-3 py-10 text-center"
        role="status"
        aria-live="polite"
      >
        <AlertCircle className="size-5 text-destructive" aria-hidden="true" />
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">Data unavailable</p>
          <p className="max-w-xs text-xs text-muted-foreground">
            The request did not complete. Try again.
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={onRetry}>
          <RefreshCcw aria-hidden="true" />
          Retry
        </Button>
      </div>
    );
  }

  if (state === "empty") {
    return (
      <div
        className="flex flex-1 flex-col items-center justify-center gap-2 py-10 text-center"
        role="status"
      >
        <Inbox className="size-5 text-muted-foreground" aria-hidden="true" />
        <p className="text-sm text-muted-foreground">{emptyTitle}</p>
        {emptyDescription && (
          <p className="max-w-xs text-xs text-muted-foreground">
            {emptyDescription}
          </p>
        )}
        {onEmptyAction && (
          <Button
            type="button"
            variant="dim"
            mode="link"
            size="sm"
            onClick={onEmptyAction}
          >
            {emptyActionLabel}
          </Button>
        )}
      </div>
    );
  }

  return children;
}

export function MetricStrip({ state, onRetry, onEmptyAction }) {
  if (state === "error" || state === "empty") {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-2 text-center">
          {state === "error" ? (
            <AlertCircle
              className="size-5 text-destructive"
              aria-hidden="true"
            />
          ) : (
            <Inbox
              className="size-5 text-muted-foreground"
              aria-hidden="true"
            />
          )}
          <p className="text-sm font-medium">
            {state === "error" ? "Metrics unavailable" : "No exposure data"}
          </p>
          <p className="text-xs text-muted-foreground">
            {state === "error"
              ? "The metrics service did not respond."
              : "Run discovery to populate the attack surface."}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={state === "error" ? onRetry : onEmptyAction}
          >
            {state === "error" ? (
              <>
                <RefreshCcw aria-hidden="true" />
                Retry
              </>
            ) : (
              "Run discovery"
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 py-1.5 lg:flex lg:flex-row lg:items-stretch lg:gap-2 lg:px-10">
          {METRICS.map((metric, index) => (
            <Fragment key={metric.label}>
              <div className="flex flex-1 flex-col items-center justify-center gap-1 text-center">
                {state === "loading" ? (
                  <>
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-3.5 w-24" />
                  </>
                ) : (
                  <>
                    <span className="text-2xl font-semibold leading-none text-mono tabular-nums">
                      {metric.value}
                    </span>
                    <span className="text-sm text-secondary-foreground">
                      {metric.label}
                    </span>
                  </>
                )}
              </div>
              {index < METRICS.length - 1 && (
                <span
                  className="my-1 hidden self-stretch border-e border-e-input lg:block"
                  aria-hidden="true"
                />
              )}
            </Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function ChartLegend({ items }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-3 text-xs">
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-1.5">
          <span
            className="size-2 shrink-0 rounded-[2px]"
            style={{ backgroundColor: item.color }}
            aria-hidden="true"
          />
          <span className="text-secondary-foreground">{item.label}</span>
          {item.value !== undefined && (
            <span className="font-medium text-foreground tabular-nums">
              {item.value}
            </span>
          )}
        </span>
      ))}
    </div>
  );
}

export function ScoreGauge({ value }) {
  const arc = 75;
  const filled = arc * (value / 100);

  return (
    <div
      className="relative flex size-40 shrink-0 items-center justify-center"
      role="img"
      aria-label={`External exposure score ${value} out of 100`}
    >
      <svg viewBox="0 0 160 160" className="size-40">
        <circle
          cx="80"
          cy="80"
          r="60"
          fill="none"
          stroke="currentColor"
          strokeWidth="12"
          pathLength="100"
          strokeDasharray={`${arc} ${100 - arc}`}
          strokeLinecap="round"
          transform="rotate(135 80 80)"
          className="text-muted"
        />
        <circle
          cx="80"
          cy="80"
          r="60"
          fill="none"
          stroke="currentColor"
          strokeWidth="12"
          pathLength="100"
          strokeDasharray={`${filled} ${100 - filled}`}
          strokeLinecap="round"
          transform="rotate(135 80 80)"
          className="text-high"
        />
      </svg>
      <div className="absolute flex flex-col items-center gap-1">
        <span className="text-3xl font-bold leading-none text-card-foreground tabular-nums">
          {value}
        </span>
        <span className="text-xs text-muted-foreground">Exposure score</span>
      </div>
    </div>
  );
}

export function RiskSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-5">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <Skeleton className="size-40 shrink-0 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-3 w-36" />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3">
              <Skeleton className="h-3.5 w-44" />
              <Skeleton className="h-3 w-12" />
            </div>
            <Skeleton className="h-1.5 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TrendSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-3">
      <Skeleton className="h-[300px] w-full" />
      <div className="flex justify-center gap-4">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

export function DonutSkeleton() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <Skeleton className="size-48 rounded-full" />
      <div className="flex gap-4">
        <Skeleton className="h-3 w-14" />
        <Skeleton className="h-3 w-14" />
        <Skeleton className="h-3 w-14" />
        <Skeleton className="h-3 w-14" />
      </div>
    </div>
  );
}

export function BarSkeleton({ bars = 6 }) {
  const heights = [82, 58, 46, 28, 18, 24, 20, 16];

  return (
    <div className="flex flex-1 flex-col justify-end gap-4">
      <div className="flex h-[300px] items-end justify-between gap-3 px-2">
        {Array.from({ length: bars }).map((_, index) => (
          <Skeleton
            key={index}
            className="w-full rounded-sm"
            style={{ height: `${heights[index % heights.length]}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function ListSkeleton({ rows = 3 }) {
  return (
    <div className="flex flex-1 flex-col gap-4">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex flex-col gap-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}
