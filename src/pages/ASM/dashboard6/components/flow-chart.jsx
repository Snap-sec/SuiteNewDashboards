import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function FlowTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  const point = payload[0].payload;

  return (
    <div className="flow-tooltip">
      <p className="flow-tooltip-title">Week of {label}, 2026</p>
      <div className="flow-tooltip-row">
        <span className="tt-key open" aria-hidden="true" />
        <strong>{point.opened}</strong>
        <span>Opened</span>
      </div>
      <div className="flow-tooltip-row">
        <span className="tt-key resolved" aria-hidden="true" />
        <strong>{point.resolvedAbs}</strong>
        <span>Resolved</span>
      </div>
    </div>
  );
}

function axisTicks(labels) {
  const indices = [];
  for (let index = 0; index < labels.length; index += 2) {
    indices.push(index);
  }
  const lastIndex = labels.length - 1;
  if (indices[indices.length - 1] !== lastIndex) {
    if (lastIndex - indices[indices.length - 1] < 2) indices.pop();
    indices.push(lastIndex);
  }
  return indices.map((index) => labels[index]);
}

export function FlowChart({ flow, summary }) {
  const chartData = flow.labels.map((label, index) => ({
    label,
    opened: flow.opened[index],
    resolved: -flow.resolved[index],
    resolvedAbs: flow.resolved[index],
  }));

  return (
    <div
      className="flow-plot"
      role="group"
      aria-label={`Weekly exposure flow over ${summary.weeks} weeks: ${summary.opened} opened and ${summary.resolved} resolved.`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          accessibilityLayer
          data={chartData}
          margin={{ top: 10, right: 8, left: 0, bottom: 0 }}
          stackOffset="sign"
          barCategoryGap="26%"
        >
          <CartesianGrid
            horizontal
            vertical={false}
            stroke="var(--grid)"
            strokeWidth={1}
          />
          <XAxis
            dataKey="label"
            ticks={axisTicks(flow.labels)}
            tick={{ fontSize: 11, fill: "var(--muted)" }}
            tickLine={false}
            axisLine={false}
            tickMargin={4}
            height={22}
          />
          <YAxis
            width={26}
            domain={[-10, 10]}
            ticks={[-10, -5, 0, 5, 10]}
            tick={{ fontSize: 11, fill: "var(--muted)" }}
            tickLine={false}
            axisLine={false}
          />
          <ReferenceLine y={0} stroke="var(--axis)" />
          <Tooltip
            cursor={{ fill: "var(--surface-3)" }}
            content={<FlowTooltip />}
          />
          <Bar
            dataKey="opened"
            stackId="flow"
            fill="var(--accent)"
            barSize={7}
            radius={[3, 3, 0, 0]}
            isAnimationActive={false}
          />
          <Bar
            dataKey="resolved"
            stackId="flow"
            fill="var(--good)"
            barSize={7}
            radius={[0, 0, 3, 3]}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
