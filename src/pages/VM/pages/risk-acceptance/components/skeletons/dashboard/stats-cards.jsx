import { Fragment } from 'react';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const DashboardStatsCardsSkeleton = () => {
  const items = Array.from({ length: 4 });

  const renderItem = (_, index) => {
    return (
      <Card key={index}>
        <CardContent className="p-0 flex flex-col justify-between h-full bg-cover rtl:bg-[left_top_-1.7rem] bg-[right_top_-1.7rem] bg-no-repeat channel-stats-bg">
          {/* Icon placeholder */}
          <div className="px-4 py-4">
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>

          {/* Text placeholders */}
          <div className="flex flex-col gap-2 pb-4 px-4">
            <Skeleton className="h-4 w-32" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-4 w-10" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Fragment>
      <style>
        {`
          .channel-stats-bg {
            background-image: url('${toAbsoluteUrl('/media/images/2600x1600/bg-3.png')}');
          }
          .dark .channel-stats-bg {
            background-image: url('${toAbsoluteUrl('/media/images/2600x1600/bg-3-dark.png')}');
          }
        `}
      </style>

      {items.map((item, index) => renderItem(item, index))}
    </Fragment>
  );
};

export default DashboardStatsCardsSkeleton;
