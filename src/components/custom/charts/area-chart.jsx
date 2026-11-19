import React, { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';

const AreaChart = ({
    data = [],
    isLoading,
    series,
    xCategories,
    height = 350,
    colors,
    showLegend = true,
    xaxisType = 'datetime',
    strokeCurve = 'smooth',
}) => {
    const chartData = useMemo(() => {
        // If series is provided, use it for multi-series area chart
        if (series && Array.isArray(series) && xCategories) {
            return {
                series,
                options: {
                    chart: {
                        height: height,
                        type: 'area',
                        animations: { enabled: !isLoading },
                        toolbar: { show: false },
                    },
                    colors: colors,
                    dataLabels: { enabled: false },
                    stroke: { curve: strokeCurve },
                    xaxis: {
                        type: xaxisType,
                        categories: xCategories,
                    },
                    legend: {
                        show: showLegend,
                        position: 'bottom',
                        horizontalAlign: 'center',
                    },
                    tooltip: {
                        x: {
                            format: xaxisType === 'datetime' ? 'dd/MM/yy HH:mm' : undefined,
                        },
                    },
                    noData: {
                        text: isLoading ? 'Loading...' : 'No data available',
                        align: 'center',
                        verticalAlign: 'middle',
                    },
                },
            };
        }

        // Fallback to single-series behavior
        return {
            series: [
                {
                    name: 'Value',
                    data: data.map((item) => item.value),
                },
            ],
            options: {
                chart: {
                    height: height,
                    type: 'area',
                    animations: { enabled: !isLoading },
                    toolbar: { show: false },
                },
                colors: colors,
                dataLabels: { enabled: false },
                stroke: { curve: strokeCurve },
                xaxis: {
                    type: xaxisType,
                    categories: data.map((item) => item.name),
                },
                legend: {
                    show: showLegend,
                    position: 'bottom',
                },
                tooltip: {
                    x: {
                        format: xaxisType === 'datetime' ? 'dd/MM/yy HH:mm' : undefined,
                    },
                },
                noData: {
                    text: isLoading ? 'Loading...' : 'No data available',
                    align: 'center',
                    verticalAlign: 'middle',
                },
            },
        };
    }, [data, isLoading, series, xCategories, colors, height, showLegend, xaxisType, strokeCurve]);

    const hasData = useMemo(() => {
        if (series) {
            return series.some((s) => s.data && s.data.length > 0);
        }
        return data && data.length > 0;
    }, [series, data]);

    return (
        <div className="w-full h-full">
            <div id="chart" className="w-full h-full">
                {!hasData && !isLoading ? (
                    <div className="flex items-center justify-center h-[300px] text-sm text-muted-foreground">
                        No data available
                    </div>
                ) : (
                    <ReactApexChart
                        options={chartData.options}
                        series={chartData.series}
                        type="area"
                        height={height}
                    />
                )}
            </div>
        </div>
    );
};

export default AreaChart;