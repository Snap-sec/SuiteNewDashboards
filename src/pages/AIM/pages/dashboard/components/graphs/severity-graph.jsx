import React, { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import ReBarChart from '@/components/custom/charts/reui/bar-chart';

const SeverityDistributionColumnGraph = ({ data, assetsLoading }) => {
  const severityDistributionData = useMemo(() => {
    if (!data) return [];

    return Object.entries(data)
      .filter(([severity]) => severity.toLowerCase() !== 'total')
      .map(([severity, counts]) => ({
        name: severity.charAt(0).toUpperCase() + severity.slice(1),
        value: counts[0],
      }));
  }, [data]);

  if (assetsLoading) {
    return <Skeleton className="w-full h-[400px]" />;
  }

  const isEmpty = severityDistributionData.every((item) => item.value === 0);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-normal">Vulnerability Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className="h-[320px] flex items-center justify-center text-muted-foreground text-sm text-center">
            Please Connect VM Adapter to see this Chart
          </div>
        ) : (
          <ReBarChart
            data={severityDistributionData}
            xKey="name"
            keys={[{ key: 'value', label: 'Count' }]}
            isLoading={assetsLoading}
            colors={['#e7000b', '#bf564a', '#efb100', '#155dfc', '#50596bff']}
            distributed={true}
            noCard={true}
            xTickFormatter={(v) => String(v)}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default SeverityDistributionColumnGraph;
