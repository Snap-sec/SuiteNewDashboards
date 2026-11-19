import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import ColumnChart from '@/components/custom/charts/column-graph';
import DetailedHoverPopover from '@/components/custom/detailed-popover';
import { CircleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
const severityColors = {
  critical: '#7f1d1d',
  high: '#ef4444',
  medium: '#f97316',
  low: '#eab308',
  info: '#3b82f6',
};

const VulnerabilityDistributionChart = ({
  statsData = {},
  statsLoading,
}) => {
  const { chartData, colors } = useMemo(() => {
    if (!statsData || Object.keys(statsData).length === 0) return { chartData: [], colors: [] };

    const filtered = Object.entries(statsData)
      .filter(([key, value]) => key !== 'total' && value > 0)
      .map(([key, value]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value,
        key,
      }));

    const dynamicColors = filtered.map(item => severityColors[item.key.toLowerCase()] || '#3b82f6');

    return { chartData: filtered, colors: dynamicColors };
  }, [statsData]);

  const isEmpty = chartData.length === 0;

  return (
    <div className="w-full rounded-xl p-4 bg-card border border-border shadow-xs">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-medium flex items-center gap-2">
            Vulnerability Severity Distribution
            <DetailedHoverPopover
                buttonText={
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground">
                    <CircleAlert className="h-4 w-4" />
                  </Button>
                }
                showBadge={false}
                popoverTitle="About this Graph"
                popoverContent={
                  <p className="text-muted-foreground">This graph details the severity distribution of vulnerabilities associated with employees.</p>
                }
            />
        </h2>
      </div>

      {isEmpty && !statsLoading ? (
        <div className="flex flex-col justify-center items-center h-[300px] text-muted-foreground text-sm">
          <p>No data available</p>
        </div>
      ) : (
        <div className="flex justify-center items-center h-full">
          <ColumnChart
            data={chartData}
            colors={colors}
            isLoading={statsLoading}
          />
        </div>
      )}
    </div>
  );
};

export default VulnerabilityDistributionChart;
