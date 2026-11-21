import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { Panel, PanelState } from "./panel";
import { formatNumber } from "./format";

const SERIES = {
  surface: { label: "Attack surface", color: "#0EA5E9" },
  rate: { label: "Exposure rate", color: "#F43F5E" },
};

function TrendTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  const point = payload[0].payload;

  return (
    <div className="border-border/60 bg-popover text-popover-foreground min-w-48 rounded-lg border px-3 py-2 text-xs shadow-lg">
      <p className="border-border/60 mb-1.5 border-b pb-1.5 font-medium">
        Week of {label}
      </p>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span
              className="size-2 rounded-[2px]"
              style={{ backgroundColor: SERIES.surface.color }}
              aria-hidden="true"
            />
            Attack surface
          </span>
          <span className="font-semibold tabular-nums">
            {point.surfaceIndex.toFixed(1)}
            <span className="ms-1 font-normal text-muted-foreground">
              · {formatNumber(point.assets)} assets
            </span>
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <span
              className="size-2 rounded-[2px]"
              style={{ backgroundColor: SERIES.rate.color }}
              aria-hidden="true"
            />
            Exposure rate
          </span>
          <span className="font-semibold tabular-nums">
            {point.rateIndex.toFixed(1)}
            <span className="ms-1 font-normal text-muted-foreground">
              · {point.rate.toFixed(1)} / 100
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

function TrendSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <Skeleton className="h-[270px] w-full" />
      <div className="flex justify-center gap-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

export function SurfaceTrend({
  data,
  status,
  onRetry,
  onEmptyAction,
  className,
}) {
  const chartData = data.weeks.map((week, index) => ({
    week,
    assets: data.assets[index],
    rate: data.rate[index],
    surfaceIndex: (data.assets[index] / data.assets[0]) * 100,
    rateIndex: (data.rate[index] / data.rate[0]) * 100,
  }));
  const latest = chartData[chartData.length - 1];

  return (
    <Panel
      title="Surface and exposure rate"
      description="Indexed to 100 at Sep 1."
      help="Tracks external asset growth against exposures per 100 assets without mixing scales."
      className={className}
    >
      <PanelState
        state={status}
        skeleton={<TrendSkeleton />}
        onRetry={onRetry}
        onEmptyAction={onEmptyAction}
        emptyTitle="No trajectory data"
        emptyDescription="Run discovery to build the surface and exposure-rate trend."
      >
        <div className="flex flex-1 flex-col gap-3">
          <ChartContainer
            config={{
              surface: { label: "Attack surface", color: SERIES.surface.color },
              rate: { label: "Exposure rate", color: SERIES.rate.color },
            }}
            className="aspect-auto h-[270px] w-full"
          >
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="week"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                minTickGap={28}
              />
              <YAxis
                width={38}
                domain={[98, 116]}
                ticks={[100, 105, 110, 115]}
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <ReferenceLine
                y={100}
                stroke="var(--border)"
                strokeDasharray="3 3"
              />
              <ChartTooltip
                cursor={{ stroke: "var(--border)" }}
                content={<TrendTooltip />}
              />
              <Area
                type="monotone"
                dataKey="surfaceIndex"
                stroke="var(--color-surface)"
                strokeWidth={2}
                fill="var(--color-surface)"
                fillOpacity={0.08}
                dot={false}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="rateIndex"
                stroke="var(--color-rate)"
                strokeWidth={2}
                fill="var(--color-rate)"
                fillOpacity={0.08}
                dot={false}
                activeDot={{ r: 4 }}
                isAnimationActive={false}
              />
            </AreaChart>
          </ChartContainer>

          <div className="sr-only">
            {chartData
              .map(
                (point) =>
                  `${point.week}: surface index ${point.surfaceIndex.toFixed(1)}, ${point.assets} assets; exposure rate index ${point.rateIndex.toFixed(1)}, ${point.rate.toFixed(1)} per 100 assets.`,
              )
              .join(" ")}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs">
            <span className="flex items-center gap-1.5">
              <span
                className="size-2 shrink-0 rounded-[2px]"
                style={{ backgroundColor: SERIES.surface.color }}
                aria-hidden="true"
              />
              <span className="text-secondary-foreground">Attack surface</span>
              <span className="font-medium text-foreground tabular-nums">
                {latest.surfaceIndex.toFixed(1)}
              </span>
              <span className="text-muted-foreground">
                · {formatNumber(latest.assets)} assets
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <span
                className="size-2 shrink-0 rounded-[2px]"
                style={{ backgroundColor: SERIES.rate.color }}
                aria-hidden="true"
              />
              <span className="text-secondary-foreground">Exposure rate</span>
              <span className="font-medium text-foreground tabular-nums">
                {latest.rateIndex.toFixed(1)}
              </span>
              <span className="text-muted-foreground">
                · {latest.rate.toFixed(1)} / 100
              </span>
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-2 text-xs text-muted-foreground">
            <span>
              <span className="font-medium text-foreground">Insight:</span>{" "}
              {data.insight}
            </span>
            <span className="tabular-nums">
              Surface +{data.surfaceChange}% · Rate +{data.rateChange}%
            </span>
          </div>
        </div>
      </PanelState>
    </Panel>
  );
}
