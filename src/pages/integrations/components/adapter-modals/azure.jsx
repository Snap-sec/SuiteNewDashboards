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
import { Cloud, Download, Key, CreditCard, LayoutTemplate, Tag, Save, Eye, EyeOff } from 'lucide-react';
import { Input, InputWrapper } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { azureSchema, azureEditSchema } from '../../schemas';
import { useStore } from '../../store';
import { getAdapterType } from '../../utils';

function Azure({ open, integrationId, adapter, onClose, mode, isEdit: propIsEdit }) {
  const { showInstallModal, setShowInstallModal, showConfigModal, setShowConfigModal } = useStore();
  const [installAzure] = useInstallAutoPtIntegrationMutation();
  const [updateIntegration] = useUpdateAutoPtIntegrationMutation();
  const [showKey, setShowKey] = useState(false);

  const isEdit =
    mode !== undefined
      ? mode === 'update'
      : propIsEdit !== undefined
        ? Boolean(propIsEdit)
        : Boolean(showConfigModal && getAdapterType(showConfigModal) === 'azure');
  const currentAdapter = isEdit ? (adapter || showConfigModal) : null;

  const isControlled = open !== undefined;
  const isOpen = isControlled
    ? !!open
    : showInstallModal?.type === 'azure' || isEdit;

  const effectiveId =
    currentAdapter?.instance_id ||
    currentAdapter?._id ||
    currentAdapter?.id ||
    integrationId ||
    showInstallModal?.integrationId ||
    'azure';

  const form = useForm({
    resolver: zodResolver(isEdit ? azureEditSchema : azureSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      ApplicationID: '',
      KeyValue: '',
      DirectoryID: '',
      SubscriptionID: '',
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
          ApplicationID:
            currentAdapter.config?.ApplicationID ||
            currentAdapter.ApplicationID ||
            '',
          KeyValue: '',
          DirectoryID:
            currentAdapter.config?.DirectoryID ||
            currentAdapter.DirectoryID ||
            '',
          SubscriptionID:
            currentAdapter.config?.SubscriptionID ||
            currentAdapter.SubscriptionID ||
            '',
        });
      } else {
        form.reset({
          name: '',
          ApplicationID: '',
          KeyValue: '',
          DirectoryID: '',
          SubscriptionID: '',
        });
      }
      setShowKey(false);
    }
  }, [isOpen, isEdit, currentAdapter, form]);

  const handleClose = () => {
    form.reset();
    setShowKey(false);
    if (onClose) onClose();
    if (showConfigModal && getAdapterType(showConfigModal) === 'azure') {
      setShowConfigModal(null);
    }
    if (!isControlled || showInstallModal?.type === 'azure') {
      setShowInstallModal({ type: '' });
    }
  };

  const handleSubmit = (data) => {
    if (isEdit) {
      const payload = {
        name: data.name?.trim(),
        userProvidedName: data.name?.trim(),
        ApplicationID: data.ApplicationID?.trim(),
        DirectoryID: data.DirectoryID?.trim(),
        SubscriptionID: data.SubscriptionID?.trim(),
      };
      if (data.KeyValue && data.KeyValue.trim()) {
        payload.KeyValue = data.KeyValue.trim();
      }

      const updatePromise = updateIntegration({
        id: effectiveId,
        ...payload,
      }).unwrap();

      toast.promise(updatePromise, {
        loading: 'Updating Microsoft Azure Integration...',
        success: 'Microsoft Azure Integration Updated',
        error: 'Failed to update Microsoft Azure Integration',
      });

      updatePromise
        .then(() => {
          handleClose();
        })
        .catch(() => {});
    } else {
      const id = effectiveId || 'azure';
      const installPromise = installAzure({
        integrationId: id,
        ...data,
      }).unwrap();

      toast.promise(installPromise, {
        loading: 'Installing Microsoft Azure Integration...',
        success: 'Microsoft Azure Integration Installed',
        error: 'Failed to install Microsoft Azure Integration',
      });

      installPromise
        .then(() => {
          handleClose();
        })
        .catch(() => {});
    }
  };

  const title = isEdit
    ? `Configure ${currentAdapter?.title || currentAdapter?.name || adapter?.title || 'Microsoft Azure'}`
    : `Integrate ${adapter?.title || adapter?.name || 'Microsoft Azure'}`;

  const description = isEdit
    ? 'Update your Microsoft Azure credentials and subscription IDs.'
    : 'Configure your Azure environment to fetch cloud assets and security postures.';

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
                      placeholder="e.g. Azure Production"
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
            name="ApplicationID"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Application ID <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <InputWrapper
                    className={
                      form.formState.errors.ApplicationID
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
                      <LayoutTemplate className="w-4 h-4" />
                    </Button>
                    <Input
                      placeholder="e.g. 00000000-0000-0000-0000-000000000000"
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
            name="KeyValue"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>
                    Client Secret (Key Value){' '}
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
                      form.formState.errors.KeyValue ? 'border-destructive' : ''
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
                      type={showKey ? 'text' : 'password'}
                      placeholder={isEdit ? '' : 'Enter your Azure client secret'}
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
                      onClick={() => setShowKey((prev) => !prev)}
                    >
                      {showKey ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </Button>
                  </InputWrapper>
                </FormControl>
                {isEdit && (
                  <p className="text-xs text-muted-foreground">
                    Only enter a new client secret if you want to replace the current one.
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="DirectoryID"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Directory (Tenant) ID <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <InputWrapper
                    className={
                      form.formState.errors.DirectoryID
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
                      placeholder="e.g. 00000000-0000-0000-0000-000000000000"
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
            name="SubscriptionID"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Subscription ID <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <InputWrapper
                    className={
                      form.formState.errors.SubscriptionID
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
                      <CreditCard className="w-4 h-4" />
                    </Button>
                    <Input
                      placeholder="e.g. 00000000-0000-0000-0000-000000000000"
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
        </div>
      </Form>
    </Modal>
  );
}

export default Azure;
