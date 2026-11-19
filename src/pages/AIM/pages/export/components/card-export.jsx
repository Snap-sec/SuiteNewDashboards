import { useState } from 'react';
import { FileText, Loader2, DownloadCloudIcon } from 'lucide-react';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import GenerateExportModal from './modals/generate-export-modal';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';

const CardExport = ({ data }) => {
    const { name, description, type, types, supported_formats } = data;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getExportLogo = () => {
        if (supported_formats.includes('csv') || supported_formats.includes('xlsx')) {
            return 'csv.svg';
        }
        return 'pdf.svg';
    };

    return (
        <>
            <Card className="flex flex-col h-full">
                <CardContent className="p-5 lg:p-7.5 flex-grow">
                    <div className="flex items-center justify-between mb-3 lg:mb-5">
                        <div className="flex items-center justify-center">
                            <img
                                src={toAbsoluteUrl(`/media/file-types/${getExportLogo()}`)}
                                className="h-11 shrink-0"
                                alt="export icon"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 lg:gap-2.5">
                        <span className="text-base font-medium text-mono hover:text-primary-active">
                            {name}
                        </span>
                        <p className="text-sm text-secondary-foreground line-clamp-2">
                            {description}
                        </p>
                    </div>
                </CardContent>
                <CardFooter className="justify-between items-center py-3.5 border-t">
                    <AuthorityGuard forbidRoles={['Auditor']}>
                    <div className="flex gap-3 w-full">
                        <Button
                            className="w-full"
                            variant="outline"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <DownloadCloudIcon />
                            Generate Export
                        </Button>
                    </div>
                    </AuthorityGuard>
                </CardFooter>
            </Card>

            <GenerateExportModal
                open={isModalOpen}
                setOpen={setIsModalOpen}
                data={data}
            />
        </>
    );
};

export { CardExport };



