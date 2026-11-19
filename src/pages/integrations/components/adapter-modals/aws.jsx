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
import { Cloud, Download, Key, Globe, Eye, EyeOff, Tag, Save } from 'lucide-react';
import { Input, InputWrapper } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { awsSchema, awsEditSchema } from '../../schemas';
import { useStore } from '../../store';
import { getAdapterType } from '../../utils';

function Aws({ open, integrationId, adapter, onClose, mode, isEdit: propIsEdit }) {
  const { showInstallModal, setShowInstallModal, showConfigModal, setShowConfigModal } = useStore();
  const [installAws] = useInstallAutoPtIntegrationMutation();
  const [updateIntegration] = useUpdateAutoPtIntegrationMutation();
  const [showSecret, setShowSecret] = useState(false);

  const isEdit =
    mode !== undefined
      ? mode === 'update'
      : propIsEdit !== undefined
        ? Boolean(propIsEdit)
        : Boolean(showConfigModal && getAdapterType(showConfigModal) === 'aws');
  const currentAdapter = isEdit ? (adapter || showConfigModal) : null;

  const isControlled = open !== undefined;
  const isOpen = isControlled
    ? !!open
    : showInstallModal?.type === 'aws' || isEdit;

  const effectiveId =
    currentAdapter?.instance_id ||
    currentAdapter?._id ||
    currentAdapter?.id ||
    integrationId ||
    showInstallModal?.integrationId ||
    'aws';

  const form = useForm({
    resolver: zodResolver(isEdit ? awsEditSchema : awsSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      accessKeyId: '',
      secretAccessKey: '',
      region: '',
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
          accessKeyId:
            currentAdapter.config?.accessKeyId ||
            currentAdapter.accessKeyId ||
            '',
          secretAccessKey: '',
          region:
            currentAdapter.config?.region ||
            currentAdapter.region ||
            '',
        });
      } else {
        form.reset({
          name: '',
          accessKeyId: '',
          secretAccessKey: '',
          region: '',
        });
      }
      setShowSecret(false);
    }
  }, [isOpen, isEdit, currentAdapter, form]);

  const handleClose = () => {
    form.reset();
    setShowSecret(false);
    if (onClose) onClose();
    if (showConfigModal && getAdapterType(showConfigModal) === 'aws') {
      setShowConfigModal(null);
    }
    if (!isControlled || showInstallModal?.type === 'aws') {
      setShowInstallModal({ type: '' });
    }
  };

  const handleSubmit = (data) => {
    if (isEdit) {
      const payload = {
        name: data.name?.trim(),
        userProvidedName: data.name?.trim(),
        accessKeyId: data.accessKeyId?.trim(),
      };
      if (data.region && data.region.trim()) {
        payload.region = data.region.trim();
      }
      if (data.secretAccessKey && data.secretAccessKey.trim()) {
        payload.secretAccessKey = data.secretAccessKey.trim();
      }

      const updatePromise = updateIntegration({
        id: effectiveId,
        ...payload,
      }).unwrap();

      toast.promise(updatePromise, {
        loading: 'Updating Amazon Web Services Integration...',
        success: 'Amazon Web Services Integration Updated',
        error: 'Failed to update Amazon Web Services Integration',
      });

      updatePromise
        .then(() => {
          handleClose();
        })
        .catch(() => {});
    } else {
      const id = effectiveId || 'aws';
      const installPromise = installAws({
        integrationId: id,
        ...data,
      }).unwrap();

      toast.promise(installPromise, {
        loading: 'Installing Amazon Web Services Integration...',
        success: 'Amazon Web Services Integration Installed',
        error: 'Failed to install Amazon Web Services Integration',
      });

      installPromise
        .then(() => {
          handleClose();
        })
        .catch(() => {});
    }
  };

  const title = isEdit
    ? `Configure ${currentAdapter?.title || currentAdapter?.name || adapter?.title || 'Amazon Web Services'}`
    : `Integrate ${adapter?.title || adapter?.name || 'Amazon Web Services'}`;

  const description = isEdit
    ? 'Update your AWS credentials and region settings.'
    : 'Configure your AWS environment to fetch cloud assets and security postures.';

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
                      placeholder="e.g. AWS Production"
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
            name="accessKeyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  AWS Access Key ID <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <InputWrapper
                    className={
                      form.formState.errors.accessKeyId
                        ? 'border-destructive'
                        : ''
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
                      placeholder="AKIAIOSFODNN7EXAMPLE"
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
            name="secretAccessKey"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>
                    AWS Secret Access Key{' '}
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
                      form.formState.errors.secretAccessKey
                        ? 'border-destructive'
                        : ''
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
                      type={showSecret ? 'text' : 'password'}
                      placeholder={isEdit ? '' : 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'}
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
                      onClick={() => setShowSecret((prev) => !prev)}
                    >
                      {showSecret ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </Button>
                  </InputWrapper>
                </FormControl>
                {isEdit && (
                  <p className="text-xs text-muted-foreground">
                    Only enter a new secret access key if you want to replace the current one.
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="region"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Default Region (Optional)</FormLabel>
                <FormControl>
                  <InputWrapper>
                    <Button
                      size="sm"
                      variant="dim"
                      mode="icon"
                      className="size-5 -ms-0.5"
                      type="button"
                    >
                      <Globe className="w-4 h-4" />
                    </Button>
                    <Input placeholder="us-east-1" {...field} />
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
