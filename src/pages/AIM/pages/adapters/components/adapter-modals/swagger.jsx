import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RiLockPasswordFill } from '@remixicon/react';
import { Globe, Download } from 'lucide-react';
import { toast } from 'sonner';
import { useInstallAimAdapterMutation, useManualImportAimAdapterMutation } from '@/services/asset-inventory/adaptersApi';
import { Button } from '@/components/ui/button';
import { Input, InputWrapper } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Modal } from '@/components/custom/modal';
import { useStore } from '../../store';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { swaggerSchema } from '../../schemas';

function Swagger() {
  const { showInstallModal, setShowInstallModal } = useStore();
  
  const form = useForm({
    resolver: zodResolver(swaggerSchema),
    mode: "onChange",
    defaultValues: {
      "swaggerUrl": ""
},
  });

  const [isOpen, setIsOpen] = useState(false);
  const [installAdapter] = useInstallAimAdapterMutation();
  const [manualImport] = useManualImportAimAdapterMutation();

  useEffect(() => {
    let { type } = showInstallModal;
    if (type === 'swagger') {
      setIsOpen(true);
      form.reset({
      "swaggerUrl": ""
});
    } else {
      setIsOpen(false);
    }
  }, [showInstallModal, form]);

  const handleClose = () => {
    setIsOpen(false);
    setShowInstallModal({});
    form.reset();
  };

  const handleInstall = async (data) => {
    const isManual = 'swagger' === 'manual';
    const isCsv = 'swagger' === 'csv';
    const hasFile = false;

    let mutationCall;
    
    if (hasFile) {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'file' && value && value.length > 0) {
          formData.append(key, value[0]);
        } else if (key !== 'file') {
          formData.append(key, value);
        }
      });
      
      mutationCall = isManual 
        ? manualImport(formData).unwrap() 
        : installAdapter({ adapterName: 'swagger', payload: formData }).unwrap();
    } else {
      mutationCall = installAdapter({
        adapterName: 'swagger',
        payload: data,
      }).unwrap();
    }

    toast.promise(mutationCall, {
      loading: 'Integrating Swagger...',
      success: () => {
        handleClose();
        return 'Swagger integrated successfully';
      },
      error: (err) => err?.data?.message || err?.data?.error || 'Integration failed',
    });
  };

  return (
    <Modal
      open={isOpen}
      setOpen={handleClose}
      title="Integrate Swagger"
      description="Configure integration settings for Swagger"
      footer={
        <Button
          variant="outline"
          onClick={form.handleSubmit(handleInstall)}
          disabled={form.formState.isSubmitting || !form.formState.isValid}
        >
          <Download /> Integrate
        </Button>
      }
    >
      <Form {...form}>
        <form style={{ display: 'none' }} aria-hidden="true">
          <input type="text" name="fakeUsernameToBypassAutofill" autoComplete="username" />
          <input type="password" name="fakePasswordToBypassAutofill" autoComplete="current-password" />
        </form>
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="swaggerUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Swagger URL <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <InputWrapper className={form.formState.errors.swaggerUrl ? 'border-destructive' : ''}>
                    <Button size="sm" variant="dim" mode="icon" className="size-5 -ms-0.5" type="button">
                      <Globe />
                    </Button>
                    <Input type="text" placeholder="Enter Swagger URL..." autoComplete="off" {...field} />
                  </InputWrapper>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Form>
    </Modal>
  );
}

export default Swagger;
