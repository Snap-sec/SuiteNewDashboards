import { useEffect, useState } from 'react';
import { Group, List, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Modal } from '@/components/custom/modal';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  useCreateVsGroupMutation,
  useUpdateVsGroupMutation,
} from '../../../../../../services/vs/groupApi';
import { postGroupSchema } from "./schemas/post-group-schema";

/**
 * Modal Component: post-group-modal
 *
 * This component serves a dual purpose:
 * 1. Creating a new Group.
 * 2. Updating an existing Group.
 *
 * Behavior is controlled via the presence of:
 * - `groupId, groupName, and groupDescription`: If provided, the modal operates in "Update" mode. otherwise in "Create" mode
 * - `groupName` and `groupDescription`: Used to pre-fill fields for updating.
 *
 */

function PostGroupModal({
  onCreate,
  isOpen: parentIsOpen,
  setIsOpen: setParentIsOpen,
  groupId,
  groupName = '',
  groupDescription = '',
  triggeredBtnText = "Add Group"
}) {
  const isUpdateMode = !!(groupId && groupName && groupDescription);
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  const isOpen = parentIsOpen || internalIsOpen;
  const setIsOpen = setParentIsOpen || setInternalIsOpen;

  const [createGroup, { isLoading: isCreating }] = useCreateVsGroupMutation();
  const [updateGroupDetails, { isLoading: isUpdating }] = useUpdateVsGroupMutation();

  const form = useForm({
    resolver: zodResolver(postGroupSchema),
    mode: "onChange",
    defaultValues: {
      name: groupName || '',
      description: groupDescription || '',
    },
  });

  const onSubmit = async (values) => {
    try {
      if (isUpdateMode) {
        toast.promise(
          updateGroupDetails({ 
            groupId, 
            name: values.name, 
            description: values.description 
          }).unwrap(),
          {
            loading: 'Updating Asset Group',
            success: 'Asset Group Updated',
            error: 'Failed to update Asset Group',
          },
        );
      } else {
        toast.promise(
          createGroup({ 
            name: values.name, 
            description: values.description 
          }).unwrap(), 
          {
            loading: 'Creating Asset Group',
            success: 'Asset Group Created',
            error: 'Failed to create Asset Group',
          }
        );
      }

      setIsOpen(false);
      if (onCreate) onCreate();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: groupName || '',
        description: groupDescription || '',
      });
    }
  }, [isOpen, groupName, groupDescription, form]);

  return (
    <Modal
      open={isOpen}
      setOpen={setIsOpen}
      title={`${isUpdateMode ? 'Update' : 'Create'} Asset Group`}
      description={`${isUpdateMode ? 'Update' : 'Create'} a asset group by providing a name and description.`}
      trigger={
        !isUpdateMode && (
          <Button onClick={() => setInternalIsOpen(true)}>
            <Plus />
            {triggeredBtnText}
          </Button>
        )
      }
      footer={
        <div className="mt-2">
          <Button 
            type="submit" 
            form="post-group-form" 
            disabled={isCreating || isUpdating || !form.formState.isValid || form.formState.isSubmitting}
          >
            <Plus />
            {isUpdateMode ? 'Update' : 'Create'}
          </Button>
        </div>
      }
      className="w-1/3"
    >
      <Form {...form}>
        <form 
          id="post-group-form" 
          onSubmit={form.handleSubmit(onSubmit)} 
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter Name"
                  />
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
                  <Textarea
                    {...field}
                    placeholder="Enter Description"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </Modal>
  );
}

export default PostGroupModal;
