import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinners'; // Import Spinner
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { CustomTooltip } from '@/components/custom/tooltip';
import { useDeleteAimPolicyMutation } from '../../../../../../services/asset-inventory/policyApi';

function DeleteRule({ ruleId, iconOnly = false, ...props }) {
  const [deleteRule, { isLoading: isDeleting }] = useDeleteAimPolicyMutation();

  const handleDeleteScan = () => {
    toast.promise(deleteRule(ruleId).unwrap(), {
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
        onConfirm={() => handleDeleteScan()}
        confirmButton={<Button variant="primary">Proceed</Button>}
        cancelButton={<Button variant="outline">Cancel</Button>}
        className={iconOnly ? 'text-secondary-foreground' : 'flex'}
        {...props}
      >
        {isDeleting ? (
          <Spinner className="w-4 h-4 animate-spin" />
        ) : iconOnly ? (
          <Trash2 className="size-4" />
        ) : (
          <div className=" font-normal flex gap-2 w-full">
            <Trash2 /> Delete
          </div>
        )}
      </ButtonWithConfirm>
    </CustomTooltip>
  );
}

export default DeleteRule;
