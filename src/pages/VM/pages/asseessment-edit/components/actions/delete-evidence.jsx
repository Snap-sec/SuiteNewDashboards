import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { CustomTooltip } from '@/components/custom/tooltip';
import { useDeleteVmAttachmentMutation } from '@/services/vm/vulnerabilityApi';

function DeleteEvidence({ evidenceId }) {
  const [deleteExportedAsset, { isLoading: isDeleting }] =
    useDeleteVmAttachmentMutation();

  const handleDelete = () => {
    toast.promise(deleteExportedAsset({ evidenceId }).unwrap(), {
      loading: 'Deleting Evidence',
      success: 'Evidence Deleted Successfully',
      error: (err) => {
        return err?.data?.message || 'Failed to delete the Evidence';
      },
    });
  };

  return (
    <CustomTooltip text="Delete Evidence">
      <ButtonWithConfirm
        disabled={isDeleting}
        variant="ghost"
        confirm={true}
        dialog="This action requires confirmation, click Delete to proceed."
        onConfirm={() => handleDelete()}
        confirmButton={<Button variant="destructive">Delete</Button>}
        cancelButton={<Button variant="outline">Cancel</Button>}
        className="hover:bg-red-200/20"
      >
        <Trash2 size={10} className="text-destructive" />
      </ButtonWithConfirm>
    </CustomTooltip>
  );
}

export default DeleteEvidence;
