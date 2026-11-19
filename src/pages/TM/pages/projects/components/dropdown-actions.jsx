import { FileText, FileUp, Share2, FileChartPie, Trash2  } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useDeleteProjectMutation } from '../../../../../services/tm/projectApi';
import { toast } from 'sonner';
import appConfig from '../../../../../config/appConfig';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';

import { Button } from "@/components/ui/button";
import AuthorityGuard from '../../../../../components/custom/authority-guard/AuthorityGuard';

export function ProjectActions({ trigger, projectId }) {
    const [deleteProject] = useDeleteProjectMutation();

    const handleDelete = () => {
        toast.promise(deleteProject(projectId).unwrap(), {
            loading: "Deleting Project",
            success: "Project Deleted",
            error: "Failed to delete project"
        });
    }



    const handleExportCSV = () => {
        if (projectId) {
            window.open( `${appConfig.BASE_URL}/tm/api/projects/${projectId}/export?token=${localStorage.getItem('token')}`);
        }
    };

    return (
        <DropdownMenu>
        <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
        <DropdownMenuContent className="w-[210px]" side="bottom" align="end">
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

            <AuthorityGuard roles={['Admin']}>
                <ButtonWithConfirm
                    variant="ghost"
                    confirm={true}
                    onConfirm={handleDelete}
                    confirmButton={
                            <Button variant="primary" >
                                Proceed
                            </Button>
                        }
                    cancelButton={<Button variant="outline">Cancel</Button>}>
                    <Trash2 /> Delete
                </ButtonWithConfirm>
            </AuthorityGuard>


            <DropdownMenuItem asChild>
                    <Button variant="ghost" className="px-3" onClick={handleExportCSV}>
                        <FileUp  />
                        <span>Export CSV Report</span>
                    </Button>
            </DropdownMenuItem>


        </DropdownMenuContent>
        </DropdownMenu>
    );
}
