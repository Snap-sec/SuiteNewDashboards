import { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Users, Globe, FileText, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useCreateAimBusinessUnitMutation } from '@/services/asset-inventory/businessUnitsApi';
import { useGetOrgMembersQuery } from '@/services/auth/orgApi';
import { Button } from '@/components/ui/button';
import { Input, InputWrapper } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Modal } from '@/components/custom/modal';
import Select from '@/components/custom/select';
import useDebounce from '../../../../../../hooks/use-debounce';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { cn } from '@/lib/utils';
import { businessUnitSchema } from './schemas';

function CreateBusinessUnitModal({ className }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  const {
    data: orgMembers,
    isFetching,
    isLoading: isMembersLoading,
  } = useGetOrgMembersQuery(
    { search: debouncedSearch },
    { skip: !open }
  );

  const [createBU] = useCreateAimBusinessUnitMutation();

  const form = useForm({
    resolver: zodResolver(businessUnitSchema),
    mode: "onChange",
    defaultValues: {
      name: '',
      description: '',
      logo: '',
      owner: null,
    },
  });

  const memberOptions = useMemo(() => {
    return orgMembers?.data?.members?.map?.((m) => ({
      id: m.userId,
      label: m.name || m.email,
      value: { id: m.userId, name: m.name || m.email, email: m.email },
    })) || [];
  }, [orgMembers]);

  const handleClose = () => {
    setOpen(false);
    form.reset();
  };

  const onSubmit = (data) => {
    toast.promise(createBU(data).unwrap(), {
      loading: 'Creating Business Unit...',
      success: () => {
        handleClose();
        return 'Business Unit created ';
      },
      error: () => 'Failed to create Business Unit',
    });
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} className={cn("w-full sm:w-auto", className)}>
        <Plus className="mr-2" /> Create Business Unit
      </Button>

      <Modal
        open={open}
        setOpen={handleClose}
        title="Create Business Unit"
        description="Create a new business unit in your organization."
      >
        <Form {...form}>
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <InputWrapper className={form.formState.errors.name ? 'border-destructive' : ''}>
                      {/* <Button size="sm" variant="dim" mode="icon" className="size-5 -ms-0.5" type="button"> */}
                        <Users />
                      {/* </Button> */}
                      <Input placeholder="e.g. Tech Division" {...field} />
                    </InputWrapper>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <div className="relative">
                      {/* <Button size="sm" variant="dim" mode="icon" className="size-5 absolute top-2.5 left-2.5 z-10" type="button"> */}
                        <FileText className=" text-gray-400 size-5 absolute top-2.5 left-2.5 z-10"/>
                      {/* </Button> */}
                      <Textarea
                        placeholder="Describe this business unit"
                        className={`pl-9 min-h-[100px] ${
                          form.formState.errors.description ? 'border-destructive' : ''
                        }`}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="owner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Owner <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Select
                      placeholder="Select Owner"
                      options={memberOptions}
                      value={field.value}
                      onChange={(option) => field.onChange(option.value)}
                      onSearchChange={setSearch}
                      isSearching={isMembersLoading || isFetching}
                      error={!!form.formState.errors.owner}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo URL <span className="text-destructive">*</span></FormLabel>
                  <div className="flex gap-2 items-start w-full">
                    <FormControl className="flex-1">
                      <InputWrapper className={form.formState.errors.logo ? 'border-destructive' : ''}>
                        {/* <Button size="sm" variant="dim" mode="icon" className="size-5 -ms-0.5" type="button"> */}
                          <ImageIcon />
                        {/* </Button> */}
                        <Input placeholder="https://example.com/logo.png" {...field} />
                      </InputWrapper>
                    </FormControl>
                    <div className="size-8 rounded-lg border flex items-center justify-center overflow-hidden shrink-0 bg-accent/20 shadow-sm transition-all hover:scale-105">
                      {field.value ? (
                        <img
                          src={field.value}
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-2">
              <Button
                onClick={form.handleSubmit(onSubmit)}
                disabled={form.formState.isSubmitting || !form.formState.isValid}
              >
                <Plus className="mr-2" />
                {form.formState.isSubmitting ? 'Creating...' : 'Create Business Unit'}
              </Button>
            </div>
          </div>
        </Form>
      </Modal>
    </>
  );
}

export default CreateBusinessUnitModal;