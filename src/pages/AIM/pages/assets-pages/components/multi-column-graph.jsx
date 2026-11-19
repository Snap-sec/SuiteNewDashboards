import React, { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';

const ColumnGraph = ({ data = [], isLoading }) => {
  const chartData = useMemo(() => ({
    series: [
      {
        name: 'Open',
        data: data.map(item => item.open)
      },
      {
        name: 'Closed',
        data: data.map(item => item.closed)
      }
    ],
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
          horizontal: false,
          borderRadius: 10,
        }
      },
      colors: ['#ef4444', '#22c55e'], 
      dataLabels: {
        enabled: true,
        formatter: (val) => val || '',
        offsetY: -20,
        style: { fontSize: '12px' }
      },
      xaxis: {
        categories: data.map(item => item.name),
        position: 'bottom',
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: {
          show: true,
          formatter: (val) => Math.round(val)
        }
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: (val) => val
        }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left'
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