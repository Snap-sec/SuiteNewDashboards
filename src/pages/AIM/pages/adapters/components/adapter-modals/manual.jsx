import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RiLockPasswordFill } from '@remixicon/react';
import { Globe, Download } from 'lucide-react';
import { toast } from 'sonner';
import { useInstallAimAdapterMutation, useManualImportAimAdapterMutation } from '@/services/asset-inventory/adaptersApi';
import { Button } from '@/components/ui/button';
import { Input, InputWrapper } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Modal } from '@/components/custom/modal';
import { useStore } from '../../store';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { manualSchema } from '../../schemas';

function Manual() {
  const { showInstallModal, setShowInstallModal } = useStore();
  
  const form = useForm({
    resolver: zodResolver(manualSchema),
    mode: "onChange",
    defaultValues: {
      "file": ""
},
  });

  const [isOpen, setIsOpen] = useState(false);
  const [installAdapter] = useInstallAimAdapterMutation();
  const [manualImport] = useManualImportAimAdapterMutation();

  useEffect(() => {
    let { type } = showInstallModal;
    if (type === 'manual') {
      setIsOpen(true);
      form.reset({
      "file": ""
});
    } else {
      setIsOpen(false);
    }
  }, [showInstallModal, form]);

  const handleClose = () => {
    setIsOpen(false);
    setShowInstallModal({});
    form.reset();
  };

  const handleInstall = async (data) => {
    const isManual = 'manual' === 'manual';
    const isCsv = 'manual' === 'csv';
    const hasFile = true;

    let mutationCall;
    
    if (hasFile) {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'file' && value && value.length > 0) {
          formData.append(key, value[0]);
        } else if (key !== 'file') {
          formData.append(key, value);
        }
      });
      
      mutationCall = isManual 
        ? manualImport(formData).unwrap() 
        : installAdapter({ adapterName: 'manual', payload: formData }).unwrap();
    } else {
      mutationCall = installAdapter({
        adapterName: 'manual',
        payload: data,
      }).unwrap();
    }

    toast.promise(mutationCall, {
      loading: 'Integrating Manual...',
      success: () => {
        handleClose();
        return 'Manual integrated successfully';
      },
      error: (err) => err?.data?.message || err?.data?.error || 'Integration failed',
    });
  };

  const handleDownloadSample = (e) => {
    e.preventDefault();
    const sampleContent = `type,value,environment,title,status,description
subdomain,api.example.com,production,Core REST API Gateway,active,Primary production API endpoint
subdomain,app.example.com,production,Customer Dashboard Portal,active,Web application frontend
ip,192.168.1.100,production,Internal Database Host,active,Primary PostgreSQL DB host
ip,10.0.4.15,staging,Staging App Server,active,Staging application worker node
domain,example.com,production,Main Corporate Domain,active,Primary enterprise domain
repository,github.com/org/auth-service,production,Authentication Service,active,User authentication microservice codebase
server,prod-db-master-01,production,Production DB Primary Node,active,Primary database cluster host
workstation,dev-mac-042,internal,Engineering Workstation,active,Developer workstation
object_storage,s3://prod-user-uploads,production,S3 Uploads Bucket,active,AWS S3 bucket storing user uploads
api,https://api.example.com/v1/payments,production,Payment Gateway API,active,Stripe payment integration API endpoint`;

    const blob = new Blob([sampleContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'assets.sample.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal
      open={isOpen}
      setOpen={handleClose}
      title="Integrate Manual"
      description="Configure integration settings for Manual"
      footer={
        <Button
          variant="outline"
          onClick={form.handleSubmit(handleInstall)}
          disabled={form.formState.isSubmitting || !form.formState.isValid}
        >
          <Download /> Integrate
        </Button>
      }
    >
      <Form {...form}>
        <form style={{ display: 'none' }} aria-hidden="true">
          <input type="text" name="fakeUsernameToBypassAutofill" autoComplete="username" />
          <input type="password" name="fakePasswordToBypassAutofill" autoComplete="current-password" />
        </form>
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="file"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel>CSV File <span className="text-destructive">*</span></FormLabel>
                  <a
                    href="/sample/download/assets.sample.csv"
                    download="assets.sample.csv"
                    onClick={handleDownloadSample}
                    className="text-xs text-muted-foreground hover:text-foreground border-b border-dotted border-muted-foreground/60 hover:border-foreground transition-colors"
                  >
                    Download Sample CSV
                  </a>
                </div>
                <FormControl>
                  <Input 
                    type="file" 
                    onChange={(e) => onChange(e.target.files)}
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

export default Manual;
