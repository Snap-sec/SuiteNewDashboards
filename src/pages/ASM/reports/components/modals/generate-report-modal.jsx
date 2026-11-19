import { useState } from 'react';
import { FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/custom/modal';
import Select from '@/components/custom/select';
import { useGenerateAsmNewReportMutation } from '../../../../../services/asm/reportsApi';

function GenerateReportModel() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportName, setReportName] = useState('');
  const [reportType, setReportType] = useState('executive');

  const [generateReport, { isLoading: isGenerating }] =
    useGenerateAsmNewReportMutation();

  // Report type options
  const reportTypeOptions = [
    { label: 'Executive Report (PDF)', value: 'executive' },
    { label: 'Attack Surface Report (XLSX)', value: 'asset-inventory' },
    { label: 'Exposure Report (XLSX)', value: 'exposure' },
  ];

  // Handle to generate report api call
  const handleGenerateReport = async () => {
    if (!reportName.trim()) return toast.error('Report Name is Required');
    if (!reportType) return toast.error('Report Type is Required');

    toast.promise(
      generateReport({ reportType, name: reportName })
        .unwrap()
        .then(() => {
          setIsModalOpen(false);
          setReportName('');
          setReportType('executive');
        }),
      {
        loading: 'Generating Report',
        success: 'Report Generated',
        error: 'Failed to generate report',
      },
    );
  };

  return (
    <Modal
      open={isModalOpen}
      setOpen={setIsModalOpen}
      title="Generate Report"
      description="Generate a new Report."
      trigger={
        <Button>
          <FileText /> Generate Report
        </Button>
      }
      footer={
        <div className="mt-2">
          <Button onClick={handleGenerateReport} disabled={isGenerating}>
            <FileText /> Generate
          </Button>
        </div>
      }
      className="w-full md:w-1/2 lg:w-1/3"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-0.5">
          <p className="mb-1">Report Type</p>
          <Select
            value={reportType}
            options={reportTypeOptions}
            placeholder="Select report type"
            onChange={(selected) => setReportType(selected?.value)}
            enableSearch={false}
          />
        </div>

        <div className="flex flex-col gap-0.5">
          <p className="mb-1">Report Name</p>
          <Input
            value={reportName}
            placeholder="Enter Name"
            onChange={(e) => setReportName(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
}

export default GenerateReportModel;
