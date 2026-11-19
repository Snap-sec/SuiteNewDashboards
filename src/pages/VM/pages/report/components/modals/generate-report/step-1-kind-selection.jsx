import { FileText, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { KIND_ICON_MAP } from './constants';

export function Step1KindSelection({
  supportedFormats,
  selectedKindIdx,
  setSelectedKindIdx,
}) {
  return (
    <div>
      <p className="text-[11px] font-medium text-muted-foreground tracking-widest uppercase mb-3">
        Report Kind
      </p>
      <div className="flex flex-col gap-2">
        {supportedFormats.map((kind, idx) => {
          const Icon = KIND_ICON_MAP[kind.type] || FileText;
          return (
            <button
              key={kind.type}
              type="button"
              onClick={() => setSelectedKindIdx(idx)}
              className={cn(
                'flex items-center gap-3 px-3 py-3 rounded-lg border text-left transition-all cursor-pointer group',
                'hover:border-primary/50',
                selectedKindIdx === idx
                  ? 'border-primary bg-primary/5'
                  : 'border-border',
              )}
            >
              <div className="w-9 h-9 rounded-lg bg-muted/50 border border-border/50 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{kind.name}</p>
                <p className="text-xs text-muted-foreground">
                  {kind.description}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
