import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useGetAimAssetDetailsByIdQuery,
  useGetAimAssetApprovalsQuery,
  useUpdateAimAssetApprovalMutation,
  useDecommissionAimGlobalAssetMutation
} from '@/services/asset-inventory/assets/assetsApi';
import { ContentLoader } from '@/components/common/content-loader';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/custom/modal';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/auth/context/auth-context';
import ApproversTable from './components/ApproversTable';
import MetricsCards from '@/components/custom/cards/metric-cards';
import { Badge } from '@/components/ui/badge';
import { Archive } from 'lucide-react';
import DecommissionAssetModal from './components/modals/DecommissionAssetModal';

function ApprovalsTab() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: asset, isLoading: isLoadingAsset } = useGetAimAssetDetailsByIdQuery(id);
  const [searchQuery, setSearchQuery] = useState('');
  const { data: approvalData, isLoading: isLoadingApprovals } = useGetAimAssetApprovalsQuery({ assetId: id, search: searchQuery });
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateAimAssetApprovalMutation();
  const [decommissionAsset, { isLoading: isDecommissioning }] = useDecommissionAimGlobalAssetMutation();

  const [modalConfig, setModalConfig] = useState({ open: false, status: '', approverId: '', reason: '' });
  const [isDecommissionModalOpen, setIsDecommissionModalOpen] = useState(false);

  const approvers = approvalData?.approvals || [];

  const handleOpenModal = (approverId, status) => {
    setModalConfig({ open: true, status, approverId, reason: '' });
  };

  const handleConfirmAction = async () => {
    try {
      await updateStatus({
        assetId: id,
        status: modalConfig.status,
        reason: modalConfig.reason
      }).unwrap();

      toast.success(`Asset ${modalConfig.status} successfully`);
      setModalConfig({ open: false, status: '', approverId: '', reason: '' });
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update approval status');
    }
  };

  const handleUndo = async () => {
    try {
      await updateStatus({
        assetId: id,
        status: 'pending',
        reason: ''
      }).unwrap();
      toast.success('Approval reverted to pending');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to revert status');
    }
  };

  const handleDecommission = async (reason) => {
    toast.promise(decommissionAsset({ assetId: id, reason }).unwrap(), {
      loading: 'Decommissioning asset...',
      success: () => {
        setIsDecommissionModalOpen(false);
        navigate('/assetinventory/assets/staged');
        return 'Asset decommissioned successfully';
      },
      error: (error) => error?.data?.message || 'Failed to decommission asset',
    });
  };

  const allApproved = approvalData?.is_fully_approved || false;
  const pendingCount = approvers.filter(a => a.status === 'pending').length;
  const acceptedCount = approvers.filter(a => a.status === 'accepted').length;
  const rejectedCount = approvers.filter(a => a.status === 'rejected').length;

  if (isLoadingAsset || isLoadingApprovals) {
    return <ContentLoader className="h-[400px]" />;
  }

  return (
    <div className="flex flex-col gap-4 w-full">

      <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-1">
        <div className="flex flex-col">
          <h2 className="text-lg font-medium text-foreground ">
            Decommission Approval
          </h2>
          <p className="text-muted-foreground text-xs font-medium">
            Review and manage the decommissioning approval workflow for this asset.
          </p>
        </div>

        {allApproved && (
          <Button onClick={() => setIsDecommissionModalOpen(true)} variant="destructive" className="gap-2 shadow-sm">
            <Archive className="size-4" />
            Decommission Asset
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <MetricsCards
        items={[
          { label: 'Pending', number: pendingCount },
          { label: 'Accepted', number: acceptedCount },
          { label: 'Rejected', number: rejectedCount },
        ]}
      />

      <div className="flex flex-col gap-4">
        <ApproversTable
          data={approvers}
          user={user}
          isLoading={isLoadingApprovals}
          onAction={handleOpenModal}
          onUndo={handleUndo}
          onSearch={setSearchQuery}
        />
      </div>

      {/* Decision Modal */}
      <Modal
        open={modalConfig.open}
        setOpen={(val) => !val && setModalConfig({ ...modalConfig, open: false })}
        title={modalConfig.status === 'accepted' ? 'Approve Decommission' : 'Reject Decommission'}
        description={`Please provide a reason for your decision to ${modalConfig.status} this asset decommissioning.`}
      >
        <div className="flex flex-col gap-4 pt-2">
          <div className="space-y-2">
            <Label>Reason <span className="text-destructive">*</span></Label>
            <Textarea
              placeholder="Enter your reason here..."
              value={modalConfig.reason}
              onChange={(e) => setModalConfig({ ...modalConfig, reason: e.target.value })}
              className="min-h-[120px]"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setModalConfig({ open: false, status: '', approverId: '', reason: '' })}
            >
              Cancel
            </Button>
            <Button
              disabled={isUpdatingStatus || !modalConfig.reason.trim()}
              onClick={handleConfirmAction}
              appearance={modalConfig.status === 'rejected' ? 'destructive' : 'primary'}
            >
              {isUpdatingStatus ? 'Processing...' : (modalConfig.status === 'accepted' ? 'Confirm Approval' : 'Confirm Rejection')}
            </Button>
          </div>
        </div>
      </Modal>

      <DecommissionAssetModal
        open={isDecommissionModalOpen}
        setOpen={setIsDecommissionModalOpen}
        onConfirm={handleDecommission}
        isLoading={isDecommissioning}
      />
    </div>
  );
}

export default ApprovalsTab;
