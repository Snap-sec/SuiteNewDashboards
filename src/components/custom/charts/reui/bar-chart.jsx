import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import BarChartSkeleton from './chart-skeletons/bar-chart-skeleton';

const DEFAULT_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
];

const WrappedTick = ({ x, y, payload, width = 80 }) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <foreignObject
        x={-width / 2}
        y={10}
        width={width}
        height={60}
        style={{ overflow: 'visible' }}
      >
        <div
          xmlns="http://www.w3.org/1999/xhtml"
          className="flex justify-center items-start text-center text-[11px] text-muted-foreground leading-tight whitespace-normal break-words [overflow-wrap:anywhere] [word-break:break-word]"
        >
          {payload?.value}
        </div>
      </foreignObject>
    </g>
  );
};

const ReBarChart = ({
  data = [],
  xKey = 'name',
  keys = [],
  colors,
  isLoading = false,
  height = 300,
  title,
  description,
  titleBadge,
  xTickFormatter = (v) => v,
  yTickFormatter,
  showGrid = true,
  distributed = false,
  stacked = false,
  noCard = false,
  className = '',
  showYAxis = false,
  yAxisWidth = 40,
  showBarLabel = true,
  valueFormatter = (v) => Number(v).toLocaleString(),
  wrapXAxisTicks = false,
  xAxisTickWidth = 80,
  margin,
}) => {
  const palette = colors || DEFAULT_COLORS;

  const chartConfig = useMemo(() => {
    const cfg = {};
    keys.forEach(({ key, label }, i) => {
      cfg[key] = {
        label: label ?? key,
        color: palette[i % palette.length],
      };
    });
    return cfg;
  }, [keys, palette]);

  const hasData =
    data.length > 0 &&
    data.some((item) => keys.some(({ key }) => Number(item[key]) > 0));

  const emptySlate = (
    <div
      className="flex flex-col justify-center items-center text-muted-foreground text-sm w-full"
      style={{ height }}
    >
      {isLoading ? (
        <BarChartSkeleton height={height} />
      ) : (
        <p>No data available</p>
      )}
    </div>
  );

  const chartContent =
    !hasData || isLoading ? (
      emptySlate
    ) : (
      <div style={{ width: '100%', height }}>
        <ChartContainer config={chartConfig} className="w-full h-full">
          <BarChart
            accessibilityLayer
            data={data}
            margin={
              margin ||
              (wrapXAxisTicks
                ? { top: 30, right: 10, left: 10, bottom: 35 }
                : { top: 30, right: 10, left: 10, bottom: 5 })
            }
          >
            {showGrid && <CartesianGrid vertical={false} />}

            <XAxis
              dataKey={xKey}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={wrapXAxisTicks ? <WrappedTick width={xAxisTickWidth} /> : true}
              tickFormatter={wrapXAxisTicks ? undefined : xTickFormatter}
            />

            {showYAxis && (
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                width={yAxisWidth}
                tickFormatter={yTickFormatter}
              />
            )}

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  className="min-w-40 max-w-xs sm:max-w-sm gap-2.5"
                  labelFormatter={(value) => (
                    <div className="border-border/50 mb-0.5 flex flex-col gap-0.5 border-b pb-2">
                      <span className="text-xs font-medium break-words [overflow-wrap:anywhere] [word-break:break-word] whitespace-normal">
                        {value}
                      </span>
                    </div>
                  )}
                  // CRITICAL: This formatter ensures the tooltip indicator matches the bar color in distributed charts.
                  // Do NOT revert this to (value, name) as that breaks the color mapping.
                  formatter={(value, name, item) => {
                    const entryIdx = data.findIndex(d => d === item.payload);
                    const color = (distributed && keys.length === 1 && entryIdx !== -1)
                      ? palette[entryIdx % palette.length]
                      : (item?.fill || item?.color || item?.payload?.fill || `var(--color-${name})`);

                    return (
                      <div className="flex w-full items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <div
                            className="h-2.5 w-2.5 shrink-0 rounded-xs"
                            style={{ background: color }}
                          />
                          <span className="text-muted-foreground">
                            {chartConfig[name]?.label ?? name}
                          </span>
                        </div>
                        <span className="text-foreground font-semibold tabular-nums">
                          {valueFormatter(value)}
                        </span>
                      </div>
                    );
                  }}
                />
              }
            />

            {keys.map(({ key }, keyIdx) => (
              <Bar
                key={key}
                dataKey={key}
                fill={distributed ? undefined : `var(--color-${key})`}
                radius={stacked ? 0 : 4}
                {...(stacked ? { stackId: 'stack' } : {})}
              >
                {showBarLabel && (
                  <LabelList
                    dataKey={key}
                    position={stacked ? 'inside' : 'top'}
                    offset={stacked ? 0 : 12}
                    className="fill-foreground font-medium"
                    fontSize={stacked ? 10 : 12}
                    formatter={(v) => {
                      const val = Number(v);
                      if (stacked) return val > 20 ? valueFormatter(val) : ''; // Hide small segment labels
                      return val > 0 ? valueFormatter(val) : '';
                    }}
                  />
                )}
                {distributed &&
                  data.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={data[index]?.fill || palette[(keys.length === 1 ? index : keyIdx) % palette.length]}
                    />
                  ))}
              </Bar>
            ))}

            {/* Show cumulative total at the top for stacked bars */}
            {stacked && showBarLabel && (
              <Bar
                key="total-label"
                dataKey={() => 0}
                stackId="stack"
                isAnimationActive={false}
              >
                <LabelList
                  dataKey={(entry) =>
                    keys.reduce(
                      (sum, { key }) => sum + (Number(entry[key]) || 0),
                      0,
                    )
                  }
                  position="top"
                  offset={8}
                  className="fill-foreground font-bold"
                  fontSize={12}
                  formatter={(v) => (v > 0 ? valueFormatter(v) : '')}
                />
              </Bar>
            )}
          </BarChart>
        </ChartContainer>
      </div>
    );

  if (noCard) {
    return <div className={`w-full ${className}`}>{chartContent}</div>;
  }

  return (
    <Card className={`w-full ${className}`}>
      {(title || description) && (
        <CardHeader>
          {title && (
            <div className="flex items-center gap-2">
              <p className="text-base leading-none tracking-tight font-normal text-sm text-gray-500">
                {title}
              </p>
              {titleBadge}
            </div>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </CardHeader>
      )}

      <CardContent>{chartContent}</CardContent>
    </Card>
  );
};

export default ReBarChart;
