import { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';

const StackedColumnChart = ({
    series = [],
    categories = [],
    height = 350,
    colors = ['#008FFB', '#00E396', '#FEB019', '#FF4560'],
    isLoading = false,
    showLegend = true,
    legendPosition="right",
    horizontalAlign="center",
    xAxisFormatter
}) => {
    const hasData = series?.some((s) => s?.data?.length);

    const chartConfig = useMemo(
        () => ({
            series,
            options: {
                chart: {
                    type: 'bar',
                    stacked: true,
                    animations: { enabled: !isLoading },
                    toolbar: { show: true },
                },

                colors,

                plotOptions: {
                    bar: {
                        horizontal: false,
                        columnWidth: '50%',
                        borderRadius: 10,
                        borderRadiusApplication: 'end',
                        borderRadiusWhenStacked: 'last',
                        dataLabels: {
                            total: {
                                enabled: true,
                                style: {
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    color: '#111',
                                },
                            },
                        },
                    },
                },

                dataLabels: {
                    enabled: false, // individual segment labels OFF
                },

                xaxis: {
                    categories,
                    axisBorder: { show: false },
                    axisTicks: { show: false },
                    labels: {
                        formatter: xAxisFormatter,
                    }
                },

                yaxis: {
                    labels: {
                        formatter: (val) => Math.round(val),
                    },
                },

                legend: {
                    show: showLegend,
                    position: legendPosition, // <-- use the prop here
                    horizontalAlign: horizontalAlign, // <-- use this prop to align legend text, left, right, center
                },

                tooltip: {
                    shared: true,
                    intersect: false,
                },

                noData: {
                    text: isLoading ? 'Loading...' : 'No data available',
                    align: 'center',
                    verticalAlign: 'middle',
                },
            },
        }),
        [series, categories, colors, isLoading, showLegend]
    );

    if (!hasData && !isLoading) {
        return (
            <div className="flex items-center justify-center h-[300px] text-sm text-muted-foreground">
                No data available
            </div>
        );
    }

    return (
        <ReactApexChart
            options={chartConfig.options}
            series={chartConfig.series}
            type="bar"
            height={height}
        />
    );
};

export default StackedColumnChart;
