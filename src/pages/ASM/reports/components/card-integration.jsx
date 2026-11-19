import React, { useState } from 'react';
import { Download, FileText, Loader2, Eye } from 'lucide-react';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateFormatter } from '@/components/custom/date-formatter';
import DownloadReport from './actions/download-report';
import DeleteReport from './actions/delete-report';
import { CustomTooltip } from '@/components/custom/tooltip';
import { useGenerateAsmNewReportMutation } from '@/services/asm/reportsApi';
import { toast } from 'sonner';
import AuthorityGuard from '../../../../components/custom/authority-guard/AuthorityGuard';

const CardIntegration = ({
    id,
    logo,
    format = 'pdf',
    formats = [],
    name,
    type,
    reportId,
    isGeneratedAt,
    status,
    description
}) => {
    const defaultFormat = formats && formats.length > 0
        ? (formats.includes('xlsx') ? 'xlsx' : formats[0])
        : (format || 'pdf');

    const [selectedFormat, setSelectedFormat] = useState(defaultFormat);

    const [generateReport, { isLoading: isGenerating }] = useGenerateAsmNewReportMutation();

    const viewUrl = type === 'executive'
        ? `/pages/public/asm-reports/executive?${reportId ? `reportId=${reportId}&` : ''}view_mode=web`
        : type === 'exposure'
        ? `/pages/public/asm-reports/exposure?${reportId ? `reportId=${reportId}&` : ''}view_mode=web`
        : null;

    const handleGenerateReport = async () => {
        const reportName = `${name} - ${new Date().toISOString().split('T')[0]}`;
        toast.promise(
            generateReport({ reportType: type, name: reportName, format: selectedFormat }).unwrap(),
            {
                loading: 'Generating Report',
                success: 'Report Generation Started',
                error: 'Failed to generate report',
            },
        );
    };


    const getReportLogo = () => {
        if (selectedFormat === 'pdf' || selectedFormat === 'PDF') return 'pdf.svg';
        if (selectedFormat === 'xlsx' || selectedFormat === 'XLSX') return 'xlsx.svg';
        if (selectedFormat === 'csv' || selectedFormat === 'CSV') return 'csv.svg';

        if (type === 'executive') {
            return 'pdf.svg';
        } else if (type === 'asset-inventory' || type === 'exposure') {
            return 'xlsx.svg';
        }
        else if (type === 'full-report' || type === 'full-report') {
            return 'xlsx.svg';
        }
        return logo || 'pdf.svg';
    };

    return (
        <Card>
            <CardContent className="p-5 lg:p-7.5">
                <div className="flex items-center justify-between mb-3 lg:mb-5">
                    <div className="flex items-center justify-center">
                        <img
                            src={toAbsoluteUrl(`/media/file-types/${getReportLogo()}`)}
                            className="h-11 shrink-0"
                            alt="report icon"
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-1 lg:gap-2.5">
                    <span className="text-base font-medium text-mono hover:text-primary-active">
                        {name}
                    </span>
                    <span className="text-sm text-secondary-foreground">
                        {description}
                    </span>
                </div>
            </CardContent>
            <CardFooter className="justify-between items-center py-3.5">
                <div className="flex gap-3">
                    <AuthorityGuard forbidRoles={['Auditor']}>
                        <Button
                            variant="outline"
                            onClick={handleGenerateReport}
                            disabled={isGenerating || status === 'pending' || status === 'processing'}
                        >
                            {isGenerating ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <FileText className="h-4 w-4 mr-2" />}
                            Generate
                        </Button>
                    </AuthorityGuard>

                    {viewUrl && selectedFormat?.toLowerCase() === 'pdf' && (
                        <Button
                            variant="outline"
                            onClick={() => window.open(viewUrl, "_blank", "noopener,noreferrer")}
                        >
                            <Eye className="h-4 w-4" />
                            Preview
                        </Button>
                    )}
                </div>

                <AuthorityGuard forbidRoles={['Auditor']}>
                    {formats && formats.length > 1 && (
                        <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                            <SelectTrigger className="w-fit h-8">
                                <SelectValue placeholder="Format" />
                            </SelectTrigger>
                            <SelectContent>
                                {formats.map((f) => (
                                    <SelectItem key={f} value={f} className="uppercase">
                                        {f}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </AuthorityGuard>
            </CardFooter>
        </Card>
    );
};

export { CardIntegration };
