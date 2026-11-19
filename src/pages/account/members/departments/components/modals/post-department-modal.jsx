import { useEffect, useState } from 'react';
import { PenBox, Plus, Users } from 'lucide-react';
import { toast } from 'sonner';
import { onAuthority } from '@/lib/helpers';
import {
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
} from '@/services/auth/departmentsApi';
import { useGetOrgMembersQuery } from '@/services/auth/orgApi';
import { useGetTeamsQuery } from '@/services/auth/teamsApi';
import { Button } from '@/components/ui/button';
import { Input, InputWrapper } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Modal } from '@/components/custom/modal';
import MultiSelect from '@/components/custom/multi-select';
import Select from '@/components/custom/select';
import useStore from '../../store';

function PostDepartment() {
  // Modal state from mocked zustand store
  const showAddTeamModal = useStore((state) => state.showAddTeamModal);
  const setShowAddTeamModal = useStore((state) => state.setShowAddTeamModal);

  const updateDepartmentDetail = useStore(
    (state) => state.updateDepartmentDetail,
  );
  const setUpdateDepartmentDetail = useStore(
    (state) => state.setUpdateDepartmentDetail,
  );

  // State for mocked API calls
  const [search, setSearch] = useState('');
  const {
    data: orgMembers,
    isLoading: isLoadingMembers,
    isFetching: isFetchingMembers,
  } = useGetOrgMembersQuery({ search });
  const { data: teams, isLoading } = useGetTeamsQuery();

  const [createDepartment, { isLoading: isCreating }] =
    useCreateDepartmentMutation();
  const [updateDepartment, { isLoading: isUpdating }] =
    useUpdateDepartmentMutation();

  // --- State Management ---
  const [allMemberOptions, setAllMemberOptions] = useState([]);
  const [allTeamsOptions, setAllTeamsOptions] = useState([]);

  const [departmentLead, setDepartmentLead] = useState(null);
  const [selectedTeams, setSelectedTeams] = useState([]);

  const [payload, setPayload] = useState({
    name: updateDepartmentDetail.name || '',
    description: '',
  });

  const isUpdateMode =
    updateDepartmentDetail?.name && updateDepartmentDetail?.description;

  useEffect(() => {
    if (orgMembers?.data?.members) {
      const formattedMembers = orgMembers.data.members.map((member) => ({
        id: member.userId,
        label: member.name || member.email,
        value: { id: member.userId, name: member.name, email: member.email },
      }));
      setAllMemberOptions(formattedMembers);
    }

    if (teams) {
      const formattedMembers = teams?.map((team) => ({
        id: team?._id,
        label: team.name,
        value: { id: team._id, name: team.name },
      }));
      setAllTeamsOptions(formattedMembers);
    }
  }, [orgMembers, teams]);

  // --- Event Handlers ---
  const handleLeaderChange = (option) => {
    setDepartmentLead(option);
    if (option) {
      setSelectedTeams((prevMembers) =>
        prevMembers.filter((member) => member.value?.id !== option.value?.id),
      );
    }
  };

  const handleMemberChange = (options) => {
    setSelectedTeams(options);
  };

  const handleCreateDepartment = onAuthority(['Admin'], () => {
    if (!payload.name) {
      toast.error('Please provide a department name.');
      return;
    }
    if (!payload.description) {
      toast.error('Please Enter Description.');
      return;
    }

    const teamIds = selectedTeams
      .filter((team) => !!team?.id)
      .map((team) => team?.id);

    const newPayload = {
      name: payload?.name,
      description: payload?.description,
      teamIds: teamIds,
      ...(departmentLead ? { departmentLead: departmentLead?.value } : {}),
    };

    toast.promise(createDepartment(newPayload), {
      loading: 'Creating department...',
      success: () => {
        setShowAddTeamModal(false);
        setPayload({ name: '', description: '' });
        setDepartmentLead(null);
        setSelectedTeams([]);
        return 'Department created successfully';
      },
      error: (err) => err?.data?.message || 'Failed to create department',
    });
  });

  const handleUpdateDepartment = onAuthority(['Admin'], () => {
    if (!payload.name) {
      toast.error('Please provide a department name.');
      return;
    }
    if (!updateDepartmentDetail?.id) {
      toast.error('Please provide department id.');
      return;
    }

    const teamIds = selectedTeams.map((team) => team?.id);
    const newPayload = {
      name: payload?.name,
      description: payload?.description,
      teamIds: teamIds,
      ...(departmentLead ? { departmentLead: departmentLead?.value } : {}),
    };

    toast.promise(
      updateDepartment({
        payload: newPayload,
        departmentId: updateDepartmentDetail?.id,
      }),
      {
        loading: 'Updating department...',
        success: () => {
          setShowAddTeamModal(false);
          setPayload({ name: '', description: '' });
          setDepartmentLead(null);
          setSelectedTeams([]);
          return 'Department updated successfully';
        },
        error: (err) => err?.data?.message || 'Failed to update department',
      },
    );
  });

  useEffect(() => {
    if (updateDepartmentDetail) {
      setPayload({
        name: updateDepartmentDetail.name || '',
        description: updateDepartmentDetail.description || '',
      });

      if (updateDepartmentDetail.departmentLead) {
        setDepartmentLead({
          label:
            updateDepartmentDetail.departmentLead.name ||
            updateDepartmentDetail.departmentLead.email,
          value: updateDepartmentDetail.departmentLead,
        });
      }

      if (
        updateDepartmentDetail?.departmentTeams &&
        Array.isArray(updateDepartmentDetail.departmentTeams)
      ) {
        const formattedTeams = updateDepartmentDetail.departmentTeams.map(
          (team) => ({
            label: team?.name,
            value: { id: team?._id, name: team?.name },
          }),
        );
        setSelectedTeams(formattedTeams);
      }
    }
  }, [updateDepartmentDetail]);

  return (
    <Modal
      open={showAddTeamModal}
      setOpen={() => {
        setShowAddTeamModal(!showAddTeamModal);
        setPayload({ name: '', description: '' });
        setSelectedTeams([]);
        setDepartmentLead(null);
        setUpdateDepartmentDetail({
          id: '',
          name: '',
          description: '',
          members: [],
        });
      }}
      title={isUpdateMode ? 'Update Department' : 'Add New Department'}
      description={
        isUpdateMode
          ? 'Update department in your organization.'
          : 'Create new department in your organization.'
      }
    >
      <div className="flex flex-col gap-4">
        <div>
          <Label htmlFor="team-name">Department Name <span className="text-destructive">*</span></Label>
          <InputWrapper>
            <Users />
            <Input
              id="team-name"
              type="text"
              placeholder="e.g. IT department, Finance department"
              value={payload.name}
              onChange={(e) =>
                setPayload((prev) => ({ ...prev, name: e.target.value }))
              }
              className="pl-9"
            />
          </InputWrapper>
        </div>
        <div>
          <Label htmlFor="team-desc">Department Description <span className="text-destructive">*</span></Label>
          <Textarea
            id="team-desc"
            placeholder="What is this department responsible for?"
            value={payload.description}
            onChange={(e) =>
              setPayload((prev) => ({ ...prev, description: e.target.value }))
            }
          />
        </div>

        <div>
          <Label>Select Department Lead (Optional)</Label>
          <Select
            placeholder="Select a department Lead"
            options={allMemberOptions}
            defaultValue={departmentLead?.value?.id}
            onChange={handleLeaderChange}
            onSearchChange={setSearch}
            isSearching={isLoadingMembers || isFetchingMembers}
          />
        </div>

        <div>
          <Label>Select Teams (Optional)</Label>
          <MultiSelect
            placeholder="Select Teams"
            options={allTeamsOptions}
            values={selectedTeams}
            onChange={handleMemberChange}
            maxShownItems={3}
            emptyPlaceholder={
              orgMembers?.length === 0
                ? 'No items found'
                : "You've added all available members."
            }
          />
        </div>
        <div className="w-full flex items-center justify-end mt-4">
          <Button
            onClick={
              updateDepartmentDetail?.id && updateDepartmentDetail?.name
                ? handleUpdateDepartment
                : handleCreateDepartment
            }
            disabled={isCreating || isUpdating}
          >
            {isUpdateMode ? <PenBox /> : <Plus />}
            {isUpdateMode
              ? isUpdating
                ? 'Updating...'
                : 'Update Department'
              : isCreating
                ? 'Creating...'
                : 'Create Department'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default PostDepartment;
