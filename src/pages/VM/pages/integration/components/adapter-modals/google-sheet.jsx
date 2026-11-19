import { Modal } from '@/components/custom/modal';
import { Button } from '@/components/ui/button';
import { useStore } from '../../store';
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Textarea } from '@/components/ui/textarea';
import { useInstallVmCSVAdapterMutation } from '@/services/vm/adaptersApi';
import { toast } from 'sonner';
import { Download, Link } from 'lucide-react';
import { Input, InputWrapper } from '@/components/ui/input';
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
import { csvSchema } from '../../schemas';

function GoogleSheet() {
  const { showInstallModal, setShowInstallModal } = useStore();
  const [search, setSearch] = useState('');
  const [installCsv] = useInstallVmCSVAdapterMutation();

  // Get all assessments with search
  const { data: assessments, isLoading, isFetching } = useGetVmAssessmentsQuery({ search });

  const form = useForm({
    resolver: zodResolver(csvSchema),
    mode: "onChange",
    defaultValues: {
      adapterName: 'google-sheet',
      assessmentId: '',
      gsheetUrl: '',
      name: '',
      reportTemplate: `# {{title}}\n\n## Description\n{{description}}\n\n## Steps To Reproduce\n{{stepsToReproduce}}\n\n## Impact\n{{impact}}\n\n## References\n{{references}}`,
    },
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const { type } = showInstallModal;
    if (type === 'google-sheet') {
      setIsOpen(true);
      form.reset({
        adapterName: 'google-sheet',
        assessmentId: '',
        gsheetUrl: '',
        name: '',
        reportTemplate: `# {{title}}\n\n## Description\n{{description}}\n\n## Steps To Reproduce\n{{stepsToReproduce}}\n\n## Impact\n{{impact}}\n\n## References\n{{references}}`,
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
    toast.promise(
      installCsv(data).unwrap(),
      {
        loading: 'Installing Google Sheet Integration...',
        success: 'Google Sheet Integration Installed',
        error: 'Failed to install Google Sheet Integration',
      }
    ).then(() => {
      handleClose();
    });
  };

  // Format assessments data for select options
  const assessmentOptions = assessments?.data?.assessments?.map(assessment => ({
    value: assessment._id,
    label: assessment.name || assessment.title
  })) || [];


  return (
    <Modal
      open={isOpen}
      setOpen={handleClose}
      title="Google Sheet Import"
      description="Set up Google Sheet integration to streamline asset data loading into the vulnerability management system"
      footer={
        <Button 
          variant="outline" 
          onClick={form.handleSubmit(handleInstall)} 
          disabled={form.formState.isSubmitting || !form.formState.isValid}
        >
          <Download /> Install
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
                <FormLabel>Instance Name <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <InputWrapper className={form.formState.errors.name ? 'border-destructive' : ''}>
                    <Input placeholder="Enter integration name" {...field} />
                  </InputWrapper>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gsheetUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Google Sheet URL <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <InputWrapper className={form.formState.errors.gsheetUrl ? 'border-destructive' : ''}>
                    <Button size="sm" variant="dim" mode="icon" className="size-5 -ms-0.5" type="button">
                      <Link />
                    </Button>
                    <Input placeholder="Enter Google Sheet URL" {...field} />
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
            name="reportTemplate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Report Template <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Report Template"
                    rows={8}
                    {...field}
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

export default GoogleSheet;
