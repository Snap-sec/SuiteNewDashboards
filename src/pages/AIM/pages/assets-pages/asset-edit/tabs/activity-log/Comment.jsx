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
      <div className="group rounded-xl border border-border/60 bg-card/60 px-4 py-3 shadow-sm hover:border-border transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">{userName}</span>
            {userEmail && (
              <span className="text-xs text-muted-foreground">({userEmail})</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              <DateFormatter date={date} />
            </span>
            {onDelete && (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <DeleteComment onDelete={onDelete} isDeleting={isDeleting} />
              </div>
            )}
          </div>
        </div>

        {/* Body */}
        <p className="text-sm text-foreground/90 leading-relaxed break-words whitespace-pre-wrap">
          {commentText}
        </p>
      </div>
    </TimelineItem>
  );
};

export default Comment;
