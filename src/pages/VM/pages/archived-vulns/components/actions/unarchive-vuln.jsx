import { ArchiveRestore, Eye, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { useUnarchiveVmVulnMutation } from '../../../../../../services/vm/archivedVulnsApi';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

function UnarchiveVuln({ row, id }) {
  const navigate = useNavigate();

  const [unarchiveVuln, { isLoading: isUnarchiving }] =
    useUnarchiveVmVulnMutation();
  const [open, setOpen] = useState(false);

  const handleUnarchiveVuln = () => {
    toast.promise(unarchiveVuln(row?.original?._id || id).unwrap(), {
      loading: 'Unarchiving Vulnerability...',
      success: ()=>{
        if(id) navigate("/vm/archived-vulns", { replace: true });

        return 'Vulnerability Unarchived Successfully'
      },
      error: (err) => {
        console.log(err);
        return err?.data?.message || 'Failed to Unarchive Vulnerability';
      },
    });
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">


        <ButtonWithConfirm
          confirm={true}
          variant="ghost"
          disabled={isUnarchiving}
          onConfirm={handleUnarchiveVuln}
          className="w-full justify-start px-2 py-1.5 h-auto font-normal text-sm rounded-md hover:bg-accent text-left"
          dialog={
            <div className="flex flex-col items-center gap-2">
              <p className="text-center font-semibold">
                Are you sure you want to unarchive this vulnerability?
              </p>
              <p className="text-sm text-muted-foreground text-center">
                This will move the vulnerability back to the active state.
              </p>
            </div>
          }
        >
          Unarchive
        </ButtonWithConfirm>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UnarchiveVuln;
