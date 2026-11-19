import {
  AlertOctagon,
  Clock,
  PlayCircle,
  ShieldCheck,
  StopCircle,
  XCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Profile } from '../../../../components/custom/profile';

export default function WasScanNotification({ notification }) {
  if (!notification) return null;

  const isSystem = !notification.actor || notification.actor?.id === 'system';
  const parts = notification.event_key?.split('.') || [];
  const action = parts[parts.length - 1] || 'queued';

  const userName = notification.actor?.name || 'System';
  const badgeColor = notification.seen ? 'offline' : 'online';

  const targetLink = `/was/projects/${notification?.target?.id}?tab=scan-history`;
  const targetTitle = notification.target?.title || 'WAS Scan';

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

  const info = (notification.origin || 'apisec').toUpperCase();

  // Helper to get system status icon
  const getSystemIcon = () => {
    switch (action) {
      case 'completed':
        return (
          <div className="flex shrink-0 h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <ShieldCheck className="h-5 w-5" />
          </div>
        );
      case 'failed':
        return (
          <div className="flex shrink-0 h-10 w-10 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20">
            <AlertOctagon className="h-5 w-5" />
          </div>
        );
      case 'queued':
        return (
          <div className="flex shrink-0 h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Clock className="h-5 w-5" />
          </div>
        );
      case 'cancelled':
        return (
          <div className="flex shrink-0 h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <XCircle className="h-5 w-5" />
          </div>
        );
      case 'stopped':
        return (
          <div className="flex shrink-0 h-10 w-10 items-center justify-center rounded-full bg-slate-500/10 text-slate-500 border border-slate-500/20">
            <StopCircle className="h-5 w-5" />
          </div>
        );
      default:
        return (
          <div className="flex shrink-0 h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <PlayCircle className="h-5 w-5" />
          </div>
        );
    }
  };

  const getActionDescription = () => {
    switch (action) {
      case 'started':
        return 'manually launched the ';
      case 'queued':
        return 'queued a ';
      case 'completed':
        return 'completed the ';
      case 'failed':
        return 'failed the ';
      default:
        return 'updated the ';
    }
  };

  const renderTitleContent = () => {
    if (notification.title_html) {
      return (
        <div
          className="text-sm font-medium mb-px leading-normal text-secondary-foreground"
          dangerouslySetInnerHTML={{ __html: notification.title_html }}
        />
      );
    }

    if (isSystem) {
      let statusText = '';
      if (action === 'started') {
        statusText = 'was manually launched.';
      } else if (action === 'queued') {
        statusText = 'was queued.';
      } else if (action === 'completed') {
        statusText = 'was completed successfully.';
      } else if (action === 'failed') {
        statusText = 'failed.';
      } else if (action === 'stopped') {
        statusText = 'was stopped.';
      } else {
        statusText = 'was updated.';
      }

      return (
        <div className="text-sm font-medium mb-px leading-normal text-secondary-foreground">
          <Link
            to={targetLink}
            className="hover:text-primary text-primary font-semibold mr-1"
          >
            {targetTitle}
          </Link>
          <span className="text-secondary-foreground">{statusText}</span>
        </div>
      );
    }

    return (
      <div className="text-sm font-medium mb-px leading-normal text-secondary-foreground">
        <span className="hover:text-primary text-mono font-semibold mr-1">
          {userName}
        </span>
        <span className="text-secondary-foreground mr-1">
          {getActionDescription()}
        </span>
        <Link
          to={targetLink}
          className="hover:text-primary text-primary font-semibold"
        >
          {targetTitle}
        </Link>
      </div>
    );
  };

  const showButton =
    notification.context?.action_text || action === 'completed';
  const buttonText = notification.context?.action_text || 'View Findings';
  const buttonLink = targetLink;

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
        {isSystem ? (
          getSystemIcon()
        ) : (
          <Avatar>
            <Profile
              userId={notification.actor?.id}
              name={notification.actor?.name}
              email={notification.actor?.email}
              size="30px"
            />
          </Avatar>
        )}
      </div>

      <div className="flex flex-col gap-3.5 grow">
        <div className="flex flex-col gap-1">
          {renderTitleContent()}
          <span className="flex items-center text-xs font-medium text-muted-foreground">
            {date}
            <span className="rounded-full size-1 bg-mono/30 mx-1.5"></span>
            {info}
          </span>
        </div>

        {showButton && (
          <div className="flex flex-wrap gap-2.5">
            <Link to={buttonLink}>
              <Button size="sm" variant="mono">
                {buttonText}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
