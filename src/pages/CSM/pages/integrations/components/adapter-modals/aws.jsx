import { Modal } from '@/components/custom/modal';
import { Button } from '@/components/ui/button';
import { useStore } from '../../store';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useInstallCsmAdapterMutation } from '@/services/csm/adaptersApi';
import { toast } from 'sonner';
import { Cloud, Download, Key } from 'lucide-react';
import { Input, InputWrapper } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { awsSchema } from '../../schemas';

function Aws() {
  const { showInstallModal, setShowInstallModal } = useStore();
  const [installAws] = useInstallCsmAdapterMutation();

  const form = useForm({
    resolver: zodResolver(awsSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      accessKeyId: '',
      secretAccessKey: '',
    },
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const { type } = showInstallModal;
    if (type === 'aws') {
      setIsOpen(true);
      form.reset({
        name: '',
        accessKeyId: '',
        secretAccessKey: '',
      });
    } else setIsOpen(false);
  }, [showInstallModal, form]);

  const handleClose = () => {
    setIsOpen(false);
    setShowInstallModal({});
    form.reset();
  };

  const handleInstall = (data) => {
    const installPromise = installAws({ adapterType: 'aws', ...data }).unwrap();

    toast.promise(installPromise, {
      loading: 'Installing Amazon Web Services Integration...',
      success: 'Amazon Web Services Integration Installed',
      error: 'Failed to install Amazon Web Services Integration',
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
      title="Integrate Amazon Web Services"
      description="Configure your AWS environment to fetch cloud assets and security postures."
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
            name="accessKeyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Access Key ID <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <InputWrapper className={form.formState.errors.accessKeyId ? 'border-destructive' : ''}>
                    <Button size="sm" variant="dim" mode="icon" className="size-5 -ms-0.5" type="button">
                      <Key className="w-4 h-4" />
                    </Button>
                    <Input placeholder="Enter Access Key ID" {...field} />
                  </InputWrapper>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="secretAccessKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Secret Access Key <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <InputWrapper className={form.formState.errors.secretAccessKey ? 'border-destructive' : ''}>
                    <Button size="sm" variant="dim" mode="icon" className="size-5 -ms-0.5" type="button">
                      <Key className="w-4 h-4" />
                    </Button>
                    <Input type="password" placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY" {...field} />
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

export default Aws;
