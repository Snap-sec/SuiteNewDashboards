import { useState, useEffect } from 'react';
import { FolderPen, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/custom/modal';
import { useUpdateVmFolderMutation } from '@/services/vm/foldersApi';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { folderSchema } from "./schemas/folder-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

function EditModel({ folders, onCloseDropdown }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateVmFolder, { isLoading }] = useUpdateVmFolderMutation();

  const form = useForm({
    resolver: zodResolver(folderSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      parentFolderId: null,
      assessments: [],
    },
  });

  // Pre-populate form when modal opens with the selected folder data
  useEffect(() => {
    if (folders && isModalOpen) {
      form.reset({
        name: folders.name || '',
        parentFolderId: folders.parent || null,
        assessments: folders.assessments?.map(assessment => ({
          value: assessment.assessmentId,
          label: assessment.title
        })) || []
      });
    }
  }, [folders, isModalOpen, form]);

  const handleSubmit = async (values) => {
    if (!folders?._id) {
      toast.error('No folder selected for editing');
      return;
    }

    try {
      const payload = {
        id: folders._id,
        name: values.name.trim(),
        children: []
      };

      if (values.assessments && values.assessments.length > 0) {
        payload.children = values.assessments.map(assessment => ({
          type: "assessment",
          assessmentId: assessment.value,
          name: assessment.label
        }));
      }

      toast.promise(updateVmFolder(payload).unwrap(), {
        loading: 'Updating Folder...',
        success: () => {
          setIsModalOpen(false);
          form.reset();
          onCloseDropdown?.();
          return 'Folder updated successfully';
        },
        error: 'Failed to update folder',
      });
    } catch (error) {
      console.error('Error updating folder:', error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    form.reset();
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  return (
    <Modal
      open={isModalOpen}
      setOpen={setIsModalOpen}
      onOpenChange={handleModalClose}
      title="Update Folder"
      description="Update the folder name"
      trigger={
        <div 
          className='text-foreground hover:bg-accent relative flex cursor-default select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-hidden transition-colors data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([role=img]):not([class*=text-])]:opacity-60 [&_svg:not([class*=size-])]:size-4 [&_svg]:shrink-0 focus:bg-accent focus:text-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground'
          onClick={handleModalOpen}
        >
          <FolderPen size={16} />
          <span>Rename</span>
        </div>
      }
      footer={
        <div className="flex gap-2 justify-end mt-4">
          <Button 
            variant="outline" 
            onClick={handleModalClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={form.handleSubmit(handleSubmit)}
            disabled={isLoading || !form.formState.isValid}
          >
            {isLoading ? 'Updating...' : 'Update Folder'}
          </Button>
        </div>
      }
      className="w-full md:w-1/2 lg:w-1/3"
    >
      <Form {...form}>
        <div className='flex flex-col gap-4 py-2'>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-1">
                <FormLabel className="text-sm font-medium">
                  Name <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input 
                    {...field}
                    placeholder="Enter folder name" 
                    disabled={isLoading}
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )}
          />

          {/* Commented out sections for future use with RHF */}
          {/* 
          <FormField
            control={form.control}
            name="assessments"
            ...
          />
          <FormField
            control={form.control}
            name="parentFolderId"
            ...
          />
          */}
        </div>
      </Form>
    </Modal>
  );
}

export default EditModel;
