import { Skeleton } from '@/components/ui/skeleton';
import RePieChart from '@/components/custom/charts/reui/pie-chart';

const ClassificationPieChart = ({ data, isLoading }) => {
  if (isLoading) {
    return <Skeleton className="w-full h-[400px]" />;
  }

  const series = [
    data?.unClassifiedCount || 0,
    data?.safeCount || 0,
    data?.total_exposures || 0,
  ];
  const labels = ['Not Classified Yet', 'Safe', 'Risky'];

  return (
    <div className="w-full rounded-xl">
      <div className="flex w-full h-full items-center justify-center">
        <RePieChart
          title="Classification Coverage"
          series={series}
          labels={labels}
          height={350}
          isLoading={isLoading}
          colors={['#64748B', '#10B981', '#EF4444']} // slate-500, emerald-500, red-500
        />
      </div>
    </div>
  );
};

export default ClassificationPieChart;

