import { useEffect, useState } from 'react';
import ApexChart from 'react-apexcharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Hardcoded dummy data for fallback
const dummyChartData = [58, 64, 52, 45, 42, 38, 45, 53, 56, 65, 75, 85];
const dummyCategories = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const LineChart = ({
  timeline = [],
  chartTitle = 'Vulnerabilities',
  lineHoverText = 'vulns',
  height
}) => {
  const currentDate = new Date();

  // If timeline is provided and has data, use it; otherwise fallback to dummy data
  const chartData =
    Array.isArray(timeline) && timeline.length > 0
      ? timeline.map((item) => item.total)
      : dummyChartData;

  const categories =
    Array.isArray(timeline) && timeline.length > 0
      ? timeline.map((item) => item.date)
      : dummyCategories;

  if (categories?.length < 2) {
    categories.unshift(
      new Intl.DateTimeFormat('en-GB')
        .format(currentDate.setDate(currentDate.getDate() - 30))
        .replace(/\//g, '-'), // turn slashes into dashes
    );
  }

  if (chartData?.length < 2) {
    chartData.unshift(0);
  }

  // Dynamically set Y-axis max value for better visibility
  const getYAxisMax = () => {
    const maxVal = Math.max(...chartData);
    // If highest data < 10, default to 10; otherwise, set max to 20% above highest point
    return maxVal < 10 ? 10 : Math.ceil(maxVal * 1.2);
  };

  const options = {
    series: [
      {
        name: chartTitle,
        data: chartData ?? [],
      },
    ],

    chart: {
      height: 250,
      type: 'area',
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    stroke: {
      curve: 'smooth',
      show: true,
      width: 3,
      colors: ['var(--color-primary)'],
    },
    xaxis: {
      categories: categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: 'var(--color-secondary-foreground)',
          fontSize: '12px',
        },
      },
      crosshairs: {
        position: 'front',
        stroke: {
          color: 'var(--color-primary)',
          width: 1,
          dashArray: 3,
        },
      },
      tooltip: {
        enabled: false,
        formatter: undefined,
        offsetY: 0,
        style: {
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      min: 0,
      max: getYAxisMax(),
      tickAmount: 5,
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: 'var(--color-secondary-foreground)',
          fontSize: '12px',
        },
        formatter: (defaultValue) => defaultValue,
      },
    },
    tooltip: {
      enabled: true,
      custom({ series, seriesIndex, dataPointIndex, w }) {
        const value = series[seriesIndex][dataPointIndex];
        const label = categories[dataPointIndex] || '';
        return `
          <div class="flex flex-col gap-2 p-3.5">
            <div class="font-medium text-sm text-secondary-foreground">${label}</div>
            <div class="flex items-center gap-1.5">
              <div class="font-semibold text-base text-mono">${value} ${chartTitle ? chartTitle : lineHoverText}</div>
            </div>
          </div>
        `;
      },
    },
    markers: {
      size: chartData.length <= 4 ? 6 : 0, // Make marker bigger for 4 or fewer points
      colors: 'var(--color-white)',
      strokeColors: 'var(--color-primary)',
      strokeWidth: 4,
      strokeOpacity: 1,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      shape: 'circle',
      offsetX: 0,
      offsetY: 0,
      onClick: undefined,
      onDblClick: undefined,
      showNullDataPoints: true,
      hover: {
        size: 8,
        sizeOffset: 0,
      },
    },
    fill: {
      gradient: {
        opacityFrom: 0.25,
        opacityTo: 0,
      },
    },
    grid: {
      borderColor: 'var(--color-border)',
      strokeDashArray: 5,
      yaxis: {
        lines: {
          show: true,
        },
      },
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{chartTitle}</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col justify-end items-stretch grow px-3 py-1">
        {!timeline?.length ? (
          <div className="flex flex-col justify-center items-center h-[300px] text-muted-foreground text-sm">
            <p>No data available</p>
          </div>
        ) : (
          <ApexChart
            id="vuln_chart"
            options={options}
            series={options.series}
            type="area"
            max-width="694"
            height={height || 300}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default LineChart;
