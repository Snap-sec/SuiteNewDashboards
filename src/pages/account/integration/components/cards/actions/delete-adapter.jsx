import { useId, useState } from 'react';
import { Trash } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { useDeleteApisecIntegrationMutation } from '@/services/apisec/integrationApi';

function DeleteActvAdapter({ adapterId, deletingAdapterName }) {
  const id = useId();
  const [deleteIntegration, { isLoading: isDeleting }] =
    useDeleteApisecIntegrationMutation();

  // Note: apisec delete expects an integrationId. The previous keepAssets
  // flag was part of AIM API; if backend supports it in future, adapt here.
  const [keepAssets, setKeepAssets] = useState(false);

  const deleteActvAdapter = () => {
    const integrationId = adapterId;
    toast.promise(deleteIntegration({ integrationId }).unwrap(), {
      loading: 'Deleting an Adapter',
      success: 'Adapter Deleted Successfully',
      error: 'Failed to delete adapter',
    });
  };

  return (
    <ButtonWithConfirm
      disabled={isDeleting}
      // variant="destructive"
      variant="outline"
      confirm={true}
      // confirmWithInput={true}
      // confirmOnInput={`delete-${deletingAdapterName}`}
      onConfirm={() => deleteActvAdapter()}
      confirmButton={<Button variant="primary">Proceed</Button>}
      cancelButton={<Button variant="outline">Cancel</Button>}
      dialog={
        <div className=" flex flex-col items-center">
          <p>Are you sure want to delete this adapter?</p>
          <div className="flex items-center space-x-2 mt-2">
            <Checkbox
              id={id}
              checked={keepAssets}
              onCheckedChange={(value) => setKeepAssets(!!value)}
            />
            <Label htmlFor={id}>Keep its assets</Label>
          </div>
        </div>
      }
    >
      <Trash /> Delete
    </ButtonWithConfirm>
  );
}

export default DeleteActvAdapter;
