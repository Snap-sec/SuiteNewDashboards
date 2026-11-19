import { Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useDeleteMemberMutation } from '@/services/auth/orgApi';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { CustomTooltip } from '@/components/custom/tooltip';
import { useAuth } from '@/auth/context/auth-context';

function DeleteMember({ memberId, memberEmail }) {
  const { user } = useAuth();
  const [deleteMember] = useDeleteMemberMutation();
  const navigate = useNavigate();

  const currentUserId = user?._id || user?.id || user?.userId;
  const isSelf = Boolean(
    (currentUserId && memberId && String(currentUserId) === String(memberId)) ||
    (user?.email && memberEmail && user.email.toLowerCase() === memberEmail.toLowerCase())
  );

  if (isSelf) {
    return null;
  }

  const handleDeleteMember = () => {
    toast.promise(deleteMember(memberId).unwrap(), {
      loading: 'Deleting member',
      success: () => {
        navigate(-1);
        return 'Member removed';
      },
      error: (err) => {
        return err?.data?.message || 'Failed to delete member';
      },
    });
  };

  return (
    <div className="flex gap-1 items-center">
      <AuthorityGuard roles={['Admin']}>
        <CustomTooltip text="Delete member">
          <ButtonWithConfirm
            variant="outline"
            onConfirm={handleDeleteMember}
            confirm={true}
            dialog={<p>This account will be removed from this organization. Are you sure you want to proceed?</p>}
          >
            <Trash /> Delete
          </ButtonWithConfirm>
        </CustomTooltip>
      </AuthorityGuard>
    </div>
  );
}

export default DeleteMember;
