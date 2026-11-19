import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { LayoutGrid, Key, Globe, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input, InputWrapper } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Modal } from '@/components/custom/modal';
import Select from '@/components/custom/select';
import { useStore } from '../store';
import {
  useGetAutomationAdapterListQuery,
  useConfigureAutomationAdapterMutation,
  useInstallAutomationAdapterMutation,
} from '@/services/automation/adaptersApi';

export default function ConfigureAdapterModal() {
  const { showConfigModal, setShowConfigModal } = useStore();
  const { data: supportedData } = useGetAutomationAdapterListQuery();
  const [configureAdapter, { isLoading: isConfiguring }] = useConfigureAutomationAdapterMutation();
  const [, { isLoading: isInstalling }] = useInstallAutomationAdapterMutation();

  const [name, setName] = useState('');
  const [model, setModel] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [endpoint, setEndpoint] = useState('');

  const adaptersList =
    supportedData?.data?.data?.adapters ||
    supportedData?.data?.adapters ||
    [];

  const currentType = (
    showConfigModal?.type ||
    showConfigModal?.adapterType ||
    showConfigModal?.adapterName ||
    ''
  ).toLowerCase();

  const matchedDefinition =
    showConfigModal?.models?.length
      ? showConfigModal
      : adaptersList.find((a) => a.type?.toLowerCase() === currentType);

  const availableModels = matchedDefinition?.models || [];
  const isSnapIQ = currentType === 'snapiq';
  const providerTitle = showConfigModal?.title || showConfigModal?.name || 'Model';

  useEffect(() => {
    if (showConfigModal) {
      setName(showConfigModal.config?.name || showConfigModal.name || '');
      setModel(
        showConfigModal.config?.model ||
        showConfigModal.model ||
        availableModels[0]?.value ||
        ''
      );
      setApiKey('');
      setEndpoint(showConfigModal.config?.endpoint || showConfigModal.endpoint || '');
    }
  }, [showConfigModal, availableModels]);

  const handleClose = () => {
    setShowConfigModal(null);
    setName('');
    setModel('');
    setApiKey('');
    setEndpoint('');
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Integration name is required');
      return;
    }

    if (!apiKey.trim()) {
      toast.error('API key is required');
      return;
    }

    if (isSnapIQ && !endpoint.trim()) {
      toast.error('Endpoint URL is required for SnapIQ');
      return;
    }

    const payloadData = {
      name: name.trim(),
      apiKey: apiKey.trim(),
      model: model || '',
    };

    if (isSnapIQ) {
      payloadData.masterKey = apiKey.trim();
      if (endpoint.trim()) {
        payloadData.endpoint = endpoint.trim();
      }
    }

    try {
      await configureAdapter({
        type: currentType,
        data: payloadData,
        method: 'PUT',
      }).unwrap();
      toast.success(`${providerTitle} updated successfully`);
      handleClose();
    } catch (err) {
      if (err?.status === 405) {
        try {
          await configureAdapter({
            type: currentType,
            data: payloadData,
            method: 'PATCH',
          }).unwrap();
          toast.success(`${providerTitle} updated successfully`);
          handleClose();
          return;
        } catch (patchErr) {
          toast.error(patchErr?.data?.message || `Failed to update ${providerTitle}`);
          return;
        }
      }
      toast.error(err?.data?.message || `Failed to update ${providerTitle}`);
    }
  };

  if (!showConfigModal || currentType === 'jira') return null;

  const isSaving = isConfiguring || isInstalling;

  return (
    <Modal
      open={!!showConfigModal}
      setOpen={(val) => !val && handleClose()}
      title={`Configure ${providerTitle}`}
      description="Edit model and integration settings"
      icon={
        showConfigModal.logo ? (
          <img
            src={showConfigModal.logo.toLowerCase()}
            alt={providerTitle}
            className="h-8 w-8 object-contain rounded"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center text-lg font-bold">
            {providerTitle.charAt(0)}
          </div>
        )
      }
      className="max-w-xl"
      footer={
        <div className="flex w-full justify-end gap-3 pt-2 pb-1 pr-1">
          <Button variant="outline" onClick={handleClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !name.trim() || !apiKey.trim()}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4 py-2">
        <form style={{ display: 'none' }} aria-hidden="true">
          <input type="text" name="fakeUsernameToBypassAutofill" autoComplete="username" />
          <input type="password" name="fakePasswordToBypassAutofill" autoComplete="current-password" />
        </form>
        <div className="flex flex-col gap-2">
          <Label className="text-xs font-semibold text-foreground">
            Integration Name <span className="text-destructive">*</span>
          </Label>
          <InputWrapper>
            <Button
              size="sm"
              variant="dim"
              mode="icon"
              className="size-5 -ms-0.5"
              type="button"
            >
              <LayoutGrid />
            </Button>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={`e.g. ${providerTitle} Production`}
              autoComplete="off"
              data-1p-ignore="true"
              data-lpignore="true"
            />
          </InputWrapper>
        </div>

        {availableModels.length > 0 && (
          <div className="flex flex-col gap-2">
            <Label className="text-xs font-semibold text-foreground">
              Model
            </Label>
            <Select
              value={model}
              options={availableModels}
              placeholder="Select model"
              onChange={(option) => setModel(option?.value || option || '')}
            />
          </div>
        )}

        {isSnapIQ && (
          <div className="flex flex-col gap-2">
            <Label className="text-xs font-semibold text-foreground">
              Inference Endpoint URL <span className="text-destructive">*</span>
            </Label>
            <InputWrapper>
              <Button
                size="sm"
                variant="dim"
                mode="icon"
                className="size-5 -ms-0.5"
                type="button"
              >
                <Globe />
              </Button>
              <Input
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                placeholder="http://litellm-gateway:4000 or https://inference.internal/v1"
                autoComplete="off"
                data-1p-ignore="true"
                data-lpignore="true"
              />
            </InputWrapper>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Label className="text-xs font-semibold text-foreground">
            {isSnapIQ ? 'Master Key' : 'API Key'} <span className="text-destructive">*</span>
          </Label>
          <InputWrapper>
            <Button
              size="sm"
              variant="dim"
              mode="icon"
              className="size-5 -ms-0.5"
              type="button"
            >
              <Key />
            </Button>
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={isSnapIQ ? "Enter LiteLLM Master Key" : "Enter API key"}
              autoComplete="new-password"
              data-1p-ignore="true"
              data-lpignore="true"
            />
          </InputWrapper>
        </div>
      </div>
    </Modal>
  );
}
