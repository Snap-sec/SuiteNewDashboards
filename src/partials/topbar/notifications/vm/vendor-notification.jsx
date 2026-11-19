import { ArrowUpRight, Store } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Avatar,
} from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Profile } from '../../../../components/custom/profile';

export default function VendorNotification({ notification }) {
  const isSystem = !notification.actor;
  const eventAction = notification.event_key?.split('.')[2] || 'created';

  const userName = notification.actor?.name || 'System';
  const avatar = notification.actor?.avatar || '300-10.png';
  const badgeColor = notification.seen ? 'offline' : 'online';

  const targetLink = '/vm/service-vendors';
  const targetTitle = notification.target?.title || 'Vendor';

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

  const renderTitleContent = () => {
    let actionText = 'created the vendor';
    if (eventAction === 'updated' || eventAction === 'update')
      actionText = 'updated the vendor';
    if (eventAction === 'deleted' || eventAction === 'delete')
      actionText = 'deleted the vendor';

    const actorLabel = isSystem ? (
      <span className="text-secondary-foreground font-semibold mr-1">
        Vulnerability Scan
      </span>
    ) : (
      <span className="hover:text-primary text-mono font-bold text-slate-800 dark:text-slate-200 mr-1">
        {userName}
      </span>
    );

    return (
      <div className="flex flex-col gap-1 w-full min-w-0">
        <div className="text-sm font-medium leading-normal text-secondary-foreground">
          {actorLabel}
          <span className="text-muted-foreground mr-1">{actionText}</span>
          <Link
            to={targetLink}
            className="hover:text-primary text-primary font-semibold"
          >
            {targetTitle}
          </Link>
        </div>
      </div>
    );
  };

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
        <div className="flex flex-col gap-1 min-w-0">
          {renderTitleContent()}
          <span className="flex items-center text-xs font-medium text-muted-foreground">
            {date}
            <span className="rounded-full size-1 bg-mono/30 mx-1.5"></span>
            {specialist}
          </span>
        </div>

        {/* Tailored Vendor Portal card */}
        {/* {eventAction !== 'deleted' && (
          <Card className="shadow-none flex flex-row items-center justify-between gap-2.5 p-3 rounded-lg bg-primary/[0.02] border border-primary/10 min-w-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Store className="h-5 w-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">
                  Vendor Profile
                </span>
                <span className="font-semibold text-secondary-foreground text-sm truncate">
                  {targetTitle}
                </span>
              </div>
            </div>

            <Link
              to={targetLink}
              className="flex h-8 items-center justify-center rounded-md border border-border bg-background px-3 text-xs font-medium text-secondary-foreground hover:bg-muted hover:text-primary transition-colors gap-1"
            >
              Manage
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </Card>
        )} */}
      </div>
    </div>
  );
}
