import { useMemo } from "react"
import { Label, Pie, PieChart, Sector } from "recharts"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"
import ActiveDonutChartSkeleton from "./chart-skeletons/active-donut-chart-skeleton"


const DEFAULT_COLORS = [
    '#FF4560',
    '#00E396',
    '#008FFB',
    '#FEB019',
    '#775DD0',
    '#546E7A',
    '#26a69a',
    '#D10CE8',
]

const ActiveDonutChart = ({
    data = [],
    series: propsSeries,
    labels: propsLabels,
    isLoading = false,
    colors,
    showLegend = true,
    height = 300,
    title,
    description,
    titleBadge,
    centerLabel = "Total",
    centerValue,
    activeIndex = 0,
    activeOuterRadius = 12,
    className = "",
    centerValueClassName = "text-2xl font-bold tabular-nums",
    centerLabelClassName = "text-xs",
    legendClassName = "",
    valueSuffix = "", // used to append suffix to value like % etc
    noCard = false,
    valueFormatter = (v) => Number(v).toLocaleString(),
}) => {
    const { chartData, chartConfig, total } = useMemo(() => {
        let items = []

        if (data && data.length > 0) {
            items = data.map((item) => ({ name: item.name, value: item.value }))
        } else if (propsSeries && propsSeries.length > 0) {
            const lbls = propsLabels || propsSeries.map((_, i) => `Label ${i + 1}`)
            items = propsSeries.map((v, i) => ({ name: lbls[i], value: v }))
        }

        const palette = colors || DEFAULT_COLORS

        const chartData = items.map((item, i) => ({
            status: item.name,
            count: item.value,
            fill: palette[i % palette.length],
        }))

        const chartConfig = { count: { label: "Count" } }
        items.forEach((item, i) => {
            chartConfig[item.name] = {
                label: item.name,
                color: palette[i % palette.length],
            }
        })

        const total = items.reduce((sum, d) => sum + d.value, 0)
        return { chartData, chartConfig, total }
    }, [data, propsSeries, propsLabels, colors])

    const renderShape = (sectorProps) => {
        const { outerRadius = 0, index, ...rest } = sectorProps
        const isActive = index === activeIndex
        return (
            <Sector
                {...rest}
                outerRadius={isActive ? outerRadius + activeOuterRadius : outerRadius}
            />
        )
    }

    const hasData = chartData.length > 0 && chartData.some((d) => d.count > 0)
    const displayCenter = centerValue ?? total.toLocaleString()

    const emptySlate = (
        <div
            className="flex flex-col justify-center items-center text-muted-foreground text-sm"
            style={{ height }}
        >
            <p>No data available</p>
        </div>
    )

    if (isLoading) {
        return (
            <ActiveDonutChartSkeleton
                height={height}
                showLegend={showLegend}
                noCard={noCard}
                className={className}
                title={title}
                description={description}
            />
        )
    }

    const Wrapper = noCard ? "div" : Card;
    const BodyWrapper = noCard ? "div" : CardContent;

    return (
        <Wrapper className={`w-full flex flex-col ${className}`}>
            {(title || description) && !noCard && (
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

            <BodyWrapper className={cn("flex-1 min-h-0 flex flex-col overflow-hidden", !noCard ? "pb-4" : "")}>
                {!hasData ? (
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
                                                        style={{ background: `var(--color-${name})` }}
                                                    />
                                                    <span className="text-muted-foreground">
                                                        {chartConfig[name]?.label ?? name}
                                                    </span>
                                                </div>
                                                <span className="text-foreground font-semibold tabular-nums">
                                                    {valueFormatter(value)}{valueSuffix}
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
                                                className={cn("[&>div]:shrink-0 [&>div]:whitespace-nowrap px-2", legendClassName)}
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
                                innerRadius="60%"
                                outerRadius="85%"
                                cornerRadius={5}
                                paddingAngle={3}
                                stroke="var(--background)"
                                strokeWidth={3}
                                shape={renderShape}
                            >
                                <Label
                                    content={({ viewBox }) => {
                                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                            return (
                                                <text
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                >
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={viewBox.cy}
                                                        className={cn("fill-foreground", centerValueClassName)}
                                                    >
                                                        {centerValue ?? valueFormatter(total)}
                                                    </tspan>
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={(viewBox.cy || 0) + 20}
                                                        className={cn("fill-muted-foreground", centerLabelClassName)}
                                                    >
                                                        {centerLabel}
                                                    </tspan>
                                                </text>
                                            )
                                        }
                                    }}
                                />
                            </Pie>
                        </PieChart>
                    </ChartContainer>
                )}
            </BodyWrapper>
        </Wrapper>
    )
}

export default ActiveDonutChart
