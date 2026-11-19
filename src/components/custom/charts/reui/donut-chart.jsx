import { useMemo } from 'react';
import { Label, Pie, PieChart } from 'recharts';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import DonutChartSkeleton from './chart-skeletons/donut-chart-skeleton';

const DEFAULT_COLORS = [
  '#FF4560',
  '#00E396',
  '#008FFB',
  '#FEB019',
  '#775DD0',
  '#546E7A',
  '#26a69a',
  '#D10CE8',
];

const DonutChart = ({
  data = [],
  series: propsSeries,
  labels: propsLabels,
  isLoading = false,
  colors,
  showLegend = true,
  height = 300,
  title,
  description,
  centerLabel = 'Total',
  centerValue,
  noCard = false,
  className = '',
  centerValueClassName = 'text-xl md:text-2xl lg:text-3xl font-bold tabular-nums',
  centerLabelClassName = 'text-[10px] sm:text-xs',
  legendClassName = '',
  titleBadge,
}) => {
  // ── Normalise data into a flat array of { status, count, fill } ─────────
  const { chartData, chartConfig, total } = useMemo(() => {
    let items = [];

    if (data && data.length > 0) {
      items = data.map((item) => ({
        name: item.name,
        value: item.value,
        fill: item.fill,
      }));
    } else if (propsSeries && propsSeries.length > 0) {
      const lbls = propsLabels || propsSeries.map((_, i) => `Label ${i + 1}`);
      items = propsSeries.map((v, i) => ({ name: lbls[i], value: v }));
    }

    const palette = colors || DEFAULT_COLORS;

    const chartData = items.map((item, i) => ({
      status: item.name,
      count: item.value,
      fill: item.fill || palette[i % palette.length],
    }));

    // Build ChartConfig from items
    const chartConfig = {
      count: { label: 'Count' },
    };
    items.forEach((item, i) => {
      chartConfig[item.name] = {
        label: item.name,
        color: item.fill || palette[i % palette.length],
      };
    });

    const total = items.reduce((sum, d) => sum + d.value, 0);

    return { chartData, chartConfig, total };
  }, [data, propsSeries, propsLabels, colors]);

  const hasData = chartData.length > 0 && chartData.some((d) => d.count > 0);

  // ── Centre label ─────────────────────────────────────────────────────────
  const displayCenter = centerValue ?? String(total);

  // ── Empty / loading states ───────────────────────────────────────────────
  const emptySlate = (
    <div
      className="flex flex-col justify-center items-center text-muted-foreground text-sm"
      style={{ height }}
    >
      <p>{isLoading ? <DonutChartSkeleton /> : 'No data available'}</p>
    </div>
  );

  const chartContent =
    !hasData || isLoading ? (
      emptySlate
    ) : (
      <div style={{ width: '100%', height }}>
        <ChartContainer config={chartConfig} className="w-full h-full">
          <PieChart accessibilityLayer>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  className="min-w-40 gap-2.5"
                  formatter={(value, name, item) => (
                    <div className="flex w-full items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <div
                          className="h-2.5 w-2.5 shrink-0 rounded-xs"
                          style={{
                            background: item?.payload?.fill || `var(--color-${name})`,
                          }}
                        />
                        <span className="text-muted-foreground">
                          {chartConfig[name]?.label ?? name}
                        </span>
                      </div>
                      <span className="text-foreground font-semibold tabular-nums">
                        {Number(value).toLocaleString()}
                      </span>
                    </div>
                  )}
                />
              }
            />

            {showLegend && (
              <ChartLegend
                content={(props) => (
                  <div className="kt-scrollable-x-auto w-full pb-2">
                    <ChartLegendContent
                      {...props}
                      nameKey="status"
                      className={cn(
                        '[&>div]:shrink-0 [&>div]:whitespace-nowrap px-2',
                        legendClassName,
                      )}
                      style={{
                        display: 'flex',
                        flexWrap: 'nowrap',
                        justifyContent: 'center',
                        width: 'max-content',
                        minWidth: '100%',
                      }}
                    />
                  </div>
                )}
                className="-translate-y-2 mt-2"
                wrapperStyle={{ width: '100%' }}
              />
            )}

            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              innerRadius="55%"
              outerRadius="80%"
              cornerRadius={5}
              paddingAngle={3}
              stroke="var(--background)"
              strokeWidth={3}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          dy="-0.2em"
                          className={cn(
                            'fill-foreground',
                            centerValueClassName,
                          )}
                        >
                          {displayCenter}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          dy="1.4em"
                          className={cn(
                            'fill-muted-foreground',
                            centerLabelClassName,
                          )}
                        >
                          {centerLabel}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </div>
    );

  if (noCard) {
    return <div className={`w-full ${className}`}>{chartContent}</div>;
  }

  return (
    <Card className={`w-full flex flex-col ${className}`}>
      {(title || description) && (
        <CardHeader className="items-center pb-0 shrink-0">
          {title && (
            <div className="flex items-center gap-2">
              <CardTitle className="text-base leading-none tracking-tight font-normal text-sm text-gray-500">{title}</CardTitle>
              {titleBadge}
            </div>
          )}
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </CardHeader>
      )}

      <CardContent className="flex-1 min-h-0 flex flex-col overflow-hidden pb-4">
        {!hasData && !isLoading ? (
          emptySlate
        ) : isLoading ? (
          emptySlate
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square w-full grow min-h-0"
            style={{ height: height }}
          >
            <PieChart accessibilityLayer>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    className="min-w-40 gap-2.5"
                    formatter={(value, name, item) => (
                      <div className="flex w-full items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <div
                            className="h-2.5 w-2.5 shrink-0 rounded-xs"
                            style={{
                              background: item?.payload?.fill || `var(--color-${name})`,
                            }}
                          />
                          <span className="text-muted-foreground">
                            {chartConfig[name]?.name ||
                              chartConfig[name]?.label ||
                              name}
                          </span>
                        </div>
                        <span className="text-foreground font-semibold tabular-nums">
                          {Number(value).toLocaleString()}
                        </span>
                      </div>
                    )}
                  />
                }
              />

              {showLegend && (
                <ChartLegend
                  content={(props) => (
                    <div className="kt-scrollable-x-auto w-full pb-2">
                      <ChartLegendContent
                        {...props}
                        nameKey="status"
                        className={cn(
                          '[&>div]:shrink-0 [&>div]:whitespace-nowrap px-2',
                          legendClassName,
                        )}
                        style={{
                          display: 'flex',
                          flexWrap: 'nowrap',
                          justifyContent: 'center',
                          width: 'max-content',
                          minWidth: '100%',
                        }}
                      />
                    </div>
                  )}
                  className="-translate-y-2 mt-2"
                  wrapperStyle={{ width: '100%' }}
                />
              )}

              <Pie
                data={chartData}
                dataKey="count"
                nameKey="status"
                innerRadius="65%"
                outerRadius="90%"
                cornerRadius={5}
                paddingAngle={3}
                stroke="var(--background)"
                strokeWidth={1}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            dy="-0.2em"
                            className={cn(
                              'fill-foreground',
                              centerValueClassName,
                            )}
                          >
                            {displayCenter}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            // dy="1.4em"
                            dy="1.7em"
                            className={cn(
                              'fill-muted-foreground',
                              centerLabelClassName,
                            )}
                          >
                            {centerLabel}
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default DonutChart;
