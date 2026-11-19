import { Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useDeleteAimBusinessUnitMutation } from '@/services/asset-inventory/businessUnitsApi';
import { useDeleteTeamMutation } from '@/services/auth/teamsApi';
import { Button } from '@/components/ui/button';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { CustomTooltip } from '../../../../../../components/custom/tooltip';

function DeleteBusinessUnit({ id, setDropdown }) {
  const navigate = useNavigate();

  const [deleteBusinessUnit, { isLoading: isDeleting }] =
    useDeleteAimBusinessUnitMutation();

  const handleDeleteTeam = () => {
    toast.promise(deleteBusinessUnit(id).unwrap(), {
      loading: 'Deleting the Business unit',
      success: () => {
        navigate(-1);
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
        className="text-destructive"
        variant="ghost"
        onConfirm={() => {
          if (isDeleting) return;

          // setDropdown(false);
          handleDeleteTeam();
        }}
        dialog="This action requires confirmation, click on delete to proceed"
        confirm={true}
        disabled={isDeleting}
        confirmOnInput={'shoaibwani'}
        confirmButton={
          <Button variant="destructive" disabled={isDeleting}>
            Delete
          </Button>
        }
        cancelButton={<Button variant="outline">Cancel</Button>}
      >
        <Trash2 />
      </ButtonWithConfirm>
    </CustomTooltip>
  );
}

export default DeleteBusinessUnit;
