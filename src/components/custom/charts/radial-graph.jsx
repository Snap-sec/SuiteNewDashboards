import React, { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';

const RadialGraph = ({
    data,
    series: propsSeries,
    labels: propsLabels,
    isLoading,
    colors,
    showLegend = false,
    legendPosition = "bottom",
    horizontalAlign = "center",
    width,
    height = 250,
    hollowSize = '70%',
    maxValue = 100,
    animated = true, // set false for PDF/headless rendering
}) => {
    const chartData = useMemo(
        (() => {
            let series = [];
            let labels = [];

            // Convert data to number if it's a numeric string
            const numericValue = (typeof data === 'number') ? data : parseFloat(data);
            const isNumeric = !isNaN(numericValue) && (typeof data === 'number' || typeof data === 'string');

            if (isNumeric) {
                series = [(numericValue / maxValue) * 100];
                labels = propsLabels || ['Score'];
            } else if (data && Array.isArray(data) && data.length > 0) {
                series = data.map((item) => (item.value / maxValue) * 100);
                labels = data.map((item) => item.name);
            } else if (propsSeries && propsSeries.length > 0) {
                series = propsSeries.map(s => (s / maxValue) * 100);
                labels = propsLabels || propsSeries.map((_, i) => `Label ${i + 1}`);
            }

            // Determine color if it's a CVSS score (maxValue is usually 10)
            let computedColors = colors;
            if (!computedColors && maxValue === 10 && isNumeric) {
                if (numericValue >= 9) computedColors = ['#DC2626']; // Critical - Red
                else if (numericValue >= 7) computedColors = ['#EA580C']; // High - Orange
                else if (numericValue >= 4) computedColors = ['#EAB308']; // Medium - Yellow
                else if (numericValue > 0) computedColors = ['#2563EB'];  // Low - Blue
                else computedColors = ['#64748b']; // Info/0 - Gray
            }

            return {
                series,
                options: {
                    chart: {
                        type: 'radialBar',
                        animations: {
                            enabled: animated && !isLoading,
                        },
                        toolbar: {
                            show: false,
                        },
                    },
                    plotOptions: {
                        radialBar: {
                            startAngle: 0,
                            endAngle: 360,
                            hollow: {
                                size: hollowSize,
                            },
                            track: {
                                background: '#f1f5f9',
                                strokeWidth: '100%',
                            },
                            dataLabels: {
                                name: {
                                    show: true,
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    color: '#64748b',
                                    offsetY: -5
                                },
                                value: {
                                    show: true,
                                    fontSize: '20px',
                                    fontWeight: 700,
                                    color: '#1e293b',
                                    formatter: (val) => {
                                        const actualValue = (val * maxValue) / 100;
                                        return maxValue <= 10 ? actualValue.toFixed(1) : Math.round(actualValue);
                                    },
                                    offsetY: 5
                                },
                                total: {
                                    show: series.length > 1,
                                    label: 'Total',
                                    formatter: function (w) {
                                        const sum = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                                        const avg = sum / series.length;
                                        const actualAvg = (avg * maxValue) / 100;
                                        return maxValue <= 10 ? actualAvg.toFixed(1) : Math.round(actualAvg);
                                    }
                                }
                            }
                        },
                    },
                    labels: labels,
                    colors: computedColors || ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
                    legend: {
                        show: showLegend,
                        position: legendPosition,
                        horizontalAlign: horizontalAlign,
                    },
                    stroke: {
                        lineCap: 'round'
                    },
                    responsive: [
                        {
                            breakpoint: 480,
                            options: {
                                legend: {
                                    position: 'bottom',
                                },
                            },
                        },
                    ],
                    noData: {
                        text: isLoading ? 'Loading...' : 'No data available',
                        align: 'center',
                        verticalAlign: 'middle',
                    },
                },
            };
        }),
        [data, propsSeries, propsLabels, isLoading, colors, showLegend, legendPosition, horizontalAlign, hollowSize, maxValue, animated],
    );

    const hasData = useMemo(() => {
        return chartData.series && chartData.series.length > 0;
    }, [chartData.series]);

    return (
        <div className='flex items-center justify-center w-full'>
            <div id="chart" className='flex items-center justify-center w-full min-h-[150px]'>
                {(!hasData && !isLoading) ? (
                    <div className="flex flex-col justify-center items-center h-[200px] text-muted-foreground text-sm">
                        <p>No data available</p>
                    </div>
                ) : (
                    <ReactApexChart
                        options={chartData.options}
                        series={chartData.series}
                        type="radialBar"
                        width={width ? width : '100%'}
                        height={height}
                    />
                )}
            </div>
        </div>
    );
};

export default RadialGraph;
