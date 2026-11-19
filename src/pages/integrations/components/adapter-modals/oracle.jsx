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
import { Cloud, Download, Key, User, Hash, Box, Globe, Tag, Save } from 'lucide-react';
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
import { oracleSchema, oracleEditSchema } from '../../schemas';
import { useStore } from '../../store';
import { getAdapterType } from '../../utils';

function Oracle({ open, integrationId, adapter, onClose, mode, isEdit: propIsEdit }) {
  const { showInstallModal, setShowInstallModal, showConfigModal, setShowConfigModal } = useStore();
  const [installOracle] = useInstallAutoPtIntegrationMutation();
  const [updateIntegration] = useUpdateAutoPtIntegrationMutation();

  const isEdit =
    mode !== undefined
      ? mode === 'update'
      : propIsEdit !== undefined
        ? Boolean(propIsEdit)
        : Boolean(showConfigModal && getAdapterType(showConfigModal) === 'oracle');
  const currentAdapter = isEdit ? (adapter || showConfigModal) : null;

  const isControlled = open !== undefined;
  const isOpen = isControlled
    ? !!open
    : showInstallModal?.type === 'oracle' || isEdit;

  const effectiveId =
    currentAdapter?.instance_id ||
    currentAdapter?._id ||
    currentAdapter?.id ||
    integrationId ||
    showInstallModal?.integrationId ||
    'oracle';

  const form = useForm({
    resolver: zodResolver(isEdit ? oracleEditSchema : oracleSchema),
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

  useEffect(() => {
    if (isOpen) {
      if (isEdit && currentAdapter) {
        form.reset({
          name:
            currentAdapter.userProvidedName ||
            currentAdapter.name ||
            currentAdapter.config?.name ||
            '',
          tenancyId:
            currentAdapter.config?.tenancyId ||
            currentAdapter.tenancyId ||
            '',
          compartmentId:
            currentAdapter.config?.compartmentId ||
            currentAdapter.compartmentId ||
            '',
          userId:
            currentAdapter.config?.userId ||
            currentAdapter.userId ||
            '',
          keyFingerprint:
            currentAdapter.config?.keyFingerprint ||
            currentAdapter.keyFingerprint ||
            '',
          keyValue: '',
          region:
            currentAdapter.config?.region ||
            currentAdapter.region ||
            '',
        });
      } else {
        form.reset({
          name: '',
          tenancyId: '',
          compartmentId: '',
          userId: '',
          keyFingerprint: '',
          keyValue: '',
          region: '',
        });
      }
    }
  }, [isOpen, isEdit, currentAdapter, form]);

  const handleClose = () => {
    form.reset();
    if (onClose) onClose();
    if (showConfigModal && getAdapterType(showConfigModal) === 'oracle') {
      setShowConfigModal(null);
    }
    if (!isControlled || showInstallModal?.type === 'oracle') {
      setShowInstallModal({ type: '' });
    }
  };

  const handleSubmit = (data) => {
    if (isEdit) {
      const payload = {
        name: data.name?.trim(),
        userProvidedName: data.name?.trim(),
        tenancyId: data.tenancyId?.trim(),
        userId: data.userId?.trim(),
        keyFingerprint: data.keyFingerprint?.trim(),
      };
      if (data.compartmentId && data.compartmentId.trim()) {
        payload.compartmentId = data.compartmentId.trim();
      }
      if (data.region && data.region.trim()) {
        payload.region = data.region.trim();
      }
      if (data.keyValue && data.keyValue.trim()) {
        payload.keyValue = data.keyValue.trim();
      }

      const updatePromise = updateIntegration({
        id: effectiveId,
        ...payload,
      }).unwrap();

      toast.promise(updatePromise, {
        loading: 'Updating Oracle Cloud Infrastructure Integration...',
        success: 'Oracle Cloud Infrastructure Integration Updated',
        error: 'Failed to update Oracle Cloud Infrastructure Integration',
      });

      updatePromise
        .then(() => {
          handleClose();
        })
        .catch(() => {});
    } else {
      const id = effectiveId || 'oracle';
      const installPromise = installOracle({
        integrationId: id,
        ...data,
      }).unwrap();

      toast.promise(installPromise, {
        loading: 'Installing Oracle Cloud Infrastructure Integration...',
        success: 'Oracle Cloud Infrastructure Integration Installed',
        error: 'Failed to install Oracle Cloud Infrastructure Integration',
      });

      installPromise
        .then(() => {
          handleClose();
        })
        .catch(() => {});
    }
  };

  const title = isEdit
    ? `Configure ${currentAdapter?.title || currentAdapter?.name || adapter?.title || 'Oracle Cloud Infrastructure'}`
    : `Integrate ${adapter?.title || adapter?.name || 'Oracle Cloud Infrastructure'}`;

  const description = isEdit
    ? 'Update your Oracle Cloud Infrastructure tenancy, credentials, and region.'
    : 'Configure your OCI environment to fetch cloud assets and security postures.';

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
                      placeholder="e.g. OCI Production"
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
            name="tenancyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Tenancy OCID <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <InputWrapper
                    className={
                      form.formState.errors.tenancyId
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
                      <Hash className="w-4 h-4" />
                    </Button>
                    <Input
                      placeholder="ocid1.tenancy.oc1..exampleuniqueID"
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
            name="compartmentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Compartment OCID (Optional)</FormLabel>
                <FormControl>
                  <InputWrapper>
                    <Button
                      size="sm"
                      variant="dim"
                      mode="icon"
                      className="size-5 -ms-0.5"
                      type="button"
                    >
                      <Box className="w-4 h-4" />
                    </Button>
                    <Input
                      placeholder="ocid1.compartment.oc1..exampleuniqueID"
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
            name="userId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  User OCID <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <InputWrapper
                    className={
                      form.formState.errors.userId ? 'border-destructive' : ''
                    }
                  >
                    <Button
                      size="sm"
                      variant="dim"
                      mode="icon"
                      className="size-5 -ms-0.5"
                      type="button"
                    >
                      <User className="w-4 h-4" />
                    </Button>
                    <Input
                      placeholder="ocid1.user.oc1..exampleuniqueID"
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
            name="keyFingerprint"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Key Fingerprint <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <InputWrapper
                    className={
                      form.formState.errors.keyFingerprint
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
                      placeholder="20:3b:97:13:55:1c:5b:0d:d3:37:d8:50:4e:c5:42:c6"
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
            name="keyValue"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>
                    Private Key (PEM format){' '}
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
                        : '-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEA0... \n-----END RSA PRIVATE KEY-----'
                    }
                    className="min-h-[120px] font-mono text-xs"
                    autoComplete="off"
                    data-1p-ignore="true"
                    data-lpignore="true"
                    {...field}
                  />
                </FormControl>
                {isEdit && (
                  <p className="text-xs text-muted-foreground">
                    Only paste a new private key if you want to replace the current one.
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
                <FormLabel>Region (Optional)</FormLabel>
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
                    <Input placeholder="us-ashburn-1" {...field} />
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

export default Oracle;
