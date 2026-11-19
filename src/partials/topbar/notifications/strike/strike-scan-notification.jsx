import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  AlertOctagon,
  StopCircle,
  PlayCircle,
  Trash2,
  Crosshair,
} from 'lucide-react';
import { Profile } from '@/components/custom/profile';

export default function StrikeScanNotification({ notification }) {
  if (!notification) return null;

  const isSystem = !notification.actor || notification.actor?.id === 'system';
  const parts = notification.event_key?.split('.') || [];
  const action = parts[parts.length - 1] || 'create';

  const userName = notification.actor?.name || 'Strike Engine';
  const targetLink = notification.target?.url || notification.resourceUrl || '/apt/scans';
  const targetTitle = notification.target?.title || notification.title || 'Strike Scan';

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
  const vulnCounts = notification.context?.vulnCounts;

  const getActionConfig = () => {
    switch (action) {
      case 'completed':
        return {
          text: 'scan completed for',
          icon: (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
          ),
        };
      case 'failed':
        return {
          text: 'scan failed on',
          icon: (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20">
              <AlertOctagon className="h-5 w-5" />
            </div>
          ),
        };
      case 'running':
        return {
          text: 'scan is now running on',
          icon: (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 animate-pulse">
              <PlayCircle className="h-5 w-5" />
            </div>
          ),
        };
      case 'cancelled':
        return {
          text: 'cancelled the scan on',
          icon: (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-500/10 text-slate-500 border border-slate-500/20">
              <StopCircle className="h-5 w-5" />
            </div>
          ),
        };
      case 'delete':
        return {
          text: 'deleted a scan from',
          icon: (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20">
              <Trash2 className="h-5 w-5" />
            </div>
          ),
        };
      case 'create':
      default:
        return {
          text: 'initiated a scan on',
          icon: (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20">
              <Crosshair className="h-5 w-5" />
            </div>
          ),
        };
    }
  };

  const { text: actionText, icon: actionIcon } = getActionConfig();

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

      <div className="flex flex-col gap-2 grow">
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

        {/* Vulnerability counts summary on completed scan */}
        {action === 'completed' && vulnCounts && vulnCounts.total > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 py-0.5">
            {vulnCounts.critical > 0 && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-rose-500/10 text-rose-600 border border-rose-500/20">
                Critical: {vulnCounts.critical}
              </span>
            )}
            {vulnCounts.high > 0 && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-amber-500/10 text-amber-600 border border-amber-500/20">
                High: {vulnCounts.high}
              </span>
            )}
            {vulnCounts.medium > 0 && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-yellow-500/10 text-yellow-600 border border-yellow-500/20">
                Medium: {vulnCounts.medium}
              </span>
            )}
            {vulnCounts.low > 0 && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-blue-500/10 text-blue-600 border border-blue-500/20">
                Low: {vulnCounts.low}
              </span>
            )}
          </div>
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

