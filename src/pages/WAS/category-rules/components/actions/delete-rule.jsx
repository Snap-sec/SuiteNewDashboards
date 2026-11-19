import { Trash } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinners'; // Import Spinner
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { CustomTooltip } from '@/components/custom/tooltip';
import { useDeleteApisecRuleMutation } from '../../../../../services/apisec/rulesApi';

function DeleteRule({ ruleId, iconOnly = false, ...props }) {
  const [deleteRule, { isLoading: isDeleting }] = useDeleteApisecRuleMutation();

  const handleDeleteScan = () => {
    toast.promise(deleteRule({ ruleId }).unwrap(), {
      loading: 'Deleting Rule..',
      success: 'Rule Deleted Successfully',
      error: 'Failed to delete the Rule',
    });
  };

  return (
    <CustomTooltip text="Delete">
      <ButtonWithConfirm
        disabled={isDeleting}
        variant="ghost"
        confirm={true}
        dialog="This action requires confirmation, click delete to proceed."
        onConfirm={() => handleDeleteScan()}
        confirmButton={<Button variant="destructive">Delete</Button>}
        cancelButton={<Button variant="outline">Cancel</Button>}
        className={iconOnly ? " text-destructive hover:bg-red-200/20" : "flex hover:bg-red-200/20"}
        {...props}
      >
        {isDeleting ? (
          <Spinner className="w-4 h-4 animate-spin" />
        ) : (
          iconOnly ? (
            <Trash className="size-4 text-destructive" />
          ) : (
            <div className=' font-normal flex gap-2 w-full'>
              <Trash /> Delete
            </div>
          )
        )}
      </ButtonWithConfirm>
    </CustomTooltip>
  );
}

export default DeleteRule;
