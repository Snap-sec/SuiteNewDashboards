import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { RiLockPasswordFill } from '@remixicon/react';
import { Download, FileSearch, GitBranch, Globe, User } from 'lucide-react';
import { toast } from 'sonner';
import { useInstallVmAdapterMutation } from '@/services/vm/adaptersApi';
import { Button } from '@/components/ui/button';
import { Input, InputWrapper } from '@/components/ui/input';
import { Modal } from '@/components/custom/modal';
import { useStore } from '../../store';
import AssessmentSelect from '../assessment-select';
import { useGetVmAssessmentsQuery } from '@/services/vm/assessmentsApi';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { qualysWasSchema } from '../../schemas';

function QualysWas() {
  const { showInstallModal, setShowInstallModal } = useStore();
  const [search, setSearch] = useState();
  const { data: assessments, isLoading, isFetching } = useGetVmAssessmentsQuery({ search });

  const assessmentOptions = assessments?.data?.assessments?.map?.(assessment => ({
    value: assessment._id,
    label: assessment.name || assessment.title,
    id: assessment._id,
  })) || [];

  const form = useForm({
    resolver: zodResolver(qualysWasSchema),
    mode: "onChange",
    defaultValues: {
      apiUrl: '',
      assessmentId: '',
      password: '',
      username: '',
      adapterName: 'qualys-was',
    },
  });

  const [isOpen, setIsOpen] = useState(false);
  const [installQualys] = useInstallVmAdapterMutation();

  useEffect(() => {
    let { type } = showInstallModal;
    if (type == 'qualys-was') {
      setIsOpen(true);
      form.reset({
        apiUrl: '',
        assessmentId: '',
        password: '',
        username: '',
        adapterName: 'qualys-was',
      });
    }
    else setIsOpen(false);
  }, [showInstallModal, form]);

  const handleClose = () => {
    setIsOpen(false);
    setShowInstallModal({});
    form.reset();
  }

  const handleInstall = (data) => {
    toast.promise(installQualys(data).unwrap(), {
      loading: 'Installing Qualys WAS',
      success: () => { handleClose(); return 'Qualys WAS has been Installed'; },
      error: 'Failed to install Qualys WAS',
    })
  };

  return (
    <Modal
      open={isOpen}
      setOpen={handleClose}
      title="Qualys WAS"
      className="max-h-[95vh] overflow-y-auto w-fit"
      description="Integrate Qualys WAS with the Vulnerability Management"
      footer={
        <Button
          variant="outline"
          onClick={form.handleSubmit(handleInstall)}
          disabled={form.formState.isSubmitting || !form.formState.isValid}
        >
          <GitBranch /> Integrate
        </Button>
      }
    >
      <Form {...form}>
        <div className="flex flex-col gap-4">

          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <InputWrapper className={form.formState.errors.username ? 'border-destructive' : ''}>
                    <Button size="sm" variant="dim" mode="icon" className="size-5 -ms-0.5" type="button">
                      <User />
                    </Button>
                    <Input placeholder="Enter Qualys username" {...field} />
                  </InputWrapper>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <InputWrapper className={form.formState.errors.password ? 'border-destructive' : ''}>
                    <Button size="sm" variant="dim" mode="icon" className="size-5 -ms-0.5" type="button">
                      <RiLockPasswordFill />
                    </Button>
                    <Input type="password" placeholder="Enter Qualys password" {...field} />
                  </InputWrapper>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="assessmentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Assessment <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <AssessmentSelect
                    value={field.value}
                    onChange={(option) => field.onChange(option.value)}
                    error={!!form.formState.errors.assessmentId}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="apiUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>API URL <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <InputWrapper className={form.formState.errors.apiUrl ? 'border-destructive' : ''}>
                    <Button size="sm" variant="dim" mode="icon" className="size-5 -ms-0.5" type="button">
                      <Globe />
                    </Button>
                    <Input placeholder="e.g., https://qualysapi.qualys.com" {...field} />
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

export default QualysWas;
