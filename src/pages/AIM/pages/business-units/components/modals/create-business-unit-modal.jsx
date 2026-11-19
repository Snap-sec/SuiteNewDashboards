import { useEffect, useState } from 'react';
import { Plus, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateAimBusinessUnitMutation } from '@/services/asset-inventory/businessUnitsApi';
import { useGetOrgMembersQuery } from '@/services/auth/orgApi';
import { Button } from '@/components/ui/button';
import { Input, InputWrapper } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Modal } from '@/components/custom/modal';
import Select from '@/components/custom/select';

const businessUnitSchema = z.object({
  name: z.string()
    .min(3, 'Name must be at least 3 characters')
    .max(20, 'Name cannot exceed 20 characters'),
  description: z.string()
    .min(1, 'Description required')
    .max(40, 'Description cannot exceed 40 characters'),
  owner: z.object({
    id: z.string(),
    label: z.string(),
    value: z.object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
    }),
  }, { required_error: 'Owner required' }).nullable().refine(val => val !== null, { message: 'Owner required' }),
  logo: z.string().url('Logo must be a valid URL (e.g., https://example.com/logo.png)'),
});

function CreateBusinessUnitModal() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const { data: orgMembers, isFetching } = useGetOrgMembersQuery({ search });
  const [createBU, { isLoading }] = useCreateAimBusinessUnitMutation();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(businessUnitSchema),
    defaultValues: {
      name: '',
      description: '',
      owner: null,
      logo: '',
    },
  });

  const [memberOptions, setMemberOptions] = useState([]);

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

  const onSubmit = (data) => {
    const payload = {
      name: data.name,
      description: data.description,
      logo: data.logo,
      owner: {
        id: data.owner.id,
        name: data.owner.value.name,
        email: data.owner.value.email,
      },
    };

    toast.promise(createBU(payload).unwrap(), {
      loading: 'Creating...',
      success: () => {
        reset();
        setOpen(false);
        return 'Business Unit created';
      },
      error: () => 'Failed to create Business Unit',
    });
  };

  const watchedName = watch('name');
  const watchedDescription = watch('description');

  return (
    <>
      <Button onClick={() => setOpen(true)} className="mb-4">
        <Plus className="mr-2" /> Create Business Unit
      </Button>

      <Modal
        open={open}
        setOpen={() => {
          setOpen(false);
          reset();
        }}
        title="Create Business Unit"
        description="Create a new business unit in your organization."
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <Label>Name <span className="text-destructive">*</span></Label>
              <span className={`text-[10px] ${watchedName?.length > 20 ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>
                {watchedName?.length || 0}/20
              </span>
            </div>
            <InputWrapper>
              <Users className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="e.g. Tech Division"
                {...register('name')}
                className={`pl-9 ${errors.name ? 'border-destructive' : ''}`}
              />
            </InputWrapper>
            {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <Label>Description <span className="text-destructive">*</span></Label>
              <span className={`text-[10px] ${watchedDescription?.length > 40 ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>
                {watchedDescription?.length || 0}/40
              </span>
            </div>
            <Textarea
              placeholder="Describe this business unit"
              {...register('description')}
              className={errors.description ? 'border-destructive' : ''}
            />
            {errors.description && <p className="text-destructive text-xs">{errors.description.message}</p>}
          </div>

          <div className="space-y-1">
            <Label>Owner <span className="text-destructive">*</span></Label>
            <Controller
              name="owner"
              control={control}
              render={({ field }) => (
                <Select
                  placeholder="Select Owner"
                  options={memberOptions}
                  value={field?.value?.name}
                  onChange={field.onChange}
                  onSearchChange={setSearch}
                  isSearching={isFetching}
                  className={errors.owner ? 'border-destructive' : ''}
                />
              )}
            />
            {errors.owner && <p className="text-destructive text-xs">{errors.owner.message}</p>}
          </div>

          <div className="space-y-1">
            <Label>Logo URL <span className="text-destructive">*</span></Label>
            <Input
              placeholder="https://example.com/logo.png"
              {...register('logo')}
              className={errors.logo ? 'border-destructive' : ''}
            />
            {errors.logo && <p className="text-destructive text-xs">{errors.logo.message}</p>}
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={isLoading}>
              <Plus className="mr-2" />{' '}
              {isLoading ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default CreateBusinessUnitModal;
