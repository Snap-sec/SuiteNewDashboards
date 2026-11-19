import { useState, useEffect } from 'react';
import { Modal } from '@/components/custom/modal';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '@/components/ui/textarea';
import {
  useInstallAutoPtIntegrationMutation,
  useUpdateAutoPtIntegrationMutation,
} from '@/services/integration/integrationsApi';
import { toast } from 'sonner';
import { Cloud, Download, Tag, Save } from 'lucide-react';
import { Input, InputWrapper } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { gcpSchema, gcpEditSchema } from '../../schemas';
import { useStore } from '../../store';
import { getAdapterType } from '../../utils';

function Gcp({ open, integrationId, adapter, onClose, mode, isEdit: propIsEdit }) {
  const { showInstallModal, setShowInstallModal, showConfigModal, setShowConfigModal } = useStore();
  const [installIntegration] = useInstallAutoPtIntegrationMutation();
  const [updateIntegration] = useUpdateAutoPtIntegrationMutation();

  const isEdit =
    mode !== undefined
      ? mode === 'update'
      : propIsEdit !== undefined
        ? Boolean(propIsEdit)
        : Boolean(showConfigModal && getAdapterType(showConfigModal) === 'gcp');
  const currentAdapter = isEdit ? (adapter || showConfigModal) : null;

  const isControlled = open !== undefined;
  const isOpen = isControlled
    ? !!open
    : showInstallModal?.type === 'gcp' || isEdit;

  const effectiveId =
    currentAdapter?.instance_id ||
    currentAdapter?._id ||
    currentAdapter?.id ||
    integrationId ||
    showInstallModal?.integrationId ||
    'gcp';

  const form = useForm({
    resolver: zodResolver(isEdit ? gcpEditSchema : gcpSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      serviceAccountKey: '',
      projectId: '',
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
          projectId:
            currentAdapter.config?.projectId ||
            currentAdapter.projectId ||
            '',
          serviceAccountKey: '',
        });
      } else {
        form.reset({
          name: '',
          serviceAccountKey: '',
          projectId: '',
        });
      }
    }
  }, [isOpen, isEdit, currentAdapter, form]);

  const handleClose = () => {
    form.reset();
    if (onClose) onClose();
    if (showConfigModal && getAdapterType(showConfigModal) === 'gcp') {
      setShowConfigModal(null);
    }
    if (!isControlled || showInstallModal?.type === 'gcp') {
      setShowInstallModal({ type: '' });
    }
  };

  const handleSubmit = (data) => {
    if (isEdit) {
      const payload = {
        name: data.name?.trim(),
        userProvidedName: data.name?.trim(),
        projectId: data.projectId?.trim(),
      };
      if (data.serviceAccountKey && data.serviceAccountKey.trim()) {
        payload.serviceAccountKey = data.serviceAccountKey.trim();
      }

      const updatePromise = updateIntegration({
        id: effectiveId,
        ...payload,
      }).unwrap();

      toast.promise(updatePromise, {
        loading: 'Updating Google Cloud Platform Integration...',
        success: 'Google Cloud Platform Integration Updated',
        error: 'Failed to update Google Cloud Platform Integration',
      });

      updatePromise
        .then(() => {
          handleClose();
        })
        .catch(() => {});
    } else {
      const id = effectiveId || 'gcp';
      const installPromise = installIntegration({
        integrationId: id,
        ...data,
      }).unwrap();

      toast.promise(installPromise, {
        loading: 'Installing Google Cloud Platform Integration...',
        success: 'Google Cloud Platform Integration Installed',
        error: 'Failed to install Google Cloud Platform Integration',
      });

      installPromise
        .then(() => {
          handleClose();
        })
        .catch(() => {});
    }
  };

  const title = isEdit
    ? `Configure ${currentAdapter?.title || currentAdapter?.name || adapter?.title || 'Google Cloud Platform'}`
    : `Integrate ${adapter?.title || adapter?.name || 'Google Cloud Platform'}`;

  const description = isEdit
    ? 'Update your GCP project ID or upload a new service account key.'
    : 'Provide your Service Account Key to connect Google Cloud Platform.';

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
                      placeholder="e.g. GCP Production"
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
            name="projectId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Project ID <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <InputWrapper
                    className={
                      form.formState.errors.projectId
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
                      <Cloud className="w-4 h-4" />
                    </Button>
                    <Input
                      placeholder="e.g. my-gcp-project-12345"
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
            name="serviceAccountKey"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>
                    Service Account Key (JSON){' '}
                    {!isEdit && <span className="text-destructive">*</span>}
                  </FormLabel>
                  {isEdit && (
                    <span className="text-xs text-muted-foreground">
                      Leave blank to keep current
                    </span>
                  )}
                </div>
                <FormControl>
                  <Textarea
                    placeholder={
                      isEdit
                        ? ''
                        : '{\n  "type": "service_account",\n  "project_id": "...",\n  "private_key_id": "...",\n  ...\n}'
                    }
                    className="min-h-[140px] font-mono text-xs"
                    autoComplete="off"
                    data-1p-ignore="true"
                    data-lpignore="true"
                    {...field}
                  />
                </FormControl>
                {isEdit && (
                  <p className="text-xs text-muted-foreground">
                    Only paste a new service account JSON if you want to replace the current one.
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

export default Gcp;
