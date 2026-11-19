import React from 'react';
import { Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useDeleteVmRemidationCampaignMutation } from '@/services/vm/remidationCampaignApi';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinners';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { CustomTooltip } from '../../../../../../components/custom/tooltip';

export default function DeleteRemediationCampaign({
  campaignId,
  iconOnly = false,
  ...props
}) {
  const navigate = useNavigate();
  const [deleteCampaign, { isLoading: isDeleting }] =
    useDeleteVmRemidationCampaignMutation();

  const handleDelete = () => {
    toast.promise(deleteCampaign(campaignId).unwrap(), {
      loading: 'Deleting Remediation Campaign...',
      success: () => {
        navigate('/vm/remidation-campaigns');
        return 'Remediation Campaign Deleted Successfully';
      },
      error: 'Failed to delete Remediation Campaign',
    });
  };

  return (
    <CustomTooltip text="Delete Remediation Campaign">
      <ButtonWithConfirm
        disabled={isDeleting}
        variant="outline"
        confirm={true}
        onConfirm={() => handleDelete()}
        confirmVariant="destructive"
        confirmTitle="Delete Remediation Campaign?"
        dialog="Are you sure you want to delete this remediation campaign? This action is permanent and cannot be undone."
        confirmButton={<Button variant="destructive">Delete</Button>}
        cancelButton={<Button variant="outline">Cancel</Button>}
        className={iconOnly ? 'text-destructive hover:bg-red-200/20' : 'flex hover:bg-red-200/20'}
        {...props}
      >
        {isDeleting ? (
          <Spinner className="w-4 h-4 animate-spin" />
        ) : iconOnly ? (
          <Trash2 className="size-4 text-red-500" />
        ) : (
          <div className="font-normal flex gap-2 w-full items-center">
            <Trash2 className="size-4 text-red-500" />
          </div>
        )}
      </ButtonWithConfirm>
    </CustomTooltip>
  );
}
