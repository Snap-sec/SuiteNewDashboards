import { Link } from 'react-router-dom';
import { toAbsoluteUrl } from '@/lib/helpers';
import {
  Avatar,
} from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Profile } from '../../../../components/custom/profile';

export default function VmReportNotification({ notification }) {
  const isSystem = !notification.actor;
  const parts = notification.event_key?.split('.') || [];
  const eventAction = parts[parts.length - 1] || 'create';

  const userName = notification.actor?.name || 'System';
  const avatar = notification.actor?.avatar || '300-10.png';
  const badgeColor = notification.seen ? 'offline' : 'online';

  const targetLink = notification.target?.url || '#';
  const targetTitle = notification.target?.title || 'Report';

  const isDeletedOrQueued =
    eventAction === 'deleted' ||
    eventAction === 'delete' ||
    eventAction === 'queued';

  const showCard = !isDeletedOrQueued;
  const showReportSuffix = !targetTitle.toLowerCase().includes('report');

  // Format date nicely, with robust fallback
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

  const getActionDescription = () => {
    switch (eventAction) {
      case 'create':
      case 'generated':
        return 'generated a new ';
      case 'delete':
      case 'deleted':
        return 'deleted the ';
      case 'queued':
        return 'queued a ';
      default:
        return 'updated the ';
    }
  };

  return (
    <div className="flex grow gap-2.5 px-5 py-2">
      <div className="flex items-start gap-1.5 shrink-0 mt-0.5">
        <div className="flex items-center justify-center w-1.5 mt-2.5">
          {!notification?.seen && (
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
          )}
        </div>
        <Avatar>
          {/* <AvatarImage src={`/media/avatars/${avatar}`} alt="avatar" /> */}
          <Profile
            userId={notification.actor?.id}
            // name={notification.actor?.name}
            // avatar={notification.actor?.avatar}
            email={notification.actor?.email}
            size="30px"
          />
          {/* <AvatarFallback>
            {userName.substring(0, 2).toUpperCase()}
          </AvatarFallback> */}
        </Avatar>
      </div>

      <div className="flex flex-col gap-3 grow min-w-0">
        <div className="flex flex-col gap-1 w-full min-w-0">
          <div className="text-sm font-medium mb-px">
            <span className="hover:text-primary text-mono font-semibold">
              {userName}{' '}
            </span>
            <span className="text-secondary-foreground">
              {getActionDescription()}
            </span>
            <Link
              to={targetLink}
              title={targetTitle}
              className="hover:text-primary text-primary font-semibold text-xs leading-normal line-clamp-1 break-words inline-block align-middle max-w-full mr-1"
            >
              {targetTitle}
            </Link>
            {showReportSuffix && (
              <span className="text-secondary-foreground">report</span>
            )}
          </div>
          <span className="flex items-center text-xs font-medium text-muted-foreground">
            {date}
            <span className="rounded-full size-1 bg-mono/30 mx-1.5"></span>
            {specialist}
          </span>
        </div>

        {/* Associated File/Report Card styled like Item4 */}
        {showCard && (
          <Card className="shadow-none flex items-center flex-row gap-2.5 p-2.5 rounded-lg bg-muted/60 border border-border/50 min-w-0">
            <img
              src={toAbsoluteUrl('/media/file-types/pdf.svg')}
              className="h-5 w-5 shrink-0"
              alt="report file"
            />

            <div className="flex flex-col grow min-w-0">
              <Link
                to={targetLink}
                title={targetTitle}
                className="hover:text-primary font-semibold text-secondary-foreground text-xs leading-normal truncate"
              >
                {targetTitle}.pdf
              </Link>
              <span className="text-[10px] text-muted-foreground/75 font-medium leading-none">
                {eventAction === 'create' || eventAction === 'generated'
                  ? 'Created and ready for download'
                  : 'Removed from server'}
              </span>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
