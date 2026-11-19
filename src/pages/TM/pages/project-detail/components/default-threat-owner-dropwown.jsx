import { useEffect, useMemo, useState } from 'react';
import { User } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useGetMembersQuery } from '@/services/vm/members';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import Select from '@/components/custom/select';
import { useSetDefaultProjectThreatOwnerMutation } from '../../../../../services/tm/projectApi';

const DefaultThreatOwner = ({
  projectCollaborators: members,
  defaultThreatOwner: defaultOwnerProp,
  isLoading,
}) => {
  const location = useLocation();
  const projectId = location.pathname.split('/')[3];

  const [search, setSearch] = useState('');
  const [defaultThreatOwner, setDefaultThreatOwner] = useState(null);

  const [updateDefaultThreatOwner, { isLoading: isSettingThreatOwner }] =
    useSetDefaultProjectThreatOwnerMutation();

  const memberOptions = useMemo(
    () =>
      members?.map((m) => ({
        value: m.userId,
        label: m.name,
        email: m.email,
      })) || [],
    [members?.data?.members],
  );

  // ✅ Sync defaultThreatOwner once both prop + options are ready
  useEffect(() => {
    if (defaultOwnerProp?.userId && memberOptions.length > 0) {
      const match = memberOptions.find(
        (m) => m.value === defaultOwnerProp.userId,
      );
      if (match) {
        setDefaultThreatOwner(match);
      }
    }
  }, [defaultOwnerProp, memberOptions]);

  const handleUpdateThreatOwner = async () => {
    if (!defaultThreatOwner)
      return toast.error('Default Threat Owner is Required!');

    const payload = {
      userId: defaultThreatOwner.value,
      name: defaultThreatOwner.label,
      email: defaultThreatOwner.email,
    };

    toast.promise(updateDefaultThreatOwner({ payload, projectId }).unwrap(), {
      loading: 'Updating Default Threat Owner',
      success: () => {
        return 'Default Threat Owner Updated Successfully';
      },
      error: () => {
        return 'Error Updating Default Threat Owner';
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Default Threat Owner</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5">
        <div className="w-full">
          {isLoading ? (
            <Skeleton className=" w-full h-20" />
          ) : (
            <div className="flex items-baseline flex-wrap lg:flex-nowrap gap-2.5">
              <Label className="flex w-full max-w-40">
                Select Default Threat Owner
              </Label>
              <Select
                placeholder="Select a Member"
                searchPlaceholder="Search Members..."
                onChange={setDefaultThreatOwner}
                options={memberOptions}
                defaultValue={defaultOwnerProp?.userId}
                enableSearch={true}
                areOptionsNavigating={false}
                searchField="label"
                emptyMessage="No Members found."
                value={defaultThreatOwner}
                onSearchChange={(search) => {
                  setSearch(search);
                }}
              />
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2.5 gap-2">
          <Button
            onClick={handleUpdateThreatOwner}
            disabled={isSettingThreatOwner || !defaultThreatOwner}
          >
            <User className="size-4 mr-2" />
            Update Default Threat Owner
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DefaultThreatOwner;
