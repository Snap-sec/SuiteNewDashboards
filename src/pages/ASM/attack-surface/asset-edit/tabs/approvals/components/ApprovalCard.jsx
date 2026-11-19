import React from 'react';
import { Check, X, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Profile } from '@/components/custom/profile';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/auth/context/auth-context';
import { formatDateTime } from '@/lib/helpers';

const ApprovalCard = ({ approver, onAction, onUndo }) => {
  const { name, role, status, email, userId, reason, updatedAt } = approver;
  const { user } = useAuth();

  // Check if the current approver is the logged-in user
  const isCurrentUser = user?._id === userId || user?.id === userId;

  const getStatusBadge = () => {
    switch (status) {
      case 'accepted':
        return <Badge variant="success" appearance="outline" className="uppercase text-[10px] font-bold">Accepted</Badge>;
      case 'rejected':
        return <Badge variant="destructive" appearance="outline" className="uppercase text-[10px] font-bold">Rejected</Badge>;
      default:
        return (
          <div className="flex items-center gap-1.5 text-orange-500">
            <div className="size-1.5 rounded-full bg-orange-500" />
            <span className="uppercase text-[10px] font-bold tracking-wider">Pending</span>
          </div>
        );
    }
  };

  return (
    <tr className="hover:bg-muted/30 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <Profile
            email={email}
            name={name}
            role={role}
            size={32}
            showEmail={false}
          />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground leading-none">
              {name || email?.split('@')[0]}
            </span>
            <span className="text-xs text-muted-foreground mt-1">
              {email}
            </span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <Badge variant="secondary" appearance="outline" className="text-[10px] uppercase font-bold tracking-wider">
          {role || 'Approver'}
        </Badge>
      </td>
      <td className="px-6 py-4">
        {getStatusBadge()}
      </td>
      <td className="px-6 py-4">
        <span className="text-sm text-muted-foreground italic truncate max-w-[200px] block" title={reason}>
          {reason || 'No reason provided'}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className="text-xs text-muted-foreground font-mono">
          {updatedAt ? formatDateTime(updatedAt) : '—'}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          {status === 'pending' && isCurrentUser && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5"
                onClick={() => onAction('accepted')}
              >
                <Check className="size-3.5" />
                Accept
              </Button>
              <Button
                variant="outline"
                appearance="destructive"
                size="sm"
                className="h-8 gap-1.5"
                onClick={() => onAction('rejected')}
              >
                <X className="size-3.5" />
                Reject
              </Button>
            </>
          )}
          {status !== 'pending' && isCurrentUser && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5"
              onClick={onUndo}
            >
              <RotateCcw className="size-3.5" />
              Undo
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default ApprovalCard;
