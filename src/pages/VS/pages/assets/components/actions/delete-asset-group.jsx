import { X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { useRemoveAssetFromVsGroupMutation } from '../../../../../../services/vs/assetApi';
import { CustomTooltip } from '../../../../../../components/custom/tooltip';

function DeleteAssetGroupAction({ assetId, groupId }) {
  const [removeAssetFromGroup, { isLoading: isRemoving }] =
    useRemoveAssetFromVsGroupMutation();

  const handleRemoveAssetFromGroup = () => {
    if (!assetId && !groupId)
      return toast.error('Asset and Group Ids are required!');

    toast.promise(removeAssetFromGroup({ assetId, groupId }).unwrap(), {
      loading: 'Removing Asset Group.',
      success: 'Asset Group Removed Successfully.',
      error: 'Error removing Asset Group.',
    });
  };

  return (
    <ButtonWithConfirm
      variant="ghost"
      confirm={true}
      confirmOnInput="shoaibwani"
      onConfirm={() => {
        if (isRemoving) return;

        handleRemoveAssetFromGroup();
        setOpen(false);
      }}
      dialog="This action requires confirmation, click remove to proceed."
      confirmButton={
        <Button disabled={isRemoving} variant="destructive">
          Remove
        </Button>
      }
      cancelButton={
        <Button disabled={isRemoving} variant="outline">
          Cancel
        </Button>
      }
      className="w-full justify-start px-1 py-0 h-5"
    >
      <CustomTooltip text={"Remove this group"}>
      <X className=" text-red-500 hover:cursor-pointer hover:text-red-300 w-4 h-4"/>
      </CustomTooltip>
    </ButtonWithConfirm>
  );
}

export default DeleteAssetGroupAction;

