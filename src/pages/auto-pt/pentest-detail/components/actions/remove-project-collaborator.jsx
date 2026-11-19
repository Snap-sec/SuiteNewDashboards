import { UserXIcon } from 'lucide-react';
import { useParams } from 'react-router';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { CustomTooltip } from '@/components/custom/tooltip';
import { useRemoveProjectCollaboratorMutation } from '@/services/tm/projectApi';

function RemoveCollaborator({ collaboratorId }) {
  const { projectId } = useParams();

  const [removeProejctCollaborator, { isLoading: isRemoving }] =
    useRemoveProjectCollaboratorMutation();

  const handleRemoveProjectCollaborator = () => {
    toast.promise(
      removeProejctCollaborator({ projectId, collaboratorId }).unwrap(),
      {
        loading: 'Removing Collaborator',
        success: 'Collaborator Removed Successfully',
        error: 'Failed to Remove Collaborator',
      },
    );
  };

  return (
    <CustomTooltip text="Remove Collaborator">
      <ButtonWithConfirm
        disabled={isRemoving}
        variant="ghost"
        confirm={true}
        // confirmOnInput={exportedAssetName}
        onConfirm={handleRemoveProjectCollaborator}
        confirmButton={<Button variant="primary">Proceed</Button>}
        cancelButton={<Button variant="outline">Cancel</Button>}
      >
        {/* <LucideUserMinus color="red" /> */}
        {/* <MinusCircleIcon color="red" /> */}
        <UserXIcon />
      </ButtonWithConfirm>
    </CustomTooltip>
  );
}

export default RemoveCollaborator;
