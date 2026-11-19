import { CircleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"

export function RegionState({ status, label, skeleton, onRetry, children }) {
  if (status === "loading") {
    return (
      <div role="status" aria-live="polite">
        <span className="sr-only">Loading {label}</span>
        {skeleton}
      </div>
    )
  }

  if (status === "error") {
    return (
      <div role="alert" className="flex flex-col items-start gap-3 py-1">
        <div className="flex items-center gap-2 text-sm font-medium text-destructive-foreground dark:text-destructive">
          <CircleAlert className="size-4" aria-hidden="true" />
          <span>Couldn&apos;t load {label}.</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Check the connection to the Northwind Labs workspace and try again.
        </p>
        <Button type="button" variant="outline" size="sm" onClick={onRetry}>
          Retry
        </Button>
      </div>
    )
  }

  return children
}
