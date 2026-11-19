import { LogIn, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TimelineItem } from '@/partials/activities/timeline-item';
import { formatDistanceToNow } from 'date-fns';

const TimelineActivities = ({logs}) => {

  console.log(logs)
  return (
      logs?.map((log, index) => (
        <TimelineItem icon={log?.log.includes("error") ? ShieldAlert : LogIn} line={true}>
          <div className="flex flex-col">
            <div className="text-sm text-foreground font-medium">
              {log?.log}
            </div>
            <span className="text-xs text-secondary-foreground">
             {formatDistanceToNow(new Date(log?.createdAt), { addSuffix: true })}
            </span>
          </div>
        </TimelineItem>
      ))
  );
};

export { TimelineActivities };
