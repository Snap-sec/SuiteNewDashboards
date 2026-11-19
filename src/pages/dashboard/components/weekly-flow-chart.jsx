import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"

const flowConfig = {
  opened: { label: "Opened", color: "var(--warning)" },
  resolved: { label: "Resolved", color: "var(--success)" },
}

function LegendKey({ className, children }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <span className={cn("size-2 rounded-full", className)} aria-hidden="true" />
      {children}
    </span>
  )
}

export function WeeklyFlowChart({ data }) {
  const chartData = data.map((week) => ({
    ...week,
    resolvedNegative: -week.resolved,
  }))
  const latest = data[data.length - 1]

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">Weekly flow</span>
        <div className="flex items-center gap-3" aria-hidden="true">
          <LegendKey className="bg-warning">Opened</LegendKey>
          <LegendKey className="bg-success">Resolved</LegendKey>
        </div>
      </div>

      <ChartContainer
        config={flowConfig}
        className="h-[168px] w-full"
        role="group"
        aria-label={`Weekly exposure flow for the last eight weeks. Latest week of ${latest.week}: ${latest.opened} opened and ${latest.resolved} resolved. Exact counts are in the weekly data table.`}
      >
        <BarChart
          accessibilityLayer
          data={chartData}
          margin={{ top: 4, right: 0, bottom: 0, left: 0 }}
          barGap={2}
          barCategoryGap="24%"
        >
          <CartesianGrid
            vertical={false}
            stroke="var(--border)"
            strokeDasharray="3 3"
          />
          <XAxis
            dataKey="week"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={18}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[-10, 10]}
            ticks={[-10, -5, 0, 5, 10]}
            tickLine={false}
            axisLine={false}
            width={36}
          />
          <ReferenceLine y={0} stroke="var(--border)" />
          <ChartTooltip
            cursor={{ fill: "var(--muted)" }}
            content={
              <ChartTooltipContent
                hideIndicator
                labelFormatter={(label) => `Week of ${label}`}
                formatter={(value, name) => (
                  <div className="flex w-full items-center justify-between gap-6">
                    <span className="flex items-center gap-1.5">
                      <span
                        className={cn(
                          "size-2 rounded-full",
                          name === "Opened" ? "bg-warning" : "bg-success",
                        )}
                        aria-hidden="true"
                      />
                      <span className="text-muted-foreground">{name}</span>
                    </span>
                    <span className="font-medium text-foreground tabular-nums">
                      {Math.abs(value)}
                    </span>
                  </div>
                )}
              />
            }
          />
          <Bar
            dataKey="opened"
            name="Opened"
            fill="var(--color-opened)"
            radius={[4, 4, 0, 0]}
            barSize={12}
            isAnimationActive={false}
          />
          <Bar
            dataKey="resolvedNegative"
            name="Resolved"
            fill="var(--color-resolved)"
            radius={[0, 0, 4, 4]}
            barSize={12}
            isAnimationActive={false}
          />
        </BarChart>
      </ChartContainer>

      <p className="text-xs text-muted-foreground">
        Latest week:{" "}
        <span className="font-medium text-foreground">
          {latest.opened} opened
        </span>{" "}
        ·{" "}
        <span className="font-medium text-foreground">
          {latest.resolved} resolved
        </span>
      </p>
    </div>
  )
}
