import { Switch } from '@/components/ui/switch';
import { Activity } from 'lucide-react';

export function CollectionCard({ category, onToggle }) {
  const { id, stats, lastSeen, enabled } = category;
  
  const Icon = category.icon || Activity;
  const title = category.title || id.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const description = category.description || `Data collection for ${title.toLowerCase()}.`;

  return (
    <div className="rounded-xl border bg-card p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon size={16} className="text-primary" />
        </div>
        <Switch checked={enabled} onCheckedChange={(val) => onToggle(id, val)} size="sm" />
      </div>

      <div className="space-y-1">
        <p className="font-semibold text-sm text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>

      <div className="mt-auto">
        {enabled ? (
          stats ? (
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
              {stats} · last seen {lastSeen}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
              Collection enabled
            </p>
          )
        ) : (
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground shrink-0" />
            Collection disabled
          </p>
        )}
      </div>
    </div>
  );
}
