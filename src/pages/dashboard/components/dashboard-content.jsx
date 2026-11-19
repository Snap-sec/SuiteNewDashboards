import { Clock, Layers, Radar, RefreshCw } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Spinner } from "@/components/ui/spinner"
import { useDashboardStore } from "../store/use-dashboard-store"

import { ExposureMatrix } from "./exposure-matrix"
import { ExposurePressure } from "./exposure-pressure"
import { PriorityQueue } from "./priority-queue"
import { RemediationBoard } from "./remediation-board"
import { RiskScore } from "./risk-score"
import { ScanPulse } from "./scan-pulse"
import { SummaryStrip } from "./summary-strip"
import { SurfaceChanges } from "./surface-changes"

const SCAN_FACTS = [
  { id: "scope", label: "Scope", value: "1,284 assets", icon: Layers },
  { id: "duration", label: "Typical run", value: "About 20 min", icon: Clock },
  { id: "cadence", label: "Cadence", value: "7-day cycle", icon: Radar },
]

function NewScanDialog() {
  function handleQueueScan() {
    toast.success("Discovery scan queued", {
      description:
        "Northwind Labs · results usually arrive in about 20 minutes.",
    })
  }

  return (
    <Dialog>
      <DialogTrigger render={<Button type="button" size="sm" className="w-full sm:w-auto" />}>
        <Radar aria-hidden="true" />
        New scan
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Queue a discovery scan</DialogTitle>
          <DialogDescription>
            Scan 1,284 assets across northwind.dev and its subdomains. Results
            land in this view when the run finishes.
          </DialogDescription>
        </DialogHeader>

        <dl className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {SCAN_FACTS.map((fact) => {
            const Icon = fact.icon
            return (
              <div
                key={fact.id}
                className="flex flex-col gap-1 rounded-lg border border-border bg-muted/30 p-2.5"
              >
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Icon className="size-4" aria-hidden="true" />
                  {fact.label}
                </dt>
                <dd className="text-sm font-medium">{fact.value}</dd>
              </div>
            )
          })}
        </dl>

        <DialogFooter>
          <DialogClose
            render={<Button type="button" variant="outline" size="sm" />}
          >
            Cancel
          </DialogClose>
          <DialogClose
            render={
              <Button
                type="button"
                size="sm"
                onClick={handleQueueScan}
              />
            }
          >
            Queue scan
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function DashboardContent() {
  const regionStatus = useDashboardStore((state) => state.regionStatus)
  const isRefreshing = useDashboardStore((state) => state.isRefreshing)
  const lastUpdated = useDashboardStore((state) => state.lastUpdated)
  const refresh = useDashboardStore((state) => state.refresh)

  async function handleRefresh() {
    const succeeded = await refresh()

    if (succeeded) {
      toast.success("Dashboard refreshed", {
        description: "Demo data reloaded for the Northwind Labs workspace.",
      })
      return
    }

    toast.error("Refresh failed", {
      description:
        "You appear to be offline. Try again when the connection is back.",
    })
  }

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-0.5">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Surface command
          </h1>
          <p className="max-w-prose text-sm text-muted-foreground">
            Decide what to fix first across Northwind Labs&apos; external
            attack surface.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            <span
              className="size-1.5 rounded-full bg-success"
              aria-hidden="true"
            />
            <span
              className="text-xs text-muted-foreground"
              aria-live="polite"
            >
              {lastUpdated}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              aria-label="Refresh dashboard"
              aria-busy={isRefreshing}
              title="Refresh dashboard"
            >
              {isRefreshing ? (
                <Spinner />
              ) : (
                <RefreshCw aria-hidden="true" />
              )}
            </Button>
          </div>

          <NewScanDialog />
        </div>
      </div>

      <SummaryStrip
        status={regionStatus.summary}
        onRetry={handleRefresh}
      />

      <section
        aria-label="Posture overview"
        className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]"
      >
        <ExposurePressure
          className="md:col-span-2 xl:col-span-1"
          status={regionStatus.pressure}
          onRetry={handleRefresh}
        />
        <RiskScore status={regionStatus.score} onRetry={handleRefresh} />
        <ScanPulse status={regionStatus.scan} onRetry={handleRefresh} />
      </section>

      <section
        aria-label="Exposure detail"
        className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)]"
      >
        <ExposureMatrix status={regionStatus.matrix} onRetry={handleRefresh} />
        <PriorityQueue status={regionStatus.queue} onRetry={handleRefresh} />
      </section>

      <section
        aria-label="Remediation and change log"
        className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)]"
      >
        <RemediationBoard status={regionStatus.board} onRetry={handleRefresh} />
        <SurfaceChanges status={regionStatus.timeline} onRetry={handleRefresh} />
      </section>

      <footer className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-muted-foreground">
        <span>Demo workspace · figures are illustrative</span>
        <span className="flex items-center gap-1.5">
          <span
            className="size-1.5 rounded-full bg-success"
            aria-hidden="true"
          />
          Aperture attack surface · v2.4
        </span>
      </footer>
    </div>
  )
}
