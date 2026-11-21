import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { SEVERITY_MIX } from "./data";

const TREND_CONFIG = {
  critical: { label: "Critical", color: "var(--destructive)" },
  high: { label: "High", color: "var(--high)" },
  medium: { label: "Medium", color: "var(--warning)" },
};

const TREND_SERIES = [
  { key: "critical", label: "Critical", dot: "bg-destructive" },
  { key: "high", label: "High", dot: "bg-high" },
  { key: "medium", label: "Medium", dot: "bg-warning" },
];

const SEVERITY_CONFIG = Object.fromEntries(
  SEVERITY_MIX.map((item) => [
    item.key,
    { label: item.label, color: item.color },
  ]),
);

const number = (value) => Number(value).toLocaleString("en-US");

export function TrendChart({ range }) {
  const latest = range.trend[range.trend.length - 1];

  return (
    <>
      <ChartContainer
        config={TREND_CONFIG}
        className="aspect-auto h-[300px] w-full"
      >
        <LineChart
          accessibilityLayer
          data={range.trend}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            minTickGap={28}
          />
          <YAxis
            width={40}
            domain={[0, 360]}
            ticks={[0, 120, 240, 360]}
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={number}
          />
          <ChartTooltip
            cursor={{ stroke: "var(--border)" }}
            content={<ChartTooltipContent indicator="line" />}
          />
          <Line
            type="monotone"
            dataKey="critical"
            stroke="var(--color-critical)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="high"
            stroke="var(--color-high)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="medium"
            stroke="var(--color-medium)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ChartContainer>

      <div className="sr-only">
        Open findings by severity, {range.label}.{" "}
        {range.trend
          .map(
            (point) =>
              `${point.date}: critical ${point.critical}, high ${point.high}, medium ${point.medium}.`,
          )
          .join(" ")}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-3 text-xs">
        {TREND_SERIES.map((series) => (
          <span key={series.key} className="flex items-center gap-1.5">
            <span
              className={`size-2 shrink-0 rounded-[2px] ${series.dot}`}
              aria-hidden="true"
            />
            <span className="text-secondary-foreground">{series.label}</span>
            <span className="font-medium text-foreground tabular-nums">
              {number(latest[series.key])}
            </span>
          </span>
        ))}
      </div>
    </>
  );
}

export function SeverityDonut() {
  const total = SEVERITY_MIX.reduce((sum, item) => sum + item.value, 0);

  return (
    <>
      <div className="relative mx-auto h-[240px] w-full max-w-[280px]">
        <ChartContainer
          config={SEVERITY_CONFIG}
          className="aspect-auto h-full w-full"
        >
          <PieChart accessibilityLayer>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent nameKey="key" hideLabel />}
            />
            <Pie
              data={SEVERITY_MIX}
              dataKey="value"
              nameKey="key"
              innerRadius="65%"
              outerRadius="90%"
              cornerRadius={5}
              paddingAngle={3}
              stroke="var(--background)"
              strokeWidth={1}
              isAnimationActive={false}
            >
              {SEVERITY_MIX.map((item) => (
                <Cell key={item.key} fill={item.color} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-0.5">
          <span className="text-3xl font-bold leading-none text-card-foreground tabular-nums">
            {number(total)}
          </span>
          <span className="text-xs text-muted-foreground">open findings</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-3 text-xs">
        {SEVERITY_MIX.map((item) => (
          <span key={item.key} className="flex items-center gap-1.5">
            <span
              className="size-2 shrink-0 rounded-[2px]"
              style={{ backgroundColor: item.color }}
              aria-hidden="true"
            />
            <span className="text-secondary-foreground">{item.label}</span>
            <span className="font-medium text-foreground tabular-nums">
              {number(item.value)}
            </span>
          </span>
        ))}
      </div>
    </>
  );
}

export function DistributionBar({ data, colors }) {
  const chartData = data.map((item, index) => ({
    ...item,
    fill: colors[index % colors.length],
  }));

  return (
    <ChartContainer
      config={{ value: { label: "Count", color: colors[0] } }}
      className="aspect-auto h-[300px] w-full"
    >
      <BarChart
        accessibilityLayer
        data={chartData}
        margin={{ top: 30, right: 10, left: 10, bottom: 5 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          tickFormatter={(value) =>
            value.length > 10 ? `${value.slice(0, 10)}…` : value
          }
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Bar dataKey="value" radius={4} isAnimationActive={false}>
          <LabelList
            dataKey="value"
            position="top"
            offset={10}
            className="fill-foreground"
            fontSize={12}
            fontWeight={500}
            formatter={(value) => (value > 0 ? number(value) : "")}
          />
          {chartData.map((item) => (
            <Cell key={item.label} fill={item.fill} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
