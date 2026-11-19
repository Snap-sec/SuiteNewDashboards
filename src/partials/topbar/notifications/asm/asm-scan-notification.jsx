import { AlertOctagon, ShieldCheck, StopCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Avatar,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Profile } from '../../../../components/custom/profile';

export default function AsmScanNotification({ notification }) {
  if (!notification) return null;

  const isSystem = !notification.actor;
  const parts = notification.event_key?.split('.') || [];
  const action = parts[parts.length - 1] || 'completed';

  const userName = notification.actor?.name || 'System';
  const avatar = notification.actor?.avatar || '300-1.png';
  const badgeColor =
    notification.context?.status === 'success' ||
    notification.context?.status === 'completed'
      ? 'online'
      : 'offline';

  const targetLink = notification.target?.url || '#';
  const targetTitle = notification.target?.title || 'Attack Surface Scan';

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

  const info = (notification.origin || 'asm').toUpperCase();

  // Helper to get system icon
  const getSystemIcon = () => {
    switch (action) {
      case 'completed':
        return (
          <div className="flex shrink-0 h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <ShieldCheck className="h-5 w-5" />
          </div>
        );
      case 'cancelled':
        return (
          <div className="flex shrink-0 h-10 w-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <XCircle className="h-5 w-5" />
          </div>
        );
      case 'failed':
        return (
          <div className="flex shrink-0 h-10 w-10 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20">
            <AlertOctagon className="h-5 w-5" />
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
          <div className="flex shrink-0 h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20">
            <ShieldCheck className="h-5 w-5" />
          </div>
        );
    }
  };

  const getActionDescription = () => {
    switch (action) {
      case 'started':
        return 'manually launched the ';
      case 'completed':
        return 'completed the ';
      case 'failed':
        return 'failed the ';
      default:
        return 'updated the ';
    }
  };

  // Helper to render customized scan message
  const renderTitleContent = () => {
    if (isSystem) {
      let statusText = '';
      if (action === 'started') {
        statusText = 'was manually launched.';
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
  const buttonLink = notification.target?.url || '/casm/scans';

  return (
    <div className="flex grow gap-2.5 px-5 py-2">
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
            {/* <AvatarImage src={`/media/avatars/${avatar}`} alt="avatar" />
            <AvatarFallback>
              {userName.substring(0, 2).toUpperCase()}
            </AvatarFallback> */}
            <Profile
              avatarSize="2.5rem"
              size="2.5rem"
              email={notification.actor?.email}
              userId={notification.actor?.id}
              name={userName}
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

        {/* High-quality contextual action buttons styled exactly like item-3 */}
        {/* {showButton && (
          <div className="flex flex-wrap gap-2.5">
            <Link to={buttonLink}>
              <Button size="sm" variant="mono">
                {buttonText}
              </Button>
            </Link>
          </div>
        )} */}
      </div>
    </div>
  );
}
