import { DropdownMenu7 } from '@/partials/dropdown-menu/dropdown-menu-7';
import { EllipsisVertical } from 'lucide-react';
import ApexChart from 'react-apexcharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const SeverityGraph = ({ title, asset, isLoading}) => {
  const data = asset ? [
    asset.critical || 0,
    asset.high || 0,
    asset.medium || 0,
    asset.low || 0
  ] : [0, 0, 0, 0];

  const hasData = data.some(value => value > 0);

  const labels = ['Critical', 'High', 'Medium', 'Low'];
  const colors = [
    'var(--color-red-500)',    // Critical
    'var(--color-orange-500)', // High
    'var(--color-yellow-500)', // Medium
    'var(--color-blue-500)',   // Low
  ];

  const options = {
    series: data,
    labels: labels,
    colors: colors,
    fill: {
      colors: colors,
    },
    chart: {
      type: 'donut',
    },
    stroke: {
      show: true,
      width: 2,
    },
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: {
          size: '70%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--color-secondary-foreground)',
            },
            value: {
              show: true,
              fontSize: '16px',
              fontWeight: 700,
              color: 'var(--color-primary)',
              formatter: function (val) {
                return val;
              }
            },
            total: {
              show: true,
              label: 'Total',
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--color-secondary-foreground)',
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
              }
            }
          }
        }
      },
    },
    legend: {
      position: 'right',
      offsetY: 0,
      fontSize: '13px',
      fontWeight: '500',
      itemMargin: {
        vertical: 5,
        horizontal: 10
      },
      labels: {
        colors: 'var(--color-secondary-foreground)',
        useSeriesColors: false,
      },
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
  };


  if (isLoading) {
    return <Skeleton className="w-full h-[360px]" />;
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center items-center px-3 py-16">
        {hasData ? (
          <ApexChart
            id="severity_chart"
            options={options}
            series={options.series}
            type="donut"
            width="100%"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-[165px] text-muted-foreground">
            <p className="text-sm  text-muted-foreground">No Severity Data Available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export { SeverityGraph };
