import { Clock, Layers, Radar, ShieldAlert } from "lucide-react"

import { Frame, FramePanel } from "@/components/reui/frame"
import { Skeleton } from "@/components/ui/skeleton"
import { summaryStats } from "../data/dashboard"
import { cn } from "@/lib/utils"

import { RegionState } from "./region-state"

const STAT_ICONS = {
  assets: Layers,
  findings: ShieldAlert,
  coverage: Radar,
  sla: Clock,
}

export function SummaryStrip({ className, status, onRetry }) {
  return (
    <Frame className={className}>
      <FramePanel>
        <RegionState
          status={status}
          label="the surface summary"
          onRetry={onRetry}
          skeleton={
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-4">
              {summaryStats.map((stat) => (
                <div key={stat.id} className="flex flex-col gap-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-7 w-16" />
                </div>
              ))}
            </div>
          }
        >
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-4 md:divide-x md:divide-border">
            {summaryStats.map((stat, index) => {
              const Icon = STAT_ICONS[stat.id]

              return (
                <div
                  key={stat.id}
                  className={cn(
                    "flex min-w-0 flex-col gap-1",
                    index > 0 && "md:pl-6",
                    index === summaryStats.length - 1 && "md:pr-0",
                  )}
                >
                  <dt className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Icon className="size-4" aria-hidden="true" />
                    <span>{stat.label}</span>
                  </dt>
                  <dd
                    className={cn(
                      "text-2xl font-semibold tracking-tight tabular-nums",
                      stat.alert &&
                        "text-destructive-foreground dark:text-destructive",
                    )}
                  >
                    {stat.value}
                  </dd>
                </div>
              )
            })}
          </dl>
        </RegionState>
      </FramePanel>
    </Frame>
  )
}
