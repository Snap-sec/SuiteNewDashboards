import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import {
  useAddAimAssetTimelineActivityMutation,
  useDeleteAimAssetTimelineActivityMutation,
  useGetAimAssetDetailsTimelineQuery,
} from '@/services/asset-inventory/assets/assetsApi';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { ContentLoader } from '@/components/common/content-loader';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import { DateFormatter } from '@/components/custom/date-formatter';
import AssetActivityInput from './AssetActivityInput';
import Comment from './Comment';
import StateChange from './StateChange';
import TimelineItem from './TimelineItem';
import PaginationView from '@/components/custom/pagination';

function ActivityTab() {
  const { id } = useParams();
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const {
    data: timelineData,
    isLoading,
    isFetching,
    isError,
  } = useGetAimAssetDetailsTimelineQuery({
    id,
    params: {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    },
  });
  const [addActivity] = useAddAimAssetTimelineActivityMutation();
  const [deleteActivity, { isLoading: isDeletingActivity }] =
    useDeleteAimAssetTimelineActivityMutation();

  const handleAddComment = async (newComment) => {
    try {
      await toast.promise(
        addActivity({
          id,
          body: {
            event: 'comment',
            commentText: newComment.text,
            mentions: newComment.mentions,
            attachments: newComment.attachments,
          },
        }).unwrap(),
        {
          loading: 'Adding comment...',
          success: 'Comment added successfully',
          error: 'Failed to add comment',
        },
      );
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  const handleDeleteComment = (activityId) => {
    toast.promise(deleteActivity({ id, activityId }).unwrap(), {
      loading: 'Deleting comment...',
      success: 'Comment deleted successfully',
      error: 'Failed to delete comment',
    });
  };

  const localActivities = timelineData?.timeline || [];

  const renderActivityItem = (activity, index) => {
    // Determine the type of activity and render accordingly
    if (activity.event === 'comment' || activity.action === 'comment') {
      return (
        <Comment
          key={activity._id || index}
          activity={activity}
          isDeleting={isDeletingActivity}
          onDelete={() => handleDeleteComment(activity._id || activity.id)}
        />
      );
    } else if (
      activity.event === 'state_changed' ||
      activity.event === 'state_change'
    ) {
      return <StateChange key={index} activity={activity} />;
    }

    const userName = activity.user?.name || activity.name || 'System';
    const userEmail = activity.user?.email || null;
    const date = activity.createdAt || activity.date;
    const message =
      activity.message ||
      activity.commentText ||
      activity.title ||
      activity.text;

    return (
      <TimelineItem
        key={index}
        userName={userName}
        email={userEmail}
        userId={activity.userId}
        line={index !== localActivities.length - 1}
      >
        <div className="flex flex-col gap-1 py-1">
          <span className="text-sm font-medium text-foreground">{message}</span>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {userName && <span className="font-medium text-secondary-foreground">{userName}</span>}
            {userEmail && <span>({userEmail})</span>}
            <span>·</span>
            <DateFormatter date={date} />
          </div>
        </div>
      </TimelineItem>
    );
  };

  if (isLoading || isFetching) {
    return (
      <div className="px-6 py-4 animate-pulse">
        {/* Comment Input Box Skeleton */}
        <div className="mb-8">
          <div className="flex gap-3">
            <Skeleton className="size-9 rounded-full shrink-0" />
            <div className="flex-1 flex flex-col gap-2">
              <Skeleton className="h-20 w-full rounded-md border border-border" />
              <div className="flex justify-between items-center mt-1">
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16 rounded" />
                  <Skeleton className="h-6 w-16 rounded" />
                </div>
                <Skeleton className="h-8 w-24 rounded-md" />
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Items List Skeletons */}
        <div className="relative border-l border-border pl-6 ml-4.5 space-y-6">
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
    <div className="px-4 flex flex-col gap-6  border rounded-2xl">
      {/* Comment Input */}
      <AuthorityGuard forbidRoles={['Auditor']}>
        <AssetActivityInput onSend={handleAddComment} />
      </AuthorityGuard>

      {/* Timeline */}
      <div>
        {localActivities.length > 0 && (
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4">Activity</p>
        )}
        <ScrollArea className="h-fit">
          <div className="space-y-0">
            {localActivities.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">
                No activity recorded yet for this asset.
              </div>
            ) : (
              localActivities.map((activity, index) =>
                renderActivityItem(activity, index),
              )
            )}
          </div>
        </ScrollArea>
      </div>

      {timelineData?.pagination?.totalPages > 1 && (
        <div className="flex justify-end py-4">
          <PaginationView
            currentPage={pagination.pageIndex + 1}
            totalPages={timelineData.pagination.totalPages}
            onPageChange={(newPage) => {
              setPagination((prev) => ({
                ...prev,
                pageIndex: newPage - 1,
              }));
            }}
            className="w-auto mx-0"
          />
        </div>
      )}
    </div>
  );
}

export default ActivityTab;
