import React, { useState } from 'react';
import { toast } from 'sonner';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { useDeleteAimBusinessUnitMutation } from '@/services/asset-inventory/businessUnitsApi';

const BusinessUnitsDropdown = ({ row }) => {
  const [open, setOpen] = useState(false);
  const id = row?.original?._id;

  const [deleteBusinessUnit, { isLoading: isDeleting }] =
    useDeleteAimBusinessUnitMutation();

  const handleDelete = () => {
    toast.promise(deleteBusinessUnit(id).unwrap(), {
      loading: 'Deleting the Business unit',
      success: () => {
        return 'Business unit Deleted';
      },
      error: (err) => {
        return err?.data?.message || 'Failed to delete the Business unit';
      },
    });
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[150px]" side="bottom" align="end">
        <DropdownMenuItem asChild>
          <ButtonWithConfirm
            disabled={isDeleting}
            variant="ghost"
            confirm={true}
            confirmOnInput={'shoaibwani'}
            onConfirm={() => {
              if (isDeleting) return;
              handleDelete();
              setOpen(false);
            }}
            confirmButton={
              <Button variant="destructive" disabled={isDeleting}>
                Proceed
              </Button>
            }
            cancelButton={<Button variant="outline">Cancel</Button>}
            className="w-full justify-start !font-normal hover:bg-red-200/20 cursor-pointer !text-inherit px-2 py-1.5 text-sm h-8"
          >
            <span className='text-destructive'>
            Delete
            </span>
          </ButtonWithConfirm>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BusinessUnitsDropdown;
