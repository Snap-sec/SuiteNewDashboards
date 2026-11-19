import { useState, useEffect } from 'react';
import { Modal } from '@/components/custom/modal';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useInstallAutoPtIntegrationMutation,
  useUpdateAutoPtIntegrationMutation,
} from '@/services/integration/integrationsApi';
import { toast } from 'sonner';
import { Download, Key, Globe, Eye, EyeOff, Tag, Save } from 'lucide-react';
import { Input, InputWrapper } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { gitlabSchema, gitlabEditSchema } from '../../schemas';
import { useStore } from '../../store';
import { getAdapterType } from '../../utils';

function Gitlab({ open, integrationId, adapter, onClose, mode, isEdit: propIsEdit }) {
  const { showInstallModal, setShowInstallModal, showConfigModal, setShowConfigModal } = useStore();
  const [installIntegration] = useInstallAutoPtIntegrationMutation();
  const [updateIntegration] = useUpdateAutoPtIntegrationMutation();
  const [showToken, setShowToken] = useState(false);

  const isEdit =
    mode !== undefined
      ? mode === 'update'
      : propIsEdit !== undefined
        ? Boolean(propIsEdit)
        : Boolean(showConfigModal && getAdapterType(showConfigModal) === 'gitlab');
  const currentAdapter = isEdit ? (adapter || showConfigModal) : null;

  const isControlled = open !== undefined;
  const isOpen = isControlled
    ? !!open
    : showInstallModal?.type === 'gitlab' || isEdit;

  const effectiveId =
    currentAdapter?.instance_id ||
    currentAdapter?._id ||
    currentAdapter?.id ||
    integrationId ||
    showInstallModal?.integrationId ||
    'gitlab';

  const form = useForm({
    resolver: zodResolver(isEdit ? gitlabEditSchema : gitlabSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      base_url: 'https://gitlab.com',
      pat: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (isEdit && currentAdapter) {
        form.reset({
          name:
            currentAdapter.userProvidedName ||
            currentAdapter.name ||
            currentAdapter.config?.name ||
            '',
          base_url:
            currentAdapter.config?.base_url ||
            currentAdapter.base_url ||
            'https://gitlab.com',
          pat: '',
        });
      } else {
        form.reset({
          name: '',
          base_url: 'https://gitlab.com',
          pat: '',
        });
      }
      setShowToken(false);
    }
  }, [isOpen, isEdit, currentAdapter, form]);

  const handleClose = () => {
    form.reset();
    setShowToken(false);
    if (onClose) onClose();
    if (showConfigModal && getAdapterType(showConfigModal) === 'gitlab') {
      setShowConfigModal(null);
    }
    if (!isControlled || showInstallModal?.type === 'gitlab') {
      setShowInstallModal({ type: '' });
    }
  };

  const handleSubmit = (data) => {
    if (isEdit) {
      const payload = {
        name: data.name?.trim(),
        userProvidedName: data.name?.trim(),
        base_url: data.base_url?.trim(),
      };
      if (data.pat && data.pat.trim()) {
        payload.pat = data.pat.trim();
      }

      const updatePromise = updateIntegration({
        id: effectiveId,
        ...payload,
      }).unwrap();

      toast.promise(updatePromise, {
        loading: 'Updating GitLab Integration...',
        success: 'GitLab Integration Updated',
        error: 'Failed to update GitLab Integration',
      });

      updatePromise
        .then(() => {
          handleClose();
        })
        .catch(() => {});
    } else {
      const id = effectiveId || 'gitlab';
      const installPromise = installIntegration({
        integrationId: id,
        ...data,
      }).unwrap();

      toast.promise(installPromise, {
        loading: 'Installing GitLab Integration...',
        success: 'GitLab Integration Installed',
        error: 'Failed to install GitLab Integration',
      });

      installPromise
        .then(() => {
          handleClose();
        })
        .catch(() => {});
    }
  };

  const title = isEdit
    ? `Configure ${currentAdapter?.title || currentAdapter?.name || adapter?.title || 'GitLab'}`
    : `Integrate ${adapter?.title || adapter?.name || 'GitLab'}`;

  const description = isEdit
    ? 'Update your GitLab configuration, connection URL, or credentials.'
    : 'Connect your GitLab workspace or self-hosted instance to scan repositories.';

  return (
    <Modal
      open={isOpen}
      setOpen={handleClose}
      title={title}
      description={description}
      footer={
        <Button
          variant="outline"
          onClick={form.handleSubmit(handleSubmit)}
          disabled={form.formState.isSubmitting || !form.formState.isValid}
        >
          {isEdit ? (
            <>
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" /> Install
            </>
          )}
        </Button>
      }
    >
      <Form {...form}>
        <div
          style={{
            position: 'absolute',
            opacity: 0,
            height: 0,
            width: 0,
            overflow: 'hidden',
            zIndex: -1,
          }}
          aria-hidden="true"
        >
          <input
            type="text"
            name="fake_username_autofill"
            tabIndex={-1}
            autoComplete="username"
          />
          <input
            type="password"
            name="fake_password_autofill"
            tabIndex={-1}
            autoComplete="current-password"
          />
        </div>
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Instance Name <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <InputWrapper
                    className={
                      form.formState.errors.name ? 'border-destructive' : ''
                    }
                  >
                    <Button
                      size="sm"
                      variant="dim"
                      mode="icon"
                      className="size-5 -ms-0.5"
                      type="button"
                    >
                      <Tag className="w-4 h-4" />
                    </Button>
                    <Input
                      placeholder="e.g. GitLab Workspace"
                      autoComplete="off"
                      data-1p-ignore="true"
                      data-lpignore="true"
                      {...field}
                    />
                  </InputWrapper>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="base_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Base URL <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <InputWrapper
                    className={
                      form.formState.errors.base_url ? 'border-destructive' : ''
                    }
                  >
                    <Button
                      size="sm"
                      variant="dim"
                      mode="icon"
                      className="size-5 -ms-0.5"
                      type="button"
                    >
                      <Globe className="w-4 h-4" />
                    </Button>
                    <Input placeholder="https://gitlab.com" {...field} />
                  </InputWrapper>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pat"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>
                    Personal Access Token (PAT){' '}
                    {!isEdit && <span className="text-destructive">*</span>}
                  </FormLabel>
                  {isEdit && (
                    <span className="text-xs text-muted-foreground">
                      Leave blank to keep current
                    </span>
                  )}
                </div>
                <FormControl>
                  <InputWrapper
                    className={
                      form.formState.errors.pat ? 'border-destructive' : ''
                    }
                  >
                    <Button
                      size="sm"
                      variant="dim"
                      mode="icon"
                      className="size-5 -ms-0.5"
                      type="button"
                    >
                      <Key className="w-4 h-4" />
                    </Button>
                    <Input
                      type={showToken ? 'text' : 'password'}
                      placeholder={isEdit ? '' : 'glpat-xxxxxxxxxxxxxxxxxxxx'}
                      autoComplete="off"
                      data-1p-ignore="true"
                      data-lpignore="true"
                      data-bwignore="true"
                      data-form-type="other"
                      {...field}
                    />
                    <Button
                      size="sm"
                      variant="dim"
                      mode="icon"
                      className="size-6 text-muted-foreground hover:text-foreground"
                      type="button"
                      onClick={() => setShowToken((prev) => !prev)}
                    >
                      {showToken ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </Button>
                  </InputWrapper>
                </FormControl>
                {isEdit && (
                  <p className="text-xs text-muted-foreground">
                    Only enter a new token if you want to replace the current one.
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </Form>
    </Modal>
  );
}

export default Gitlab;
