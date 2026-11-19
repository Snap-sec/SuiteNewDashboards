import { useEffect, useState } from 'react';
import { SquarePen, Users, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useUpdateAimBusinessUnitMutation } from '@/services/asset-inventory/businessUnitsApi';
import { useGetOrgMembersQuery } from '@/services/auth/orgApi';
import { Button } from '@/components/ui/button';
import { Input, InputWrapper } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Modal } from '@/components/custom/modal';
import Select from '@/components/custom/select';
import { CustomTooltip } from '../../../../../../components/custom/tooltip';

function EditBusinessUnitModal({
  id,
  avatar,
  name,
  info,
  owner: initialOwner,
  className = '',
}) {

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const { data: orgMembers, isFetching } = useGetOrgMembersQuery({ search });
  const [updateBU, { isLoading }] = useUpdateAimBusinessUnitMutation();

  const [owner, setOwner] = useState(null);

  const [payload, setPayload] = useState({
    name: '',
    info: '',
    avatar: '',
  });

  const [memberOptions, setMemberOptions] = useState([]);

  // Prefill from props
  useEffect(() => {
    setPayload({
      name: name,
      info: info,
      avatar: avatar,
    });

    if (initialOwner) {
      setOwner({
        label: initialOwner.name || initialOwner.email,
        value: {
          id: initialOwner.id,
          name: initialOwner.name || initialOwner.email,
          email: initialOwner.email,
        },
      });
    }
  }, [id, name, info, avatar, initialOwner]);

  // Members dropdown
  useEffect(() => {
    if (orgMembers?.data?.members) {
      const formatted = orgMembers.data.members.map((m) => ({
        id: m.userId,
        label: m.name || m.email,
        value: { id: m.userId, name: m.name || m.email, email: m.email },
      }));
      setMemberOptions(formatted);
    }
  }, [orgMembers]);

  const handleUpdate = () => {
    if (!payload.name || payload.name.length < 3) return toast.error('Name must be at least 3 characters');
    if (payload.name.length > 100) return toast.error('Name cannot exceed 100 characters');
    if (!/^[a-zA-Z0-9\s]+$/.test(payload.name)) return toast.error('Name must be alphanumeric');
    if (!payload.info) return toast.error('Description required');
    if (payload.info.length > 500) return toast.error('Description cannot exceed 500 characters');
    if (!owner) return toast.error('Owner required');
    if (!/^https?:\/\/.+/.test(payload.avatar)) return toast.error('Logo must be a valid URL (e.g., https://example.com/logo.png)');

    const data = {
      id,
      name: payload.name,
      description: payload.info,
      logo: payload.avatar,
      owner: {
        id: owner.value.id,
        name: owner.value.name,
        email: owner.value.email,
      },
    };

    toast.promise(updateBU(data).unwrap(), {
      loading: 'Updating...',
      success: () => {
        setOpen(false);
        return 'Business Unit updated successfully ✅';
      },
      error: () => 'Failed to update Business Unit',
    });
  };

  return (
    <>
      <CustomTooltip text="Edit Business Unit">
        <Button
          variant="ghost"
          onClick={() => setOpen(true)}
        >
          <SquarePen className=" w-full" />
        </Button>
      </CustomTooltip>

      <Modal
        open={open}
        setOpen={setOpen}
        title="Edit Business Unit"
        description="Update business unit info."
      >
        <div className="flex flex-col gap-4">
          <div>
            <Label>Name <span className="text-destructive">*</span></Label>
            <InputWrapper>
              <Users />
              <Input
                placeholder="Business Unit Name"
                value={payload.name}
                onChange={(e) =>
                  setPayload({ ...payload, name: e.target.value })
                }
                className="pl-9"
              />
            </InputWrapper>
          </div>

          <div>
            <Label>Info <span className="text-destructive">*</span></Label>
            <Textarea
              placeholder="Describe this business unit"
              value={payload.info}
              onChange={(e) => setPayload({ ...payload, info: e.target.value })}
            />
          </div>

          <div>
            <Label>Owner <span className="text-destructive">*</span></Label>
            <Select
              placeholder="Select Owner"
              options={memberOptions}
              value={owner?.value?.id}
              defaultValue={owner?.value?.id}
              onChange={setOwner}
              onSearchChange={setSearch}
              isSearching={isFetching}
            />
          </div>

          <div>
            <Label>Avatar URL <span className="text-destructive">*</span></Label>
            <div className="flex gap-2 items-start w-full">
              <InputWrapper className="flex-1">
                <Button size="sm" variant="dim" mode="icon" className="size-5 -ms-0.5" type="button">
                  <ImageIcon />
                </Button>
                <Input
                  placeholder="https://example.com/image.png"
                  value={payload?.avatar}
                  onChange={(e) =>
                    setPayload({ ...payload, avatar: e.target.value })
                  }
                />
              </InputWrapper>
              <div className="size-8 rounded-lg border flex items-center justify-center overflow-hidden shrink-0 bg-accent/20 shadow-sm transition-all hover:scale-105">
                {payload?.avatar ? (
                  <img
                    src={payload.avatar}
                    alt="Logo preview"
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/media/avatars/default-image2.png';
                    }}
                  />
                ) : (
                  <ImageIcon className="size-5 text-muted-foreground" />
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={handleUpdate} disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Business Unit'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default EditBusinessUnitModal;
