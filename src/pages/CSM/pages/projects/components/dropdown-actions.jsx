import { FileText, FileUp, Share2, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { toast } from 'sonner';
import appConfig from '@/config/appConfig';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';

import { Button } from "@/components/ui/button";
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import { useDeleteAccountMutation } from '@/services/csm/accountsApi';
import { useState } from 'react';


export function AccountActions({ trigger, projectId }) {
    const [deleteAccount, { isLoading: isDeleting }] = useDeleteAccountMutation();

    const [open, setOpen] = useState(false); // 👈 Track dropdown open state

    const handleDelete = () => {
        toast.promise(deleteAccount(projectId).unwrap(), {
            loading: "Disconnecting Account",
            success: "Account Disconnected",
            error: "Failed to disconnect account"
        });
    }



    const handleExportCSV = () => {
        if (projectId) {
            window.open(`${appConfig.BASE_URL}/tm/api/projects/${projectId}/export?token=${localStorage.getItem('token')}`);
        }
    };

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
            <DropdownMenuContent className="w-[150px]" side="bottom" align="end">
                {/* <DropdownMenuItem asChild>
            <Link to="#">
                <FileText />
                <span>Details</span>
            </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
            <Link to="#">
                <Share2 />
                <span>Share</span>
            </Link>
            </DropdownMenuItem> */}
                <DropdownMenuItem asChild>
                    <AuthorityGuard roles={['Admin']}>
                        <ButtonWithConfirm
                            variant="ghost"
                            confirm={true}
                            disabled={isDeleting}
                            onConfirm={() => {
                                if (isDeleting) return;

                                setOpen(false);
                                handleDelete()
                            }}
                            confirmButton={
                                <Button variant="primary" >
                                    Proceed
                                </Button>
                            }
                            cancelButton={<Button variant="outline">Cancel</Button>}>
                            <Trash2 /> Delete
                        </ButtonWithConfirm>
                    </AuthorityGuard>
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    );
}
