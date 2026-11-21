import { useState } from 'react';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { ConfirmDialog } from '@/components/custom/button-with-confirmation';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, RefreshCw } from 'lucide-react';

const AutomaticSyncSwitch = ({ autoSync, setAutoSync, isDisabled, onToggle }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (checked) => {
    if (checked) {
      setIsOpen(true);
    } else {
      setAutoSync(false);
      toast.info('Vulnerability Synchronization Disabled');
      onToggle?.(false);
    }
  };

  const handleConfirm = () => {
    setAutoSync(true);
    setIsOpen(false);
    toast.success('Vulnerability Synchronization Enabled');
    onToggle?.(true);
  };

  return (
    <>
      <div className="flex flex-col gap-3 p-4 bg-muted/30 rounded-xl border border-border/70 transition-colors">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <RefreshCw className="size-4" />
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-foreground">
                  Automatic Synchronization
                </span>
                <Badge
                  variant={autoSync ? "success" : "secondary"}
                  appearance={autoSync ? "light" : "outline"}
                  size="xs"
                >
                  {autoSync ? "Active" : "Disabled"}
                </Badge>
              </div>
              <span className="text-xs text-muted-foreground line-clamp-2">
                Push newly detected exposures directly to the linked VM assessment in real-time.
              </span>
            </div>
          </div>
          <Switch
            id="auto-sync"
            checked={autoSync}
            onCheckedChange={handleToggle}
            disabled={isDisabled}
            aria-label="Toggle automatic vulnerability synchronization"
          />
        </div>

        {autoSync && (
          <div className="flex items-start gap-2 pt-2 border-t border-border/50 text-xs text-muted-foreground">
            <AlertCircle className="size-3.5 shrink-0 text-warning mt-0.5" />
            <span>
              Real-time sync automatically generates VM tickets for all new exposures.
            </span>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={isOpen}
        setOpen={setIsOpen}
        onConfirm={handleConfirm}
        confirmTitle="Enable Automatic Vulnerability Sync?"
        dialog="Auto-synchronization automatically creates and assigns VM tickets for all ASM exposures in real-time, which can generate high ticket volume. Are you sure you want to proceed?"
        confirmButton="Enable Sync"
      />
    </>
  );
};

export default AutomaticSyncSwitch;
