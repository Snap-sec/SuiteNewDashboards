import { useState } from 'react';
import { MessageSquare, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Profile } from '../../../../components/custom/profile';

export default function MentionNotification({ notification }) {
  const [replyInput, setReplyInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const userName = notification.actor?.name || 'Shoaib Wani';
  const avatar = notification.actor?.avatar || '300-10.png';
  const badgeColor = notification.seen ? 'offline' : 'online';

  const targetLink = notification.target?.url || '#';
  const targetTitle =
    notification.target?.title || 'CVE-2025-12758 - validator';

  const commentText = notification?.context?.commentText || '';
  const shouldTruncate = commentText.length > 540;
  const displayText = shouldTruncate && !isExpanded
    ? `${commentText.slice(0, 540)}...`
    : commentText;

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

  const specialist = (notification.origin || 'mentions').toUpperCase();

  return (
    <div className="flex grow gap-2.5 px-5 py-2">
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
          <div className="text-sm font-medium leading-normal">
            <span className="hover:text-primary text-mono font-bold text-slate-800 dark:text-slate-200 mr-1">
              {userName}
            </span>
            <span className="text-muted-foreground mr-1">mentioned you in</span>
            <Link
              to={targetLink}
              title={targetTitle}
              className="hover:text-primary text-primary font-semibold text-xs leading-normal line-clamp-1 break-words inline-block align-middle max-w-full"
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

        {/* Custom tailored mentions box with nested Trivy assessment card and reply input */}
        <Card className="shadow-none flex flex-col gap-3 p-3.5 rounded-lg bg-primary/[0.03] border border-primary/10 min-w-0">
          <div
            onClick={() => shouldTruncate && setIsExpanded(!isExpanded)}
            className={`text-xs font-medium text-secondary-foreground/90 leading-relaxed ${
              shouldTruncate ? 'cursor-pointer select-none hover:bg-muted/20 transition-colors p-1 rounded' : ''
            }`}
            title={shouldTruncate ? (isExpanded ? 'Click to collapse' : 'Click to expand') : undefined}
          >
            {!commentText && (
              <span className="text-primary font-semibold mr-1">
                @{userName}
              </span>
            )}
            {commentText ? (
              <>
                {displayText}
                {shouldTruncate && isExpanded && (
                  <span className="text-primary font-semibold ml-1.5 cursor-pointer hover:underline">
                    Show Less
                  </span>
                )}
              </>
            ) : (
              'was mentioned in this report'
            )}
          </div>

          {/* {notification.context && (
            <div className="flex items-center gap-2 p-2 rounded bg-background border border-border/50 text-xs min-w-0">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-rose-500/10 text-rose-500">
                <ShieldAlert className="h-4 w-4" />
              </div>
              <div className="flex flex-col grow min-w-0">
                <span className="text-[10px] uppercase font-bold text-muted-foreground/60 tracking-wider">
                  Assessment Context
                </span>
                <Link
                  to={notification.context.url || '#'}
                  className="hover:text-primary font-semibold text-secondary-foreground truncate"
                >
                  {notification.context.title || 'Continuous Image Scanning'}
                </Link>
              </div>
            </div>
          )} */}

          {/* <div className="relative w-full">
            <MessageSquare className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
            <Input
              type="text"
              placeholder="Reply to Shoaib Wani..."
              value={replyInput}
              onChange={(e) => setReplyInput(e.target.value)}
              className="w-full h-8 text-xs pr-9 bg-background focus-visible:ring-primary/20"
            />
          </div> */}
        </Card>
      </div>
    </div>
  );
}
