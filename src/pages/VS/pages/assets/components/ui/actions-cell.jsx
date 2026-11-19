import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Star, UserCircle2, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Modal } from '@/components/custom/modal';
import { toast } from 'sonner';
import { useMarkVmAssetImportantMutation, useDeleteVmAssetMutation, useUpdateVmAssetMutation } from '@/services/vm/assetsApi';
import { ButtonWithConfirm } from "@/components/custom/button-with-confirmation";
import { Skeleton } from "@/components/ui/skeleton";
import Select from '@/components/custom/select';
import { useGetOrgMembersQuery } from '@/services/auth/orgApi';
import { useEffect } from 'react';
import { useAuth } from '@/auth/context/auth-context';



const ActionsCell = ({ row }) => {
  const [markImportant] = useMarkVmAssetImportantMutation();
  const [deleteAsset] = useDeleteVmAssetMutation();
  const [updateAsset] = useUpdateVmAssetMutation();
  const [isChangeOwnerOpen, setIsChangeOwnerOpen] = useState(false);
  const [newOwner, setNewOwner] = useState({});
  const [members, setMembers] = useState([]);
  const { user } = useAuth();
  const isAuditor = user?.role?.toLowerCase() === 'auditor';

  const { data, isLoading, isFetching } = useGetOrgMembersQuery({});

  useEffect(() => {
    if (data?.data?.members)
      setMembers(data?.data?.members?.map(member => ({ label: member.name || member.email, value: member.email })));
  }, [data, isLoading]);

  console.log(members);

  const handleActions = {
    delete: async () => {
        toast.promise(deleteAsset(row.original._id).unwrap(), {
          loading: "Deleting asset",
          success: "Asset deleted",
          error: "Failed to delete the asset"
        });
    },
    
    changeOwner: async () => {
        toast.promise(updateAsset({ id: row.original._id, data: { owner: newOwner }}).unwrap(), {
          loading: "Updating the owner",
          success: "Owner Updated",
          error: "Failed to update the owner"
        })
        .then(() => {
          setIsChangeOwnerOpen(false);
        });
        setIsChangeOwnerOpen(false);
    },
    
    toggleImportant: async () => {
        toast.promise(markImportant({ id: row.original._id, important: !row.original.important }).unwrap(), {
          loading: `Marking ${row.original.important ? 'Unimportant' : 'Imporant'}`,
          success: `Asset ${row.original.important ? 'removed from' : 'marked as'} important`,
          error: "Failed to toggle asset"
        });
    }
  };


  return (
    <div className="flex justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleActions.toggleImportant}>
            <Star className={`mr-2 h-4 w-4 ${row.original.important ? 'fill-yellow-400' : ''}`} />
            {row.original.important ? 'Remove Important' : 'Mark as Important'}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsChangeOwnerOpen(true)}>
            <UserCircle2 className="mr-2 h-4 w-4" />
            Change Owner
          </DropdownMenuItem>
          {!isAuditor && (
            <DropdownMenuItem className="w-full" asChild>
              <ButtonWithConfirm variant="ghost" className="flex justify-start" confirm={true} onConfirm={handleActions.delete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Asset
              </ButtonWithConfirm>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Modal
        open={isChangeOwnerOpen}
        setOpen={setIsChangeOwnerOpen}
        title="Change Owner"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsChangeOwnerOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleActions.changeOwner}>
              Update Owner
            </Button>
          </div>
        }
        description={
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Change the owner for asset: <span className="font-medium text-foreground">{row.original.value || 'Unnamed Asset'}</span>
            </p>
            {
              isLoading || isFetching ?
              <Skeleton className="h-[50px]" />
              :
              <Select
                options={members}
                placeholder="Select Owner"
                onChange={(option) => setNewOwner(data?.data?.members?.find(m => m.email == option.value))}
              />
            }
          </div>
        }
      />
    </div>
  );
};

export default ActionsCell;