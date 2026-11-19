import { useTable } from "@tanstack/react-table"

import {
  DataGrid,
  DataGridContainer,
  dataGridFeatures,
} from "@/components/reui/data-grid/data-grid"
import {
  DataGridTable,
  DataGridTableFootRow,
  DataGridTableFootRowCell,
} from "@/components/reui/data-grid/data-grid-table"
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
import { Skeleton } from "@/components/ui/skeleton"
import { matrixRows, matrixTotals } from "../data/dashboard"
import { SEVERITY_META } from "../lib/severity"
import { cn } from "@/lib/utils"

import { RegionState } from "./region-state"

const SEVERITY_KEYS = ["critical", "high", "medium", "low"]

const SERIES_DOT_CLASSES = {
  1: "bg-blue-500 dark:bg-blue-400",
  2: "bg-emerald-500 dark:bg-emerald-400",
  3: "bg-amber-500 dark:bg-amber-400",
  4: "bg-violet-500 dark:bg-violet-400",
  5: "bg-pink-500 dark:bg-pink-400",
}

const HEAT_LEGEND = [
  { label: "0", className: "bg-muted text-muted-foreground" },
  { label: "1", className: "bg-destructive/10 dark:bg-destructive/20" },
  { label: "2–3", className: "bg-destructive/15 dark:bg-destructive/25" },
  { label: "4–5", className: "bg-destructive/25 dark:bg-destructive/35" },
  { label: "6+", className: "bg-destructive/40 dark:bg-destructive/50" },
]

function heatClassName(value) {
  if (value === 0) return "bg-muted text-muted-foreground"
  if (value === 1) return "bg-destructive/10 dark:bg-destructive/20"
  if (value <= 3) return "bg-destructive/15 dark:bg-destructive/25"
  if (value <= 5) return "bg-destructive/25 dark:bg-destructive/35"
  return "bg-destructive/40 dark:bg-destructive/50"
}

function HeatValue({ value }) {
  return (
    <div className="flex justify-center">
      <span
        className={cn(
          "inline-flex min-w-8 items-center justify-center rounded-md px-2 py-1 text-xs font-medium tabular-nums",
          heatClassName(value),
        )}
      >
        {value}
      </span>
    </div>
  )
}

function SeverityHead({ severity }) {
  const meta = SEVERITY_META[severity]

  return (
    <div className="flex w-full items-center justify-center gap-1.5">
      <span
        className={cn("size-1.5 shrink-0 rounded-full", meta.dot)}
        aria-hidden="true"
      />
      {meta.label}
    </div>
  )
}

const matrixColumns = [
  {
    id: "type",
    accessorKey: "type",
    header: "Asset type",
    size: 172,
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-sm font-medium">
        <span
          className={cn(
            "size-2 shrink-0 rounded-full",
            SERIES_DOT_CLASSES[row.original.series],
          )}
          aria-hidden="true"
        />
        <span>{row.original.type}</span>
      </div>
    ),
  },
  ...SEVERITY_KEYS.map((severity) => ({
    id: severity,
    accessorKey: severity,
    header: () => <SeverityHead severity={severity} />,
    size: 70,
    cell: ({ getValue }) => <HeatValue value={getValue()} />,
  })),
  {
    id: "total",
    accessorFn: (row) => row.critical + row.high + row.medium + row.low,
    header: () => <div className="w-full text-right">Total</div>,
    size: 70,
    cell: ({ getValue }) => (
      <div className="text-right text-sm font-semibold tabular-nums">
        {getValue()}
      </div>
    ),
  },
]

const totalFooter = (
  <DataGridTableFootRow>
    <DataGridTableFootRowCell className="font-semibold">Total</DataGridTableFootRowCell>
    {SEVERITY_KEYS.map((severity) => (
      <DataGridTableFootRowCell key={severity} className="text-center font-semibold tabular-nums">
        {matrixTotals[severity]}
      </DataGridTableFootRowCell>
    ))}
    <DataGridTableFootRowCell className="text-right font-semibold tabular-nums">
      {matrixTotals.total}
    </DataGridTableFootRowCell>
  </DataGridTableFootRow>
)

function MatrixSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {matrixRows.map((row) => (
        <Skeleton key={row.id} className="h-9 w-full" />
      ))}
      <Skeleton className="mt-1 h-3 w-44" />
    </div>
  )
}

export function ExposureMatrix({ className, status, onRetry }) {
  const table = useTable({
    features: dataGridFeatures,
    data: matrixRows,
    columns: matrixColumns,
    manualPagination: true,
  })

  return (
    <Frame className={cn("h-full", className)}>
      <FrameHeader className="flex-row flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <FrameTitle>Exposure matrix</FrameTitle>
          <FrameDescription>
            Where the 47 open findings concentrate
          </FrameDescription>
        </div>
        <Badge variant="destructive-light">
          {matrixTotals.critical} critical
        </Badge>
      </FrameHeader>

      <FramePanel className="flex flex-1 flex-col">
        <RegionState
          status={status}
          label="the exposure matrix"
          onRetry={onRetry}
          skeleton={<MatrixSkeleton />}
        >
          <div className="flex flex-1 flex-col">
            <DataGrid
              table={table}
              recordCount={matrixRows.length}
              emptyMessage={
                <div className="flex flex-col items-center gap-2">
                  <span>No exposures in this matrix.</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onRetry}
                  >
                    Refresh data
                  </Button>
                </div>
              }
              tableLayout={{
                dense: true,
                width: "fixed",
                rowBorder: false,
                headerBackground: false,
                headerBorder: true,
                footerBackground: true,
              }}
            >
              <DataGridContainer>
                <DataGridTable footerContent={totalFooter} />
              </DataGridContainer>
            </DataGrid>

            <div
              className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground"
              aria-label="Exposure density legend"
            >
              <span>Exposures</span>
              {HEAT_LEGEND.map((entry) => (
                <span key={entry.label} className="inline-flex items-center gap-1">
                  <span
                    className={cn("size-3 rounded-sm", entry.className)}
                    aria-hidden="true"
                  />
                  {entry.label}
                </span>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground sm:hidden">
              Swipe sideways to see Low and Total.
            </p>
          </div>
        </RegionState>
      </FramePanel>

      <FrameFooter className="flex-row flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>Technologies and web servers hold 55% of open findings</span>
        <span>Darker means more exposures</span>
      </FrameFooter>
    </Frame>
  )
}
