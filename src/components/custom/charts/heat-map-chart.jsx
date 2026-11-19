import React, { useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';

const HeatMapChart = ({ series = [], isLoading, isDarkMode }) => {
  // Decide text colors based on theme
  const axisTextColor = isDarkMode ? "#fff" : "#374151"; // white for dark, neutral-700 for light

  const options = useMemo(() => ({
    chart: {
      height: 310,
      type: 'heatmap',
      animations: { enabled: !isLoading },
      foreColor: axisTextColor,
      background: 'transparent',
    },
    plotOptions: {
      heatmap: {
        colorScale: {
          ranges: [
            {
              from: 0,
              to: 0,
              color: "#18181b",
              // no 'name' here to hide legend label
            },
          ],
        },
      },
    },
    dataLabels: { enabled: false },
    colors: ['#008FFB'],
    title: { text: '' },
    legend: { show: false },
    noData: {
      text: isLoading ? 'Loading...' : 'No data available',
      align: 'center',
      verticalAlign: 'middle',
      style: { color: axisTextColor },
    },
    xaxis: { labels: { style: { colors: axisTextColor } } },
    yaxis: { labels: { style: { colors: axisTextColor } } },
  }), [isLoading, axisTextColor]);

  // Check if all data points have y=0 (empty data)
  const isSeriesEmpty = useMemo(() => {
    if (!series.length) return true;
    return series.every(s =>
      Array.isArray(s.data) &&
      s.data.every(point => point.y === 0)
    );
  }, [series]);

  return (
    <div>
      {(isSeriesEmpty && !isLoading) ? (
        <div style={{
          height: 310,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: axisTextColor,
          backgroundColor: isDarkMode ? '#18181b' : '#fff'
        }}>
          <p>No data available</p>
        </div>
      ) : (
        <ReactApexChart options={options} series={series} type="heatmap" height={310} />
      )}
    </div>
  );
};

export default HeatMapChart;
