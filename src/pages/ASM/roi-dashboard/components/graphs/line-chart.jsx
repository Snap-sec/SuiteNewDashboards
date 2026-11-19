import ApexChart from 'react-apexcharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const LineChart = ({
  categories = [],
  series = [],
  chartTitle = 'Vulnerabilities',
  height = 300,
  colors = ["#3b82f6", "#ef4444"],
  filter,
  onFilterChange,
  isLoading
}) => {
  // Dynamically set Y-axis max value for better visibility
  const getYAxisMax = () => {
    const allDataPoints = series.flatMap(s => s.data || []);
    if (allDataPoints.length === 0) return 10;
    const maxVal = Math.max(...allDataPoints);
    return maxVal < 10 ? 10 : Math.ceil(maxVal * 1.2);
  };

  const options = {
    chart: {
      type: 'line',
      toolbar: { show: false },
    },

    dataLabels: { enabled: false },

    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: "center",
      floating: false,
      labels: {
        colors: 'var(--color-secondary-foreground)',
      },
      markers: {
        width: 10,
        height: 10,
        radius: 4,
      },
      itemMargin: {
        horizontal: 4,
        vertical: 0,
      },
    },

    stroke: {
      curve: 'smooth',
      width: 3,
    },
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: 'var(--color-secondary-foreground)',
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      min: 0,
      max: getYAxisMax(),
      tickAmount: 7,
      axisTicks: { show: false },
      labels: {
        style: {
          colors: 'var(--color-secondary-foreground)',
          fontSize: '12px',
        },
        formatter: (value) => value.toFixed(0),
      },
    },
    tooltip: {
      enabled: true,
      shared: true,
      intersect: false,
    },
    markers: {
      size: 4,
      strokeWidth: 2,
      hover: { size: 8 },
    },
    grid: {
      borderColor: 'var(--color-border)',
      strokeDashArray: 5,
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
    },
    // Set colors for series
    colors: colors,
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base leading-none tracking-tight font-normal text-sm text-gray-500">{chartTitle}</CardTitle>
        {filter && onFilterChange && (
          <Select value={filter} onValueChange={onFilterChange}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Daily" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        )}
      </CardHeader>
      <CardContent className={`min-w-[200px]   ${isLoading ? 'p-0' : ''}`}>
        {isLoading ? (
          <Skeleton className="w-full" style={{ height: height }} />
        ) : !series || series.length === 0 || !series.some(s => s.data && s.data.length) ? (
          <div className="flex flex-col justify-center items-center text-muted-foreground text-sm" style={{ height: height }}>
            <p>No data available</p>
          </div>
        ) : (
          <ApexChart
            id="multi_line_chart"
            options={options}
            series={series}
            type="line"
            height={height}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default LineChart;
