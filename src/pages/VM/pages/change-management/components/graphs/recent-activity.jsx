import { Skeleton } from '@/components/ui/skeleton';
import LineChart from '@/components/custom/charts/line-chart';

const RecentActivity = ({ data = [{}], assetsLoading }) => {
  const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const formattedTimelineData = data?.reduce((acc, item) => {
    const day = days[new Date(item.updatedAt).getDay()];
    const found = acc.find((d) => d.date === day);
    found ? found.total++ : acc.push({ date: day, total: 1 });
    return acc;
  }, []);

  if (assetsLoading) {
    return <Skeleton className="w-full h-[400px]" />;
  }

  return (
    <LineChart
      timeline={formattedTimelineData}
      chartTitle="Recent Activties"
      lineHoverText="requests"
      height={330}
    />
  );
};

export default RecentActivity;
