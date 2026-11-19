import { toast } from 'sonner';
import {
  useDeleteDepartmentMutation,
  useDeleteDepartmentTeamMutation,
} from '@/services/auth/departmentsApi';
import { Button } from '@/components/ui/button';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { useNavigate } from 'react-router-dom';

function DeleteDepartment({ departmentId, setDropdown = () => { }, departmentTeams }) {
  const navigate = useNavigate()

  const [deleteDepartment, { isLoading: isDeletingDept }] =
    useDeleteDepartmentMutation();
  const [deleteDepartmentTeam, { isLoading: isDeletingTeam }] =
    useDeleteDepartmentTeamMutation();

  const isDeleting = isDeletingDept || isDeletingTeam;

  const handleDeleteDepartment = () => {
    toast.promise(deleteDepartment(departmentId).unwrap(), {
      loading: 'Deleting the department...',
      success: () => {
        navigate(-1)
        return 'Department Deleted'
      },
      error: () => {
        // navigate(-1)
        return 'Failed to delete the department'
      },
    });
  };

  return (
    <ButtonWithConfirm
      className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
      variant="ghost"
      onConfirm={() => {
        if (isDeleting) return;

        setDropdown(false);
        handleDeleteDepartment();
      }}
      dialog="This action requires confirmation, click Delete to proceed."
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
      <div className="w-full flex items-center justify-start gap-2">
        <span className="font-normal">Delete</span>
      </div>
    </ButtonWithConfirm>
  );
}

export default DeleteDepartment;
