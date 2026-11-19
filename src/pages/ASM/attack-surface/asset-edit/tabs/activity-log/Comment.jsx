import { MessageSquare } from 'lucide-react';
import { DateFormatter } from "@/components/custom/date-formatter";
import TimelineItem from './TimelineItem';
import DeleteComment from './actions/delete-comment';

const Comment = ({ activity, onDelete, isDeleting = false }) => {
  const commentText = activity.message || activity.commentText || activity.text;
  const userName = activity.user?.name || activity.name || 'User';
  const userEmail = activity.user?.email || null;
  const date = activity.createdAt || activity.date;
  const userId = activity.user?._id || activity.userId;

  const hasUserProfile = Boolean(activity.user || userId);

  return (
    <TimelineItem
      icon={hasUserProfile ? null : MessageSquare}
      iconClassName={hasUserProfile ? undefined : "bg-blue-500/10 text-blue-500 border-blue-500/20"}
      line={true}
      userName={userName}
      email={userEmail}
      userId={userId}
    >
      <div className="flex items-start justify-between gap-4 group">
        <div className="flex flex-col">
          <p className="text-sm break-all text-foreground">
            {commentText}
          </p>
          <span className="text-xs text-secondary-foreground">
            {userName && <span className="text-muted-foreground">{userName}</span>} - <DateFormatter date={date} />
          </span>
        </div>

        {onDelete && (
          <DeleteComment onDelete={onDelete} isDeleting={isDeleting} />
        )}
      </div>
    </TimelineItem>
  );
};


export default Comment;
