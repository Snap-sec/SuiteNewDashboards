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
import { cloudflareSchema } from '../../schemas';

function Cloudflare() {
  const { showInstallModal, setShowInstallModal } = useStore();
  
  const form = useForm({
    resolver: zodResolver(cloudflareSchema),
    mode: "onChange",
    defaultValues: {
      "apiKey": "",
      "orgWebsite": ""
},
  });

  const [isOpen, setIsOpen] = useState(false);
  const [installAdapter] = useInstallAimAdapterMutation();
  const [manualImport] = useManualImportAimAdapterMutation();

  useEffect(() => {
    let { type } = showInstallModal;
    if (type === 'cloudflare') {
      setIsOpen(true);
      form.reset({
      "apiKey": "",
      "orgWebsite": ""
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
    const isManual = 'cloudflare' === 'manual';
    const isCsv = 'cloudflare' === 'csv';
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
        : installAdapter({ adapterName: 'cloudflare', payload: formData }).unwrap();
    } else {
      mutationCall = installAdapter({
        adapterName: 'cloudflare',
        payload: data,
      }).unwrap();
    }

    toast.promise(mutationCall, {
      loading: 'Integrating Cloudflare...',
      success: () => {
        handleClose();
        return 'Cloudflare integrated successfully';
      },
      error: (err) => err?.data?.message || err?.data?.error || 'Integration failed',
    });
  };

  return (
    <Modal
      open={isOpen}
      setOpen={handleClose}
      title="Integrate Cloudflare"
      description="Configure integration settings for Cloudflare"
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
            name="apiKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>API Key <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <InputWrapper className={form.formState.errors.apiKey ? 'border-destructive' : ''}>
                    <Button size="sm" variant="dim" mode="icon" className="size-5 -ms-0.5" type="button">
                      <RiLockPasswordFill />
                    </Button>
                    <Input type="password" placeholder="Enter API Key..." autoComplete="new-password" {...field} />
                  </InputWrapper>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="orgWebsite"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization Website <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <InputWrapper className={form.formState.errors.orgWebsite ? 'border-destructive' : ''}>
                    <Button size="sm" variant="dim" mode="icon" className="size-5 -ms-0.5" type="button">
                      <Globe />
                    </Button>
                    <Input type="text" placeholder="Enter Organization Website..." autoComplete="off" {...field} />
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

export default Cloudflare;
