import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import PieChart from '@/components/custom/charts/pie-chart';

function OpenCloseDistribution({ data }) {

  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate async data fetch
    setTimeout(() => {
      setChartData([
        { name: 'Open', value: data?.open },
        { name: 'Close', value: data?.closed },
      ]);
      setLoading(false);
    }, 1500);
  }, [data]);

  return (
    <Card className="h-full w-full">
      <CardHeader>
        <CardTitle>Open/Close Vulnerabilities</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center">
        <PieChart
          data={chartData}
          // isLoading={loading}
          colors={['#FF4560', '#00E396', '#008FFB']}
          showLegend
          legendPosition="right"
          horizontalAlign="center"
        />
      </CardContent>
    </Card>
  );
}

export default OpenCloseDistribution;
