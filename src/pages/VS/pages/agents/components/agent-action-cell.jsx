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
import { useDeleteVsAgentMutation } from '@/services/vs/agentsApi';

export function AgentActionCell({ row }) {
  const [open, setOpen] = useState(false);
  const agentId = row?.original?._id || row?._id;

  const [deleteAgent, { isLoading: isDeleting }] = useDeleteVsAgentMutation();

  const handleDeleteAgent = () => {
    toast.promise(deleteAgent(agentId).unwrap(), {
      loading: 'Deleting agent...',
      success: 'Agent deleted successfully',
      error: 'Failed to delete agent',
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
        <DropdownMenuItem asChild variant="destructive">
          <ButtonWithConfirm
            disabled={isDeleting}
            variant="ghost"
            confirm={true}
            onConfirm={() => {
              if (isDeleting) return;
              handleDeleteAgent();
              setOpen(false);
            }}
            dialog="This action requires confirmation, click delete to proceed."
            confirmButton={
              <Button variant="destructive" disabled={isDeleting}>
                Delete
              </Button>
            }
            cancelButton={<Button variant="outline">Cancel</Button>}
            className="w-full justify-start !font-normal cursor-pointer !text-inherit px-2 py-1.5 text-sm h-8"
          >
            <span className="text-destructive">Delete</span>
          </ButtonWithConfirm>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default AgentActionCell;
