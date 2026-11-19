import { Modal } from "@/components/custom/modal";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { SquarePen } from 'lucide-react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCreateAccountMutation } from '@/services/csm/accountsApi';
import { createProjectSchema } from "./schemas/create-project-schema";
import { Plus } from 'lucide-react';

function CreateProjectModel() {
  const [isOpen, setIsOpen] = useState(false);
  const [createAccount, { isLoading }] = useCreateAccountMutation();

  const form = useForm({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      description: "",
    },
    mode: "onChange",
  });

  const handleCreate = (values) => {
    const payload = {
      name: values.name,
      description: values.description,
      collectionUids: [], // From previous code, collectionIds were commented out
    };

    toast.promise(createAccount(payload).unwrap(), {
      loading: "Connecting Account",
      success: () => {
        handleOpenChange(false);
        return "Account Connected";
      },
      error: () => "Failed to connect account",
    });
  };

  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (!open) {
      form.reset();
    }
  };

  return (
    <div>
      <Modal
        open={isOpen}
        setOpen={handleOpenChange}
        title="Connect Account"
        trigger={<Button><Plus className="w-3 h-3" size={12} />Connect Account</Button>}
        footer={<Button
          onClick={form.handleSubmit(handleCreate)}
          disabled={isLoading || !form.formState.isValid}
        >
          <Plus />Create
        </Button>}
        className="w-[550px]"
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
                    <Input
                      {...field}
                      placeholder="Enter the name of the account"
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
                      placeholder="Enter the description of the account"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default CreateProjectModel;
