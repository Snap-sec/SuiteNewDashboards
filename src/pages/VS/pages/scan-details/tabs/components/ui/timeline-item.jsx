import { Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TimelineItem } from '@/partials/activities/timeline-item';

const TimelineItems = ({item}) => {
  return (
    <TimelineItem icon={Users} line={true}>
      <div className="flex flex-col">
        <div className="text-sm text-foreground">
         {item?.message}
        </div>
        <span className="text-xs text-secondary-foreground">
          {item?.createdAt ? new Date(item?.createdAt).toLocaleString() : 'Unknown'}
        </span>
      </div>
    </TimelineItem>
  );
};

export { TimelineItems };
