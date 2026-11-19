import { Modal } from '@/components/custom/modal';
import { Button } from '@/components/ui/button';
import { useStore } from '../../store';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '@/components/ui/textarea';
import { useInstallVmCSVAdapterMutation } from '@/services/vm/adaptersApi';
import { toast } from 'sonner';
import { Download } from 'lucide-react';
import { Input, InputWrapper } from '@/components/ui/input';
import AssessmentSelect from '../assessment-select';
import { useGetVmAssessmentsQuery } from '@/services/vm/assessmentsApi';
import { FileUpload } from '@/components/custom/file-upload';
import { Badge } from '@/components/ui/badge';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { csvAdapterSchema } from '../../schemas';
import appConfig from '@/config/appConfig';

function CsvAdapterModal() {
  const { showInstallModal, setShowInstallModal } = useStore();
  const [search, setSearch] = useState('');
  const [installCsv] = useInstallVmCSVAdapterMutation();
  const [csvFile, setCsvFile] = useState(null);
  const [csvHeaders, setCsvHeaders] = useState([]);

  // Get all assessments with search
  const { data: assessments, isLoading, isFetching } = useGetVmAssessmentsQuery({ search });

  const form = useForm({
    resolver: zodResolver(csvAdapterSchema),
    mode: "onChange",
    defaultValues: {
      adapterName: 'csv',
      assessmentId: '',
      name: '',
      reportTemplate: `# {{title}}\n\n## Description\n{{description}}\n\n## Steps To Reproduce\n{{stepsToReproduce}}\n\n## Impact\n{{impact}}\n\n## References\n{{references}}`,
    },
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const { type } = showInstallModal;
    if (type === 'csv') {
      setIsOpen(true);
      form.reset({
        adapterName: 'csv',
        assessmentId: '',
        name: '',
        reportTemplate: `# {{title}}\n\n## Description\n{{description}}\n\n## Steps To Reproduce\n{{stepsToReproduce}}\n\n## Impact\n{{impact}}\n\n## References\n{{references}}`,
      });
      setCsvFile(null);
      setCsvHeaders([]);
    } else {
      setIsOpen(false);
    }
  }, [showInstallModal, form]);

  const handleClose = () => {
    setIsOpen(false);
    setShowInstallModal({});
    setCsvFile(null);
    setCsvHeaders([]);
    form.reset();
  };

  const handleFilesChange = (files) => {
    if (files.length === 0) {
      setCsvFile(null);
      setCsvHeaders([]);
      return;
    }
    const file = files[0];
    setCsvFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const firstLine = text.split(/\r?\n/)[0];
      const headers = firstLine.split(',');
      setCsvHeaders(headers);
    };
    reader.readAsText(file);
  };

  const handleInstall = (data) => {
    if (!csvFile) {
      toast.error('Please upload a CSV file');
      return;
    }

    const formData = new FormData();
    formData.append('file', csvFile);
    formData.append('name', data.name);
    formData.append('assessmentId', data.assessmentId);
    formData.append('reportTemplate', data.reportTemplate);

    toast.promise(
      installCsv(formData).unwrap(),
      {
        loading: 'Installing CSV Integration...',
        success: () => {
          handleClose();
          return 'CSV Integration Installed & Data Processing Initiated';
        },
        error: (err) => err?.data?.message || 'Failed to install CSV Integration',
      }
    );
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
      title="CSV Import"
      description="Set up CSV integration to load vulnerability data directly from CSV files"
      footer={
        <Button
          variant="outline"
          onClick={form.handleSubmit(handleInstall)}
          disabled={form.formState.isSubmitting || !form.formState.isValid || !csvFile}
        >
          <Download /> Install
        </Button>
      }
      className="max-h-[95vh] overflow-y-auto sm:max-w-[550px] w-full"
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
                    <Input placeholder="Enter integration name" {...field} />
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
                    onChange={(option) => field.onChange(option?.value || '')}
                    error={!!form.formState.errors.assessmentId}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <FormLabel>Upload CSV File <span className="text-destructive">*</span></FormLabel>
              <a
                href={`${appConfig.BASE_URL}/sample/download/vulns.sample.csv`}
                download
                className="text-xs text-muted-foreground hover:text-foreground border-b border-dotted border-muted-foreground/60 hover:border-foreground transition-colors"
              >
                Download Sample CSV
              </a>
            </div>
            <FileUpload
              maxFiles={1}
              maxFileSize={10 * 1024 * 1024}
              variant="compact"
              acceptedTypes=".csv"
              onFilesChange={handleFilesChange}
            />
            {csvHeaders.length > 0 && (
              <div className="mt-1">
                <span className="text-xs font-semibold text-muted-foreground block mb-1">Detected CSV Columns:</span>
                <div className="flex gap-1.5 items-center flex-wrap max-h-24 overflow-y-auto p-1.5 border rounded-md bg-secondary/20">
                  {csvHeaders.map((header, i) => (
                    <Badge key={i} variant="secondary" className="text-[10px] font-mono py-0.5 px-1.5">
                      {header.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <FormField
            control={form.control}
            name="reportTemplate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Report Template <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter report template structure (e.g. ##{{title}}\n\n## Summary\n{{impact}})"
                    rows={6}
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

export default CsvAdapterModal;
