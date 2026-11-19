import { Bot } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar } from '@/components/ui/avatar';
import { Profile } from '../../../../components/custom/profile';

export default function AsmRuleNotification({ notification }) {
  if (!notification) return null;

  const userName = notification.actor?.name || 'System';
  const description =
    "updated rule" || 'triggered rule alert for';

  // Rule ID is either notification.target.id or notification.target._id
  const ruleId = notification.target?.id || notification.target?._id || '';
  const redirectUrl = `/casm/signals?ruleId=${ruleId}`;

  const link = notification.target?.title || 'Rule Alert';
  const label = '';

  const time =
    notification.context?.timestamp ||
    (() => {
      if (!notification.createdAt) return 'Recent';
      try {
        return new Date(notification.createdAt).toLocaleString('en-US', {
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

  const specialist = (notification.origin || 'asm').toUpperCase();

  return (
    <div className="flex grow gap-2.5 px-5 py-2">
      <div className="flex items-start gap-1.5 shrink-0 mt-0.5">
        <div className="flex items-center justify-center w-1.5 mt-2.5">
          {!notification?.seen && (
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
          )}
        </div>
        <Avatar>
          {!notification?.actor ||
          notification?.actor?.name?.trim().toLowerCase() === 'system' ? (
            <div className="flex h-full rounded-full w-full items-center justify-center bg-muted select-none">
              <Bot className="h-4 w-4 text-muted-foreground" />
            </div>
          ) : (
            <Profile
              userId={notification.actor?.id}
              name={notification.actor?.name}
              email={notification.actor?.email}
              size="30px"
            />
          )}
        </Avatar>
      </div>

      <div className="flex flex-col gap-3.5">
        <div className="flex flex-col gap-1">
          <div className="text-sm font-medium">
            <span className="text-mono font-semibold mr-1">{userName}</span>
            <span className="text-secondary-foreground"> {description} </span>
            <Link
              to={redirectUrl}
              className="hover:text-primary text-primary font-semibold"
            >
              {link}
            </Link>
            <span className="text-secondary-foreground"> {label} </span>
          </div>

          <span className="flex items-center text-xs font-medium text-muted-foreground">
            {time}
            <span className="rounded-full size-1 bg-mono/30 mx-1.5"></span>
            {specialist}
          </span>
        </div>
      </div>
    </div>
  );
}
