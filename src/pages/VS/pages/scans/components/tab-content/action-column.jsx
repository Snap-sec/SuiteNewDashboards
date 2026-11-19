import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { MoreHorizontal } from 'lucide-react';
import { useDeleteVsScanMutation, useHaltVsScanMutation, useStartVsScanMutation } from '../../../../../../services/vs/scansApi';
import { toast } from 'sonner';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import appConfig from '@/config/appConfig';

function ActionColumn({ scan }) {
    const [deleteScan, { isLoading: isDeleting }] = useDeleteVsScanMutation();
    const [haltScan, { isLoading: isHalting }] = useHaltVsScanMutation();
    const [startScan, { isLoading: isStarting }] = useStartVsScanMutation();
    const [isDownloading, setIsDownloading] = useState(false);

    const handleHalt = async () => {
        try {
            await haltScan({
                scannerId: scan?.scanner?._id,
                scanId: scan?._id
            }).unwrap();
            toast.success('Scan halted successfully');
        } catch (error) {
            toast.error(error?.data?.message || 'Failed to halt scan');
        }
    };

    const handleRestart = async () => {
        try {
            await startScan(scan?._id).unwrap();
            toast.success('Scan restarted successfully');
        } catch (error) {
            toast.error(error?.data?.message || 'Failed to restart scan');
        }
    };

    const handleDelete = async () => {
        try {
            await deleteScan(scan?._id).unwrap();
            toast.success('Scan deleted successfully');
        } catch (error) {
            toast.error(error?.data?.message || 'Failed to delete scan');
        }
    };

    const handleDownloadReport = async () => {
        setIsDownloading(true);
        toast.info('Generating report, please wait...');
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${appConfig.BASE_URL}/vs/api/scans/${scan?._id}/report`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error('Report generation failed');

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `scan-report-${scan?._id}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
            toast.success('Report downloaded');
        } catch (err) {
            toast.error('Failed to generate report');
        } finally {
            setIsDownloading(false);
        }
    };

    const isRunning = scan?.state === 'running' || scan?.state === 'pending';
    const canDelete = scan?.state === 'halted' || scan?.state === 'failed';
    const isCompleted = scan?.state === 'completed';

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
                {isRunning && (
                    <ButtonWithConfirm
                        variant="ghost"
                        confirm
                        disabled={isHalting}
                        dialog={<p>Are you sure you want to halt this scan? This will stop the scan immediately.</p>}
                        onConfirm={handleHalt}
                        className="w-full justify-start px-2 py-1.5 h-auto font-normal text-sm rounded-md hover:bg-accent text-left bg-transparent"
                    >
                        Halt
                    </ButtonWithConfirm>
                )}

                {isCompleted && (
                    <>
                        <DropdownMenuItem
                            onClick={() => window.open(`/pages/public/vs-reports/scan-report?scanId=${scan?._id}&view_mode=web`, '_blank')}
                            className="cursor-pointer"
                        >
                            View Report
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            disabled={isDownloading || scan?.totalVulns === 0}
                            onClick={handleDownloadReport}
                            className="cursor-pointer"
                        >
                            {isDownloading ? 'Downloading...' : 'Download Report'}
                        </DropdownMenuItem>
                    </>
                )}

                {canDelete && (
                    <ButtonWithConfirm
                        variant="ghost"
                        confirm
                        disabled={isStarting}
                        dialog={<p>Are you sure you want to restart this scan? All previous results will be preserved in history.</p>}
                        onConfirm={handleRestart}
                        className="w-full justify-start px-2 py-1.5 h-auto font-normal text-sm rounded-md hover:bg-accent text-left bg-transparent"
                    >
                        Restart
                    </ButtonWithConfirm>
                )}

                {(isRunning || isCompleted) && canDelete && <DropdownMenuSeparator />}

                {canDelete && (
                    <ButtonWithConfirm
                        variant="ghost"
                        confirm
                        disabled={isDeleting}
                        dialog={<p>Are you sure you want to delete this scan? This action cannot be undone.</p>}
                        onConfirm={handleDelete}
                        className="w-full justify-start px-2 py-1.5 h-auto font-normal text-sm rounded-md text-destructive hover:text-destructive hover:bg-destructive/10 text-left bg-transparent"
                    >
                        Delete
                    </ButtonWithConfirm>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default ActionColumn;
