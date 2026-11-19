import { useEffect, useState } from 'react';
import { CheckCircle2, XCircleIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/auth/context/auth-context';
import { useUpdateVmRiskAcceptanceStatusMutation } from '@/services/vm/riskAcceptanceApi';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Modal } from '@/components/custom/modal';
import { Label } from '../../../../../../components/ui/label';
import AuthorityGuard from '../../../../../../components/custom/authority-guard/AuthorityGuard';

function RiskAcceptance({
  escalationDetails,

  closeParentModal = () => {},
}) {
  const { user } = useAuth();
  const isAuditor = user?.role?.toLowerCase() === 'auditor';

  const [
    updateRiskAcceptanceStatus,
    { isLoading: isUpdatingRiskAcceptanceStatus },
  ] = useUpdateVmRiskAcceptanceStatusMutation();

  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [isApproveBtnClicked, setIsApproveBtnClicked] = useState('approve');

  const handleSubmit = () => {
    setIsOpen(false);
    setReason('');
  };

  const handleUpdateRiskAcceptanceStatus = () => {
    const payload = {
      id: escalationDetails?._id,
      status: isApproveBtnClicked == 'approve' ? 'approved' : 'rejected',
      reason,
    };

    toast.promise(updateRiskAcceptanceStatus(payload).unwrap(), {
      loading: `${isApproveBtnClicked == 'approve' ? 'Approving' : 'Rejecting'} Risk...`,
      success: () => {
        // close this modal
        setIsOpen(false);
        // close parent modal
        closeParentModal();
        return `Risk ${isApproveBtnClicked == 'approve' ? 'Approved' : 'Rejected'} Successfully`;
      },
      error: (error) => {
        return (
          error?.data?.message ||
          `Error ${isApproveBtnClicked == 'approve' ? 'Approving' : 'Rejecting'} Risk`
        );
      },
    });
  };

  return (
    <Modal
      open={isOpen}
      setOpen={setIsOpen}
      title={`${isApproveBtnClicked == 'approve' ? 'Approve' : ' Reject'} Risk Acceptance`}
      description={escalationDetails?.vulnId?.title || ''}
      trigger={
        <>
        <AuthorityGuard forbidRoles={['Auditor']}>
          <Button
            variant="destructive"
            onClick={() => {
              setIsOpen(true);
              setIsApproveBtnClicked('reject');
            }}
            disabled={
              isAuditor ||
              escalationDetails?.status == 'approved' ||
              escalationDetails?.status == 'rejected'
            }
          >
            <XCircleIcon /> Reject
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              setIsOpen(true);
              setIsApproveBtnClicked('approve');
            }}
            disabled={
              isAuditor ||
              escalationDetails?.status == 'approved' ||
              escalationDetails?.status == 'rejected'
            }
          >
            <CheckCircle2 />
            Approve
          </Button>
          </AuthorityGuard>
        </>
      }
      footer={
        <div className=" flex gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>

          <Button
            variant="outline"
            onClick={handleUpdateRiskAcceptanceStatus}
            disabled={!reason.trim() || isUpdatingRiskAcceptanceStatus}
          >
            Commit {isApproveBtnClicked == 'approve' ? 'approval' : 'rejection'}
          </Button>
        </div>
      }
    >
      <div>
        <Label>Comment <span className="text-destructive">*</span></Label>
        <Textarea
          placeholder={`Provide your reasoning for ${isApproveBtnClicked == 'approve' ? 'approving' : 'rejecting'} the risk acceptance...`}
          rows={4}
          className="w-full mt-1"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </div>
    </Modal>
  );
}
export default RiskAcceptance;
