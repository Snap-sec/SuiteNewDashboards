import { Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Select from '@/components/custom/select';
import { cn } from '@/lib/utils';

const RETENTION_OPTIONS = [
  { label: 'Latest 1 only', value: '1' },
];

export function RetentionPolicy({ disabled, retention, onRetentionChange }) {
  return (
    <div className={cn('transition-opacity', disabled && 'opacity-40 pointer-events-none select-none')}>
      <p className="text-sm font-semibold text-foreground mb-3">Retention Policy</p>
      <Card>
        <CardContent className="flex items-center gap-4 py-4">
          <div className="flex items-center justify-center rounded-lg size-9 shrink-0 bg-muted text-muted-foreground">
            <Shield size={16} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Keep latest backups</p>
            <p className="text-xs text-muted-foreground">
              Older backups beyond this count are deleted automatically after each new backup
            </p>
          </div>
          <div className="w-40 shrink-0">
            <Select
              options={RETENTION_OPTIONS}
              value={retention}
              onChange={(opt) => onRetentionChange(opt?.value)}
              placeholder="Select..."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
