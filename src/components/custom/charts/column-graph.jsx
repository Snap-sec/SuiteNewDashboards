;
// ApexChart.js
import { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';


const ColumnGraph = ({
  data = [],
  isLoading,
  series,
  xCategories,
  height,
  colors = ['#008ffbd9'],
  showLegend = false,
  distributed = true, // enable when each bar needs a unique color
  animated = true, // set false for PDF/headless rendering
}) => {
  const chartData = useMemo(() => {
    // If series is provided, use it for grouped bars
    if (series && Array.isArray(series) && xCategories) {
      return {
        series,
        options: {
          chart: {
            height: 350,
            type: 'bar',
            animations: { enabled: animated && !isLoading },
          },
          colors,
          plotOptions: {
            bar: {
              borderRadius: 10,
              dataLabels: { position: 'top' },
              horizontal: false,
              columnWidth: '50%',
              distributed: distributed,
            },
          },

          dataLabels: {
            enabled: true,
            formatter: (val) => val,
            offsetY: -20,
            style: { fontSize: '12px', colors: ['#304758'] },
          },
          legend: {
            show: false,
            position: 'bottom', // or 'top', as you prefer
            horizontalAlign: 'center', // aligns the legend items in a row
          },
          xaxis: {
            categories: xCategories,
            position: 'bottom',
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: {
              hideOverlappingLabels: false,
              rotate: -45,
              rotateAlways: false,
            },
            crosshairs: {
              fill: {
                type: 'gradient',
                gradient: {
                  colorFrom: '#D8E3F0',
                  colorTo: '#BED1E6',
                  stops: [0, 100],
                  opacityFrom: 0.4,
                  opacityTo: 0.5,
                },
              },
            },
            tooltip: { enabled: true },
          },
          yaxis: {
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: {
              show: true,
              formatter: (val) => Math.round(val),
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
    // Fallback to old single-series behavior
    return {
      series: [
        {
          name: 'Count',
          data: data.map((item) => item.value),
        },
      ],
      options: {
        chart: {
          height: 350,
          type: 'bar',
          animations: {
            enabled: animated && !isLoading,
          },
        },
        colors,
        plotOptions: {
          bar: {
            borderRadius: 10,
            dataLabels: { position: 'top' },
            distributed: true,
          },
        },
        dataLabels: {
          enabled: true,
          formatter: (val) => val,
          offsetY: -20,
          style: { fontSize: '12px', colors: ['#304758'] },
        },
        xaxis: {
          categories: data.map((item) => item.name),
          position: 'bottom',
          axisBorder: { show: false },
          axisTicks: { show: false },
          labels: {
            hideOverlappingLabels: false,
            rotate: -45,
            rotateAlways: false,
          },
          crosshairs: {
            fill: {
              type: 'gradient',
              gradient: {
                colorFrom: '#D8E3F0',
                colorTo: '#BED1E6',
                stops: [0, 100],
                opacityFrom: 0.4,
                opacityTo: 0.5,
              },
            },
          },
          tooltip: {
            enabled: true,
            formatter: function (value, { dataPointIndex }) {
              // Show full name in x-axis tooltip
              return data?.[dataPointIndex]?.fullName || value;
            },
          },
        },
        yaxis: {
          axisBorder: { show: false },
          axisTicks: { show: false },
          labels: {
            show: true,
            formatter: (val) => Math.round(val),
          },
        },
        noData: {
          text: isLoading ? 'Loading...' : 'No data available',
          align: 'center',
          verticalAlign: 'middle',
        },
        legend: {
          show: showLegend,
        },
      },
    };
  }, [data, isLoading, series, xCategories, animated]);

  return (
    <div className="w-full h-full">
      <div id="chart">
        {((series && !series?.some((s) => s?.data?.length)) ||
          (!series && !data?.length)) &&
          !isLoading ? (
          <div className="flex items-center justify-center h-[300px] text-sm text-muted-foreground">
            No data available
          </div>
        ) : (
          <ReactApexChart
            options={chartData.options}
            series={chartData.series}
            type="bar"
            height={height ? height : 350}
          />
        )}
      </div>
    </div>
  );
};

export default ColumnGraph;