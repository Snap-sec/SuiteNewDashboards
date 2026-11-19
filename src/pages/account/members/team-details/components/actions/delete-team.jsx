import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useDeleteTeamMutation } from '@/services/auth/teamsApi';
import { Button } from '@/components/ui/button';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';

function DeleteTeam({ teamId, setDropdown = () => {} }) {
  const [deleteTeam, { isLoading: isDeleting }] = useDeleteTeamMutation();

  const navigate = useNavigate();

  const handleDeleteTeam = () => {
    toast.promise(deleteTeam(teamId).unwrap(), {
      loading: 'Deleting the team..',
      success: () => {
        navigate(-1, { replace: true });
        return 'Team Deleted';
      },
      error: (err)=>{
        if(err?.data?.error == "Team not found") navigate(-1);

        return err?.data?.error || 'Failed to delete the team'
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
        handleDeleteTeam();
      }}
      dialog="This action requires confirmation, click confirm to delete the team."
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

export default DeleteTeam;
