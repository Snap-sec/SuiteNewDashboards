import React, { useMemo } from 'react';
import ColumnGraph from '@/components/custom/charts/column-graph';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const statuses = [
    'pending',
    'acknowledged',
    'rejected',
    'fixed',
    'risk_accepted',
    'fix_verified',
    'need_more_info',
    'in_progress',
];

const statusLabels = {
    pending: 'Pending',
    acknowledged: 'Acknowledged',
    rejected: 'Rejected',
    fixed: 'Fixed',
    risk_accepted: 'Risk Accepted',
    fix_verified: 'Fix Verified',
    need_more_info: 'Need More Info',
    in_progress: 'In Progress',
};

const statusColors = {
    pending: '#FBBF24',
    acknowledged: '#60A5FA',
    rejected: '#F87171',
    fixed: '#4ADE80',
    risk_accepted: '#FB923C',
    fix_verified: '#34D399',
    need_more_info: '#A78BFA', // Purple
    in_progress: '#38BDF8', // Light blue
};


const ProjectStatusDistribution = ({ data = {}, isLoading }) => {
  console.log("Distribution Data:", data);

  const { seriesData, xCategories, isAllZero } = useMemo(() => {
    const values = statuses.map(status => data?.[status] ?? 0);
    const labels = statuses.map(status => statusLabels[status]);

    const allZero = values.every(val => val === 0);

    return {
      seriesData: [{ name: 'Threat Count', data: values }],
      xCategories: labels,
      isAllZero: allZero
    };
  }, [data]);

  if (isLoading) {
    return <Skeleton className="w-full h-[320px]" />;
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Threat Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        {isAllZero ? (
          <div className="flex items-center justify-center h-[240px] text-muted-foreground">
            <p className="text-sm mt-16">No data available</p>
          </div>
        ) : (
          <ColumnGraph
            series={seriesData}
            xCategories={xCategories}
            height={300}
            colors={statuses.map((s) => statusColors[s])} // Optional - if your chart lib supports it
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectStatusDistribution;
