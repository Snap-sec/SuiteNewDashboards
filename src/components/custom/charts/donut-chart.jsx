import React, { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';

const DonutChart = ({
    data = [],
    series: propsSeries,
    labels: propsLabels,
    isLoading,
    colors,
    showLegend = true,
    legendPosition = "bottom",
    horizontalAlign = "center",
    height = 300,
    width
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

            return {
                series,
                options: {
                    chart: {
                        type: 'donut',
                        animations: {
                            enabled: !isLoading,
                        },
                        toolbar: {
                            show: false,
                        },
                    },
                    labels: labels,
                    colors: colors || ['#ff5724', '#ff8a66', '#ff9800', '#0ea5e9', '#10b981', '#0ea5e9'],
                    legend: {
                        show: showLegend,
                        position: legendPosition,
                        horizontalAlign: horizontalAlign,
                        formatter: function (seriesName) {
                            return `<span class="text-gray-800 dark:text-gray-300">${seriesName}</span>`;
                        },
                    },
                    dataLabels: {
                        enabled: true,
                    },
                    tooltip: {
                        y: {
                            formatter: (val) => val,
                        },
                    },
                    plotOptions: {
                        pie: {
                            donut: {
                                size: '65%',
                                labels: {
                                    show: true,
                                    total: {
                                        show: true,
                                        label: 'Total',
                                        formatter: function (w) {
                                            return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                                        }
                                    }
                                }
                            }
                        }
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
                    noData: {
                        text: isLoading ? 'Loading...' : 'No data available',
                        align: 'center',
                        verticalAlign: 'middle',
                    },
                },
            };
        },
        [data, propsSeries, propsLabels, isLoading, colors, showLegend, legendPosition, horizontalAlign],
    );

    const hasData = useMemo(() => {
        const series = chartData.series;
        if (!series || !series.length) return false;
        return series.some(item => item > 0);
    }, [chartData.series]);

    return (
        <div className='flex items-center justify-center w-full h-full'>
            <div id="chart" className='flex items-center justify-center w-full'>
                {(!hasData && !isLoading) ? (
                    <div className="flex flex-col justify-center items-center h-[300px] text-muted-foreground text-sm">
                        <p>No data available</p>
                    </div>
                ) : (
                    <ReactApexChart
                        options={chartData.options}
                        series={chartData.series}
                        type="donut"
                        width={width ? width : '100%'}
                        height={height}
                    />
                )}
            </div>
        </div>
    );
};

export default DonutChart;