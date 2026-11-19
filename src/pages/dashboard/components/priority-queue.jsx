import { Search } from "lucide-react"

import {
  Frame,
  FrameDescription,
  FrameFooter,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@/components/reui/frame"
import { Badge } from "@/components/reui/badge"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"
import { priorityAssets, priorityAssetTotal } from "../data/dashboard"
import { SEVERITY_META } from "../lib/severity"
import { useDashboardStore } from "../store/use-dashboard-store"
import { cn } from "@/lib/utils"

import { RegionState } from "./region-state"
import { SeverityBadge } from "./severity-badge"

function QueueSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {priorityAssets.slice(0, 5).map((asset) => (
        <div key={asset.id} className="flex items-start gap-3">
          <Skeleton className="h-3 w-4" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-3.5 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-6 w-10" />
        </div>
      ))}
    </div>
  )
}

export function PriorityQueue({ className, status, onRetry }) {
  const query = useDashboardStore((state) => state.query)
  const setQuery = useDashboardStore((state) => state.setQuery)

  const normalizedQuery = query.trim().toLowerCase()
  const visibleAssets = normalizedQuery
    ? priorityAssets.filter((asset) =>
        `${asset.name} ${asset.type} ${asset.team} ${SEVERITY_META[asset.severity].label}`
          .toLowerCase()
          .includes(normalizedQuery),
      )
    : priorityAssets
  const atRiskCount = priorityAssets.filter((asset) => asset.slaRisk).length

  return (
    <section
      id="priority-queue"
      className={cn("min-w-0 scroll-mt-20", className)}
      aria-label="Priority queue"
    >
      <Frame className="h-full">
        <FrameHeader className="flex-row flex-wrap items-start justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-0.5">
            <FrameTitle>Priority queue</FrameTitle>
            <FrameDescription>
              Assets with the shortest path to impact
            </FrameDescription>
          </div>
          <Badge variant="destructive-light">{atRiskCount} at SLA risk</Badge>
        </FrameHeader>

        <FramePanel className="flex flex-1 flex-col">
          <RegionState
            status={status}
            label="the priority queue"
            onRetry={onRetry}
            skeleton={<QueueSkeleton />}
          >
            {visibleAssets.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Search aria-hidden="true" />
                  </EmptyMedia>
                  <EmptyTitle>No matching assets</EmptyTitle>
                  <EmptyDescription>
                    No priority asset matches &ldquo;{query.trim()}&rdquo;. Try
                    a domain, asset type, or team.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setQuery("")}
                  >
                    Clear search
                  </Button>
                </EmptyContent>
              </Empty>
            ) : (
              <ul className="flex flex-col">
                {visibleAssets.map((asset) => (
                  <li
                    key={asset.id}
                    className="flex items-start gap-3 border-b border-border py-3 first:pt-0 last:border-b-0 last:pb-0"
                  >
                    <span
                      className="w-4 shrink-0 pt-0.5 text-xs font-medium text-muted-foreground tabular-nums"
                      aria-hidden="true"
                    >
                      {String(asset.rank).padStart(2, "0")}
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="truncate text-sm font-medium">
                          {asset.name}
                        </span>
                        <SeverityBadge severity={asset.severity} />
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                        <span>{asset.openFindings} open</span>
                        <span
                          aria-hidden="true"
                          className="size-1 shrink-0 rounded-full bg-muted-foreground/40"
                        />
                        <span>{asset.type}</span>
                        <span
                          aria-hidden="true"
                          className="size-1 shrink-0 rounded-full bg-muted-foreground/40"
                        />
                        <span>{asset.team}</span>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div
                        className={cn(
                          "text-sm font-semibold tabular-nums",
                          asset.slaRisk
                            ? "text-destructive-foreground dark:text-destructive"
                            : "text-foreground",
                        )}
                      >
                        {asset.sla}
                      </div>
                      <div className="text-xs text-muted-foreground">to SLA</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </RegionState>
        </FramePanel>

        <FrameFooter className="flex-row flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span aria-live="polite">
            {status === "loading"
              ? "Refreshing priority assets"
              : visibleAssets.length === 0
                ? "No matching priority assets"
                : `Showing ${visibleAssets.length} of ${priorityAssetTotal} priority assets`}
          </span>
          <span>Ranked by severity</span>
        </FrameFooter>
      </Frame>
    </section>
  )
}
