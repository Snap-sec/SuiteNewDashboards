import React, { useState } from 'react';
import { toast } from 'sonner';
import { SquarePen, Trash2, MoreHorizontal, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { useDeleteAimPolicyMutation, useExecuteSingleAimPolicyMutation } from '@/services/asset-inventory/policyApi';

const ClassifersListDropdown = ({ row, navigate }) => {
  const [open, setOpen] = useState(false);
  const policyId = row?.original?._id;

  const [deleteRule, { isLoading: isDeleting }] = useDeleteAimPolicyMutation();
  const [executeSinglePolicy, { isLoading: isExecuting }] = useExecuteSingleAimPolicyMutation();

  const handleDeleteScan = () => {
    toast.promise(deleteRule(policyId).unwrap(), {
      loading: 'Deleting Rule..',
      success: 'Rule Deleted Successfully',
      error: 'Failed to delete the Rule',
    });
  };

  const handleExecuteSinglePolicy = () => {
    toast.promise(executeSinglePolicy(policyId).unwrap(), {
      loading: 'Executing a Policy..',
      success: 'Policy executed successfully',
      error: (err) => err?.data?.message || err?.data?.error || 'Failed to execute Policy',
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
        <DropdownMenuItem
          onClick={() => {
            if (isExecuting) return;
            handleExecuteSinglePolicy();
            setOpen(false);
          }}
          disabled={isExecuting}
          className="cursor-pointer font-normal flex gap-2 w-full"
        >
          {/* <Play className="size-4" /> */}
          Execute
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            navigate(`/assetinventory/engine/classifers/new?policyId=${policyId}`);
            setOpen(false);
          }}
          className="cursor-pointer font-normal flex gap-2 w-full"
        >
          {/* <SquarePen className="size-4" /> */}
          Edit
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <ButtonWithConfirm
            disabled={isDeleting}
            variant="ghost"
            confirm={true}
            onConfirm={() => {
              if (isDeleting) return;
              handleDeleteScan();
              setOpen(false);
            }}
            confirmButton={
              <Button variant="destructive" disabled={isDeleting}>
                Proceed
              </Button>
            }
            cancelButton={<Button variant="outline">Cancel</Button>}
            className="w-full justify-start !font-normal !hover:bg-transparent !bg-transparent !text-inherit px-2 py-1.5 text-sm h-8"
          >
            Delete
            {/* <Trash2 className="size-4" /> */}
          </ButtonWithConfirm>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ClassifersListDropdown;
