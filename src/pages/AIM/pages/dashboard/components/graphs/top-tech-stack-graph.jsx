import React, { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import ColumnGraph from '@/components/custom/charts/column-graph.jsx';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const TopTechStackGraph = ({ data, assetsLoading }) => {
  const techStackData = useMemo(() => {
    if (!data) return [];

    return Object.entries(data).map(([techName, count]) => ({
      name: techName,
      value: count,
    }));
  }, [data]);

  if (assetsLoading) {
    return <Skeleton className="w-full h-[400px]" />;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-normal">Top Tech Stack</CardTitle>
      </CardHeader>
      <CardContent>
        {techStackData.length > 0 ? (
          <ColumnGraph data={techStackData} isLoading={assetsLoading} />
        ) : (
          <div className="flex flex-col justify-center items-center h-[360px] text-muted-foreground text-sm">
            <p>No data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopTechStackGraph;
