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
import { ociSchema } from '../../schemas';

function Oci() {
  const { showInstallModal, setShowInstallModal } = useStore();
  
  const form = useForm({
    resolver: zodResolver(ociSchema),
    mode: "onChange",
    defaultValues: {
      "tenancyId": "",
      "userId": "",
      "fingerprint": "",
      "privateKey": "",
      "region": ""
},
  });

  const [isOpen, setIsOpen] = useState(false);
  const [installAdapter] = useInstallAimAdapterMutation();
  const [manualImport] = useManualImportAimAdapterMutation();

  useEffect(() => {
    let { type } = showInstallModal;
    if (type === 'oci') {
      setIsOpen(true);
      form.reset({
      "tenancyId": "",
      "userId": "",
      "fingerprint": "",
      "privateKey": "",
      "region": ""
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
    const isManual = 'oci' === 'manual';
    const isCsv = 'oci' === 'csv';
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
        : installAdapter({ adapterName: 'oci', payload: formData }).unwrap();
    } else {
      mutationCall = installAdapter({
        adapterName: 'oci',
        payload: data,
      }).unwrap();
    }

    toast.promise(mutationCall, {
      loading: 'Integrating Oci...',
      success: () => {
        handleClose();
        return 'Oci integrated successfully';
      },
      error: (err) => err?.data?.message || err?.data?.error || 'Integration failed',
    });
  };

  return (
    <Modal
      open={isOpen}
      setOpen={handleClose}
      title="Integrate Oci"
      description="Configure integration settings for Oci"
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
            name="tenancyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tenancy ID <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <InputWrapper className={form.formState.errors.tenancyId ? 'border-destructive' : ''}>
                    <Button size="sm" variant="dim" mode="icon" className="size-5 -ms-0.5" type="button">
                      <Globe />
                    </Button>
                    <Input type="text" placeholder="Enter Tenancy ID e.g aaaaaaaah567890" autoComplete="off" {...field} />
                  </InputWrapper>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="userId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User ID <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <InputWrapper className={form.formState.errors.userId ? 'border-destructive' : ''}>
                    <Button size="sm" variant="dim" mode="icon" className="size-5 -ms-0.5" type="button">
                      <Globe />
                    </Button>
                    <Input type="text" placeholder="Enter User ID e.g aaaaaaaah567890" autoComplete="off" {...field} />
                  </InputWrapper>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fingerprint"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fingerprint <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <InputWrapper className={form.formState.errors.fingerprint ? 'border-destructive' : ''}>
                    <Button size="sm" variant="dim" mode="icon" className="size-5 -ms-0.5" type="button">
                      <Globe />
                    </Button>
                    <Input type="text" placeholder="Enter Fingerprint..." autoComplete="off" {...field} />
                  </InputWrapper>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="privateKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Private Key <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter Private Key..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Region <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <InputWrapper className={form.formState.errors.region ? 'border-destructive' : ''}>
                    <Button size="sm" variant="dim" mode="icon" className="size-5 -ms-0.5" type="button">
                      <Globe />
                    </Button>
                    <Input type="text" placeholder="Enter Region..." autoComplete="off" {...field} />
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

export default Oci;
