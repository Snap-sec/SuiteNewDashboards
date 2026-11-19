import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LayoutGrid, Terminal } from 'lucide-react';
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
import { nucleiSchema } from '../../schemas';
import Editor from "@/components/custom/Editor";


const nucleiAdapterDocumentation = `This adapter enables you to import vulnerability findings directly from **Nuclei** into your system. It parses Nuclei scan results and standardizes them for seamless integration into your vulnerability management workflow.

### How to Use

1.  **Perform a Nuclei Scan**
    Run your Nuclei scan and save the output to a file named \`vulnerabilities.json\`.

2.  **Verify JSON Format**
    Ensure the scan results are in the required JSON format. A valid sample structure is provided at the end of this guide under the "Sample \`vulnerabilities.json\`" section.

3.  **Get Your Credentials**
    -   Log in to your **Snapsec VM Account**.
    -   Copy the **Assessment ID** for the assessment where you want to import the findings.
    -   Navigate to the **Account Settings** page and copy your **API Key**.

4.  **Import the Findings**
    Open your terminal and execute the following \`curl\` command to upload your \`vulnerabilities.json\` file.

    \`\`\`sh
    curl -X POST "https://suite.snapsec.co/csm/api/import/<assessment-id>/nuclei-scanning" \\
         -H "x-api-key: <your-api-key>" \\
         -H "Content-Type: application/json" \\
         -d @vulnerabilities.json \\
         -k
    \`\`\`

    > **Important:** Replace \`<assessment-id>\` with your actual Assessment ID and \`<your-api-key>\` with your API key.
    >
    > **Note on the \`-k\` flag:** This flag tells \`curl\` to perform an "insecure" SSL transfer, which bypasses certificate validation. You may need this for local or development environments. Remove it if your endpoint has a valid SSL certificate.

---

### Sample \`vulnerabilities.json\`

\`\`\`json
[
  {
    "template-id": "network-telnet-default-credentials",
    "info": {
      "name": "Telnet Default Credentials - admin:admin",
      "severity": "high",
      "description": "Device accessible via Telnet with default credentials (admin:admin)."
    },
    "host": "192.168.100.10:23",
    "matched-at": "telnet://192.168.100.10:23",
    "ip": "192.168.100.10",
    "timestamp": "2025-03-18T12:11:01Z"
  },
  {
    "template-id": "network-open-smb-anonymous-access",
    "info": {
      "name": "SMB Anonymous Share Access",
      "severity": "medium",
      "description": "SMB service allows anonymous access to shared folders."
    },
    "host": "10.0.0.12:445",
    "matched-at": "smb://10.0.0.12/shared",
    "ip": "10.0.0.12",
    "timestamp": "2025-03-18T13:45:15Z"
  }
]
\`\`\`

> ✅ Ensure your file strictly follows the JSON structure shown above for successful ingestion.
`;


function Nuclei() {
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
    resolver: zodResolver(nucleiSchema),
    mode: "onChange",
    defaultValues: {
      name: '',
      assessmentId: '',
      adapterName: 'nuclei',
    },
  });

  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isInstallOpen, setIsInstallOpen] = useState(false);

  const [installNuclei] = useInstallVmAdapterMutation();

  useEffect(() => {
    let { type, slug } = showInstallModal;

    if (type === 'adapter' && slug === 'nuclei') {
      setIsDocsOpen(true);
      setIsInstallOpen(false);
    } else if (type === 'nuclei') {
      setIsInstallOpen(true);
      setIsDocsOpen(false);
      form.reset({
        name: '',
        assessmentId: '',
        adapterName: 'nuclei',
      });
    } else {
      setIsDocsOpen(false);
      setIsInstallOpen(false);
    }
  }, [showInstallModal, form]);

  const handleInstallClose = () => {
    setIsInstallOpen(false);
    setShowInstallModal({});
    form.reset();
  };

  const handleInstall = (data) => {
    const finalPayload = {
      adapterName: 'nuclei',
      name: data.name,
      assessmentId: data.assessmentId,
    };

    toast.promise(installNuclei(finalPayload).unwrap(), {
      loading: 'Installing Nuclei Integration...',
      success: () => {
        handleInstallClose();
        return 'Nuclei Integration has been installed';
      },
      error: 'Failed to install Nuclei Integration',
    });
  };

  return (
    <>
      {/* Docs Modal */}
      <Modal
        open={isDocsOpen}
        setOpen={(val) => {
          setIsDocsOpen(val);
          if (!val) setShowInstallModal({});
        }}
        title="Guide for Nuclei"
        description="Import Nuclei Vulns directly to VM"
        className="w-3/4"
      >
        <div className="h-[80vh] overflow-y-scroll">
          <Editor
            className="w-full"
            readOnly={true}
            defaultValue={nucleiAdapterDocumentation}
          />
        </div>
      </Modal>

      {/* Install Modal */}
      <Modal
        open={isInstallOpen}
        setOpen={handleInstallClose}
        title="Integrate Nuclei"
        description="Fetch vulnerabilities directly from Nuclei scans"
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
                      <Input placeholder="Enter integration name (e.g. Nuclei Prod)" {...field} />
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
    </>
  );
}

export default Nuclei;