import React, { useMemo } from 'react';
import ColumnGraph from '@/components/custom/charts/column-graph';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SeverityOpenCloseDistribution = ({ Data, assetsLoading }) => {
  // Prepare grouped bar data for severities
  const severities = ['Low', 'Medium', 'High', 'Critical', 'None'];
  const openData = [
    Data?.lowOpen || 0,
    Data?.medOpen || 0,
    Data?.highOpen || 0,
    Data?.criticalOpen || 0,
    Data?.noneOpen || 0,
  ];
  const closedData = [
    Data?.lowClosed || 0,
    Data?.medClosed || 0,
    Data?.highClosed || 0,
    Data?.criticalClosed || 0,
    Data?.noneClosed || 0,
  ];
  const isAllZero = openData.concat(closedData).every((v) => v === 0);



  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Open/Close Severity Distribution</CardTitle>
      </CardHeader>
      <CardContent className="">
        {isAllZero ? (
          <div className="flex justify-center h-[165px] text-muted-foreground">
            <p className="text-sm text-muted-foreground mt-8">No data available</p>
          </div>
        ) : (
          <ColumnGraph
            series={[{ name: 'Open', data: openData }, { name: 'Closed', data: closedData }]}
            xCategories={severities}
            height={310}
            colors={['#FF0000', '#00c951']}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default SeverityOpenCloseDistribution;
