import { Modal } from '@/components/custom/modal';
import { Button } from '@/components/ui/button';
import { useStore } from '../../store';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useInstallCsmAdapterMutation } from '@/services/csm/adaptersApi';
import { toast } from 'sonner';
import { Cloud, Download, Key, CreditCard, LayoutTemplate } from 'lucide-react';
import { Input, InputWrapper } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { azureSchema } from '../../schemas';

function Azure() {
  const { showInstallModal, setShowInstallModal } = useStore();
  const [installAzure] = useInstallCsmAdapterMutation();

  const form = useForm({
    resolver: zodResolver(azureSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      ApplicationID: '',
      KeyValue: '',
      DirectoryID: '',
      SubscriptionID: '',
    },
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const { type } = showInstallModal;
    if (type === 'azure') {
      setIsOpen(true);
      form.reset({
        name: '',
        ApplicationID: '',
        KeyValue: '',
        DirectoryID: '',
        SubscriptionID: '',
      });
    } else setIsOpen(false);
  }, [showInstallModal, form]);

  const handleClose = () => {
    setIsOpen(false);
    setShowInstallModal({});
    form.reset();
  };

  const handleInstall = (data) => {
    const installPromise = installAzure({ adapterType: 'azure', ...data }).unwrap();

    toast.promise(installPromise, {
      loading: 'Installing Microsoft Azure Integration...',
      success: 'Microsoft Azure Integration Installed',
      error: 'Failed to install Microsoft Azure Integration',
    });

    installPromise
      .then(() => {
        handleClose();
      })
      .catch(() => {
        // Catch prevents unhandled promise rejection if installation fails
      });
  };

  return (
    <Modal
      open={isOpen}
      setOpen={handleClose}
      title="Integrate Microsoft Azure"
      description="Configure your Azure environment to fetch cloud assets and security postures."
      footer={
        <Button 
          variant="outline" 
          onClick={form.handleSubmit(handleInstall)} 
          disabled={form.formState.isSubmitting || !form.formState.isValid}
        >
          <Download className="mr-2 h-4 w-4" /> Install
        </Button>
      }
    >
      <Form {...form}>
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instance Name <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <InputWrapper className={form.formState.errors.name ? 'border-destructive' : ''}>
                    <Button size="sm" variant="dim" mode="icon" className="size-5 -ms-0.5" type="button">
                      <Cloud className="w-4 h-4" />
                    </Button>
                    <Input placeholder="Enter instance name" {...field} />
                  </InputWrapper>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ApplicationID"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Application ID <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <InputWrapper className={form.formState.errors.ApplicationID ? 'border-destructive' : ''}>
                    <Button size="sm" variant="dim" mode="icon" className="size-5 -ms-0.5" type="button">
                      <LayoutTemplate className="w-4 h-4" />
                    </Button>
                    <Input placeholder="00000000-0000-0000-0000-000000000000" {...field} />
                  </InputWrapper>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="KeyValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Key Value (Client Secret) <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <InputWrapper className={form.formState.errors.KeyValue ? 'border-destructive' : ''}>
                    <Button size="sm" variant="dim" mode="icon" className="size-5 -ms-0.5" type="button">
                      <Key className="w-4 h-4" />
                    </Button>
                    <Input type="password" placeholder="Client secret key value" {...field} />
                  </InputWrapper>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="DirectoryID"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Directory ID <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <InputWrapper className={form.formState.errors.DirectoryID ? 'border-destructive' : ''}>
                    <Button size="sm" variant="dim" mode="icon" className="size-5 -ms-0.5" type="button">
                      <LayoutTemplate className="w-4 h-4" />
                    </Button>
                    <Input placeholder="00000000-0000-0000-0000-000000000000" {...field} />
                  </InputWrapper>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="SubscriptionID"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subscription ID <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <InputWrapper className={form.formState.errors.SubscriptionID ? 'border-destructive' : ''}>
                    <Button size="sm" variant="dim" mode="icon" className="size-5 -ms-0.5" type="button">
                      <CreditCard className="w-4 h-4" />
                    </Button>
                    <Input placeholder="00000000-0000-0000-0000-000000000000" {...field} />
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

export default Azure;
