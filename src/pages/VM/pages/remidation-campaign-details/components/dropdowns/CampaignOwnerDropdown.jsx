import React, { useState } from 'react';
import { Check, SquarePen, X } from 'lucide-react';
import { toast } from 'sonner';
import useDebounce from '@/hooks/use-debounce';
import { useGetMembersQuery } from '@/services/vm/members';
import { useChangeVmRemediationCampaignOwnerMutation } from '@/services/vm/remidationCampaignApi';
import { Button } from '@/components/ui/button';
import { Profile } from '@/components/custom/profile';
import SelectWithAvatar from '@/components/custom/select-with-avatar';
import AuthorityGuard from '../../../../../../components/custom/authority-guard/AuthorityGuard';

export default function CampaignOwnerDropdown({ campaign }) {
  const campaignId = campaign?._id;
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  const {
    data: membersData,
    isLoading: membersLoading,
    isFetching: membersFetching,
  } = useGetMembersQuery({ search: debouncedSearch });

  const members = membersData?.data;
  const memberList = (members?.members || []).filter(
    (u) => u.hasSignedUp === true,
  );

  const [editing, setEditing] = useState(false);
  const [selectedOwnerId, setSelectedOwnerId] = useState(
    campaign?.owner?._id ||
      campaign?.owner?.userId ||
      (typeof campaign?.owner === 'object'
        ? campaign?.owner?._id
        : campaign?.owner) ||
      '',
  );

  const [changeOwner, { isLoading }] =
    useChangeVmRemediationCampaignOwnerMutation();

  const handleSave = async () => {
    const selectedMember = memberList.find((m) => m._id === selectedOwnerId);

    if (!selectedMember) {
      toast.error('Invalid owner selected');
      return;
    }

    const payload = {
      owner: {
        userId: selectedMember._id,
        name: selectedMember.name,
        email: selectedMember.email,
      },
    };

    toast.promise(changeOwner({ id: campaignId, payload }).unwrap(), {
      loading: 'Updating owner...',
      success: () => {
        setEditing(false);
        return 'Owner updated successfully';
      },
      error: 'Failed to update owner',
    });
  };

  // Resolve current owner display properties
  const ownerObj = typeof campaign?.owner === 'object' ? campaign?.owner : null;
  const ownerName =
    ownerObj?.name ||
    (typeof campaign?.owner === 'string' ? campaign?.owner : 'Not Assigned');
  const ownerEmail = ownerObj?.email || '';
  const ownerId = ownerObj?._id || ownerObj?.userId || '';

  return (
    <div className="flex items-center justify-between gap-3 mt-1 grow min-h-9">
      {editing ? (
        <div className="flex items-center gap-1.5 w-full">
          <div className="grow max-w-[200px]">
            <SelectWithAvatar
              onSearchChange={(val) => setSearch(val)}
              users={memberList}
              onChange={(value) => setSelectedOwnerId(value)}
              searchFields={['name', 'email']}
              isLoading={membersLoading || membersFetching}
              placeholder="Select owner..."
            />
          </div>
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 p-0 hover:bg-muted"
              onClick={handleSave}
              disabled={isLoading}
            >
              <Check size={14} className="text-emerald-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 p-0 hover:bg-muted"
              onClick={() => setEditing(false)}
              disabled={isLoading}
            >
              <X size={14} className="text-destructive" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between w-full gap-2">
          <Profile
            name={ownerName}
            email={ownerEmail}
            userId={ownerId}
            showName={true}
            size="28px"
          />

          <AuthorityGuard forbidRoles={['Auditor']}>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0 hover:bg-muted"
              onClick={() => setEditing(true)}
            >
              <SquarePen size={12} className="text-muted-foreground" />
            </Button>
          </AuthorityGuard>
        </div>
      )}
    </div>
  );
}
