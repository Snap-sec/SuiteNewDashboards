import { useState } from 'react';
import { useAuth } from '@/auth/context/auth-context';
import { format } from 'date-fns';
import {
  Activity,
  ChevronsRight,
  FolderGit2,
  Info,
  MessageSquare,
  OctagonAlert,
  Trash2,
  UserPen,
} from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge, BadgeDot } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DateFormatter } from '@/components/custom/date-formatter';
import NumberLables from '@/components/custom/number-lables';
import PaginationView from '@/components/custom/pagination';
import AuthorityGuard from '../../../../../components/custom/authority-guard/AuthorityGuard';
import { Profile } from '../../../../../components/custom/profile';
import {
  useDeleteVmAssessmentActivityMutation,
  useGetVmAssessmentActivityQuery,
} from '../../../../../services/vm/assessmentsApi';
import { Blocker } from '../../vulnerability-report/components/activities/blocker';
import { Comment } from '../../vulnerability-report/components/activities/comment';
import { Revalidation } from '../../vulnerability-report/components/activities/revalidation';
import { StateChange } from '../../vulnerability-report/components/activities/state-change';
import TimelineItem from '../../vulnerability-report/components/activities/timeline-item';
import AssessmentActivityInput from '../components/assessment-activity-input';
import ApiErrorHandler from '../../../../../components/common/api-error-handler';

const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

function ActivityTab({ assessmentId }) {
  const [pagination, setPagination] = useState({
    pageIndex: 0, // 0-based
    pageSize: 12,
  });

  const { data, isLoading, isError, error } = useGetVmAssessmentActivityQuery({
    assessmentId,
    params: {
      page: pagination?.pageIndex + 1, // convert to 1-based
      limit: pagination?.pageSize,
    },
  });

  const { user } = useAuth();
  const [deleteActivity, { isLoading: isDeletingActivity }] =
    useDeleteVmAssessmentActivityMutation();
  const [activityToDelete, setActivityToDelete] = useState(null);

  const handleDelete = async () => {
    if (!activityToDelete) return;

    toast.promise(
      deleteActivity({
        assessmentId,
        activityId: activityToDelete._id,
        entityType: activityToDelete.entityType,
        entityId: activityToDelete.entityId,
      }).unwrap(),
      {
        loading: 'Deleting Comment...',

        success: () => {
          setActivityToDelete(null);
          return 'Comment Deleted Successfully';
        },

        error: (err) => err?.data?.message || 'Error Deleting Comment',
      },
    );
  };

  if (!isError && isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-grow">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) return <ApiErrorHandler error={error}/>

  const activities = data?.data?.activities || [];

  // if (activities.length === 0) {
  //   return (
  //     <div className="text-center py-10 text-muted-foreground">
  //       No activity recorded yet for this assessment.
  //     </div>
  //   );
  // }

  const renderActivityItem = (activity, index) => {
    const isVuln = activity.entityType === 'Vulnerability';
    const actorName = activity.actor?.name || activity.name || 'System';
    const activityDate = activity.createdAt || activity.date;
    const activityText = activity.text || activity.commentText;

    if (activity.commentType === 'blocker:created') {
      return (
        <TimelineItem
          key={index}
          userId={activity.actor?.userId || activity.ownerId}
          userName={actorName}
          email={activity.actor?.email || activity.email}
          line={index !== activities.length - 1}
          icon={OctagonAlert}
          iconClassName="bg-red-500/10 text-red-500 border-red-500/20"
        >
          <div className="flex flex-col w-full pb-2">
            <p className="text-sm text-foreground mt-1 font-medium">
              Created a blocker:{' '}
              {activity.blockerId?.title || activity.text || 'Untitled Blocker'}
            </p>
            <span className="text-xs text-secondary-foreground mt-1">
              {actorName} - <DateFormatter date={activityDate} />
            </span>
          </div>
        </TimelineItem>
      );
    } else if (activity.commentType === 'revalidation_added') {
      return <Revalidation key={index} activity={activity} />;
    } else if (
      activity.action === 'comment' ||
      activity.commentType === 'text'
    ) {
      return (
        <Comment
          key={index}
          activity={activity}
          text={activity}
          assessmentId={assessmentId}
          vulnId={activity.entityId}
          attachments={activity.attachment}
          readOnly={!isOwner(activity)}
          onDelete={() => setActivityToDelete(activity)}
          isDeletingActivity={isDeletingActivity}
        />
      );
    } else if (activity.action === 'state_change' || activity.stateChange) {
      return (
        <StateChange
          key={index}
          heading={`${actorName} updated the ${isVuln ? 'Vulnerability' : 'Assessment'}`}
          datetime={activityDate}
          title={activityText}
          stateFrom={activity.previous_value || activity.stateChangedFrom}
          stateTo={activity.new_value || activity.stateChangedTo}
          ownerId={activity.actor?.userId || activity.ownerId}
          name={actorName}
          resolutionReason={activity.resolutionReason}
        />
      );
    }

    return (
      <TimelineItem
        key={index}
        userId={activity.actor?.userId || activity.ownerId}
        userName={actorName}
        email={activity.actor?.email || activity.email}
        line={index !== activities.length - 1}
      >
        <div className="flex flex-col w-full pb-2 ml-2">
          <p className="text-sm text-foreground mt-1">{activityText}</p>
          <span className="text-xs text-secondary-foreground mt-2">
            {actorName} - <DateFormatter date={activityDate} />
          </span>
        </div>
      </TimelineItem>
    );
  };

  const isOwner = (activity) => {
    // Check if current user is the owner of the activity
    // Activity ownerId or userId should match user.id or user._id
    if (!user) return false;
    const activityUserId =
      activity.ownerId || activity.userId || activity.actor?.userId;
    const currentUserId = user._id || user.id; // Adjust based on user object structure
    return (
      activityUserId &&
      currentUserId &&
      activityUserId.toString() === currentUserId.toString()
    );
  };



  return (
    <div className="px-3 py-4">
      <AuthorityGuard forbidRoles={['Auditor']}>
        <div className="mb-6">
          <AssessmentActivityInput className='!px-0' assessmentId={assessmentId} />
        </div>
      </AuthorityGuard>

      <div className="">
        {activities.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No activity recorded yet for this assessment.
          </div>
        ) : (
          activities.map((activity, index) =>
            renderActivityItem(activity, index),
          )
        )}
      </div>

      <AlertDialog
        open={!!activityToDelete}
        onOpenChange={(open) => !open && setActivityToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot
              be undone
              {activityToDelete?.attachment?.length > 0
                ? ' and will permanently delete the associated attachment.'
                : '.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {data?.data?.total > 0 && (
        <div className="mt-8 flex justify-end">
          <PaginationView
            currentPage={pagination.pageIndex + 1}
            totalPages={data?.data?.totalPages || 1}
            className="w-auto mx-0"
            onPageChange={(newPage) => {
              setPagination((prev) => ({
                ...prev,
                pageIndex: newPage - 1,
              }));
            }}
          />
        </div>
      )}
    </div>
  );
}

export default ActivityTab;
