import React from 'react';
import ColumnGraph from '@/components/custom/charts/column-graph';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Type definition for the CWE data structure
// {
//   _id: string;    // CWE ID
//   total: number;  // Number of occurrences
//   cwe: string;    // CWE identifier
// }

const CWEDistributinGraph = ({ cweDistribution = [], isLoading }) => {
  // Transform and sort the data by total occurrences (descending)
  const sortedData = [...cweDistribution].sort((a, b) => b.total - a.total);

  // Take top 10 CWEs for better visualization
  const topCWEs = sortedData.slice(0, 10);

  // Transform the array of objects into the required format
  const xCategories = topCWEs.map(item => `CWE-${item.cwe}`);
  const data = topCWEs.map(item => item.total);
  const isAllZero = data.every((v) => v === 0);

  if (isLoading) {
    return <Skeleton className="w-full h-[360px]" />;
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>CWE Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        {isAllZero ? (
          <div className="flex justify-center h-[205px] text-muted-foreground">
            <p className="text-sm text-muted-foreground mt-16">No data available</p>
          </div>
        ) : (
          <ColumnGraph
            series={[{ 
              name: 'Occurrences', 
              data,
              color: '#2563eb' // You can customize the color
            }]}
            xCategories={xCategories}
            isLoading={isLoading}
            height={240}
            options={{
              chart: {
                toolbar: {
                  show: false
                }
              },
              plotOptions: {
                bar: {
                  borderRadius: 4,
                  dataLabels: {
                    position: 'top'
                  }
                }
              },
              dataLabels: {
                enabled: true,
                formatter: function (val) {
                  return val;
                }
              }
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default CWEDistributinGraph;
