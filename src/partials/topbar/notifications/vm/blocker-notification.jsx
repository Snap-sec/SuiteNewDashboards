import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useUpdateVmBlockerStatusMutation } from '@/services/vm/blockersApi';
import {
  Avatar,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Profile } from '@/components/custom/profile';

export default function BlockerNotification({ notification }) {
  const [updateBlockerStatus, { isLoading }] =
    useUpdateVmBlockerStatusMutation();

  const userName = notification.actor?.name || 'System';
  const avatar = notification.actor?.avatar || '300-10.png';
  const badgeColor = notification.seen ? 'offline' : 'online';

  const targetLink = '/vm/blockers';
  const targetTitle = notification.target?.title || 'Blocker';

  const contextTitle = notification.context?.title || 'Vulnerability';
  const blockerDescription = notification.context?.description;

  let actionText = 'updated the blocker:';
  if (notification.event_key === 'vm.vulnerability.blocker.create') {
    actionText = 'raised a blocker:';
  } else if (notification.event_key === 'vm.vulnerability.blocker.resolved') {
    actionText = 'resolved the blocker:';
  } else if (notification.event_key === 'vm.vulnerability.blocker.reopened') {
    actionText = 'reopened the blocker:';
  }

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

  const handleUpdateStatus = async (newStatus) => {
    const blockerId = notification.target?.id;
    if (!blockerId) {
      toast.error('Blocker ID not found');
      return;
    }
    const toastId = toast.loading('Updating blocker status...');
    try {
      await updateBlockerStatus({ id: blockerId, status: newStatus }).unwrap();
      toast.success(
        newStatus === 'pending' ? 'Blocker Reopened' : 'Blocker Resolved',
      );
    } catch (err) {
      toast.error('Error updating blocker status');
    } finally {
      toast.dismiss(toastId);
    }
  };

  const renderButtons = () => {
    if (notification.event_key === 'vm.blocker.create') {
      return (
        <Button
          size="sm"
          variant="mono"
          disabled={isLoading}
          onClick={() => handleUpdateStatus('resolved')}
        >
          Mark Resolved
        </Button>
      );
    }
    if (notification.event_key === 'vm.blocker.resolved') {
      return (
        <Button
          size="sm"
          variant="outline"
          disabled={isLoading}
          onClick={() => handleUpdateStatus('pending')}
        >
          Reopen Blocker
        </Button>
      );
    }
    if (notification.event_key === 'vm.blocker.reopen') {
      return (
        <Button
          size="sm"
          variant="mono"
          disabled={isLoading}
          onClick={() => handleUpdateStatus('resolved')}
        >
          Resolve Blocker
        </Button>
      );
    }
    return null;
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

      <div className="flex flex-col gap-3.5 grow min-w-0">
        <div className="flex flex-col gap-1">
          <div className="text-sm font-medium mb-px leading-normal text-secondary-foreground flex items-center flex-wrap">
            <Link
              to="#"
              className="hover:text-primary text-mono font-semibold mr-1"
            >
              {userName}
            </Link>
            <span className="text-muted-foreground mr-1">{actionText}</span>
            <Link
              to={targetLink}
              className="hover:text-primary text-primary font-semibold text-xs leading-normal line-clamp-1 break-words max-w-full"
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

        <Card className="shadow-none flex items-center flex-row justify-between gap-1.5 px-2.5 py-2 rounded-lg bg-muted/70 min-w-0">
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-secondary-foreground text-xs truncate">
              {contextTitle}
            </span>
            {blockerDescription && (
              <span className="text-muted-foreground font-medium text-[11px] truncate italic">
                "{blockerDescription}"
              </span>
            )}
          </div>

          <Link
            to={targetLink}
            className="hover:text-primary text-secondary-foreground font-medium text-xs shrink-0 ml-1.5"
          >
            View Blocker
          </Link>
        </Card>

        {renderButtons() && (
          <div className="flex flex-wrap gap-2.5">{renderButtons()}</div>
        )}
      </div>
    </div>
  );
}
