import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useGetMembersQuery } from '@/services/vm/members';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Select from '@/components/custom/select';
import { useUpdateProjectCollabratorsMutation } from '@/services/tm/projectApi';

const AddCollabrator = ({ alreadySelectedCollabs = [] }) => {
  const location = useLocation();
  const projectId = location.pathname.split('/')[3]; // Extract projectId from URL

  const [search, setSearch] = useState('');

  const {
    data: members,
    error: MembersError,
    isLoading: MembersLoading,
    isFetching: MembersFetching,
  } = useGetMembersQuery({ search });

  const [updateCollaborators] = useUpdateProjectCollabratorsMutation();

  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  // ✅ Build a set of already selected userIds for filtering
  const alreadySelectedIds = new Set(
    alreadySelectedCollabs.map((c) => c.userId),
  );

  // ✅ Only show members not already collaborators
  const memberOptions = members?.data?.members
    ?.filter((m) => !alreadySelectedIds.has(m.userId))
    ?.map((m) => ({
      value: m.userId,
      label: m.name || m.email,
    }));

  const handleMemberChange = (option) => {

    let selectedMember = members?.data?.members?.find(m => m.userId == option.value);

    setSelectedMember(selectedMember);
    // setSelectedRole(
    //   option?.role
    //     ? {
    //         value: option.role,
    //         label: option.role.charAt(0).toUpperCase() + option.role.slice(1),
    //       }
    //     : null,
    // );
  };

  const roleOptions = [
    { value: 'manager', label: 'Manager' },
    { value: 'member', label: 'Member' },
  ];

  const handleRoleChange = (option) => {
    setSelectedRole(option);
  };

  const handleUpdateCollaborator = async () => {
    if (!selectedMember || !selectedRole) return;

    const payload = {
      collaborators: [
        {
          userId: selectedMember.userId,
          name: selectedMember.name,
          email: selectedMember.email,
          role: selectedRole.value,
        },
      ],
    };

    toast.promise(updateCollaborators({ payload, projectId }).unwrap(), {
      loading: 'Updating Collaborator',
      success: () => {
        setSelectedMember(null);
        setSelectedRole(null);
        return 'Collaborator Added Successfully';
      },
      error: (err) => {
        setSelectedMember(null);
        setSelectedRole(null);
        return err?.data?.message || 'Error Adding Collaborator';
      },
    });
  };

  return (
    <Card>
      <CardHeader id="auth_password">
        <CardTitle>Update Collaborators</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5">
        <div className="w-full">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <Label className="flex w-full max-w-30">Collaborators</Label>
            <Select
              placeholder="Select a Collaborator"
              searchPlaceholder="Search Collaborators..."
              onChange={handleMemberChange}
              options={memberOptions || []}
              enableSearch={true}
              areOptionsNavigating={false}
              searchField="label"
              emptyMessage="No Collaborators found."
              value={selectedMember}
              isLoading={MembersLoading || MembersFetching}
              onSearchChange={(search) => {
                setSearch(search);
              }}
            />
          </div>
        </div>
        <div className="w-full">
          <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
            <Label className="flex w-full max-w-30">Role</Label>
            <Select
              placeholder="Select a role"
              onChange={handleRoleChange}
              options={roleOptions}
              value={selectedRole}
              enableSearch={false}
              areOptionsNavigating={false}
              isDisabled={!selectedMember}
            />
          </div>
        </div>
        <div className="flex justify-end pt-2.5 gap-2">
          <Button
            onClick={handleUpdateCollaborator}
            disabled={!selectedMember || !selectedRole}
          >
            Update Collaborator
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddCollabrator;
