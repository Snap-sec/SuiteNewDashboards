import { useEffect, useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useGetDepartmentsQuery } from '@/services/auth/departmentsApi';
import { useGetOrgMembersQuery } from '@/services/auth/orgApi';
import { useGetTeamsQuery } from '@/services/auth/teamsApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import Select from '@/components/custom/select';
import ApiErrorHandler from '../../../../../components/common/api-error-handler';
import {
  useGetAimDefaultOwnershipQuery,
  useSetBulkDefaultOwnersToMultipleAimAssetsMutation,
} from '../../../../../services/asset-inventory/defaultOwnershipApi';
import DefaultOwnershipSkeleton from './skeletons/default-ownership-skeleton';

const ASSET_TYPES = {
  Subdomains: 'subdomain',
  API: 'api',
  'IP Addresses': 'ip',
  'DNS Records': 'dns',
  Repositories: 'repository',
  Certificates: 'certificate',
  Employees: 'employee',
  Applications: 'application',
  Technologies: 'technology',
  Compartments: 'compartment',
  Workstations: 'workstation',
  Registries: 'registry',
  'Object Storages': 'object_storage',
  Vendors: 'vendor',
};

/* ============================
   ROW COMPONENT (FULLY ISOLATED)
============================ */

function OwnershipRow({ type, ownership, handleSelectChange }) {
  const [searchMember, setSearchMember] = useState('');
  const [searchTeam, setSearchTeam] = useState('');
  const [searchDepartment, setSearchDepartment] = useState('');

  /* ===== Members Query ===== */
  const {
    data: membersData,
    isLoading: membersLoading,
    isFetching: isFetchingMembers,
  } = useGetOrgMembersQuery({
    search: searchMember,
    includeIds: ownership?.member,
  });

  const memberOptions = [
    { label: 'None', value: 'none', user: null },
    ...(membersData?.data?.members?.map((member) => {
      const name = member.name ? `${member.name}`.trim() : member.email;
      return {
        label: name,
        value: member.userId || member._id,
        user: { ...member, name },
      };
    }) || []),
  ];

  /* ===== Teams Query ===== */
  const {
    data: teamsData,
    isLoading: teamsLoading,
    isFetching: isFetchingTeams,
  } = useGetTeamsQuery({ search: searchTeam, includeIds: ownership?.team });

  const teamOptions = [
    { label: 'None', value: 'none' },
    ...(teamsData?.map((team) => ({
      label: team.name,
      value: team._id,
    })) || []),
  ];

  /* ===== Departments Query ===== */
  const {
    data: departmentsData,
    isLoading: departmentsLoading,
    isFetching: isFetchingDepartments,
  } = useGetDepartmentsQuery({
    search: searchDepartment,
    includeIds: ownership?.department,
  });

  const departmentOptions = [
    { label: 'None', value: 'none' },
    ...(departmentsData?.data?.map((dept) => ({
      label: dept.name,
      value: dept._id,
    })) || []),
  ];

  return (
    <TableRow>
      <TableCell className="font-medium">{type}</TableCell>

      {/* ===== OWNER ===== */}
      <TableCell>
        <Select
          searchPlaceholder="Search by name or email"
          options={memberOptions}
          value={ownership.member || 'none'}
          onChange={(opt) => handleSelectChange(type, 'member', opt)}
          placeholder="Select owner"
          isSearching={membersLoading || isFetchingMembers}
          onSearchChange={setSearchMember}
        />
      </TableCell>

      {/* ===== TEAM ===== */}
      <TableCell>
        <Select
          searchPlaceholder="Search by Team Name"
          options={teamOptions}
          value={ownership.team || 'none'}
          onChange={(opt) => handleSelectChange(type, 'team', opt)}
          placeholder="Select team"
          isSearching={teamsLoading || isFetchingTeams}
          onSearchChange={setSearchTeam}
        />
      </TableCell>

      {/* ===== DEPARTMENT ===== */}
      <TableCell>
        <Select
          searchPlaceholder="Search by Department Name"
          options={departmentOptions}
          value={ownership.department || 'none'}
          onChange={(opt) => handleSelectChange(type, 'department', opt)}
          placeholder="Select department"
          isSearching={departmentsLoading || isFetchingDepartments}
          onSearchChange={setSearchDepartment}
        />
      </TableCell>
    </TableRow>
  );
}

/* ============================
   MAIN COMPONENT
============================ */

function DefaultOwnership() {
  const {
    data: defaultOwnershipData,
    isLoading: isFetchingOwnershipData,
    isError,
    error,
  } = useGetAimDefaultOwnershipQuery();

  const [setBulkDefaultOwners, { isLoading: isSavingMappings }] =
    useSetBulkDefaultOwnersToMultipleAimAssetsMutation();

  const [ownership, setOwnership] = useState(
    Object.keys(ASSET_TYPES).reduce((acc, type) => {
      acc[type] = {
        team: '',
        department: '',
        assetType: ASSET_TYPES[type],
        ownerType: 'member',
        member: '',
        userObject: null,
      };
      return acc;
    }, {}),
  );

  /* ===== Populate from API ===== */
  useEffect(() => {
    if (!defaultOwnershipData) return;

    setOwnership((prev) => {
      const updated = { ...prev };

      defaultOwnershipData.forEach((item) => {
        const matchedType = Object.keys(ASSET_TYPES).find(
          (key) =>
            ASSET_TYPES[key]?.toLowerCase() === item?.assetType?.toLowerCase(),
        );

        if (!matchedType) return;

        updated[matchedType] = {
          ...updated[matchedType],
          assetType: item.assetType,
          member:
            (typeof item.userId === 'object'
              ? item.userId?.userId || item.userId?._id
              : item.userId) || '',
          userObject:
            item.user || (typeof item.userId === 'object' ? item.userId : null),
          team: item.teamId || '',
          department: item.departmentId || '',
        };
      });

      return updated;
    });
  }, [defaultOwnershipData]);

  const handleSelectChange = (assetType, field, option) => {
    setOwnership((prev) => ({
      ...prev,
      [assetType]: {
        ...prev[assetType],
        [field]: option?.value || '',
        ...(field === 'member' && {
          userObject: option?.user || null,
        }),
      },
    }));
  };

  const handleSaveMappings = () => {
    const payload = Object.entries(ownership)
      .filter(([_, value]) => value?.member || value?.team || value?.department)
      .map(([assetType, value]) => ({
        assetType: ASSET_TYPES[assetType],
        userId: value.member === 'none' || !value.member ? null : value.member,
        teamId: value.team === 'none' || !value.team ? null : value.team,
        departmentId:
          value.department === 'none' || !value.department
            ? null
            : value.department,
      }));

    toast.promise(setBulkDefaultOwners(payload).unwrap(), {
      loading: 'Setting default owners to assets...',
      success: 'Default owners to assets set successfully',
      error: (err) =>
        err?.data?.message || 'Error Setting default owners to assets',
    });
  };

  if (isFetchingOwnershipData) {
    return <DefaultOwnershipSkeleton />;
  }

  if (isError) return <ApiErrorHandler error={error} />;

  return (
    <div className="py-4">
      <Card>
        <CardHeader>
          <CardTitle className="font-semibold">
            Asset Ownership Mapping
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Asset Type</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Department</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {Object.keys(ASSET_TYPES).map((type) => (
                <OwnershipRow
                  key={type}
                  type={type}
                  ownership={ownership[type]}
                  handleSelectChange={handleSelectChange}
                />
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-end mt-6">
            <ButtonWithConfirm
              disabled={isSavingMappings}
              onConfirm={handleSaveMappings}
              size="lg"
              confirm={true}
              confirmVariant="success"
              dialog="This will assign an owner to the selected asset types."
            >
              {isSavingMappings ? (
                <>
                  <Loader2 className="animate-spin" />
                  Saving Mappings
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  Save Mapping
                </>
              )}
            </ButtonWithConfirm>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default DefaultOwnership;
