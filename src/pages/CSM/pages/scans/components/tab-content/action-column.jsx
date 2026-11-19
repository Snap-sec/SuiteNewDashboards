import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { MoreHorizontal } from 'lucide-react';
import { useDeleteScanMutation, useTriggerScanMutation } from '@/services/csm/scansApi';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import useStore from '../../store';

function ActionColumn({ scan }) {
    const [deleteScan, { isLoading: isDeleting }] = useDeleteScanMutation();
    const [triggerScan, { isLoading: isTriggering }] = useTriggerScanMutation();
    const setModalMode = useStore((state) => state.setModalMode);
    const setSelectedScan = useStore((state) => state.setSelectedScan);
    const setShowCreateUpdateModal = useStore((state) => state.setShowCreateUpdateModal);

    const handleEdit = () => {
        setModalMode('update');
        setSelectedScan(scan);
        setShowCreateUpdateModal(true);
    };

    const handleTrigger = async () => {
        try {
            await triggerScan(scan?._id).unwrap();
            toast.success('Scan triggered successfully');
        } catch (error) {
            toast.error(error?.data?.message || 'Failed to trigger scan');
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

    const status = (scan?.status || scan?.lastRunStatus || '').toLowerCase();
    const isFailed = status === 'failed';
    const isCompleted = status === 'completed';

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px]">
                {/* <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
                    Edit Scan
                </DropdownMenuItem> */}

                <DropdownMenuItem
                    onClick={handleTrigger}
                    disabled={isTriggering || isCompleted}
                    className="cursor-pointer"
                >
                    {isFailed || isCompleted ? 'Re-run' : 'Execute'}
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <ButtonWithConfirm
                    variant="ghost"
                    confirm
                    disabled={isDeleting}
                    dialog={<p>Are you sure you want to delete this scan? This action cannot be undone.</p>}
                    onConfirm={handleDelete}
                    className="w-full justify-start px-2 py-1.5 h-auto font-normal text-sm rounded-md hover:bg-accent text-left bg-transparent text-destructive hover:text-destructive"
                >
                    Delete
                </ButtonWithConfirm>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default ActionColumn;
