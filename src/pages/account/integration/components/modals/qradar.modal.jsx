import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Modal } from '@/components/custom/modal';
import { useAuthCreateAdapterMutation } from '@/services/auth/adapterApi';
import { useStore } from '../../store';

const schema = yup.object().shape({
  logPushEndpoint: yup
    .string()
    .trim()
    .required('Log Push Endpoint is required')
    .url('Log Push Endpoint must be a valid URL (e.g. https://qradar.com/log/push)'),
  bearerToken: yup
    .string()
    .trim()
    .required('Bearer Token is required'),
});

export function QRadarModal() {
  const [createAdapter, { isLoading }] = useAuthCreateAdapterMutation();

  const adapter_modal_open = useStore((state) => state.adapter_modal_open);
  const setAdapterModalOpen = useStore((state) => state.setAdapterModalOpen);
  const adapter_type = useStore((state) => state.adapter_type);

  const isModalOpen = adapter_modal_open && adapter_type === 'qradar';

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      logPushEndpoint: '',
      bearerToken: '',
    },
  });

  const closeModal = () => {
    reset({ logPushEndpoint: '', bearerToken: '' });
    setAdapterModalOpen(false);
  };

  useEffect(() => {
    if (!isModalOpen) {
      reset({ logPushEndpoint: '', bearerToken: '' });
    }
  }, [isModalOpen, reset]);

  const onSubmit = (data) => {
    const config = {
      qradar_log_push_endpoint: data.logPushEndpoint.trim(),
      qradar_bearer_token: data.bearerToken.trim(),
    };

    toast.promise(createAdapter({ type: 'qradar', config }).unwrap(), {
      loading: 'Installing QRadar Adapter...',
      success: () => {
        closeModal();
        return 'QRadar Adapter Installed Successfully';
      },
      error: (err) => {
        return err?.data?.message || 'Failed to Install QRadar Adapter';
      },
    });
  };

  return (
    <Modal
      open={isModalOpen}
      setOpen={() => closeModal()}
      title="Install QRadar Adapter"
      description="Configure Log Push Endpoint and Bearer Token to install the QRadar adapter."
      footer={
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={closeModal} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="outline"
            disabled={isLoading}
            onClick={handleSubmit(onSubmit)}
          >
            {isLoading ? 'Installing...' : 'Install'}
          </Button>
        </div>
      }
      className="w-1/3"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 py-2">
        <div>
          <Label htmlFor="qradar-endpoint" className="text-xs font-medium mb-1 block">
            Log Push Endpoint <span className="text-destructive">*</span>
          </Label>
          <Input
            id="qradar-endpoint"
            placeholder="https://qradar.com/log/push"
            {...register('logPushEndpoint')}
          />
          {errors.logPushEndpoint && (
            <p className="text-xs text-destructive mt-1">
              {errors.logPushEndpoint.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="qradar-token" className="text-xs font-medium mb-1 block">
            Bearer Token <span className="text-destructive">*</span>
          </Label>
          <Input
            id="qradar-token"
            type="password"
            placeholder="Bearer Token"
            {...register('bearerToken')}
          />
          {errors.bearerToken && (
            <p className="text-xs text-destructive mt-1">
              {errors.bearerToken.message}
            </p>
          )}
        </div>
      </form>
    </Modal>
  );
}