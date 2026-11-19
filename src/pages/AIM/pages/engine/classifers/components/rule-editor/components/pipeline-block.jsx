import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Tag, Bell, Zap, ShieldCheck, X } from 'lucide-react';

export const ACTION_META = {
  classify: { icon: Tag, color: 'text-teal-500', bg: 'bg-teal-500/10', border: 'border-t-teal-500' },
  alert: { icon: Bell, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-t-amber-500' },
  trigger: { icon: Zap, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-t-purple-500' },
  compliance: { icon: ShieldCheck, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-t-blue-500' },
};

export function PipelineBlock({ title, type, onRemove, configureDrawer, summary, step, totalSteps }) {
  const meta = ACTION_META[type] || ACTION_META.classify;
  const Icon = meta.icon;

  return (
    <div className={cn("flex flex-col relative rounded-xl border bg-card text-card-foreground shadow-sm w-[220px] shrink-0")}>
      {onRemove && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-destructive z-10"
          onClick={onRemove}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2 pr-5">
          <div className={cn("p-1.5 rounded-md bg-accent")}>
            <Icon className={cn("h-4 w-4")} />
          </div>
          <span className="font-semibold text-sm truncate">{title}</span>
        </div>
        <div className="text-xs text-muted-foreground truncate font-mono h-4">
          {summary || ''}
        </div>
        {configureDrawer}
      </div>
    </div>
  );
}
