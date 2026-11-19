import { useMemo } from 'react';
import { Cell, Pie, PieChart } from 'recharts';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import RePieChartSkeleton from './chart-skeletons/pie-chart-skeleton';

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

const RePieChart = ({
  data = [],
  series: propsSeries,
  labels: propsLabels,
  isLoading = false,
  colors,
  showLegend = true,
  height = 300,
  title,
  description,
  className = '',
  legendClassName = '',
  showLabels = true,
  titleBadge,
  noCard = false,
}) => {
  // ── Normalise data into a flat array of { name, value, fill } ─────────
  const { chartData, chartConfig } = useMemo(() => {
    let items = [];

    if (data && data.length > 0) {
      items = data.map((item) => ({ name: item.name, value: item.value }));
    } else if (propsSeries && propsSeries.length > 0) {
      const lbls = propsLabels || propsSeries.map((_, i) => `Label ${i + 1}`);
      items = propsSeries.map((v, i) => ({ name: lbls[i], value: v }));
    }

    const palette = colors || DEFAULT_COLORS;

    const chartData = items.map((item, i) => ({
      name: item.name,
      value: item.value,
      fill: palette[i % palette.length],
    }));

    // Build ChartConfig from items
    const chartConfig = {
      value: { label: 'Value' },
    };
    items.forEach((item, i) => {
      chartConfig[item.name] = {
        label: item.name,
        color: palette[i % palette.length],
      };
    });

    return { chartData, chartConfig };
  }, [data, propsSeries, propsLabels, colors]);

  const hasData = chartData.length > 0 && chartData.some((d) => d.value > 0);

  // ── Empty / loading states ───────────────────────────────────────────────
  const emptySlate = (
    <div
      className="flex flex-col justify-center items-center text-muted-foreground text-sm"
      style={{ height }}
    >
      <p>{isLoading ? <RePieChartSkeleton /> : 'No data available'}</p>
    </div>
  );

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
    name,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Don't show label for very small slices

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-[9px] font-bold"
      >
        <tspan x={x} dy="-0.5em">
          {name.length > 10 ? name.substring(0, 8) + '...' : name}
        </tspan>
        <tspan x={x} dy="1.2em">{`${(percent * 100).toFixed(0)}%`}</tspan>
      </text>
    );
  };

  const chartContent = (
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
                  formatter={(value, name) => (
                    <div className="flex w-full items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <div
                          className="h-2.5 w-2.5 shrink-0 rounded-xs"
                          style={{
                            background: `var(--color-${name})`,
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
                      nameKey="name"
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
              dataKey="value"
              nameKey="name"
              innerRadius={0}
              outerRadius="90%"
              stroke="var(--background)"
              strokeWidth={2}
              labelLine={false}
              label={showLabels ? renderCustomizedLabel : false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      )}
    </CardContent>
  );

  if (noCard) {
    return <div className={`w-full ${className}`}>{chartContent}</div>;
  }

  return (
    <Card className={cn('w-full h-full flex flex-col', className)}>
      {(title || description) && (
        <CardHeader className="items-center pb-0 shrink-0">
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
      {chartContent}
    </Card>
  );
};

export default RePieChart;
