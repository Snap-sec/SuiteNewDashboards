import { AlertCircle, CircleHelp, Inbox, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function PanelTitle({ title, description, help }) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-normal leading-none tracking-tight text-gray-500 dark:text-zinc-400">
          {title}
        </h2>
        {help && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                mode="icon"
                aria-label={`About ${title}`}
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
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

export function Panel({
  title,
  description,
  help,
  children,
  className,
  contentClassName,
}) {
  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader className="flex-wrap">
        <PanelTitle title={title} description={description} help={help} />
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
