import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/custom/modal';
import { Label } from '@/components/ui/label';
import { Loader2, Key } from 'lucide-react';
import { useStore } from '../store';
import { useIntegration } from '../context/integration-context';

export default function ConfigureAdapterModal() {
  const { showConfigModal, setShowConfigModal } = useStore();
  const { handleInstallAdapter, isInstalling } = useIntegration();
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    if (showConfigModal) {
      setApiKey('');
    }
  }, [showConfigModal]);

  const handleClose = () => {
    setShowConfigModal(null);
    setApiKey('');
  };

  const handleSave = async (e) => {
    e?.preventDefault();
    const adapterType = (showConfigModal?.adapterType || showConfigModal?.id || showConfigModal?.type || showConfigModal?.name || '').toLowerCase();
    if (!adapterType || !apiKey.trim()) return;

    const success = await handleInstallAdapter(adapterType, apiKey.trim());
    if (success) {
      handleClose();
    }
  };

  if (!showConfigModal) return null;

  const adapterTitle = showConfigModal.title || showConfigModal.name || showConfigModal.adapterType;
  const logoUrl = showConfigModal.logo || `/new-adapter-logos/${(showConfigModal.adapterType || showConfigModal.id || '').toLowerCase()}.svg`;
  const fieldConfig = showConfigModal?.config_fields?.[0] || {};
  const fieldLabel = fieldConfig.label || 'API Key';
  const fieldPlaceholder = fieldConfig.placeholder || `Enter your ${adapterTitle} API Key`;
  const fieldDescription = fieldConfig.description || 'Verifies credentials against the AI provider and saves the config upon validation.';

  return (
    <Modal
      open={!!showConfigModal}
      setOpen={(val) => !val && handleClose()}
      title={`Install ${adapterTitle}`}
      description={showConfigModal.description || 'Configure API key credentials to install this AI Provider adapter.'}
      icon={
        <img
          src={logoUrl}
          alt={adapterTitle}
          className="h-8 w-8 object-contain rounded"
          onError={(e) => {
            e.currentTarget.src = '/new-adapter-logos/defaultlogo.webp';
          }}
        />
      }
      className="max-w-md"
      footer={
        <div className="flex w-full justify-end gap-3 pt-2 pb-1 pr-1">
          <Button variant="outline" onClick={handleClose} disabled={isInstalling}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isInstalling || !apiKey.trim()}>
            {isInstalling ? <Loader2 className="animate-spin size-4 mr-2" /> : null}
            <span>{isInstalling ? 'Installing...' : 'Install Adapter'}</span>
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSave} className="flex flex-col gap-4 py-2">
        <div className="flex flex-col gap-2">
          <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Key className="size-3.5 text-primary" /> {fieldLabel} <span className="text-destructive">*</span>
          </Label>
          <Input
            type={fieldConfig.type || 'password'}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={fieldPlaceholder}
            required
            autoFocus
          />
          <p className="text-xs text-muted-foreground">
            {fieldDescription}
          </p>
        </div>
      </form>
    </Modal>
  );
}
