import { useState } from 'react';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { ConfirmDialog } from '@/components/custom/button-with-confirmation';

const AutomaticSyncSwitch = ({ autoSync, setAutoSync, isDisabled, onToggle }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (checked) => {
    if (checked) {
      setIsOpen(true);
    } else {
      setAutoSync(false);
      toast.info('Vuln Sync Config Disabled');
      onToggle?.(false);
    }
  };

  const handleConfirm = () => {
    setAutoSync(true);
    setIsOpen(false);
    toast.info('Vuln Sync Config Enabled');
    onToggle?.(true);
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium">Automatic Synchronization</span>
          <span className="text-xs text-muted-foreground">
            Automatically push new findings to the linked assessment in
            real-time.
          </span>
        </div>
        <Switch
          id="auto-sync"
          checked={autoSync}
          onCheckedChange={handleToggle}
          disabled={isDisabled}
        />
      </div>

      <ConfirmDialog
        open={isOpen}
        setOpen={setIsOpen}
        onConfirm={handleConfirm}
        dialog="Auto-synchronization automatically creates and assigns VM tickets for ASM exposures, which can generate significant noise—so we recommend keeping it disabled."
      />
    </>
  );
};

export default AutomaticSyncSwitch;

