import { useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateVsScannerMutation } from '@/services/vs/vsApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Modal } from '@/components/custom/modal';
import { createScannerSchema } from "./schemas/create-scanner-schema";
import { CustomTooltip } from '../../../../../../components/custom/tooltip';

function CreateScannerModel({ onClose, onCreate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [createScanner, { isLoading: isCreating }] = useCreateVsScannerMutation();

  const form = useForm({
    resolver: zodResolver(createScannerSchema),
    mode: "onChange",
    defaultValues: {
      name: '',
      ip: '',
    },
  });

  const onSubmit = async (values) => {
    toast.promise(createScanner({
      name: values.name,
      ip: values.ip
    }).unwrap(), {
      loading: 'Creating Scanner',
      success: () => {
        setIsOpen(false);
        form.reset();
        if (onCreate) onCreate();
        return 'Scanner Created';
      },
      error: (err) => { return err?.data?.message || 'Failed to create Scanner' },
    });
  };

  return (
    <Modal
      open={isOpen}
      setOpen={(val) => {
        setIsOpen(val);
        if (!val) form.reset();
      }}
      title="Add New Scanner"
      description="Create a new scanner by providing a Name and IP."
      trigger={
        <Button variant="outline" onClick={() => setIsOpen(true)}>
          <Plus /> Add
        </Button>
      }
      footer={
        <div className="mt-2 text-right">
          <Button
            type="submit"
            form="create-scanner-form"
            disabled={isCreating || !form.formState.isValid || form.formState.isSubmitting}
          >
            <Plus /> Add New Scanner
          </Button>
        </div>
      }
      className="w-1/3"
    >
      <Form {...form}>
        <form
          id="create-scanner-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Scanner Name <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter Scanner Name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ip"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center justify-between">
                  <span>Scanner URL <span className="text-destructive">*</span></span>
                  <em className="text-[10px] text-muted-foreground font-normal">(should be live and accessible from outside)</em>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter Scanner URL"
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

export default CreateScannerModel;
