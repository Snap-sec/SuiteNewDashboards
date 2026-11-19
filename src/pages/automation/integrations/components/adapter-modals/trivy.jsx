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
import Select from '@/components/custom/select';
import { useGetVmAssessmentsQuery } from '@/services/vm/assessmentsApi';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { trivySchema } from '../../schemas';
import Editor from "@/components/custom/Editor";
import AssessmentSelect from '../assessment-select';


const gitlabImageImportApiDocs = `### 📤 Endpoint

\`POST /api/imports/:assessmentId/gitlab-image-scanning\`

### Headers

| Key | Value |
| :--- | :--- |
| **Authorization** | \`Bearer <your-service-token>\` |
| **Content-Type** | \`application/json\` |

---
### 🔐 Auth Notes

* If using a service token, the \`orgId\` will be extracted from the token.
* For webhook use cases (e.g., directly from GitLab CI/CD), the \`orgId\` must be passed in the first vulnerability object of the body.

---
### 🧾 Request Body Format

\`\`\`json
{
  "vulnerabilities": [
    {
      "id": "123",
      "category": "container_scanning",
      "message": "CVE-2021-1234 in libssl",
      "description": "This vulnerability allows attackers to ...",
      "severity": "High",
      "solution": "Upgrade libssl to version 1.2.3",
      "identifiers": [
        {
          "type": "cve",
          "name": "CVE-2021-1234",
          "value": "CVE-2021-1234",
          "url": "https://nvd.nist.gov/vuln/detail/CVE-2021-1234"
        }
      ],
      "location": {
        "image": "registry.gitlab.com/org/project:tag",
        "operating_system": "debian",
        "dependency": {
          "package": {
            "name": "libssl"
          },
          "version": "1.0.2"
        }
      }
    }
  ]
}
\`\`\`

---
### 🧠 What the System Does

* Validates the assessment and org authorization.
* Parses vulnerabilities from the scan and enriches them.
* Links vulnerabilities to the specified assessment and container image.

---
### ✅ Example cURL (Trivy GitLab Webhook)

\`\`\`sh
curl -X POST http://your-domain.com/api/imports/<ASSESSMENT_ID>/gitlab-image-scanning \\
     -H "Content-Type: application/json" \\
     -d @gl-container-report.json
\`\`\`

---
### 🧾 Response

\`\`\`json
{
  "success": true,
  "message": "Import completed: 5 vulnerabilities created, 3 vulnerabilities updated",
  "data": {
    "created": [],
    "updated": []
  }
}
\`\`\`

---
### 🛠️ How to Use with Trivy (GitLab Integration)

* To set up Trivy, you can follow the official Trivy Docs.
* To use this parser module with Trivy GitLab container image scanning results:

1.  **Run Trivy on a Container Image**
    If Trivy is set up to export GitLab-compatible results, you can directly run:
    \`\`\`sh
    trivy image --format gitlab-json --output result.json your-image:tag
    \`\`\`

### 🛠️ Notes on Parsing

* Ensure the Trivy output format is \`gitlab-json\`.
* If using GitLab CI/CD, you can extract \`gl-container-scanning-report.json\` as the input.
* Vulnerabilities are enriched with properties like \`stepsToReproduce\`, \`impact\`, \`cvssScore\`, etc.
`;


function Trivy() {
  const { showInstallModal, setShowInstallModal } = useStore();

  const form = useForm({
    resolver: zodResolver(trivySchema),
    mode: "onChange",
    defaultValues: {
      name: '',
      assessmentId: '',
      adapterName: 'trivy',
    },
  });

  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isInstallOpen, setIsInstallOpen] = useState(false);

  const [installTrivy] = useInstallVmAdapterMutation();

  useEffect(() => {
    let { type, slug } = showInstallModal;

    if (type === 'adapter' && slug === 'trivy') {
      setIsDocsOpen(true);
      setIsInstallOpen(false);
    } else if (type === 'trivy') {
      setIsInstallOpen(true);
      setIsDocsOpen(false);
      form.reset({
        name: '',
        assessmentId: '',
        adapterName: 'trivy',
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
      adapterName: 'trivy',
      name: data.name,
      assessmentId: data.assessmentId,
    };

    toast.promise(installTrivy(finalPayload).unwrap(), {
      loading: 'Installing Trivy Integration...',
      success: () => {
        handleInstallClose();
        return 'Trivy Integration has been installed';
      },
      error: 'Failed to install Trivy Integration',
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
        title="Guide for Trivy"
        description="Import Vulnerabilities from Trivy into VM"
        className="w-3/4"
      >
        <div className="h-[80vh] overflow-y-scroll">
          <Editor
            className="w-full"
            readOnly={true}
            defaultValue={gitlabImageImportApiDocs}
          />
        </div>
      </Modal>

      {/* Install Modal */}
      <Modal
        open={isInstallOpen}
        setOpen={handleInstallClose}
        title="Integrate Trivy"
        description="Fetch vulnerabilities directly from Trivy scans"
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
                      <Input placeholder="Enter integration name (e.g. Trivy Prod)" {...field} />
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

export default Trivy;