import { ArrowDownRight } from "lucide-react"

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
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { riskScore } from "../data/dashboard"
import { cn } from "@/lib/utils"

import { RegionState } from "./region-state"

const BANDS = [
  { label: "Low", className: "bg-success/25 dark:bg-success/30" },
  { label: "Moderate", className: "bg-warning/30 dark:bg-warning/35" },
  { label: "High", className: "bg-warning/55 dark:bg-warning/60" },
  { label: "Critical", className: "bg-destructive/35 dark:bg-destructive/45" },
]

function ScoreSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-10 w-28" />
      <Skeleton className="h-3 w-36" />
      <Skeleton className="h-2.5 w-full" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
      <Skeleton className="h-3 w-3/5" />
    </div>
  )
}

export function RiskScore({ className, status, onRetry }) {
  return (
    <Frame className={cn("h-full", className)}>
      <FrameHeader className="flex-row flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <FrameTitle>Risk score</FrameTitle>
          <FrameDescription>Where 68 sits in the risk bands</FrameDescription>
        </div>
        <Badge variant="warning-light">{riskScore.band}</Badge>
      </FrameHeader>

      <FramePanel className="flex flex-1 flex-col">
        <RegionState
          status={status}
          label="the risk score"
          onRetry={onRetry}
          skeleton={<ScoreSkeleton />}
        >
          <div className="flex flex-1 flex-col gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-semibold leading-none tracking-tight tabular-nums">
                  {riskScore.value}
                </span>
                <span className="text-xs text-muted-foreground">
                  / {riskScore.max}
                </span>
              </div>
              <p className="flex items-center gap-1 text-xs font-medium text-success-foreground dark:text-success">
                <ArrowDownRight className="size-4" aria-hidden="true" />
                {riskScore.deltaLabel}
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <div
                className="relative grid h-2.5 grid-cols-[2fr_1fr_1fr_1fr] gap-0.5"
                role="img"
                aria-label="Risk score 68 out of 100, inside the high band from 60 to 79."
              >
                {BANDS.map((band) => (
                  <span
                    key={band.label}
                    className={cn("rounded-full", band.className)}
                  />
                ))}
                <span
                  className="absolute -top-1 -bottom-1 w-0.5 -translate-x-1/2 rounded-full bg-foreground"
                  style={{ left: "68%" }}
                />
                <span
                  className="absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground"
                  style={{ left: "68%" }}
                />
              </div>
              <div
                className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-0.5 text-xs text-muted-foreground"
                aria-hidden="true"
              >
                {BANDS.map((band, index) => (
                  <span
                    key={band.label}
                    className={cn(
                      index > 0 && index < BANDS.length - 1 && "text-center",
                      index === BANDS.length - 1 && "text-right",
                    )}
                  >
                    {band.label}
                  </span>
                ))}
              </div>
            </div>

            <Separator />

            <div className="flex flex-1 flex-col gap-3">
              <div className="flex items-center justify-between gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <span>Score drivers</span>
                <span>Risk</span>
              </div>
              <div className="flex flex-col gap-3">
                {riskScore.drivers.map((driver) => (
                  <div key={driver.id} className="flex flex-col gap-1.5">
                    <div className="flex items-baseline justify-between gap-2 text-xs">
                      <span className="text-muted-foreground">
                        {driver.label}
                      </span>
                      <span className="font-medium tabular-nums">
                        {driver.value}
                      </span>
                    </div>
                    <Progress
                      value={driver.value}
                      aria-label={`${driver.label} risk ${driver.value} of 100`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </RegionState>
      </FramePanel>

      <FrameFooter className="flex-row flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>Lower is better</span>
        <span>Recalculated daily</span>
      </FrameFooter>
    </Frame>
  )
}
