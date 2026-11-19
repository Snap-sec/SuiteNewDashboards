import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Globe, Download, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { useInstallAimAdapterMutation } from '@/services/asset-inventory/adaptersApi';
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
import { googleSchema } from '../../schemas';

function Google() {
  const { showInstallModal, setShowInstallModal } = useStore();

  const form = useForm({
    resolver: zodResolver(googleSchema),
    mode: "onChange",
    defaultValues: {
      serviceAccountKey: "",
      adminEmail: "",
      customerId: "",
    },
  });

  const [isOpen, setIsOpen] = useState(false);
  const [installAdapter] = useInstallAimAdapterMutation();

  useEffect(() => {
    let { type } = showInstallModal;
    if (type === 'google') {
      setIsOpen(true);
      form.reset({
        serviceAccountKey: "",
        adminEmail: "",
        customerId: "",
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
    // Drop empty optional fields so the backend uses its defaults.
    const payload = { ...data };
    if (!payload.customerId) delete payload.customerId;

    const mutationCall = installAdapter({
      adapterName: 'google',
      payload,
    }).unwrap();

    toast.promise(mutationCall, {
      loading: 'Integrating Google Workspace...',
      success: () => {
        handleClose();
        return 'Google Workspace integrated successfully';
      },
      error: (err) => err?.data?.message || err?.data?.error || 'Integration failed',
    });
  };

  return (
    <Modal
      open={isOpen}
      setOpen={handleClose}
      title="Integrate Google Workspace"
      description="Configure integration settings for Google Workspace"
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
            name="serviceAccountKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Account Key (JSON) <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Textarea
                    rows={8}
                    placeholder='{ "type": "service_account", "project_id": "...", "client_email": "...", "private_key": "..." }'
                    className={form.formState.errors.serviceAccountKey ? 'border-destructive' : ''}
                    {...field}
                  />
                </FormControl>
                <p className="text-xs text-muted-foreground">
                  Paste the full JSON key of a service account with domain-wide delegation enabled for the read-only Directory and Drive scopes.
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="adminEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Admin Email <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <InputWrapper className={form.formState.errors.adminEmail ? 'border-destructive' : ''}>
                    <Button size="sm" variant="dim" mode="icon" className="size-5 -ms-0.5" type="button">
                      <Mail />
                    </Button>
                    <Input type="text" placeholder="admin@yourdomain.com" autoComplete="off" {...field} />
                  </InputWrapper>
                </FormControl>
                <p className="text-xs text-muted-foreground">
                  A Workspace super-admin the service account will impersonate.
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="customerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer ID</FormLabel>
                <FormControl>
                  <InputWrapper className={form.formState.errors.customerId ? 'border-destructive' : ''}>
                    <Button size="sm" variant="dim" mode="icon" className="size-5 -ms-0.5" type="button">
                      <Globe />
                    </Button>
                    <Input type="text" placeholder="my_customer (default)" autoComplete="off" {...field} />
                  </InputWrapper>
                </FormControl>
                <p className="text-xs text-muted-foreground">
                  Optional. Leave blank to use your own account (my_customer).
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Form>
    </Modal>
  );
}

export default Google;
