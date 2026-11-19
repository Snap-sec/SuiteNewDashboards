import { RefreshCw } from 'lucide-react';
import TimelineItem from './TimelineItem';
import { DateFormatter } from "@/components/custom/date-formatter";

import { ChevronsRight } from 'lucide-react';

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
      <div className="flex flex-col pb-2.5 gap-0.5">
        <span className="text-sm text-foreground font-medium">
          {displayMessage}
        </span>

        {resolutionReason && (
          <span className="text-xs text-muted-foreground mt-0.5">
            <span className="font-medium">Reason:</span> {resolutionReason}
          </span>
        )}
        <span className="text-xs text-secondary-foreground">
          {user?.email && <span className="text-muted-foreground">{user.email}</span>} - <DateFormatter date={createdAt} />
        </span>
      </div>
    </TimelineItem>
  );
};


export default StateChange;
