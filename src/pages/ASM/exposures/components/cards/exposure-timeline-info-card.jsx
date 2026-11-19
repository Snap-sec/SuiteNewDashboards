import React from 'react';
import { DateFormatter } from '@/components/custom/date-formatter';
import { StateLabels } from '@/components/custom/state-labels';
import { Badge, BadgeDot } from '@/components/ui/badge';
import NumberLables from '@/components/custom/number-lables';
import { Profile } from '@/components/custom/profile';
import TimelineItem from './timeline-item';

function TimelineCard({
  commentText = '',
  date = '',
  userId,
  owner,
  stateChangedFrom,
  stateChangedTo,
  isStateChnage,
  line = true,
}) {
  const renderBadge = (state) => {
    if (!state) return state;

    if (typeof state === 'number' || !isNaN(parseFloat(state))) {
      return <NumberLables score={parseFloat(state)} />;
    }

    if (state === 'None' || state === 'none' || state.includes?.('@')) {
      return (
        <Badge size="sm" variant="secondary" appearance="outline">
          <BadgeDot className="text-success" /> {state}
        </Badge>
      );
    }

    if (
      [
        'In Progress',
        'In Review',
        'Not Applicable',
        'False Positive',
        'Unresolved',
        'Resolved',
        'Re Test',
        'Duplicate',
        'None',
      ].includes(state)
    ) {
      return <StateLabels state={state} />;
    }

    return (
      <p
        className={`text-xs px-2 py-0.5 bg-muted rounded-md border ${state === 'true' ? 'text-green-500' : 'text-red-500'} `}
      >
        <BadgeDot className="text-secondary" /> {state}
      </p>
    );
  };

  const hasAvatar = (userId || owner) && owner?.toLowerCase() !== 'system';

  return (
    <TimelineItem
      line={line}
      avatar={
        hasAvatar ? (
          <Profile
            userId={userId}
            name={owner}
            graphicsUserName={owner}
            showName={false}
            size="36px"
            avatarSize={36}
          />
        ) : null
      }
      userName={owner}
      userId={userId}
    >
      <div className="flex flex-col gap-1 pt-1">
        <div className="text-sm font-medium text-foreground leading-snug">
          {commentText || 'Activity note'}
        </div>

        <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
          <span>{owner || 'Unknown'}</span>
          <span className="text-xs text-secondary-foreground">
            <DateFormatter date={date} />
          </span>
        </div>

        {isStateChnage && (
          <div className="mt-2 bg-muted/40 border border-border/50 p-2 rounded-md flex items-center font-medium gap-1.5 text-xs flex-wrap">
            <span className="text-muted-foreground">
              {!stateChangedTo?.includes?.('@') ? 'State Changed From' : 'Changed from'}
            </span>
            {renderBadge(stateChangedFrom)}
            <span className="text-muted-foreground">to</span>
            {renderBadge(stateChangedTo)}
          </div>
        )}
      </div>
    </TimelineItem>
  );
}

export default TimelineCard;
