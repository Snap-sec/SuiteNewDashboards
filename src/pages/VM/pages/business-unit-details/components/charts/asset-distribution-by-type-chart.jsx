import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReBarChart from '../../../../../../components/custom/charts/reui/bar-chart';

function AssetDistributionByTypeChart({ data = [] }) {
  const chartData = data?.map(item => ({
    type: item.label,
    Count: item.count
  })) || [];

  const keys = [
    { key: 'Count', label: 'Count' }
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-normal">Asset Distribution by Type</CardTitle>
      </CardHeader>
      <CardContent>
        <ReBarChart
          data={chartData}
          xKey="type"
          keys={keys}
          colors={['#008FFB']}
          height={300}
          xTickFormatter={(v) => String(v)}
          noCard={true}
        />
      </CardContent>
    </Card>
  );
}

export default AssetDistributionByTypeChart;
