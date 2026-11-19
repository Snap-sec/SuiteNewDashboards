import { useState } from 'react';
import { Check, SquarePen } from 'lucide-react';
import { toast } from 'sonner';
import { useUpdateThreatDetailsByIdMutation } from '@/services/tm/threatApi';
import { useGetMembersQuery } from '@/services/vm/members';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { Profile } from '@/components/custom/profile';
import SelectWithAvatar from '@/components/custom/select-with-avatar';

function OwnerDropdown({ threatDetails, ReportDetail = {} }) {
  const [editing, setEditing] = useState(false);
  const [selectedOwnerId, setSelectedOwnerId] = useState(
    ReportDetail?.assignee?.userId || '',
  );

  const {
    data: members,
    error: MembersError,
    isLoading: MembersLoading,
  } = useGetMembersQuery();

  const [updateThreatDetailsById, { isLoading }] =
    useUpdateThreatDetailsByIdMutation();
  const memberList = (members?.data?.members || []).filter(
    (user) => user.hasSignedUp === true,
  );

  const handleSave = async () => {
    const selectedMember = memberList.find((m) => m._id === selectedOwnerId);

    console.log('Selected Owner ID:', selectedOwnerId);
    console.log('Selected Member:', selectedMember);

    if (!selectedMember) {
      toast.error('Invalid assignee selected');
      return;
    }

    const payload = {
      owner: {
        name: selectedMember.name,
        email: selectedMember.email,
        userId: selectedMember._id,
      },
    };

    toast.promise(
      updateThreatDetailsById({
        threatId: threatDetails?._id,
        updates: payload,
      }).unwrap(),
      {
        loading: 'Updating owner...',
        success: () => {
          setEditing(false);
          return 'Owner updated successfully';
        },
        error: 'Failed to update owner',
      },
    );
  };

  return (
    <TableRow>
      <TableCell className="py-2 min-w-28 text-secondary-foreground font-normal">
        Owner
      </TableCell>

      <TableCell className="py-2 text-gray700 font-normal min-w-32 text-sm">
        {editing ? (
          <SelectWithAvatar
            users={memberList}
            onChange={(value) => setSelectedOwnerId(value)} // ✅ Set _id directly
            searchFields={['name', 'email']}
          />
        ) : (
          <Profile
            name={threatDetails?.owner?.name || 'Unknown'}
            email={threatDetails?.owner?.email}
          />
        )}
      </TableCell>

      <TableCell className="py-3 text-center">
        {editing ? (
          <Button
            variant="ghost"
            mode="icon"
            onClick={handleSave}
            disabled={isLoading}
          >
            <Check size={16} className="text-green-500" />
          </Button>
        ) : (
          <Button variant="ghost" mode="icon" onClick={() => setEditing(true)}>
            <SquarePen size={16} className="text-blue-500" />
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}

export default OwnerDropdown;
