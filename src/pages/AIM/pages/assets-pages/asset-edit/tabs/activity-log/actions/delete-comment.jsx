import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { CustomTooltip } from '@/components/custom/tooltip';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';

function DeleteComment({ onDelete, isDeleting = false, ...props }) {
  return (
    <AuthorityGuard forbidRoles={['Auditor']}>
      <CustomTooltip text="Delete Comment">
        <ButtonWithConfirm
          disabled={isDeleting}
          variant="ghost"
          mode="icon"
          confirm={true}
          confirmTitle="Delete Comment"
          dialog="Are you sure you want to delete this comment? This action cannot be undone."
          confirmButton={<Button variant="destructive" disabled={isDeleting}>Delete</Button>}
          cancelButton={<Button variant="outline">Cancel</Button>}
          onConfirm={onDelete}
          className="h-8 w-8 p-0 text-destructive hover:bg-red-500/10 hover:text-red-600 transition-colors"
          {...props}
        >
          <Trash2 className="size-4 text-destructive" />
        </ButtonWithConfirm>
      </CustomTooltip>
    </AuthorityGuard>
  );
}

export default DeleteComment;
