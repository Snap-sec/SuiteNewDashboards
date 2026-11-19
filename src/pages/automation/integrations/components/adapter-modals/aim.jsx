import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Download, Key, Text } from 'lucide-react';
import { toast } from 'sonner';
import { useInstallVmAdapterMutation } from '@/services/vm/adaptersApi';
import { Button } from '@/components/ui/button';
import { Input, InputWrapper } from '@/components/ui/input';
import { Modal } from '@/components/custom/modal';
import { useStore } from '../../store';

function Aim() {
  const { showInstallModal, setShowInstallModal } = useStore();

  console.log(showInstallModal);

  const aimSchema = z.object({
    apiKey: z.string().min(1, 'API Key is required'),
    name: z.string().default('AIM'),
    adapterName: z.string().default('aim'),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(aimSchema),
    defaultValues: {
      apiKey: '',
      name: 'AIM',
      adapterName: 'aim',
    },
  });

  const [isOpen, setIsOpen] = useState(false);

  const [installAim] = useInstallVmAdapterMutation();

  useEffect(() => {
    let { type } = showInstallModal;

    if (type == 'aim') {
      setIsOpen(true);
      reset({
        apiKey: '',
        name: 'AIM',
        adapterName: 'aim',
      });
    }
    else setIsOpen(false);
  }, [showInstallModal, reset]);


  const handleInstall = (data) => {
    toast.promise(installAim(data).unwrap(), {
      loading: 'Installing Aim',
      success: 'Aim has been Installed',
      error: 'Failed to install Aim',
    });
    setIsOpen(false);
    setShowInstallModal({});
  };

  return (
    <Modal
      className="max-h-[95vh] overflow-y-auto w-1/3"
      open={isOpen}
      setOpen={setIsOpen}
      title="Integrate AIM"
      description="Integrate AIM with the Vulnerability Management"
      footer={
        <Button variant="outline" onClick={handleSubmit(handleInstall)} disabled={isSubmitting}>
          <Download /> Install Now
        </Button>
      }
    >
      <div className="flex flex-col gap-3">
        {/* <InputWrapper>
          <Button
            size="sm"
            variant="dim"
            mode="icon"
            className="size-5 -ms-0.5"
          >
            <Text />
          </Button>
          <Input
            name="name"
            type="text"
            placeholder="Description"
            value={payload.name}
            onChange={handleInput}
          />
        </InputWrapper> */}
        <div className="flex flex-col gap-1">
          <InputWrapper className={errors.apiKey ? 'border-destructive' : ''}>
            <Button
              size="sm"
              variant="dim"
              mode="icon"
              className="size-5 -ms-0.5"
            >
              <Key />
            </Button>
            <Input
              type="text"
              placeholder="API Key"
              {...register('apiKey')}
            />
          </InputWrapper>
          {errors.apiKey && (
            <p className="text-[10px] text-destructive font-medium px-1">{errors.apiKey.message}</p>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default Aim;
