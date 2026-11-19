import { useState } from 'react';
import { Archive, Bug, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { useAimStageForDecommissionMutation } from '@/services/asset-inventory/assets/assetsApi';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';


const ActionsCell = ({ row }) => {
  const [stageForDecommission, { isLoading: isStaging }] = useAimStageForDecommissionMutation();
  const [open, setOpen] = useState(false);

  const handleStageForDecommission = () => {
    toast.promise(
      stageForDecommission({ assetId: row?.original?._id }).unwrap(),
      {
        loading: 'Staging asset for decommission...',
        success: 'Asset staged for decommission successfully.',
        error: (err) => err?.data?.message || 'Failed to stage asset for decommission.',
      },
    );
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end">
        <AuthorityGuard forbidRoles={['Auditor']}>
          <ButtonWithConfirm
            confirm={true}
            variant="ghost"
            disabled={isStaging}
            onConfirm={handleStageForDecommission}
            className="w-full justify-start text-red-500 hover:text-red-500 hover:bg-red-200/20 px-2 py-1.5 h-auto font-normal text-sm rounded-md"
            dialog={
              <div className="flex flex-col items-center gap-2">
                <p className="text-center">
                  Are you sure you want to stage this asset for decommission?
                </p>
                <p className="text-sm text-muted-foreground text-center">
                  Archiving this asset will remove it from the Asset List, move
                  it to the Decommissioned state, and automatically resolve all
                  associated vulnerabilities.
                </p>
              </div>
            }
          >
            Decommission Asset
          </ButtonWithConfirm>
          <DropdownMenuSeparator />
        </AuthorityGuard>

        <DropdownMenuItem asChild>
          <Link
            to={`/vm/vulnerabilities?filters=asset:${row?.original?.value}`}
            className="flex items-center cursor-pointer"
          >
            View Vulnerabilities
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ActionsCell;