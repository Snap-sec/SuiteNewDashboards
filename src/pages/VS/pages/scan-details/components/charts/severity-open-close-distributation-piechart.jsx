import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import RePieChart from '@/components/custom/charts/reui/pie-chart';

function Chart({ data = {}, isLoading }) {
  // Extract asset_health data from raw API data
  const assetHealthData = data?.charts?.asset_health?.data || {};

  const series = [
    assetHealthData?.['safe_assets'] ?? 0,
    assetHealthData?.['vulnerable_assets'] ?? 0,
  ];
  const labels = ['Safe Assets', 'Vulnerable Assets'];
  const colors = ['#00E396', '#FF4560'];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Vulnerable Vs Safe Asset</CardTitle>
      </CardHeader>

      <CardContent className="flex items-center justify-center">
        <RePieChart
          series={series}
          labels={labels}
          colors={colors}
          height={300}
          isLoading={isLoading}
          noCard={true}
        />
      </CardContent>
    </Card>
  );
}

export default Chart;

