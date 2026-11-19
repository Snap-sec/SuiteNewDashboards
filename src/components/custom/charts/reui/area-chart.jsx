import { useMemo } from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import AreaChartSkeleton from "./chart-skeletons/area-chart-skeleton"

const DEFAULT_COLORS = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
]

const ReAreaChart = ({
    data = [],
    xKey = "name",
    keys = [],
    colors,
    stacked = true,
    curveType = "monotone",
    isLoading = false,
    height = 300,
    title,
    description,
    titleBadge,
    xTickFormatter = (v) => String(v).slice(0, 3),
    showGrid = true,
    noCard = false,
    className = "",
    hideZeroValues = false,
}) => {
    const palette = colors || DEFAULT_COLORS

    const chartConfig = useMemo(() => {
        const cfg = {}
        keys.forEach(({ key, label }, i) => {
            cfg[key] = {
                label: label ?? key,
                color: palette[i % palette.length],
            }
        })
        return cfg
    }, [keys, palette])

    const hasData = data.length > 0;

    const emptySlate = (
        <div
            className="flex flex-col justify-center items-center text-muted-foreground text-sm w-full"
            style={{ height }}
        >
            {isLoading ? (
                <AreaChartSkeleton height={height} />
            ) : (
                <p>No data available</p>
            )}
        </div>
    )

    // Unique gradient IDs per key (avoids clashes when multiple charts are on one page)
    const gradientId = (key) => `rearea-grad-${key.replace(/[^a-zA-Z0-9]/g, "-")}`

    const chartContent = !hasData || isLoading ? (
        emptySlate
    ) : (
        <div style={{ width: "100%", height }}>
            <ChartContainer config={chartConfig} className="w-full h-full">
                <AreaChart
                    accessibilityLayer
                    data={data}
                    margin={{ top: 20, right: 0, bottom: 0, left: 0 }}
                >
                    {/* Gradient defs for each series */}
                    <defs>
                        {keys.map(({ key }, i) => (
                            <linearGradient
                                key={key}
                                id={gradientId(key)}
                                x1="0" y1="0" x2="0" y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor={palette[i % palette.length]}
                                    stopOpacity={0.5}
                                />
                                <stop
                                    offset="95%"
                                    stopColor={palette[i % palette.length]}
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        ))}
                    </defs>

                    {showGrid && (
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    )}

                    <XAxis
                        dataKey={xKey}
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={xTickFormatter}
                    />

                    <ChartTooltip
                        content={
                            <ChartTooltipContent
                                indicator="dot"
                                hideZeroValues={hideZeroValues}
                                className="min-w-40 gap-2.5"
                                labelFormatter={(value) => (
                                    <div className="border-border/50 mb-0.5 border-b pb-2">
                                        <span className="text-xs font-medium">{value}</span>
                                    </div>
                                )}
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
                                            {Number(value).toLocaleString()}
                                        </span>
                                    </div>
                                )}
                            />
                        }
                    />

                    {/* Render areas in reverse so the first key sits on top */}
                    {[...keys].reverse().map(({ key }, ri) => {
                        const originalIndex = keys.length - 1 - ri
                        const isTopLine = originalIndex === 0
                        return (
                            <Area
                                key={key}
                                dataKey={key}
                                type={curveType}
                                {...(stacked ? { stackId: "1" } : {})}
                                fill={`url(#${gradientId(key)})`}
                                fillOpacity={0.4}
                                stroke={palette[originalIndex % palette.length]}
                                strokeWidth={isTopLine ? 2 : 0.8}
                                {...(!isTopLine ? { strokeDasharray: "3 3" } : {})}
                            />
                        )
                    })}
                </AreaChart>
            </ChartContainer>
        </div>
    )

    if (noCard) {
        return <div className={`w-full ${className}`}>{chartContent}</div>
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
            <CardContent>
                {chartContent}
            </CardContent>
        </Card>
    )
}

export default ReAreaChart
