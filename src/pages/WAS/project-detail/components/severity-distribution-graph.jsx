import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import ColumnGraph from '@/components/custom/charts/column-graph';

const DEFAULT_COLOR = '#0066ff';

const capitalize = (word) =>
  word ? word.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) : '';

const ProjectStatusDistribution = ({ title, data = {}, isLoading }) => {
  const { seriesData, xCategories, isAllZero } = useMemo(() => {
    const keys = data.map((d) => d._id);
    const values = data.map((d) => d.count);
    const labels = keys.map((status) => capitalize(status));
    const allZero = values.every((val) => val === 0);
    return {
      seriesData: [{ name: 'Status Count', data: values }],
      xCategories: labels,
      isAllZero: allZero,
    };
  }, [data]);

  if (isLoading) {
    return <Skeleton className="w-full h-[320px]" />;
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
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
            colors={Array(seriesData[0].data.length).fill(DEFAULT_COLOR)}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectStatusDistribution;
