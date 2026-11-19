// ApexChart.js
import React, { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';

const PieChart = ({ data = [], isLoading  }) => {
  const chartData = useMemo(() => ({
    series: data.map(item => item.value),
    options: {
      chart: {
        width: 380,
        type: 'pie',
        animations: {
          enabled: !isLoading
        }
      },
      labels: data.map(item => item.name),
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
      // dataLabels: {
      //   enabled: true,
      //   formatter: (val, { seriesIndex }) => {
      //     const roundedVal = Number(val).toFixed(2);
      //     return `${data[seriesIndex]?.name}: ${roundedVal}`
      //   }
      // },
      noData: {
        text: isLoading ? 'Loading...' : 'No data available',
        align: 'center',
        verticalAlign: 'middle'
      }
    },
  }), [data, isLoading]);

  return (
    <div>
      <div id="chart">
        <ReactApexChart 
          options={chartData.options} 
          series={chartData.series} 
          type="pie" 
          width={380} 
        />
      </div>
    </div>
  );
};

export default PieChart;
