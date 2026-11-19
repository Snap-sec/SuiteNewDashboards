import React, { useMemo } from 'react';
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
  fix_verified: "Fix Verified",
  need_more_info: "Needs More Info",
  in_progress: "In Progress"
};

const ProjectStatusDistribution = ({ data = [], isLoading }) => {
  // Prepare data for the grouped column graph
  const projectNames = data.map(project => project.name);

  // For each status, get the value for each project (in order)
  const series = statuses.map(status => ({
    name: statusLabels[status],
    data: data.map(project => project.state_distribution[status] ?? 0),
  }));

  const isAllZero = series.every(category =>
    category.data.every(value => value === 0)
  );

  if (isLoading) {
    return <Skeleton className="w-full h-[450px]" />;
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Project Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        {isAllZero ? (
          <div className="flex justify-center h-[240px] text-muted-foreground">
            <p className="text-sm text-muted-foreground mt-16">No data available</p>
          </div>
        ) : (
          <ColumnGraph
            series={series}
            xCategories={projectNames}
            isLoading={isLoading}
            height={340}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectStatusDistribution;
