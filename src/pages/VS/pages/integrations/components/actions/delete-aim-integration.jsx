import React from 'react';
import { Trash } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { useDeleteVsAdapterMutation } from '@/services/vs/integrationApi';

export function DeleteAimIntegration({ adapter, adapterId, disabled, isAdmin = true }) {
  const [deleteAdapter, { isLoading: isDeleting }] = useDeleteVsAdapterMutation();

  const id = adapterId || adapter?._id || adapter?.id;
  const adapterName = adapter?.name || adapter?.adapterName || 'aim';
  const confirmationText = `delete-${adapterName?.toLowerCase().replace(/\s+/g, '-')}`;

  const handleDelete = async () => {
    if (!id || isDeleting) return;

    toast.promise(deleteAdapter(id).unwrap(), {
      loading: 'Deleting adapter...',
      success: 'Asset Inventory Integration removed successfully.',
      error: (err) => err?.data?.message || err?.message || 'Failed to delete adapter.',
    });
  };

  return (
    <ButtonWithConfirm
      disabled={disabled || !isAdmin || isDeleting || !id}
      confirm={true}
      confirmWithInput={true}
      confirmOnInput={confirmationText}
      confirmTitle="Delete Asset Inventory Integration"
      dialog="Are you sure you want to delete this integration? This action will disconnect the Asset Inventory from Vulnerability Scanner."
      confirmVariant="destructive"
      variant="destructive"
      onConfirm={handleDelete}
      confirmButton={
        <Button variant="destructive" disabled={isDeleting}>
          Delete
        </Button>
      }
      cancelButton={<Button variant="outline">Cancel</Button>}
    >
      <Trash className="size-4" />
      <span>Delete</span>
    </ButtonWithConfirm>
  );
}

export default DeleteAimIntegration;
