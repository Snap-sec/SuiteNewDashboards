import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const LogicToggle = memo(function LogicToggle({ value, onChange }) {
  return (
    <div className="flex bg-muted/60 rounded-md p-1 items-center border border-border">
      {['AND', 'OR', 'NOT'].map((op) => (
        <Button
          key={op}
          variant={value === op ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => onChange(op)}
          className={cn(
            "h-7 px-3 text-[10px] font-bold tracking-widest rounded-sm transition-all uppercase",
            value === op ? "shadow-sm" : "text-muted-foreground/60 hover:text-foreground"
          )}
        >
          {op}
        </Button>
      ))}
    </div>
  );
});
