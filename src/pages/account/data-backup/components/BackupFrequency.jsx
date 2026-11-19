import { Clock, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const FREQUENCY_OPTIONS = [
  { id: 'hourly', label: 'Hourly', description: 'Snapshot taken every hour' },
  { id: 'daily', label: 'Daily', description: 'One snapshot every 24 hours' },
  { id: 'weekly', label: 'Weekly', description: 'One snapshot every Sunday' },
  { id: 'monthly', label: 'Monthly', description: 'One snapshot on the 1st of each month' },
];

export function BackupFrequency({ disabled, selectedFrequency, onSelect }) {
  return (
    <div className={cn('transition-opacity', disabled && 'opacity-40 pointer-events-none select-none')}>
      <p className="text-sm font-semibold text-foreground mb-3">Backup Frequency</p>
      <div className="grid grid-cols-2 gap-3">
        {FREQUENCY_OPTIONS.map((opt) => {
          const isSelected = selectedFrequency === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onSelect(opt.id)}
              className={cn(
                'flex items-center gap-3 p-4 rounded-xl border text-left transition-all',
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-card hover:border-border/80 hover:bg-accent/40',
              )}
            >
              <div className={cn(
                'flex items-center justify-center rounded-lg size-9 shrink-0',
                isSelected ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground',
              )}>
                <Clock size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{opt.label}</p>
                <p className="text-xs text-muted-foreground">{opt.description}</p>
              </div>
              {isSelected && (
                <CheckCircle size={16} className="ml-auto shrink-0 text-primary" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
