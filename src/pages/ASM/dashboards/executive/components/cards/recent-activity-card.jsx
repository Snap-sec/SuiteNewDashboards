import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TimelineItem } from '@/partials/activities/timeline-item';
import { History } from 'lucide-react';
import { DateFormatter } from '../../../../../../components/custom/date-formatter';
import { Skeleton } from '@/components/ui/skeleton';

function RecentActivity({ data = [], isLoading }) {
  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col px-3 py-1 p-4 h-[300px]">
          {[...Array(3)].map((_, i) => (
            <TimelineItem icon={History} line={i !== 2} key={i}>
              <Card className="shadow-none">
                <CardContent className="lg:py-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-3 w-full" />
                  </div>
                </CardContent>
              </Card>
            </TimelineItem>
          ))}
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col px-3 py-1 p-4 h-[300px] kt-scrollable-x-auto">
        {data.length === 0 ? (
          <p className="text-center text-gray-500 py-6 mt-20">No recent activities available.</p>
        ) : (
          data.map((item, index) => (
            <TimelineItem icon={History} line={true} key={index}>
              <Card className="shadow-none">
                <CardContent className="lg:py-4">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">{item?.title}</p>
                      <p className="text-xs text-secondary-foreground">
                        <DateFormatter date={item?.createdAt} />
                      </p>
                    </div>
                    <p className="flex items-center gap-2 text-sm font-normal text-muted-foreground">
                      {item?.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TimelineItem>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export default RecentActivity;
