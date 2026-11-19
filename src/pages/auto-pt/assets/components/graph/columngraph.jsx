import React, { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';

const ColumnGraph = ({ data = [], isLoading, colors, height = 350 }) => {
  const defaultColor = "#2196F3"; // your current blue color

  const chartData = useMemo(() => ({
    series: [{
      name: 'Count',
      data: data.map(item => item.value)
    }],
    options: {
      chart: { 
        height: height, 
        type: 'bar',
        animations: { enabled: !isLoading }
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          dataLabels: { position: 'top' },
          distributed: true, 
        }
      },
      colors: colors && colors.length === data.length 
      ? colors 
      : Array(data.length).fill(defaultColor),
      dataLabels: {
        enabled: true,
        formatter: (val) => val,
        offsetY: -20,
        style: { fontSize: '12px', colors: ["#304758"] }
      },
      legend: {
        show: false // disables legend buttons
      },
      xaxis: {
        categories: data.map(item => item.name),
        position: 'bottom',
        axisBorder: { show: false },
        axisTicks: { show: false },
        crosshairs: {
          fill: {
            type: 'gradient',
            gradient: {
              colorFrom: '#D8E3F0',
              colorTo: '#BED1E6',
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5
            }
          }
        },
        tooltip: { enabled: true }
      },
      yaxis: {
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: { show: true, formatter: (val) => Math.round(val) }
      },
      noData: {
        text: isLoading ? 'Loading...' : 'No data available',
        align: 'center',
        verticalAlign: 'middle'
      }
    }
  }), [data, isLoading, colors, height]);

  return (
    <div>
      <div id="chart">
        <ReactApexChart 
          options={chartData.options} 
          series={chartData.series} 
          type="bar" 
          height={height} 
        />
      </div>
    </div>
  );
};

export default ColumnGraph;
