import { Fragment } from "react";
import { AlertCircle, Inbox, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function MetricStrip({ metrics, status, onRetry, onEmptyAction }) {
  if (status === "error" || status === "empty") {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-2 text-center">
          {status === "error" ? (
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
            {status === "error" ? "Metrics unavailable" : "No exposure data"}
          </p>
          <p className="text-xs text-muted-foreground">
            {status === "error"
              ? "The posture service did not respond."
              : "Run discovery to populate the attack surface."}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={status === "error" ? onRetry : onEmptyAction}
          >
            {status === "error" ? (
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
          {metrics.map((metric, index) => (
            <Fragment key={metric.id}>
              <div className="flex flex-1 flex-col items-center justify-center gap-1 text-center">
                {status === "loading" ? (
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
              {index < metrics.length - 1 && (
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
