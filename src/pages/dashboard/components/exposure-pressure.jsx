import { useState } from "react"

import { useTable } from "@tanstack/react-table"
import { ArrowDownRight, ChevronDown } from "lucide-react"

import {
  DataGrid,
  DataGridContainer,
  dataGridFeatures,
} from "@/components/reui/data-grid/data-grid"
import { DataGridScrollArea } from "@/components/reui/data-grid/data-grid-scroll-area"
import { DataGridTable } from "@/components/reui/data-grid/data-grid-table"
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Skeleton } from "@/components/ui/skeleton"
import { flowTotals, flowWeeks } from "../data/dashboard"
import { cn } from "@/lib/utils"

import { RegionState } from "./region-state"
import { WeeklyFlowChart } from "./weekly-flow-chart"

const weeklyColumns = [
  {
    id: "week",
    accessorKey: "week",
    header: "Week of",
    size: 160,
  },
  {
    id: "opened",
    accessorKey: "opened",
    header: () => <div className="w-full text-right">Opened</div>,
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue()}</div>
    ),
    size: 110,
  },
  {
    id: "resolved",
    accessorKey: "resolved",
    header: () => <div className="w-full text-right">Resolved</div>,
    cell: ({ getValue }) => (
      <div className="text-right tabular-nums">{getValue()}</div>
    ),
    size: 110,
  },
]

function WeeklyFlowTable({ data }) {
  const table = useTable({
    features: dataGridFeatures,
    data,
    columns: weeklyColumns,
    manualPagination: true,
  })

  return (
    <DataGrid
      table={table}
      recordCount={data.length}
      emptyMessage="No weekly flow data yet."
      tableLayout={{
        dense: true,
        width: "fixed",
        headerBackground: true,
        headerBorder: true,
        headerSticky: true,
        rowBorder: true,
      }}
    >
      <DataGridContainer>
        <DataGridScrollArea className="h-48" orientation="both">
          <DataGridTable />
        </DataGridScrollArea>
      </DataGridContainer>
    </DataGrid>
  )
}

function PressureSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)]">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-12 w-20" />
        <Skeleton className="h-3 w-36" />
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-3 w-32" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-3 w-full max-w-48 self-end" />
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  )
}

export function ExposurePressure({ className, status, onRetry }) {
  const [open, setOpen] = useState(false)

  return (
    <Frame className={cn("h-full", className)}>
      <FrameHeader className="flex-row flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <FrameTitle>Exposure pressure</FrameTitle>
          <FrameDescription>Open exposures and weekly flow</FrameDescription>
        </div>
        <Badge variant="outline">Last 8 weeks</Badge>
      </FrameHeader>

      <FramePanel className="flex flex-1 flex-col">
        <RegionState
          status={status}
          label="exposure pressure"
          onRetry={onRetry}
          skeleton={<PressureSkeleton />}
        >
          <div className="flex flex-1 flex-col gap-4">
            <div className="grid items-center gap-4 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)]">
              <div className="flex flex-col gap-1">
                <p className="text-xs text-muted-foreground">Open exposures</p>
                <p className="text-5xl font-semibold leading-none tracking-tight tabular-nums">
                  47
                </p>
                <p className="flex items-center gap-1 text-xs font-medium text-success-foreground dark:text-success">
                  <ArrowDownRight className="size-4" aria-hidden="true" />9
                  fewer than last month
                </p>
                <ul
                  className="flex flex-col gap-1 pt-1 text-xs text-muted-foreground"
                  aria-label="Open exposures by severity"
                >
                  <li className="flex items-center gap-1.5">
                    <span
                      className="size-1.5 rounded-full bg-destructive"
                      aria-hidden="true"
                    />
                    9 critical
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span
                      className="size-1.5 rounded-full bg-warning"
                      aria-hidden="true"
                    />
                    14 high
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span
                      className="size-1.5 rounded-full bg-muted-foreground"
                      aria-hidden="true"
                    />
                    24 medium &amp; low
                  </li>
                </ul>
              </div>

              <div className="min-w-0">
                <WeeklyFlowChart data={flowWeeks} />
              </div>
            </div>

            <Collapsible open={open} onOpenChange={setOpen}>
              <CollapsibleTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between"
                  />
                }
              >
                <span className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {flowTotals.resolved} resolved
                  </span>{" "}
                  ·{" "}
                  <span className="font-medium text-foreground">
                    {flowTotals.opened} opened
                  </span>{" "}
                  over 8 weeks
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  Weekly data
                  <ChevronDown
                    className={cn(
                      "size-3.5 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                      open && "rotate-180",
                    )}
                    aria-hidden="true"
                  />
                </span>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="pt-2" role="group" aria-label="Weekly flow data">
                  <WeeklyFlowTable data={flowWeeks} />
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </RegionState>
      </FramePanel>

      <FrameFooter className="flex-row flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>Lower is better</span>
        <span>Rolling 8-week window</span>
      </FrameFooter>
    </Frame>
  )
}
