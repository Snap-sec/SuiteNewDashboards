import { Clock } from "lucide-react"

import {
  Frame,
  FrameDescription,
  FrameFooter,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@/components/reui/frame"
import { Badge } from "@/components/reui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { scanPulse } from "../data/dashboard"
import { cn } from "@/lib/utils"

import { RegionState } from "./region-state"

const DAY_STATES = {
  default: "border-border bg-background",
  today: "border-ring bg-muted",
  scan: "border-primary bg-primary text-primary-foreground",
}

function ScanSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-7 w-28" />
      </div>
      <div className="grid grid-cols-7 gap-1">
        {scanPulse.days.map((day) => (
          <Skeleton key={day.date} className="h-12 w-full" />
        ))}
      </div>
      <Skeleton className="h-2.5 w-full" />
      <Skeleton className="h-3 w-44" />
      <Skeleton className="h-3 w-36" />
    </div>
  )
}

export function ScanPulse({ className, status, onRetry }) {
  return (
    <Frame className={cn("h-full", className)}>
      <FrameHeader className="flex-row flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <FrameTitle>Scan pulse</FrameTitle>
          <FrameDescription>Coverage, cadence and the next run</FrameDescription>
        </div>
        <Badge variant="success-light">Live</Badge>
      </FrameHeader>

      <FramePanel className="flex flex-1 flex-col">
        <RegionState
          status={status}
          label="the scan pulse"
          onRetry={onRetry}
          skeleton={<ScanSkeleton />}
        >
          <div className="flex flex-1 flex-col gap-4">
            <div className="flex flex-col gap-0.5">
              <p className="text-xs text-muted-foreground">Next scan</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-semibold tracking-tight">
                  {scanPulse.nextDate}
                </p>
                <span className="text-xs text-muted-foreground">
                  {scanPulse.nextTime}
                </span>
              </div>
            </div>

            <div
              className="grid grid-cols-7 gap-1"
              role="group"
              aria-label="Scan cadence from November 19 to 25. The next scan is Tuesday, November 24."
            >
              {scanPulse.days.map((day) => (
                <div
                  key={day.date}
                  aria-current={day.state === "today" ? "date" : undefined}
                  className={cn(
                    "flex flex-col items-center gap-0.5 rounded-md border py-1.5",
                    DAY_STATES[day.state],
                  )}
                >
                  <span
                    className={cn(
                      "text-xs",
                      day.state === "scan"
                        ? "text-primary-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    {day.key}
                  </span>
                  <span className="text-sm font-medium tabular-nums">
                    {day.date}
                  </span>
                  {day.state === "scan" && (
                    <span className="sr-only">Next scan</span>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="text-muted-foreground">Coverage</span>
                <span className="font-medium tabular-nums">
                  {scanPulse.coverage}%
                </span>
              </div>
              <Progress
                value={scanPulse.coverage}
                aria-label={`Scan coverage ${scanPulse.coverage} percent`}
              />
              <p className="text-xs text-muted-foreground">
                {scanPulse.inScope}
              </p>
            </div>

            <div className="mt-auto flex items-center gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
              <Clock className="size-4" aria-hidden="true" />
              <span>{scanPulse.lastScan}</span>
            </div>
          </div>
        </RegionState>
      </FramePanel>

      <FrameFooter className="flex-row flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>Continuous discovery</span>
        <span>7-day cycle</span>
      </FrameFooter>
    </Frame>
  )
}
