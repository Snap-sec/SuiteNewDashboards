import { useEffect, useState } from 'react';
import {
  MoreHorizontal,
  Star,
  StarOff,
  Trash2,
  UserCircle2,
} from 'lucide-react';
import { toast } from 'sonner';
import { useGetOrgMembersQuery } from '@/services/auth/orgApi';
import {
  useDeleteVmAssetMutation,
  useMarkVmAssetImportantMutation,
  useUpdateVmAssetMutation,
} from '@/services/vm/assetsApi';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { Modal } from '@/components/custom/modal';
import Select from '@/components/custom/select';

const ActionsCell = ({ row }) => {

  const [markImportant] = useMarkVmAssetImportantMutation();
  const [deleteAsset, { isLoading: isDeleting }] = useDeleteVmAssetMutation();
  const [updateAsset] = useUpdateVmAssetMutation();
  const [isChangeOwnerOpen, setIsChangeOwnerOpen] = useState(false);
  const [newOwner, setNewOwner] = useState({});
  const [members, setMembers] = useState([]);

  const { data, isLoading, isFetching } = useGetOrgMembersQuery({});

  useEffect(() => {
    if (data?.data?.members)
      setMembers(
        data?.data?.members
          ?.filter((member) => member.name && member.email)
          ?.map((member) => ({
            label: member.name || member.email,
            value: member.email,
          })),
      );
  }, [data, isLoading]);

  const handleActions = {
    delete: async () => {
      toast.promise(deleteAsset(row?.original?.assetId?._id).unwrap(), {
        loading: 'Deleting asset',
        success: 'Asset deleted',
        error: (err) => {
          return err?.data?.message || 'Failed to delete the asset';
        },
      });
    },

    changeOwner: async () => {
      toast
        .promise(
          updateAsset({
            id: row.original?.assetId?._id,
            data: { owner: newOwner },
          }).unwrap(),
          {
            loading: 'Updating the owner',
            success: 'Owner Updated',
            error: 'Failed to update the owner',
          },
        )
        .then(() => {
          setIsChangeOwnerOpen(false);
        });
      setIsChangeOwnerOpen(false);
    },

    toggleImportant: async () => {
      toast.promise(
        markImportant({
          id: row.original?.assetId?._id,
          important: !row.original?.assetId?.important,
        }).unwrap(),
        {
          loading: `Marking ${row.original.important ? 'Unimportant' : 'Imporant'}`,
          success: `Asset ${row.original.important ? 'removed from' : 'marked as'} important`,
          error: 'Failed to toggle asset',
        },
      );
    },
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
            {row.original.assetId?.important ? (
              <StarOff className="mr-2 h-4 w-4" />
            ) : (
              <Star className={`mr-2 h-4 w-4`} />
            )}
            {row.original.assetId?.important
              ? 'Mark as  Un-Important'
              : 'Mark as Important'}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsChangeOwnerOpen(true)}>
            <UserCircle2 className="mr-2 h-4 w-4" />
            Change Owner
          </DropdownMenuItem>
          <DropdownMenuItem className="w-full" asChild>
            <ButtonWithConfirm
              variant="ghost"
              disabled={isDeleting}
              className="flex justify-start"
              confirm={true}
              onConfirm={handleActions.delete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <p className=' font-normal'>Delete Asset</p>
            </ButtonWithConfirm>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Modal
        open={isChangeOwnerOpen}
        setOpen={setIsChangeOwnerOpen}
        title="Change Owner"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsChangeOwnerOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleActions.changeOwner}>Update Owner</Button>
          </div>
        }
        description={
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Change the owner for asset:{' '}
              <span className="font-medium text-foreground">
                {row.original.value || 'Unnamed Asset'}
              </span>
            </p>
            {isLoading || isFetching ? (
              <Skeleton className="h-[50px]" />
            ) : (
              <Select
                options={members}
                placeholder="Select Owner"
                onChange={(option) =>
                  setNewOwner(
                    data?.data?.members?.find((m) => m.email == option.value),
                  )
                }
              />
            )}
          </div>
        }
      />
    </div>
  );
};

export default ActionsCell;
