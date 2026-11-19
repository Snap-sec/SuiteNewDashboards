import React from 'react';
import { Link } from 'react-router-dom';
import { Cable, Unplug, RefreshCw } from 'lucide-react';
import { Profile } from '@/components/custom/profile';

export default function StrikeIntegrationNotification({ notification }) {
  if (!notification) return null;

  const isSystem = !notification.actor || notification.actor?.id === 'system';
  const parts = notification.event_key?.split('.') || [];
  const action = parts[parts.length - 1] || 'install';

  const userName = notification.actor?.name || 'Strike Engine';
  const targetLink = notification.target?.url || notification.resourceUrl || '/apt/integrations';
  const targetTitle = notification.target?.title || notification.title || 'Integration';

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

  const info = 'STRIKE';

  const getActionDetails = () => {
    switch (action) {
      case 'install':
        return {
          text: 'connected integration',
          icon: (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <Cable className="h-5 w-5" />
            </div>
          ),
        };
      case 'update':
        return {
          text: 'updated integration',
          icon: (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
              <RefreshCw className="h-5 w-5" />
            </div>
          ),
        };
      case 'delete':
        return {
          text: 'disconnected integration',
          icon: (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20">
              <Unplug className="h-5 w-5" />
            </div>
          ),
        };
      default:
        return {
          text: 'configured integration',
          icon: (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20">
              <Cable className="h-5 w-5" />
            </div>
          ),
        };
    }
  };

  const { text: actionText, icon: actionIcon } = getActionDetails();

  return (
    <div className="flex grow gap-2.5 px-5 py-2">
      <div className="flex items-start gap-1.5 shrink-0 mt-0.5">
        <div className="flex items-center justify-center w-1.5 mt-2.5">
          {!notification?.seen && (
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
          )}
        </div>
        {isSystem ? (
          actionIcon
        ) : (
          <Profile
            userId={notification.actor?.id}
            name={notification.actor?.name}
            email={notification.actor?.email}
            size="32px"
            showName={false}
          />
        )}
      </div>

      <div className="flex flex-col gap-1.5 grow">
        <div className="text-sm font-medium leading-normal">
          <span className="text-foreground font-semibold mr-1">{userName}</span>
          <span className="text-secondary-foreground mr-1">{actionText}</span>
          <Link
            to={targetLink}
            className="hover:text-primary text-primary font-semibold hover:underline break-words"
          >
            {targetTitle}
          </Link>
        </div>

        {notification.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {notification.description}
          </p>
        )}

        <span className="flex items-center text-xs font-medium text-muted-foreground pt-0.5">
          {date}
          <span className="rounded-full size-1 bg-mono/30 mx-1.5"></span>
          {info}
        </span>
      </div>
    </div>
  );
}

