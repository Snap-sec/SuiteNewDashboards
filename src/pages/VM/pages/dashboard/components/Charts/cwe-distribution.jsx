import React, { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import ReBarChart from '@/components/custom/charts/reui/bar-chart';
import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DetailedHoverPopover from '@/components/custom/detailed-popover';

const KEYS = [{ key: 'count', label: 'Vulnerabilities' }];

import { CHART_COLORS } from '@/pages/VM/constants';
const COLORS = [CHART_COLORS[1]]; // Blue

const DistributionChart = ({ data = [], isLoading }) => {
  const chartData = useMemo(() => {
    return data?.slice(0, 10)?.map((item) => ({
      cwe: item?.cwe?.toUpperCase() || 'UNKNOWN',
      count: item?.count || 0,
    }));
  }, [data]);

  return (
    <ReBarChart
      data={chartData}
      xKey="cwe"
      keys={KEYS}
      colors={COLORS}
      title="CWE Distribution"
      titleBadge={
        <DetailedHoverPopover
          buttonText={
            <Button variant="ghost" size="sm">
              <CircleAlert className="h-4 w-4" />
            </Button>
          }
          showBadge={false}
          popoverTitle="About this Graph"
          popoverContent={
            <p className="text-muted-foreground">
              This chart displays the distribution of vulnerabilities across
              different Common Weakness Enumerations (CWEs). It helps identify
              the most prevalent types of security weaknesses in your
              environment.
            </p>
          }
        />
      }
      isLoading={isLoading}
      xTickFormatter={(v) => v}
      height={310}
      className="h-full"
      showYAxis={true}
      showBarLabel={true}
    />
  );
};

export default DistributionChart;
