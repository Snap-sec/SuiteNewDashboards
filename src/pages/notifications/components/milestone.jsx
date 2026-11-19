import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TimelineItem } from './timeline-item';
import { DateFormatter } from '../../../components/custom/date-formatter';
import { useMarkNotificationAsSeenMutation } from '../../../services/notify/activityApi';
import { toast } from 'sonner';

const ActivitiesFollowersMilestone = ({data}) => {
console.log(data,"x");

  const [markNotificationSeen, {isLoading: isMarkingSeen}] = useMarkNotificationAsSeenMutation();

  const handleMarkNotificationAsSeen = () =>{
    toast.promise(markNotificationSeen({ notificationId: data?._id }).unwrap(), {
      loading: "Marking notification as Seen",
      success: "Notification marked as Seen",
      error: "Error marking notification as Seen"
    })
  }
  
  
  return (
    <TimelineItem icon={Bell} line={true} profileData={data?.actor || data?.createdBy} showProfilePic={true}>
      <div className={`flex justify-between p-2 ${!data.seen && 'bg-blue-100 dark:bg-[#152251] rounded-lg'}`}>
        <div className="flex flex-col">
          <div className="text-sm text-mono">
            {data?.title_html ? (
                <div dangerouslySetInnerHTML={{ __html: data.title_html }} />
            ) : (
                data?.title || data?.notification?.title || data?.context?.title
            )}
          </div>
          <div className="flex gap-2 items-center">
            <span className="text-xs text-secondary-foreground">
              {data?.description || data?.notification?.description || data?.context?.description}
            </span>
            {
              data?.resourceUrl &&
              <a href={data?.resourceUrl} className="text-primary text-[11px]">View Report</a>
            }
          </div>
        </div>

        <div className=' flex flex-col'>
        <span className="text-xs text-secondary-foreground">
            <DateFormatter date={data?.createdAt}/>
        </span>

        {/* Show when not seen */}
        {!data?.seen && <Button disabled={isMarkingSeen} onClick={handleMarkNotificationAsSeen} mode="link" underline="solid">
          Mark as seen
        </Button>}
        </div>
      </div>
    </TimelineItem>
  );
};

export { ActivitiesFollowersMilestone };
