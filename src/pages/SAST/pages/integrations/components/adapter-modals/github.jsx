import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RiLockPasswordFill } from '@remixicon/react';
import { GitBranch, User, Tag } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input, InputWrapper } from '@/components/ui/input';
import { Modal } from '@/components/custom/modal';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useStore } from '../../store';
import { useIntegration } from '../../context/integration-context';
import { githubSchema } from '../../schemas';

export function GithubModal() {
  const { showInstallModal, setShowInstallModal, showConfigModal, setShowConfigModal } = useStore();
  const { handleSaveConfig, isConfiguring } = useIntegration();

  const [isOpen, setIsOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(githubSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      organization: '',
      token: '',
    },
  });

  useEffect(() => {
    const installType = showInstallModal?.type?.toLowerCase();
    const configId = showConfigModal?.id?.toLowerCase();
    const configType = showConfigModal?.type?.toLowerCase();
    const configTitle = showConfigModal?.title?.toLowerCase();

    const isGithubInstall = installType === 'github' || installType === 'github-sca';
    const isGithubConfig =
      configId === 'github-sca' ||
      configType === 'github' ||
      (configTitle && configTitle.includes('github'));

    if (isGithubInstall) {
      setIsOpen(true);
      form.reset({
        name: '',
        organization: '',
        token: '',
      });
    } else if (isGithubConfig && showConfigModal) {
      setIsOpen(true);
      form.reset({
        name: showConfigModal.name || showConfigModal.config?.name || '',
        organization: showConfigModal.config?.organization || showConfigModal.config?.org || '',
        token: showConfigModal.config?.token || showConfigModal.config?.patToken || showConfigModal.config?.accessToken || '',
      });
    } else {
      setIsOpen(false);
    }
  }, [showInstallModal, showConfigModal, form]);

  const handleClose = () => {
    setIsOpen(false);
    setShowInstallModal({});
    setShowConfigModal(null);
    form.reset();
  };

  const handleSave = async (data) => {
    const adapterId = showInstallModal?.type || showInstallModal?.adapterType || showConfigModal?.id || showConfigModal?.type || 'github';
    const success = await handleSaveConfig(adapterId, {
      name: data.name,
      organization: data.organization,
      token: data.token,
      patToken: data.token,
      accessToken: data.token,
    });
    if (success) {
      handleClose();
    }
  };

  return (
    <Modal
      open={isOpen}
      setOpen={handleClose}
      title="GitHub Repository Scanner"
      description="Integrate GitHub with Software Composition Analysis for automated scanning"
      footer={
        <Button
          variant="outline"
          onClick={form.handleSubmit(handleSave)}
          disabled={form.formState.isSubmitting || !form.formState.isValid || isConfiguring}
        >
          <GitBranch className="size-4" /> Integrate
        </Button>
      }
      className="max-h-[95vh] overflow-y-auto w-fit"
    >
      <Form {...form}>
        <div className="flex flex-col gap-4 min-w-[320px] sm:min-w-[400px]">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Integration Name <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <InputWrapper className={form.formState.errors.name ? 'border-destructive' : ''}>
                    <Button size="sm" variant="dim" mode="icon" className="size-5 -ms-0.5" type="button">
                      <Tag className="size-4" />
                    </Button>
                    <Input placeholder="e.g. My GitHub Integration" {...field} />
                  </InputWrapper>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="organization"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  GitHub Organization / User <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <InputWrapper className={form.formState.errors.organization ? 'border-destructive' : ''}>
                    <Button size="sm" variant="dim" mode="icon" className="size-5 -ms-0.5" type="button">
                      <User className="size-4" />
                    </Button>
                    <Input placeholder="e.g. facebook, vercel, snapsec-corp" {...field} />
                  </InputWrapper>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="token"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Personal Access Token (PAT) <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <InputWrapper className={form.formState.errors.token ? 'border-destructive' : ''}>
                    <Button size="sm" variant="dim" mode="icon" className="size-5 -ms-0.5" type="button">
                      <RiLockPasswordFill className="size-4" />
                    </Button>
                    <Input type="password" placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" {...field} />
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

export default GithubModal;
