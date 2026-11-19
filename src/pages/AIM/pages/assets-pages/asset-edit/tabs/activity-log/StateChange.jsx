import { RefreshCw, ChevronsRight } from 'lucide-react';
import TimelineItem from './TimelineItem';
import { DateFormatter } from "@/components/custom/date-formatter";

const StateChange = ({ activity }) => {
  const { message, title, name, createdAt, resolutionReason, previous, current, userId, user } = activity;
  const userName = user?.name || name || 'System';
  const displayMessage = message || title;

  return (
    <TimelineItem
      icon={RefreshCw}
      iconClassName="bg-purple-500/10 text-purple-500 border-purple-500/20"
      line={true}
      userName={userName}
      email={user?.email}
      userId={userId}
    >
      <div className="flex flex-col gap-1 py-1">
        {/* Event pill */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
            {displayMessage}
          </span>

          {previous && current && (
            <span className="inline-flex items-center gap-1 text-xs">
              <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">{previous}</span>
              <ChevronsRight size={12} className="text-muted-foreground" />
              <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 font-medium border border-purple-500/20">{current}</span>
            </span>
          )}
        </div>

        {resolutionReason && (
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">Reason:</span> {resolutionReason}
          </p>
        )}

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
          {userName && <span className="font-medium text-secondary-foreground">{userName}</span>}
          {user?.email && <span>({user.email})</span>}
          <span>·</span>
          <DateFormatter date={createdAt} />
        </div>
      </div>
    </TimelineItem>
  );
};

export default StateChange;
