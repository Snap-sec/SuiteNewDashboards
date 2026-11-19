import React from 'react';
import ColumnGraph from '@/components/custom/charts/column-graph';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const statuses = ["pending", "acknowledged", "rejected", "fixed", "risk_accepted", "fix_verified", "need_more_info", "in_progress"];
const statusLabels = {
  pending: "Pending",
  acknowledged: "Acknowledged",
  rejected: "Rejected",
  fixed: "Fixed",
  risk_accepted: "Risk Accepted",
  need_more_info: "Needs More Info",
  in_progress: "In Progress",
  fix_verified: "Fix Verified"
};

const StatusDistribution = ({ data = {}, isLoading }) => {


    console.log(data, "status distribution data");

  // Transform the data for the column graph
  const series = [{
    name: 'Findings',
    data: statuses.map(status => data[status] || 0),
    color: '#2563eb'
  }];

  const isAllZero = series[0].data.every(value => value === 0);

  if (isLoading) {
    return <Skeleton className="w-full h-[360px]" />;
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        {isAllZero ? (
          <div className="flex justify-center h-[240px] text-muted-foreground">
            <p className="text-sm text-muted-foreground mt-16">No data available</p>
          </div>
        ) : (
          <ColumnGraph
            series={series}
            xCategories={statuses.map(status => statusLabels[status])}
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
                  return val || 0;
                }
              }
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default StatusDistribution;
