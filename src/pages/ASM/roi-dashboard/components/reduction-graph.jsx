
import { useEffect, useState } from 'react';
import { Card, CardContent,CardHeader, CardTitle } from '@/components/ui/card';
import LineChart from './graphs/line-chart';
import { Skeleton } from '@/components/ui/skeleton';


function ReductionGraph({ data = [], isLoading }) {
  // Use the passed data or empty array fallback
  const timeline = data;

  const categories = timeline.map(item => item.date);

  const series = [
    {
      name: 'Total Assets',
      data: timeline.map(item =>
        (item.ip || 0) + (item.subdomain || 0) + (item.certificate || 0) + (item.web_server || 0) + (item.technology || 0)
      ),
    },
  ];


  if (isLoading) {
    return(
        <Skeleton className="w-full h-[350px]"/>
    )
  }

  return (
    <LineChart
      series={series}
      categories={categories}
      chartTitle="Attack Surface Over Time"
      height={350}
      isLoading={isLoading}
    />
  );
}



export default ReductionGraph;