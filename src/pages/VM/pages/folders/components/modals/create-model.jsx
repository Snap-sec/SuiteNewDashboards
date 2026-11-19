import { useState } from 'react';
import { Plus, FolderPlus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/custom/modal';
import { useCreateVmFolderMutation } from '../../../../../../services/vm/foldersApi';
import { AddFolderAssessmentCard } from './add-folder-card';
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

function CreateModel({ isSimpleButton = false, triggerText = "Create Folder" }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createVmFolder, { isLoading }] = useCreateVmFolderMutation();

  const form = useForm({
    resolver: zodResolver(folderSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      parentFolderId: null,
    },
  });

  const handleSubmit = async (values) => {
    try {
      const payload = {
        name: values.name.trim(),
        parentFolderId: values.parentFolderId || null,
        children: [
          {
            _id: values.parentFolderId || null,
            type: 'folder',
          },
        ],
      };

      toast.promise(createVmFolder(payload).unwrap(), {
        loading: 'Creating Folder...',
        success: () => {
          setIsModalOpen(false);
          form.reset();
          return 'Folder created successfully';
        },
        error: 'Failed to create folder',
      });
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    form.reset();
  };

  return (
    <Modal
      open={isModalOpen}
      setOpen={setIsModalOpen}
      onOpenChange={handleModalClose}
      title="Create Folder"
      description="Create a new folder to organize your assessments."
      trigger={
        isSimpleButton ? (
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            <FolderPlus className="mr-2 h-4 w-4" />
            {triggerText}
          </Button>
        ) : (
          <AddFolderAssessmentCard
            title={"Create Folder"}
            subTitle={"Create a new folder."}
            iconSize={30}
            onClick={() => setIsModalOpen(true)}
            logo={<FolderPlus className='h-[40px] w-[40px]' />}
            className={'flex flex-col items-center justify-center gap-5'}
            alignment="text-center"
          />
        )
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
            {isLoading ? (
              'Creating...'
            ) : (
              <>
                <Plus className="mr-2" size={16} /> Create Folder
              </>
            )}
          </Button>
        </div>
      }
      className="w-full md:w-1/2 lg:w-1/3"
    >
      <Form {...form}>
        <div className="flex flex-col gap-4 py-2">
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
        </div>
      </Form>
    </Modal>
  );
}

export default CreateModel;
