import { Link } from 'react-router-dom';
import {
  Avatar,
} from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Profile } from '../../../../components/custom/profile';

export default function ScoringMethodologyNotification({ notification }) {
  const userName = notification.actor?.name || 'System';
  const avatar = notification.actor?.avatar || '300-5.png';
  const badgeColor = notification.seen ? 'offline' : 'online';

  const targetLink = '/vm/true-risk';
  const targetTitle = notification.context?.to || 'CVSS';

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

  const fromMethod = notification.context?.from || 'TrueRisk';
  const toMethod = notification.context?.to || 'CVSS';

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

      <div className="flex flex-col gap-3.5 grow">
        <div className="flex flex-col gap-1">
          <div className="text-sm font-medium mb-px">
            <Link to="#" className="hover:text-primary text-mono font-semibold">
              {userName}
            </Link>
            <span className="text-secondary-foreground">
              {' '}
              changed scoring methodology to{' '}
            </span>
            <Link
              to={targetLink}
              className="hover:text-primary text-primary font-semibold"
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

        <div className="flex flex-wrap gap-2.5">
          <Badge
            size="sm"
            variant="secondary"
            appearance="light"
            className=" border-none"
          >
            From: {fromMethod}
          </Badge>
          <Badge
            size="sm"
            variant="info"
            appearance="light"
            className=" border-none"
          >
            To: {toMethod}
          </Badge>
          <Badge
            size="sm"
            variant="warning"
            className=" border-none"
            appearance="light"
          >
            Methodology Changed
          </Badge>
        </div>
      </div>
    </div>
  );
}
