import { Modal } from '@/components/custom/modal';
import { Button } from '@/components/ui/button';
import { useStore } from '../../store';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '@/components/ui/textarea';
import { useInstallCsmAdapterMutation } from '@/services/csm/adaptersApi';
import { toast } from 'sonner';
import { Cloud, Download, Braces } from 'lucide-react';
import { Input, InputWrapper } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { gcpSchema } from '../../schemas';

function Gcp() {
  const { showInstallModal, setShowInstallModal } = useStore();
  const [installGcp] = useInstallCsmAdapterMutation();

  const form = useForm({
    resolver: zodResolver(gcpSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      serviceAccountKey: '',
      projectId: '',
    },
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const { type } = showInstallModal;
    if (type === 'gcp') {
      setIsOpen(true);
      form.reset({
        name: '',
        serviceAccountKey: '',
        projectId: '',
      });
    } else setIsOpen(false);
  }, [showInstallModal, form]);

  const handleClose = () => {
    setIsOpen(false);
    setShowInstallModal({});
    form.reset();
  };

  const handleInstall = (data) => {
    const installPromise = installGcp({ adapterType: 'gcp', ...data }).unwrap();

    toast.promise(installPromise, {
      loading: 'Installing Google Cloud Platform Integration...',
      success: 'Google Cloud Platform Integration Installed',
      error: 'Failed to install Google Cloud Platform Integration',
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
      title="Integrate Google Cloud Platform"
      description="Configure your GCP environment to fetch cloud assets and security postures."
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
            name="projectId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project ID <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <InputWrapper className={form.formState.errors.projectId ? 'border-destructive' : ''}>
                    <Button size="sm" variant="dim" mode="icon" className="size-5 -ms-0.5" type="button">
                      <Cloud className="w-4 h-4" />
                    </Button>
                    <Input placeholder="Enter project ID" {...field} />
                  </InputWrapper>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="serviceAccountKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Account Key (JSON) <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <div className="relative">
                    <Textarea
                      placeholder="Paste your JSON key here..."
                      rows={10}
                      className={`font-mono text-xs resize-none ${form.formState.errors.serviceAccountKey ? 'border-destructive' : ''}`}
                      {...field}
                    />
                  </div>
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

export default Gcp;
