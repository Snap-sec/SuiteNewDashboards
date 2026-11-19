import { useEffect, useState } from 'react';
import { Check, Edit, User } from 'lucide-react';
import { useGetDepartmentsQuery } from '@/services/auth/departmentsApi';
import { useGetTeamsQuery } from '@/services/auth/teamsApi';
import { useGetMembersQuery } from '@/services/vm/members';
import { Badge } from '@/components/ui/badge';
import { Profile } from '@/components/custom/profile';
import Select from '@/components/custom/select';
import SelectWithAvatar from '@/components/custom/select-with-avatar';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import InfoTable from './InfoTable';
import SectionCard from './SectionCard';


const OwnerSection = ({ asset, handleUpdate }) => {
  const owner = asset?.owner;

  const [isEditingOwner, setIsEditingOwner] = useState(false);
  const [isEditingDepartment, setIsEditingDepartment] = useState(false);
  const [isEditingTeam, setIsEditingTeam] = useState(false);
  const [selectedOwnerId, setSelectedOwnerId] = useState(
    owner?.user?._id || '',
  );
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(
    owner?.department?._id || '',
  );
  const [selectedTeamId, setSelectedTeamId] = useState(owner?.team?._id || '');

  const { data: members } = useGetMembersQuery();
  const { data: departmentsData, isLoading: departmentsLoading } =
    useGetDepartmentsQuery();
  const { data: teamsData, isLoading: teamsLoading } = useGetTeamsQuery();

  const memberList = (members?.data?.members || []).filter(
    (user) => user.hasSignedUp === true,
  );

  const departmentOptions =
    departmentsData?.data?.map((dept) => ({
      label: dept.name,
      value: dept._id,
    })) || [];

  const teamOptions =
    teamsData?.map((team) => ({
      label: team.name,
      value: team._id,
    })) || [];

  useEffect(() => {
    if (owner?.user?._id) {
      setSelectedOwnerId(owner.user._id);
    }
    if (owner?.department?._id) {
      setSelectedDepartmentId(owner.department._id);
    }
    if (owner?.team?._id) {
      setSelectedTeamId(owner.team._id);
    }
  }, [owner]);

  if (!owner) return null;

  const rows = [
    {
      label: 'User',
      value: selectedOwnerId,
      render: (val) => {
        const selectedMember = memberList.find((m) => m._id === val);
        const displayName = selectedMember
          ? selectedMember.name
          : owner?.user
            ? `${owner.user.firstName} ${owner.user.lastName}`
            : 'Not Assigned';

        return (
          <div className="flex items-center gap-2 h-8">
            {isEditingOwner ? (
              <div className="flex items-center gap-1.5">
                <div className="w-[200px]">
                  <SelectWithAvatar
                    users={memberList}
                    value={val}
                    onChange={(newVal) => {
                      setSelectedOwnerId(newVal);
                    }}
                    searchFields={['name', 'email']}
                  />
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditingOwner(false);
                    handleUpdate?.({
                      owner: {
                        userId: selectedOwnerId,
                        departmentId: selectedDepartmentId,
                        teamId: selectedTeamId,
                      },
                    });
                  }}
                  className="inline-flex items-center justify-center rounded-md p-1 hover:bg-muted text-green-600 transition-colors"
                  title="Save"
                >
                  <Check size={16} strokeWidth={3} />
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  {selectedMember ? (
                    <Profile email={selectedMember.email} size={18} />
                  ) : (
                    owner?.user?.email && (
                      <Profile email={owner.user.email} size={18} />
                    )
                  )}
                  <p>{displayName}</p>
                </div>
                <AuthorityGuard forbidRoles={['Auditor']}>
                  <button
                    onClick={() => setIsEditingOwner(true)}
                    className="p-1 rounded-md text-muted-foreground hover:bg-muted hover:text-primary transition-all duration-200"
                    title="Edit"
                  >
                    <Edit className="size-3.5" />
                  </button>
                </AuthorityGuard>
              </>
            )}
          </div>
        );
      },
    },
    {
      label: 'Team',
      value: selectedTeamId,
      render: (val) => {
        const selectedTeam = teamOptions.find((t) => t.value === val);
        const displayName = selectedTeam
          ? selectedTeam.label
          : owner?.team?.name || 'Not Assigned';

        return (
          <div className="flex items-center gap-2 h-8">
            {isEditingTeam ? (
              <div className="flex items-center gap-1.5">
                <div className="w-[200px]">
                  <Select
                    options={teamOptions}
                    value={val}
                    onChange={(opt) => {
                      setSelectedTeamId(opt?.value || opt);
                    }}
                    placeholder="Select team"
                    isSearching={teamsLoading}
                  />
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditingTeam(false);
                    handleUpdate?.({
                      owner: {
                        userId: selectedOwnerId,
                        departmentId: selectedDepartmentId,
                        teamId: selectedTeamId,
                      },
                    });
                  }}
                  className="inline-flex items-center justify-center rounded-md p-1 hover:bg-muted text-green-600 transition-colors"
                  title="Save"
                >
                  <Check size={16} strokeWidth={3} />
                </button>
              </div>
            ) : (
              <>
                <p>{displayName}</p>
                <AuthorityGuard forbidRoles={['Auditor']}>
                  <button
                    onClick={() => setIsEditingTeam(true)}
                    className="p-1 rounded-md text-muted-foreground hover:bg-muted hover:text-primary transition-all duration-200"
                    title="Edit"
                  >
                    <Edit className="size-3.5" />
                  </button>
                </AuthorityGuard>
              </>
            )}
          </div>
        );
      },
    },
    {
      label: 'Department',
      value: selectedDepartmentId,
      render: (val) => {
        const selectedDept = departmentOptions.find((d) => d.value === val);
        const displayName = selectedDept
          ? selectedDept.label
          : owner?.department?.name || 'Not Assigned';

        return (
          <div className="flex items-center gap-2 h-8">
            {isEditingDepartment ? (
              <div className="flex items-center gap-1.5">
                <div className="w-[200px]">
                  <Select
                    options={departmentOptions}
                    value={val}
                    onChange={(opt) => {
                      setSelectedDepartmentId(opt?.value || opt);
                    }}
                    placeholder="Select department"
                    isSearching={departmentsLoading}
                  />
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditingDepartment(false);
                    handleUpdate?.({
                      owner: {
                        userId: selectedOwnerId,
                        departmentId: selectedDepartmentId,
                        teamId: selectedTeamId,
                      },
                    });
                  }}
                  className="inline-flex items-center justify-center rounded-md p-1 hover:bg-muted text-green-600 transition-colors"
                  title="Save"
                >
                  <Check size={16} strokeWidth={3} />
                </button>
              </div>
            ) : (
              <>
                <p>{displayName}</p>
                <AuthorityGuard forbidRoles={['Auditor']}>
                  <button
                    onClick={() => setIsEditingDepartment(true)}
                    className="p-1 rounded-md text-muted-foreground hover:bg-muted hover:text-primary transition-all duration-200"
                    title="Edit"
                  >
                    <Edit className="size-3.5" />
                  </button>
                </AuthorityGuard>
              </>
            )}
          </div>
        );
      },
    },
    { label: 'Custom Assignment', value: owner?.is_custom ? 'Yes' : 'No' },
  ];

  return (
    <SectionCard
      icon={<User className="size-4" />}
      iconColor="text-sky-500"
      title="Owner"
    >
      <InfoTable rows={rows} />
    </SectionCard>
  );
};

export default OwnerSection;