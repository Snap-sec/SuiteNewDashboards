import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DonutChart from '@/components/custom/charts/reui/donut-chart';

const severityColors = {
  critical: '#7f1d1d',
  high: '#ef4444',
  medium: '#f97316',
  low: '#eab308',
  info: '#3b82f6',
  none: '#6b7280',
};

const SeverityGraph = ({ title, asset }) => {
  const { chartData, colors } = useMemo(() => {
    if (!asset) return { chartData: [], colors: [] };

    const entries = [
      { key: 'critical', label: 'Critical', value: asset?.critical_open || 0 },
      { key: 'high', label: 'High', value: asset?.high_open || 0 },
      { key: 'medium', label: 'Medium', value: asset?.medium_open || 0 },
      { key: 'low', label: 'Low', value: asset?.low_open || 0 },
      { key: 'info', label: 'Info', value: asset?.info_open || 0 },
      { key: 'none', label: 'None', value: asset?.none_open || 0 },
    ].filter(item => item.value > 0);

    return {
      chartData: entries.map(({ label, value }) => ({ name: label, value })),
      colors: entries.map(({ key }) => severityColors[key] || '#6b7280'),
    };
  }, [asset]);

  const hasData = chartData.length > 0;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center items-center px-3 py-4">
        {hasData ? (
          <DonutChart
            data={chartData}
            colors={colors}
            showLegend={true}
            height={220}
            centerLabel="Total"
            className="border-none shadow-none p-0"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-[165px] text-muted-foreground">
            <p className="text-sm text-muted-foreground">No Data Available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export { SeverityGraph };
