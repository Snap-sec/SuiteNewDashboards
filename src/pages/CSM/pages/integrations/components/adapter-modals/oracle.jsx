import { Modal } from '@/components/custom/modal';
import { Button } from '@/components/ui/button';
import { useStore } from '../../store';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useInstallCsmAdapterMutation } from '@/services/csm/adaptersApi';
import { toast } from 'sonner';
import { Cloud, Download, Key, User, Hash, Box, Globe } from 'lucide-react';
import { Input, InputWrapper } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { oracleSchema } from '../../schemas';

function Oracle() {
  const { showInstallModal, setShowInstallModal } = useStore();
  const [installOracle] = useInstallCsmAdapterMutation();

  const form = useForm({
    resolver: zodResolver(oracleSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      tenancyId: '',
      compartmentId: '',
      userId: '',
      keyFingerprint: '',
      keyValue: '',
      region: '',
    },
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const { type } = showInstallModal;
    if (type === 'oracle') {
      setIsOpen(true);
      form.reset({
        name: '',
        tenancyId: '',
        compartmentId: '',
        userId: '',
        keyFingerprint: '',
        keyValue: '',
        region: '',
      });
    } else setIsOpen(false);
  }, [showInstallModal, form]);

  const handleClose = () => {
    setIsOpen(false);
    setShowInstallModal({});
    form.reset();
  };

  const handleInstall = (data) => {
    const installPromise = installOracle({ adapterType: 'oracle', ...data }).unwrap();

    toast.promise(installPromise, {
      loading: 'Installing Oracle Cloud Infrastructure Integration...',
      success: 'Oracle Cloud Infrastructure Integration Installed',
      error: 'Failed to install Oracle Cloud Infrastructure Integration',
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
      title="Integrate Oracle Cloud Infrastructure"
      description="Configure your Oracle environment to fetch cloud assets and security postures."
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
            name="tenancyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tenancy ID <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <InputWrapper className={form.formState.errors.tenancyId ? 'border-destructive' : ''}>
                    <Button size="sm" variant="dim" mode="icon" className="size-5 -ms-0.5" type="button">
                      <Hash className="w-4 h-4" />
                    </Button>
                    <Input placeholder="ocid1.tenancy.oc1..example" {...field} />
                  </InputWrapper>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="compartmentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Compartment ID (Optional)</FormLabel>
                <FormControl>
                  <InputWrapper className={form.formState.errors.compartmentId ? 'border-destructive' : ''}>
                    <Button size="sm" variant="dim" mode="icon" className="size-5 -ms-0.5" type="button">
                      <Box className="w-4 h-4" />
                    </Button>
                    <Input placeholder="ocid1.compartment.oc1..example" {...field} />
                  </InputWrapper>
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
                <FormLabel>Region (Optional)</FormLabel>
                <FormControl>
                  <InputWrapper className={form.formState.errors.region ? 'border-destructive' : ''}>
                    <Button size="sm" variant="dim" mode="icon" className="size-5 -ms-0.5" type="button">
                      <Globe className="w-4 h-4" />
                    </Button>
                    <Input placeholder="us-ashburn-1 (default)" {...field} />
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
                      <User className="w-4 h-4" />
                    </Button>
                    <Input placeholder="ocid1.user.oc1..example" {...field} />
                  </InputWrapper>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="keyFingerprint"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Key Fingerprint <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <InputWrapper className={form.formState.errors.keyFingerprint ? 'border-destructive' : ''}>
                    <Button size="sm" variant="dim" mode="icon" className="size-5 -ms-0.5" type="button">
                      <Key className="w-4 h-4" />
                    </Button>
                    <Input placeholder="20:3b:97:13:55:1c:5b:0d:d3:37:d8:50:4e:c5:3a:34" {...field} />
                  </InputWrapper>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="keyValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Key Value (Private Key) <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <div className="relative">
                    <Textarea
                      placeholder={`-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----`}
                      rows={5}
                      className={`font-mono text-xs resize-none ${form.formState.errors.keyValue ? 'border-destructive' : ''}`}
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

export default Oracle;
