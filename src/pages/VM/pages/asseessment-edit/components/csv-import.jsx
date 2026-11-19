import { useState } from 'react';
import { Download } from 'lucide-react';
import { toast } from 'sonner';
import { useInstallVmCSVAdapterMutation } from '@/services/vm/adaptersApi';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FileUpload } from '@/components/custom/file-upload';
import { Modal } from '@/components/custom/modal';

function CSVImport({ isOpen, setIsOpen, assessmentId }) {
  const [installCsv, { isLoading: isInstalling }] =
    useInstallVmCSVAdapterMutation();
  const [csvFile, setCsvFile] = useState(null);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [reportTemplate, setReportTemplate] = useState(`##{{title}}


## Summary
{{impact}}


###
`);

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

  const handleInstall = () => {
    if (!csvFile) {
      toast.error('Please upload a CSV file');
      return;
    }

    const formData = new FormData();
    formData.append('file', csvFile);
    formData.append('reportTemplate', reportTemplate);
    formData.append('assessmentId', assessmentId);

    toast.promise(installCsv(formData).unwrap(), {
      loading: 'Importing CSV data...',
      success: (data) => {
        setIsOpen(false);
        setCsvFile(null);
        setCsvHeaders([]);
        setReportTemplate(`##{{title}}\n\n## Summary\n{{impact}}\n\n###\n`);
        return 'CSV data imported successfully! The vulnerabilities will be processed shortly.';
      },
      error: (err) => {
        return (
          err?.data?.message || 'Failed to import CSV data. Please try again.'
        );
      },
    });
  };

  return (
    <Modal
      open={isOpen}
      setOpen={setIsOpen}
      title="CSV Import"
      description="Import vulnerability data via CSV file"
      footer={
        <Button
          variant="outline"
          onClick={handleInstall}
          disabled={isInstalling || !csvFile}
        >
          <Download /> Import CSV
        </Button>
      }
    >
      <div className="flex flex-col gap-3">
        <FileUpload
          maxFiles={1}
          maxFileSize={10 * 1024 * 1024}
          variant="compact"
          acceptedTypes=".csv"
          onFilesChange={handleFilesChange}
        />

        {csvHeaders.length > 0 && (
          <div>
            <b>Headers:</b>
            <div className="flex gap-1 items-center flex-wrap">
              {csvHeaders.map((header, i) => (
                <Badge variant="secondary">{header}</Badge>
              ))}
            </div>
          </div>
        )}

        <Textarea
          value={reportTemplate}
          onChange={(e) => setReportTemplate(e.target.value)}
          placeholder="Report Template"
          rows={8}
        />
      </div>
    </Modal>
  );
}

export default CSVImport;
