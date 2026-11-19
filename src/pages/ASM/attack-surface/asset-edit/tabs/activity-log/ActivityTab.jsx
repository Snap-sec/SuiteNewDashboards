import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetAsmAssetTimelineDataQuery } from '@/services/asm/attackSurfaceApi';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { DateFormatter } from '@/components/custom/date-formatter';
import PaginationView from '@/components/custom/pagination';
import StateChange from './StateChange';
import TimelineItem from './TimelineItem';
import { EmptyScreen } from '@/components/common/empty-screen';

function ActivityTab() {
  const params = useParams();
  const actualId = params.id || params.assetId;

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const {
    data: timelineData,
    isLoading,
    isError,
    isFetching
  } = useGetAsmAssetTimelineDataQuery(
    { assetId: actualId, page, limit: pageSize },
    { skip: !actualId }
  );

  const rawActivities = Array.isArray(timelineData?.data)
    ? timelineData.data
    : Array.isArray(timelineData?.timeline)
    ? timelineData.timeline
    : Array.isArray(timelineData)
    ? timelineData
    : [];

  const totalCount =
    timelineData?.total ||
    timelineData?.totalCount ||
    timelineData?.data?.total ||
    rawActivities.length;

  const totalPages =
    timelineData?.totalPages ||
    timelineData?.data?.totalPages ||
    Math.ceil(totalCount / pageSize);

  const isServerPaginated =
    timelineData?.totalPages !== undefined ||
    timelineData?.data?.totalPages !== undefined;

  const displayedActivities =
    !isServerPaginated && rawActivities.length > pageSize
      ? rawActivities.slice((page - 1) * pageSize, page * pageSize)
      : rawActivities;

  const renderActivityItem = (activity, index) => {
    if (
      activity.event === 'state_changed' ||
      activity.event === 'state_change'
    ) {
      return <StateChange key={index} activity={activity} />;
    }

    const userName = activity.user?.name || activity.name || 'System';
    const userEmail = activity.user?.email || null;
    const date = activity.createdAt || activity.date || activity.updatedAt;
    const title = activity.title || activity.message || 'Activity Logged';
    const description = activity.description || activity.text;

    return (
      <TimelineItem
        key={index}
        userName={userName}
        email={userEmail}
        userId={activity.userId}
        line={index !== displayedActivities.length - 1}
      >
        <div className="flex flex-col w-full pb-2">
          <p className="text-sm font-medium text-foreground mt-1">{title}</p>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs text-secondary-foreground">
              {userEmail && (
                <span className="mr-1">{userEmail}</span>
              )}
              <DateFormatter date={date} />
            </span>
            {activity.change_type && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full border border-border bg-muted/50 capitalize text-muted-foreground">
                {activity.change_type}
              </span>
            )}
          </div>
        </div>
      </TimelineItem>
    );
  };

  if (isLoading || isFetching) {
    return (
      <div className="px-6 py-4 animate-pulse">
        {/* Timeline Items List Skeletons */}
        <div className="relative border-l border-border pl-6 ml-4.5 space-y-6 mt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="relative flex gap-3">
              {/* Timeline marker node */}
              <div className="absolute -left-9.5 top-1 size-7 rounded-full bg-background border border-border flex items-center justify-center">
                <Skeleton className="size-5 rounded-full" />
              </div>
              <div className="flex-1 flex flex-col gap-2.5">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-28 rounded" />
                  <Skeleton className="h-3 w-16 rounded" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Skeleton className="h-3.5 w-full rounded" />
                  <Skeleton className="h-3.5 w-4/5 rounded" />
                </div>
                <Skeleton className="h-3 w-32 rounded mt-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-destructive text-sm">
        Failed to load activity timeline.
      </div>
    );
  }

  return (
    <div className="px-6 py-4 space-y-4">
      <ScrollArea className="h-[550px] pr-4">
        <div className="space-y-4">
          {displayedActivities.length === 0 ? (
            <div className="flex items-center justify-center h-full min-h-[300px]">
              <EmptyScreen
                title="No Activity Found"
                subTitle="No activity recorded yet for this asset."
              />
            </div>
          ) : (
            displayedActivities.map((activity, index) =>
              renderActivityItem(activity, index),
            )
          )}
        </div>
      </ScrollArea>

      {totalPages > 1 && (
        <div className="flex justify-end pt-2">
          <PaginationView
            currentPage={page}
            totalPages={totalPages}
            className="w-auto mx-0"
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      )}
    </div>
  );
}

export default ActivityTab;
