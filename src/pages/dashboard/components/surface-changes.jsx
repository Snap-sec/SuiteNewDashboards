import { Activity } from "lucide-react"

import {
  Frame,
  FrameDescription,
  FrameFooter,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@/components/reui/frame"
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/reui/timeline"
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
import { surfaceChanges } from "../data/dashboard"
import { cn } from "@/lib/utils"

import { RegionState } from "./region-state"

const CHANGE_DOT_CLASSES = {
  discovery: "border-info bg-info/10",
  resolved: "border-success bg-success/10",
  changed: "border-warning bg-warning/10",
  scan: "border-muted-foreground/40 bg-muted",
}

function ChangesSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {surfaceChanges.slice(0, 4).map((change) => (
        <div key={change.id} className="flex flex-col gap-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3.5 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  )
}

export function SurfaceChanges({ className, status, onRetry }) {
  return (
    <Frame className={cn("h-full", className)}>
      <FrameHeader className="flex-row flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <FrameTitle>Surface changes</FrameTitle>
          <FrameDescription>
            Last 48 hours of discovery and cleanup
          </FrameDescription>
        </div>
        <Badge variant="outline">12 this week</Badge>
      </FrameHeader>

      <FramePanel className="flex flex-1 flex-col">
        <RegionState
          status={status}
          label="surface changes"
          onRetry={onRetry}
          skeleton={<ChangesSkeleton />}
        >
          {surfaceChanges.length === 0 ? (
            <Empty className="py-6">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Activity aria-hidden="true" />
                </EmptyMedia>
                <EmptyTitle>No recent changes</EmptyTitle>
                <EmptyDescription>
                  Nothing has moved on the surface in the last 48 hours.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onRetry}
                >
                  Check again
                </Button>
              </EmptyContent>
            </Empty>
          ) : (
            <Timeline defaultValue={surfaceChanges.length}>
              {surfaceChanges.map((change, index) => (
                <TimelineItem key={change.id} step={index + 1}>
                  <TimelineHeader>
                    <TimelineDate>{change.time}</TimelineDate>
                    <TimelineTitle>{change.title}</TimelineTitle>
                  </TimelineHeader>
                  <TimelineIndicator
                    className={CHANGE_DOT_CLASSES[change.type]}
                  />
                  <TimelineSeparator />
                  <TimelineContent className="break-all text-xs">
                    {change.asset}
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          )}
        </RegionState>
      </FramePanel>

      <FrameFooter className="flex-row flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>Showing 5 recent changes</span>
        <span>Live feed</span>
      </FrameFooter>
    </Frame>
  )
}
