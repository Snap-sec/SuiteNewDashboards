import React from 'react';
import { Check, Circle } from 'lucide-react';
import { PASSWORD_REQUIREMENTS } from '../forms/password-rules';
import { cn } from '@/lib/utils';

export function PasswordChecklist({ password = '', email = '', alwaysShow = false, className }) {
  if (!alwaysShow && !password) return null;

  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 gap-1.5 p-2.5 rounded-lg bg-muted/40 border border-border/60 text-xs mt-2 transition-all',
        className
      )}
    >
      {PASSWORD_REQUIREMENTS.map((req) => {
        const isMet = req.validator(password, email);
        return (
          <div
            key={req.id}
            className={cn(
              'flex items-center gap-1.5 transition-colors',
              isMet
                ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                : 'text-muted-foreground/75'
            )}
          >
            {isMet ? (
              <Check className="size-3.5 shrink-0 stroke-[2.5] text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Circle className="size-3 shrink-0 text-muted-foreground/40 stroke-[2]" />
            )}
            <span>{req.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export default PasswordChecklist;
