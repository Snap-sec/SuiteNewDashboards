import React, { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';

const PieChart = ({
    data,
    series: propsSeries,
    labels: propsLabels,
    isLoading,
    colors,
    showLegend = false,
    legendPosition = "bottom",
    horizontalAlign = "center",
    showPercentage = false,
    width,
    height = 300,
    animated = true, // set false for PDF/headless rendering
}) => {
    const chartData = useMemo(
        () => {
            let series = [];
            let labels = [];

            if (data && data.length > 0) {
                series = data.map((item) => item.value);
                labels = data.map((item) => item.name);
            } else if (propsSeries && propsSeries.length > 0) {
                series = propsSeries;
                labels = propsLabels || propsSeries.map((_, i) => `Label ${i + 1}`);
            }

            // Custom tooltip configuration for showing percentages
            const tooltipConfig = showPercentage ? {
                custom: function ({ series, seriesIndex, w }) {
                    const total = series.reduce((a, b) => a + b, 0);
                    const value = series[seriesIndex];
                    const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                    const label = w.globals.labels[seriesIndex];
                    const color = w.globals.colors[seriesIndex];

                    return `<div style="padding: 8px 12px; background: var(--background); border: 1px solid var(--border); border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="width: 10px; height: 10px; border-radius: 50%; background: ${color};"></span>
                            <span style="color: var(--foreground); font-weight: 500;">${label}</span>
                        </div>
                        <div style="margin-top: 4px; color: var(--muted-foreground); font-size: 13px;">
                            ${value} <span style="color: var(--foreground); font-weight: 600;">(${percentage}%)</span>
                        </div>
                    </div>`;
                }
            } : {};

            return {
                series,
                options: {
                    chart: {
                        type: 'pie',
                        animations: {
                            enabled: animated && !isLoading,
                        },
                    },
                    labels: labels,
                    colors: colors,
                    legend: {
                        show: showLegend,
                        position: legendPosition,
                        horizontalAlign: horizontalAlign,
                    },
                    responsive: [
                        {
                            breakpoint: 480,
                            options: {
                                chart: {
                                    width: 200,
                                },
                                legend: {
                                    position: 'bottom',
                                },
                            },
                        },
                    ],
                    dataLabels: {
                        enabled: true,
                        formatter: (val, { seriesIndex }) => {
                            return `${labels[seriesIndex] || ''}`
                        }
                    },
                    tooltip: tooltipConfig,
                    noData: {
                        text: isLoading ? 'Loading...' : 'No data available',
                        align: 'center',
                        verticalAlign: 'middle',
                    },
                },
            };
        },
        [data, propsSeries, propsLabels, isLoading, colors, showLegend, legendPosition, horizontalAlign, showPercentage, animated],
    );


    const isDataEmpty = useMemo(() => {
        const series = chartData.series;
        if (!series || !series.length) return true;
        return series.every(item => item === 0);
    }, [chartData.series]);

    return (
        <div className='flex items-center justify-center w-full'>
            <div id="chart" className='flex items-center justify-center w-full'>
                {(isDataEmpty && !isLoading) ? (
                    <div className="flex flex-col justify-center items-center h-[300px] text-muted-foreground text-sm">
                        <p>No data available</p>
                    </div>
                ) : (
                    <ReactApexChart
                        options={chartData.options}
                        series={chartData.series}
                        type="pie"
                        width={width ? width : '100%'}
                    // height={height}
                    />
                )}
            </div>
        </div>
    );

};

export default PieChart;
