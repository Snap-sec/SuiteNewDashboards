import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CodeBlock({ code, label, copiedField, onCopy, variant = 'default' }) {
  return (
    <div className="relative group mt-2">
      <div
        className={`p-4 rounded-lg font-mono text-sm ${
          variant === 'destructive'
            ? 'bg-accent/50 text-destructive'
            : 'bg-accent text-foreground'
        }`}
      >
        <div className="flex justify-between items-start gap-4">
          <code className="whitespace-pre-wrap break-all">{code}</code>
          <Button
            size="sm"
            variant="ghost"
            className="shrink-0 text-muted-foreground hover:text-foreground hover:bg-foreground/10"
            onClick={() => onCopy(code, label)}
          >
            {copiedField === label ? (
              <Check className="size-4 text-green-400" />
            ) : (
              <Copy className="size-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
