import { useEffect, useState } from 'react';
import ApexChart from 'react-apexcharts';
import { Card, CardContent,CardHeader, CardTitle } from '@/components/ui/card';

// Dummy data for both lines
const dummyUnresolvedData = [20, 8, 5, 12, 8, 3, 10, 15, 12, 5, 8, 4];
const dummyResolvedData = [5, 3, 2, 8, 4, 1, 5, 8, 6, 2, 4, 2];



const SlaComplianceOverTime = ({ data }) => {

    const timeline = data.vulnTimeline;
    
    // Get only the latest 8 entries
    const latestTimeline = timeline?.slice(-8) || [];

    const categories = latestTimeline?.map(event => event.date);

    const [chartData, setChartData] = useState({
        unresolved: latestTimeline?.map(event => event.unresolvedCount),
        resolved: latestTimeline?.map(event => event.resolvedCount),
    });


    const series = [
      {
        name: 'Detected',
        data: chartData.unresolved,
      }
    ];

    const options = {
      series: [
        {
          name: 'Detected',
          data: chartData.unresolved,
        },
      ],
      chart: {
        height: 400,
        type: 'bar',
        toolbar: {
          show: false,
        },
      },
      colors: ['#FF0000', '#12B76A'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      xaxis: {
        categories: categories,
        labels: {
          style: {
            colors: 'var(--color-secondary-foreground)',
            fontSize: '12px',
          },
        },
      },
      yaxis: {
        min: 0,
        tickAmount: 5,
        labels: {
          style: {
            colors: 'var(--color-secondary-foreground)',
            fontSize: '12px',
          },
        },
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        fontSize: '14px',
      },
      grid: {
        borderColor: 'var(--color-border)',
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: false,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      tooltip: {
        shared: true,
        intersect: false,
      },
    };

    return (
      <Card className="h-full">
        <CardHeader>
        <CardTitle>SLA Compliance Over Time</CardTitle>
      </CardHeader>
        <CardContent className="flex flex-col justify-end items-stretch grow px-3 py-1">
          <ApexChart
            id="vulnerability_chart"
            options={options}
            series={series}
            type="line"
            height={300}
          />
        </CardContent>
      </Card>
    );
};

export default SlaComplianceOverTime;
