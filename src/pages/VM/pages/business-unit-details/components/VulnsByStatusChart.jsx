import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ColumnGraph from '@/components/custom/charts/column-graph';

function VulnByStatus({ data = {} }) {
  // data = { status1: count, status2: count, ... }

  const categories = Object.keys(data);

  const seriesData = [
    {
      name: 'Count',
      data: categories.map((c) => data[c] ?? 0),
    },
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Vulns by status</CardTitle>
      </CardHeader>

      <CardContent>
        <ColumnGraph
          series={seriesData}
          xCategories={categories}
          isLoading={false}
          height={300}
          colors={['#008FFB', '#00E396', '#FEB019']}
        />
      </CardContent>
    </Card>
  );
}

export default VulnByStatus;
