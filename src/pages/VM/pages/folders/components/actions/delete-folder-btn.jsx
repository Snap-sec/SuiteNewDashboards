import { Trash } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { CustomTooltip } from '@/components/custom/tooltip';
import { useDeleteVmFolderMutation } from '../../../../../../services/vm/foldersApi';


function DeleteFolder({ folderId }) {
  const [deleteFolder, { isLoading: isDeletingFolder }] =
    useDeleteVmFolderMutation();

  const handleDeleteFolder = () => {
    toast.promise(deleteFolder(folderId).unwrap(), {
      loading: 'Deleting Folder',
      success: () => {

        return 'Folder Deleted Successfully';
      },
      error: 'Failed to delete the Folder',
    });
  };

  return (
    <CustomTooltip text="Delete">
      <ButtonWithConfirm
        disabled={isDeletingFolder}
        variant="ghost"
        confirm={true}
        dialog="This action requires confirmation, click delete to proceed"
        // confirmOnInput={exportedAssetName}
        onConfirm={() => handleDeleteFolder()}
        confirmButton={<Button variant="destructive">Delete</Button>}
        cancelButton={<Button variant="outline">Cancel</Button>}
      >
        <span className=" font-normal w-full text-destructive">Delete</span>
      </ButtonWithConfirm>
    </CustomTooltip>
  );
}

export default DeleteFolder;
