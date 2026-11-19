import { Link } from 'react-router-dom';
import {
  Avatar,
} from '@/components/ui/avatar';
import { Profile } from '../../../../components/custom/profile';

export default function ChangeRequestNotification({ notification }) {
  const userName = notification.actor?.name || 'System';
  const avatar = notification.actor?.avatar || '300-10.png';
  const badgeColor = notification.seen ? 'offline' : 'online';

  const targetLink = `/vm/assessment-edit?assessmentId=${notification?.target?.id}`;
  const targetTitle = notification.target?.title || 'Assessment';

  const isUpdated = notification.event_key.startsWith(
    'vm.change_request.update',
  );
  const isCreated = notification.event_key.startsWith(
    'vm.change_request.create',
  );

  const date =
    notification.context?.timestamp ||
    (() => {
      if (!notification.createdAt) return 'Recent';
      try {
        const d = new Date(notification.createdAt);
        if (isNaN(d.getTime())) return 'Recent';
        return d.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });
      } catch (e) {
        return 'Recent';
      }
    })();

  const specialist = (notification.origin || 'vm').toUpperCase();

  return (
    <div
      className="flex grow gap-2.5 px-5 py-2"
    >
      <div className="flex items-start gap-1.5 shrink-0 mt-0.5">
        <div className="flex items-center justify-center w-1.5 mt-2.5">
          {!notification?.seen && (
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
          )}
        </div>
        <Avatar>
          {/* <AvatarImage src={`/media/avatars/${avatar}`} alt="avatar" />
          <AvatarFallback>
            {userName.substring(0, 2).toUpperCase()}
          </AvatarFallback> */}
          <Profile
            userId={notification.actor?.id}
            name={notification.actor?.name}
            email={notification.actor?.email}
            size="30px"
          />
        </Avatar>
      </div>

      <div className="flex flex-col gap-3 grow min-w-0">
        <div className="flex flex-col gap-1 w-full min-w-0">
          <div className="text-sm font-medium leading-normal text-secondary-foreground flex items-center flex-wrap">
            <span className="hover:text-primary text-mono font-bold text-slate-800 dark:text-slate-200 mr-1">
              {userName}
            </span>
            <span className="text-muted-foreground mr-1">
              {isCreated && 'created the change request'}
              {isUpdated && 'updated the change request'}
            </span>
            <Link
              to={targetLink}
              title={targetTitle}
              className="hover:text-primary text-primary font-semibold text-xs leading-normal line-clamp-1 break-words max-w-full inline-block"
            >
              {targetTitle}
            </Link>
          </div>
          <span className="flex items-center text-xs font-medium text-muted-foreground">
            {date}
            <span className="rounded-full size-1 bg-mono/30 mx-1.5"></span>
            {specialist}
          </span>
        </div>


      </div>
    </div>
  );
}
