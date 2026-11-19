import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RiLockPasswordFill } from '@remixicon/react';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { useInstallAimAdapterMutation } from '@/services/asset-inventory/adaptersApi';
import { Button } from '@/components/ui/button';
import { Input, InputWrapper } from '@/components/ui/input';
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
import { hostingerSchema } from '../../schemas';

function Hostinger() {
  const { showInstallModal, setShowInstallModal } = useStore();

  const form = useForm({
    resolver: zodResolver(hostingerSchema),
    mode: "onChange",
    defaultValues: {
      apiKey: '',
    },
  });

  const [isOpen, setIsOpen] = useState(false);
  const [installAdapter] = useInstallAimAdapterMutation();

  useEffect(() => {
    const { type } = showInstallModal;
    if (type === 'hostinger') {
      setIsOpen(true);
      form.reset({ apiKey: '' });
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
    const mutationCall = installAdapter({
      adapterName: 'hostinger',
      payload: { apiKey: data.apiKey },
    }).unwrap();

    toast.promise(mutationCall, {
      loading: 'Installing Hostinger...',
      success: () => {
        handleClose();
        return 'Hostinger integrated successfully';
      },
      error: (err) => err?.data?.message || err?.data?.error || 'Integration failed',
    });
  };

  return (
    <Modal
      open={isOpen}
      setOpen={handleClose}
      title="Integrate Hostinger"
      description="Fetch VPS, Domains, DNS Records, and SSL Certificates from the Hostinger API"
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
        {/* Hidden honey-pot to intercept browser autofill away from visible fields */}
        <form style={{ display: 'none' }} aria-hidden="true">
          <input type="text" name="fakeUsernameHostinger" autoComplete="username" />
          <input type="password" name="fakePasswordHostinger" autoComplete="current-password" />
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
                    <Input
                      type="password"
                      placeholder="Enter your Hostinger API key..."
                      autoComplete="new-password"
                      {...field}
                    />
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

export default Hostinger;
