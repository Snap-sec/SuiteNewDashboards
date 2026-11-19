import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Key, Globe, LayoutGrid, Terminal } from 'lucide-react';
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
import { semgrepSchema } from '../../schemas';

function Semgrep() {
  const { showInstallModal, setShowInstallModal } = useStore();
  const [search, setSearch] = useState('');

  // Get all assessments with search
  const { data: assessments, isLoading, isFetching } = useGetVmAssessmentsQuery({ search });

  const assessmentOptions = assessments?.data?.assessments?.map?.(assessment => ({
    value: assessment._id,
    label: assessment.name || assessment.title,
    id: assessment._id,
  })) || [];

  const form = useForm({
    resolver: zodResolver(semgrepSchema),
    mode: "onChange",
    defaultValues: {
      name: '',
      deploymentSlug: '',
      accessToken: '',
      assessmentId: '',
      adapterName: 'semgrep',
    },
  });

  const [isOpen, setIsOpen] = useState(false);

  const [installSemgrep] = useInstallVmAdapterMutation();

  useEffect(() => {
    let { type } = showInstallModal;

    if (type === 'semgrep') {
      setIsOpen(true);
      form.reset({
        name: '',
        deploymentSlug: '',
        accessToken: '',
        assessmentId: '',
        adapterName: 'semgrep',
      });
    }
    else setIsOpen(false);
  }, [showInstallModal, form]);

  const handleClose = () => {
    setIsOpen(false);
    setShowInstallModal({});
    form.reset();
  };

  const handleInstall = (data) => {
    const finalPayload = {
      adapterName: 'semgrep',
      name: data.name,
      deploymentSlug: data.deploymentSlug,
      accessToken: data.accessToken,
      assessmentId: data.assessmentId,
    };

    toast.promise(installSemgrep(finalPayload).unwrap(), {
      loading: 'Installing Semgrep Integration...',
      success: () => {
        handleClose();
        return 'Semgrep Integration has been installed';
      },
      error: 'Failed to install Semgrep Integration',
    });
  };

  return (
    <Modal
      open={isOpen}
      setOpen={handleClose}
      title="Integrate Semgrep"
      className="max-h-[95vh] overflow-y-auto w-fit"
      description="Fetch SAST, SCA, and AI SAST findings from Semgrep Cloud"
      footer={
        <Button 
          variant="outline" 
          onClick={form.handleSubmit(handleInstall)} 
          disabled={form.formState.isSubmitting || !form.formState.isValid}
        >
          <Terminal /> Integrate
        </Button>
      }
    >
      <Form {...form}>
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Integration Name <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <InputWrapper className={form.formState.errors.name ? 'border-destructive' : ''}>
                    <Button size="sm" variant="dim" mode="icon" className="size-5 -ms-0.5" type="button">
                      <LayoutGrid />
                    </Button>
                    <Input placeholder="Enter integration name (e.g. Semgrep Prod)" {...field} />
                  </InputWrapper>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deploymentSlug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deployment Slug <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <InputWrapper className={form.formState.errors.deploymentSlug ? 'border-destructive' : ''}>
                    <Button size="sm" variant="dim" mode="icon" className="size-5 -ms-0.5" type="button">
                      <Globe />
                    </Button>
                    <Input placeholder="Enter your deployment slug" {...field} />
                  </InputWrapper>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="accessToken"
            render={({ field }) => (
              <FormItem>
                <FormLabel>API Access Token <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <InputWrapper className={form.formState.errors.accessToken ? 'border-destructive' : ''}>
                    <Button size="sm" variant="dim" mode="icon" className="size-5 -ms-0.5" type="button">
                      <Key />
                    </Button>
                    <Input type="password" placeholder="Enter Semgrep API token" {...field} />
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
        </div>
      </Form>
    </Modal>
  );
}

export default Semgrep;
