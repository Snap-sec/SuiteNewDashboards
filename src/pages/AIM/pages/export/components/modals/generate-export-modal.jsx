import { useState } from 'react';
import { DownloadCloudIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/custom/modal';
import Select from '@/components/custom/select';
import appConfig from '@/config/appConfig';
import { useDownloadAimExportMutation } from '@/services/asset-inventory/exportApi';

function GenerateExportModal({ open, setOpen, data }) {
    const { name, description, type, types, supported_formats } = data;

    const [selectedFormat, setSelectedFormat] = useState(supported_formats[0] || 'csv');
    const [finalType, setFinalType] = useState(type == "custom" ? "" : type);

    const [downloadAimExport, { isLoading }] = useDownloadAimExportMutation();

    const formatOptions = supported_formats.map((format) => ({
        label: format.toUpperCase(),
        value: format,
    }));

    const typeOptions = types.map((format) => ({
        label: format.toUpperCase(),
        value: format,
    }));

    const handleGenerateExport = async () => {
        if (!selectedFormat) return toast.error('Please select a format');

        if (finalType == "custom") return toast.error("Invalid Type Selected");

        try {
            toast.info(`Downloading ${name} in ${selectedFormat.toUpperCase()} format...`);
            
            const blob = await downloadAimExport({ type: finalType, format: selectedFormat }).unwrap();

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `export-${name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.${selectedFormat}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            toast.success(`Downloaded ${name} in ${selectedFormat.toUpperCase()} format.`);
            setOpen(false);
        } catch (error) {
            toast.error('Failed to download export');
        }
    };

    return (
        <Modal
            open={open}
            setOpen={setOpen}
            title="Generate Export"
            description={`Export ${name} assets in your preferred format.`}
            footer={
                <div className="mt-2">
                    <Button onClick={handleGenerateExport}>
                        <DownloadCloudIcon /> Generate
                    </Button>
                </div>
            }
            className="w-full md:w-1/2 lg:w-1/3"
        >
            <div className="flex flex-col gap-4">
                {
                    type == "custom" &&
                    <div className="flex flex-col gap-0.5">
                        <p className="mb-1 text-sm font-medium">Select Type</p>
                        <Select
                            value={finalType}
                            options={typeOptions}
                            placeholder="Select Type"
                            onChange={(selected) => setFinalType(selected?.value)}
                            enableSearch={false}
                        />
                    </div>
                }
                <div className="flex flex-col gap-0.5">
                    <p className="mb-1 text-sm font-medium">Select Format</p>
                    <Select
                        value={selectedFormat}
                        options={formatOptions}
                        placeholder="Select format"
                        onChange={(selected) => setSelectedFormat(selected?.value)}
                        enableSearch={false}
                    />
                </div>
            </div>
        </Modal>
    );
}

export default GenerateExportModal;
