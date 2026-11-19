import { Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useDeleteAimBusinessUnitMutation } from '@/services/asset-inventory/businessUnitsApi';
import { useDeleteTeamMutation } from '@/services/auth/teamsApi';
import { Button } from '@/components/ui/button';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { CustomTooltip } from '../../../../../../components/custom/tooltip';

function DeleteBusinessUnit({ id, setDropdown, navigateOnSuccess = true }) {
  const navigate = useNavigate();

  const [deleteBusinessUnit, { isLoading: isDeleting }] =
    useDeleteAimBusinessUnitMutation();

  const handleDeleteTeam = () => {
    toast.promise(deleteBusinessUnit(id).unwrap(), {
      loading: 'Deleting the Business unit',
      success: () => {
        if (navigateOnSuccess) {
          navigate(-1);
        }
        return 'Business unit Deleted';
      },
      error: (err) => {
        return err?.data?.message || 'Failed to delete the Business unit';
      },
    });
  };

  return (
    <CustomTooltip text="Delete this business unit">
      <ButtonWithConfirm
        className="w-full"
        // variant="outline"
        variant="outline"
        onConfirm={() => {
          if (isDeleting) return;

          // setDropdown(false);
          handleDeleteTeam();
        }}
        confirm={true}
        disabled={isDeleting}
        confirmOnInput={'shoaibwani'}
        confirmButton={
          <Button variant="destructive" disabled={isDeleting}>
            Proceed
          </Button>
        }
        cancelButton={<Button variant="outline">Cancel</Button>}
      >
        <Trash2 className='text-destructive' />
      </ButtonWithConfirm>
    </CustomTooltip>
  );
}

export default DeleteBusinessUnit;
