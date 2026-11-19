import { MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { useGetVsScannersQuery } from '@/services/vs/vsApi';
import { useCreateVsScanMutation } from '@/services/vs/scansApi';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

function RunImmediateScanAction({ assetId }) {
    const { data: scanners } = useGetVsScannersQuery();
    const [createScan, { isLoading }] = useCreateVsScanMutation();

    const defaultScanner = scanners?.scanners?.[0];

    const handleRunImmediateScan = () => {
        if (!assetId) {
            return toast.error('Asset ID is required!');
        }

        if (!defaultScanner?._id) {
            return toast.error('No scanner available. Please configure a scanner first.');
        }

        const payload = {
            scannerId: defaultScanner._id,
            scanType: 'full',
            schedule: 'immediate',
            nextScan: new Date().toISOString(),
            assetId: assetId,
        };

        toast.promise(createScan(payload).unwrap(), {
            loading: 'Starting immediate scan...',
            success: 'Scan started successfully!',
            error: (err) => err?.data?.message || 'Failed to start scan',
        });
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
                <ButtonWithConfirm
                    confirm
                    variant="ghost"
                    disabled={isLoading}
                    confirmTitle="Run Immediate Scan?"
                    dialog="Are you sure you want to start an immediate full scan for this asset?"
                    onConfirm={handleRunImmediateScan}
                    className="w-full justify-start px-2 py-1.5 h-auto font-normal text-sm rounded-md hover:bg-accent text-left bg-transparent"
                >
                    Run Scan
                </ButtonWithConfirm>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default RunImmediateScanAction;
