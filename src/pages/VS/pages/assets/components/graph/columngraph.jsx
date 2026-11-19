// ApexChart.js
import React, { useEffect, useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';

const ColumnGraph = ({ data = [], isLoading }) => {
  const chartData = useMemo(() => ({
    series: [{
      name: 'Count',
      data: data.map(item => item.value)
    }],
    options: {
      chart: { 
        height: 350, 
        type: 'bar',
        animations: {
          enabled: !isLoading
        }
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          dataLabels: { position: 'top' }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => val,
        offsetY: -20,
        style: { fontSize: '12px', colors: ["#304758"] }
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
        labels: {
          show: true,
          formatter: (val) => Math.round(val)
        }
      },
      noData: {
        text: isLoading ? 'Loading...' : 'No data available',
        align: 'center',
        verticalAlign: 'middle'
      }
    }
  }), [data, isLoading]);

  return (
    <div>
      <div id="chart">
        <ReactApexChart 
          options={chartData.options} 
          series={chartData.series} 
          type="bar" 
          height={350} 
        />
      </div>
    </div>
  );
};

export default ColumnGraph;
