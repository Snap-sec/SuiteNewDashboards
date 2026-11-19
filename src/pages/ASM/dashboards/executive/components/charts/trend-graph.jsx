import ReAreaChart from '@/components/custom/charts/reui/area-chart';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

function TrendGraph({ data = [], isLoading, filter, setFilter }) {
  const chartData = data.map(item => {
    let label = item.date;
    if (filter === 'daily' && item.date) {
      const parts = item.date.split('-');
      if (parts.length === 3) {
        const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        label = format(date, 'MMM dd');
      }
    }
    return {
      date: label,
      'Total Assets': item.assets || 0,
      'Risks': item.risks || 0,
    };
  });

  if (isLoading) {
    return <Skeleton className="w-full h-full rounded-xl" />;
  }

  return (
    <ReAreaChart
      data={chartData}
      xKey="date"
      keys={[
        { key: 'Total Assets', label: 'Total Assets' },
        { key: 'Risks', label: 'Risks' },
      ]}
      colors={['#3b82f6', '#ef4444']}
      height={350}
      isLoading={isLoading}
      stacked={false}
      title="Asset vs Risk Trend"
      xTickFormatter={(v) => String(v)}
    />
  );
}

export default TrendGraph;

