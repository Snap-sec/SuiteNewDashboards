import React from 'react';
import {
    CircleMinus,
    Ellipsis,
    Link2,
    PlusCircle,
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

function VulnerabilityActionCell({ row }) {
    const [suppressVuln] = useSuppressVsVulnMutation();
    const [unsuppressVuln] = useUnSuppressVsVulnMutation();
    const [sendToVm, { isLoading: isSendingToVm }] = useSendVsToVmMutation();

    const handleSuppress = async () => {
        const payload = {
            vulnId: row._id,
            matcher_name: row.matcher_name,
            template_id: row.template_id,
            matched_at: row.matched_at,
            host: row.host,
        };

        toast.promise(suppressVuln(payload).unwrap(), {
            loading: 'Suppressing vulnerability',
            success: 'Vulnerability suppressed successfully',
            error: 'Failed to suppress vulnerability',
        });
    };

    const handleUnsuppress = async () => {
        const payload = {
            vulnId: row._id,
            matcher_name: row.matcher_name,
            template_id: row.template_id,
            matched_at: row.matched_at,
            host: row.host,
        };

        toast.promise(unsuppressVuln(payload).unwrap(), {
            loading: 'Un-suppressing vulnerability',
            success: 'Vulnerability un-suppressed successfully',
            error: 'Failed to un-suppress vulnerability',
        });
    };

    const handleSendToVm = () => {
        toast.promise(sendToVm({ vulnIds: [row._id] }).unwrap(), {
            loading: 'Sending to VM',
            error: 'VM Assessment is not configured in settings',
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
                        onClick={row.is_suppressed ? handleUnsuppress : handleSuppress}
                    >
                        {row.is_suppressed ? (
                            <>
                                {/* <PlusCircle className="mr-2 h-4 w-4 text-blue-500" /> */}
                                Un-suppress
                            </>
                        ) : (
                            <>
                                {/* <CircleMinus className="mr-2 h-4 w-4 text-orange-500" /> */}
                                Suppress
                            </>
                        )}
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {row.sentToVm ? (
                        <DropdownMenuItem
                            onClick={() =>
                                window.open(
                                    `/vm/vulnerability-report?id=${row.universalVulnId}&assessmentId=${row.assessmentId}`,
                                    '_blank',
                                )
                            }
                        >
                            {/* <Link2 className="mr-2 h-4 w-4" /> */}
                            View Ticket
                        </DropdownMenuItem>
                    ) : (
                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem>
                                {/* <Send className="mr-2 h-4 w-4" /> */}
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

export default VulnerabilityActionCell;
