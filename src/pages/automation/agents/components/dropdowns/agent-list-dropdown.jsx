import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { CustomTooltip } from '@/components/custom/tooltip';
import { useDeleteAgentMutation } from '@/services/automation/agentsApi';
import EditAgentModal from '../modals/edit-agent-modal';

const AgentListDropdown = ({ row }) => {
  const [open, setOpen] = useState(false);
  const agent = row?.original;
  const agentId = agent?._id || agent?.id;
  const agentName = agent?.name || 'Untitled Agent';
  const isPredefined = Boolean(row?.original?.agent_type);

  const [deleteAgent, { isLoading: isDeleting }] = useDeleteAgentMutation();

  const handleDeleteAgent = () => {
    if (!agentId || isPredefined) return;
    toast.promise(deleteAgent(agentId).unwrap(), {
      loading: 'Deleting agent...',
      success: 'Agent Deleted Successfully',
      error: (err) => {
        console.log(err);
        return err?.data?.message || err?.message || 'Failed to delete the Agent';
      },
    });
  };

  const deleteButton = (
    <ButtonWithConfirm
      disabled={isDeleting || isPredefined}
      variant="ghost"
      confirm={!isPredefined}
      dialog="This action requires confirmation, click Delete to proceed."
      confirmOnInput={agentName}
      onConfirm={() => {
        if (isDeleting || isPredefined) return;
        handleDeleteAgent();
        setOpen(false);
      }}
      confirmButton={
        <Button variant="destructive" disabled={isDeleting || isPredefined}>
          Delete
        </Button>
      }
      cancelButton={<Button variant="outline">Cancel</Button>}
      className={`w-full justify-start !font-normal px-2 py-1.5 text-sm h-8 ${
        isPredefined
          ? 'cursor-not-allowed opacity-50'
          : 'hover:bg-red-200/20 cursor-pointer'
      }`}
    >
      <span className="text-destructive">Delete</span>
    </ButtonWithConfirm>
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[150px]" side="bottom" align="end">
        <AuthorityGuard forbidRoles={['Auditor']}>
          <EditAgentModal
            row={row}
            trigger={
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="w-full justify-start !font-normal px-2 py-1.5 text-sm h-8 cursor-pointer gap-2"
              >
                <span>Edit</span>
              </DropdownMenuItem>
            }
          />

          <DropdownMenuSeparator />

          {isPredefined ? (
            <CustomTooltip text="System Agents cannot be deleted">
              <div className="w-full cursor-not-allowed">
                <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()} disabled>
                  {deleteButton}
                </DropdownMenuItem>
              </div>
            </CustomTooltip>
          ) : (
            <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
              {deleteButton}
            </DropdownMenuItem>
          )}
        </AuthorityGuard>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AgentListDropdown;
