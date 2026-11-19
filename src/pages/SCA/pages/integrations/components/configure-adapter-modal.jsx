import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/custom/modal';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useStore } from '../store';

export default function ConfigureAdapterModal() {
  const { showConfigModal, setShowConfigModal } = useStore();
  const [name, setName] = useState('');
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (showConfigModal) {
      setName(showConfigModal.config?.name || showConfigModal.name || '');
      setActive(showConfigModal.active ?? true);
    }
  }, [showConfigModal]);

  const handleClose = () => {
    setShowConfigModal(null);
  };

  const isGithub =
    showConfigModal?.id === 'github-sca' ||
    showConfigModal?.name?.toLowerCase() === 'github' ||
    showConfigModal?.type?.toLowerCase() === 'github' ||
    showConfigModal?.title?.toLowerCase().includes('github');

  if (!showConfigModal || isGithub) return null;

  return (
    <Modal
      open={!!showConfigModal}
      setOpen={(val) => !val && handleClose()}
      title={`Configure ${showConfigModal.title || showConfigModal.name}`}
      description="Integration settings"
      icon={
        showConfigModal.logo ? (
          <img src={showConfigModal.logo} alt={showConfigModal.title} className="h-8 w-8 object-contain" />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center text-lg font-bold">
            {(showConfigModal.title || showConfigModal.name)?.charAt(0)}
          </div>
        )
      }
      className="max-w-xl"
      footer={
        <div className="flex w-full justify-end gap-3 pt-2 pb-1 pr-1">
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Save Changes</Button>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Integration Name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={`e.g. ${showConfigModal.title || showConfigModal.name} Prod`}
            autoComplete="off"
            data-1p-ignore="true"
            data-lpignore="true"
          />
        </div>

        <div className="flex items-center justify-between gap-4 p-4 rounded-md border border-border/50 bg-secondary/10">
          <div className="flex flex-col gap-1">
            <Label className="text-sm font-medium">Enable Ingestion</Label>
            <span className="text-xs text-muted-foreground">
              Allow this integration to automatically sync dependencies and vulnerabilities.
            </span>
          </div>
          <Switch
            checked={active}
            onCheckedChange={setActive}
          />
        </div>
      </div>
    </Modal>
  );
}
