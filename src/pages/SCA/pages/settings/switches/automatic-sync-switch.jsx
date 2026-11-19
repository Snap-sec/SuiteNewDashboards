import { useState } from 'react';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { ConfirmDialog } from '@/components/custom/button-with-confirmation';

const AutomaticSyncSwitch = ({ autoSync, setAutoSync, isToggling, isDisabled, onToggle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingState, setPendingState] = useState(null);

  const handleToggle = (checked) => {
    setPendingState(checked);
    setIsOpen(true);
  };

  const handleConfirm = () => {
    if (pendingState === null) return;

    setAutoSync(pendingState);
    setIsOpen(false);

    if (pendingState) {
      toast.info('Vuln Sync Config Enabled');
      onToggle?.(true);
    } else {
      toast.info('Vuln Sync Config Disabled');
      onToggle?.(false);
    }
  };

  const isEnabling = pendingState === true;

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
          disabled={isDisabled || isToggling}
        />
      </div>

      <ConfirmDialog
        open={isOpen}
        setOpen={setIsOpen}
        onConfirm={handleConfirm}
        variant={isEnabling ? 'info' : 'warning'}
        title={
          isEnabling
            ? 'Enable Automatic Synchronization?'
            : 'Disable Automatic Synchronization?'
        }
        dialog={
          isEnabling
            ? 'Auto-synchronization automatically creates and assigns VM tickets for SCA exposures, which can generate significant noise—so we recommend keeping it disabled.'
            : 'Disabling auto-synchronization will stop automatically pushing new findings to the linked assessment in real-time. Are you sure you want to disable it?'
        }
      />
    </>
  );
};

export default AutomaticSyncSwitch;
