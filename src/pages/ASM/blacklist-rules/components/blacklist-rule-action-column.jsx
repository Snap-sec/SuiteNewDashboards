import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { useDeleteAsmBlacklistRuleMutation } from '@/services/asm/blacklistRulesApi';
import useStore from '../store';

export const BlacklistRuleActionColumn = ({ rule }) => {
  const navigate = useNavigate();
  const setSelectedRule = useStore((state) => state.setSelectedRule);
  const setMode = useStore((state) => state.setMode);
  const setShowModal = useStore((state) => state.setShowModal);
  const [deleteRule, { isLoading: isDeletingRule }] = useDeleteAsmBlacklistRuleMutation();

  const handleEdit = () => {
    setSelectedRule(rule);
    setMode('update');
    setShowModal(true);
    navigate('/casm/blacklist-rules/guided-editor');
  };

  const handleDelete = () => {
    const ruleId = rule._id || rule.id;
    toast.promise(deleteRule(ruleId).unwrap(), {
      loading: 'Removing Rule',
      success: 'Rule Removed',
      error: 'Failed to remove the rule',
    });
  };

  return (
    <div onClick={(e) => e.stopPropagation()} className="flex justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 pointer-events-auto">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <ButtonWithConfirm
            variant="ghost"
            confirm={true}
            disabled={isDeletingRule}
            onConfirm={handleDelete}
            dialog={
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to remove this blacklist rule? This action cannot be undone.
                </p>
              </div>
            }
            className="w-full justify-start text-destructive px-2 py-1.5 h-auto font-normal text-sm rounded-md hover:text-destructive hover:bg-red-200/20"
          >
            Delete
          </ButtonWithConfirm>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default BlacklistRuleActionColumn;
