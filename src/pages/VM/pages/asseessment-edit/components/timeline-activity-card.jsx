import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDateTime } from '../../../../../lib/helpers';
import { Profile } from '@/components/custom/profile';

function TimelineActivityCard({ timelineData }) {

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Timeline</CardTitle>
      </CardHeader>

      <CardContent className=" space-y-2">
        <div>
          <span className="leading-none font-medium text-sm text-mono">
            Assessment State:{' '}
            <span className="text-sm text-secondary-foreground font-normal">
              {timelineData?.state}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="leading-none font-medium text-sm text-mono shrink-0">
            Initated By:
          </span>
          <Profile
            email={timelineData?.activity[0]?.email}
            name={timelineData?.activity[0]?.name}
            size="28px"
          />
        </div>
        <div>
          <span className="leading-none font-medium text-sm text-mono">
            Reason:{' '}
            <span className="text-sm font-normal text-secondary-foreground">
              {timelineData?.pauseReason}
            </span>
          </span>
        </div>

        <div>
          <span className="leading-none font-medium text-sm text-mono">
            Date & Time:{' '}
            <span className="text-sm font-normal text-secondary-foreground">
              {formatDateTime(timelineData?.updatedAt)}
            </span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default TimelineActivityCard;
