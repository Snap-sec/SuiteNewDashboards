import {
    Ellipsis,
    Link2,
    Send,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
    useSendVsToVmMutation,
    useSuppressVsVulnMutation,
    useUnSuppressVsVulnMutation,
} from '@/services/vs/vsApi';

function ScanVulnActionCell({ row }) {
    const data = row.original;

    const [suppressVuln] = useSuppressVsVulnMutation();
    const [unsuppressVuln] = useUnSuppressVsVulnMutation();
    const [sendToVm, { isLoading: isSendingToVm }] = useSendVsToVmMutation();

    const handleSuppress = () => {
        const payload = {
            vulnId: data._id,
            matcher_name: data.matcher_name,
            template_id: data.template_id,
            matched_at: data.matched_at,
            host: data.host,
        };
        toast.promise(suppressVuln(payload).unwrap(), {
            loading: 'Suppressing vulnerability',
            success: 'Vulnerability suppressed successfully',
            error: 'Failed to suppress vulnerability',
        });
    };

    const handleUnsuppress = () => {
        const payload = {
            vulnId: data._id,
            matcher_name: data.matcher_name,
            template_id: data.template_id,
            matched_at: data.matched_at,
            host: data.host,
        };
        toast.promise(unsuppressVuln(payload).unwrap(), {
            loading: 'Un-suppressing vulnerability',
            success: 'Vulnerability un-suppressed successfully',
            error: 'Failed to un-suppress vulnerability',
        });
    };

    const handleSendToVm = () => {
        toast.promise(sendToVm({ vulnIds: [data._id] }).unwrap(), {
            loading: 'Sending to VM',
            error: (err) => err?.data?.message || 'VM Assessment is not configured in settings',
            success: 'Ticket created in VM',
        });
    };

    return (
        <AlertDialog>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <Ellipsis size={16} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[180px]">
                    <DropdownMenuItem
                        onClick={data.is_suppressed ? handleUnsuppress : handleSuppress}
                    >
                        {data.is_suppressed ? 'Un-suppress' : 'Suppress'}
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {data.sentToVm ? (
                        <DropdownMenuItem
                            onClick={() =>
                                window.open(
                                    `/vm/vulnerability-report?id=${data.universalVulnId}&assessmentId=${data.assessmentId}`,
                                    '_blank',
                                )
                            }
                        >
                            View Ticket
                        </DropdownMenuItem>
                    ) : (
                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem>
                                Send to VM
                            </DropdownMenuItem>
                        </AlertDialogTrigger>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Send to VM</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to send this vulnerability to Vulnerability
                        Management? This will create a new ticket.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleSendToVm}
                        disabled={isSendingToVm}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        {isSendingToVm ? 'Sending...' : 'Confirm'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default ScanVulnActionCell;
