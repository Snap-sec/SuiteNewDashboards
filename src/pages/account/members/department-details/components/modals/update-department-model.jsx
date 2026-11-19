import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { onAuthority } from '@/lib/helpers';
import { useUpdateDepartmentMutation } from '@/services/auth/departmentsApi';
import { useGetTeamsQuery } from '@/services/auth/teamsApi';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/custom/modal';
import MultiSelect from '@/components/custom/multi-select';
import useStore from '../../../departments/store';

function UpdateTeamModel() {
  const showAddTeamModal = useStore((state) => state.showAddTeamModal);
  const setShowAddTeamModal = useStore((state) => state.setShowAddTeamModal);

  const updateDepartmentDetail = useStore(
    (state) => state.updateDepartmentDetail,
  );
  const setUpdateDepartmentDetail = useStore(
    (state) => state.setUpdateDepartmentDetail,
  );

  const { data: teams } = useGetTeamsQuery();

  const [updateDepartment, { isLoading: isUpdating }] =
    useUpdateDepartmentMutation();

  const [allTeamsOptions, setAllTeamsOptions] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);

  // Build team dropdown list
  useEffect(() => {
    if (teams) {
      const formatted = teams.map((team) => ({
        id: team?._id,
        label: team?.name,
        value: { id: team?._id, name: team?.name },
      }));
      setAllTeamsOptions(formatted);
    }
  }, [teams]);

  // Load existing teams into selector
  useEffect(() => {
    if (
      updateDepartmentDetail?.departmentTeams &&
      Array.isArray(updateDepartmentDetail.departmentTeams)
    ) {
      const formatted = updateDepartmentDetail.departmentTeams.map((team) => ({
        id: team?._id,
        label: team?.name,
        value: { id: team?._id, name: team?.name },
      }));
      setSelectedTeams(formatted);
    }
  }, [updateDepartmentDetail]);

  const handleUpdateTeams = onAuthority(['Admin'], () => {
    if (!updateDepartmentDetail?.id) {
      toast.error('Department ID missing!');
      return;
    }

    const teamIds = selectedTeams.map((t) => t.id);

    const payload = { teamIds };

    toast.promise(
      updateDepartment({
        departmentId: updateDepartmentDetail.id,
        payload,
      }),
      {
        loading: 'Updating teams...',
        success: () => {
          setShowAddTeamModal(false);
          setSelectedTeams([]);
          setUpdateDepartmentDetail({});
          return 'Teams updated successfully';
        },
        error: (err) => err?.data?.message || 'Failed to update teams',
      },
    );
  });

  return (
    <Modal
      open={showAddTeamModal}
      setOpen={() => {
        setShowAddTeamModal(false);
        setSelectedTeams([]);
        setUpdateDepartmentDetail({});
      }}
      title="Update Department Teams"
      description="Manage the list of teams assigned to this department."
    >
      <div className="flex flex-col gap-4">
        <MultiSelect
          placeholder="Select Teams"
          options={allTeamsOptions}
          values={selectedTeams}
          onChange={setSelectedTeams}
          maxShownItems={5}
        />

        <div className="w-full flex items-center justify-end mt-4">
          <Button onClick={handleUpdateTeams} disabled={isUpdating}>
            {isUpdating ? 'Updating...' : 'Update Teams'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default UpdateTeamModel;
