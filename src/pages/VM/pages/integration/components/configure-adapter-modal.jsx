import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/custom/modal';
import { Switch } from '@/components/ui/switch';
import { useStore } from '../store';
import AssessmentSelect from './assessment-select';
import { useConfigureVmAdapterMutation } from '@/services/vm/adaptersApi';
import { Label } from '@/components/ui/label';
import { ManualWebhookPanel } from './manual-webhook-panel';

export default function ConfigureAdapterModal() {
  const { showConfigModal, setShowConfigModal } = useStore();
  const [configureAdapter, { isLoading: isSaving }] = useConfigureVmAdapterMutation();

  const [name, setName] = useState('');
  const [assessmentId, setAssessmentId] = useState('');
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (showConfigModal) {
      setName(showConfigModal.config?.name || showConfigModal.name || '');
      setAssessmentId(showConfigModal.assessmentId ?? '');
      setActive(showConfigModal.active ?? true);
    }
  }, [showConfigModal]);

  const handleClose = () => {
    setShowConfigModal(null);
  };

  const handleSave = async () => {
    try {
      await configureAdapter({
        adapterId: showConfigModal.instance_id,
        data: {
          name,
          assessmentId,
          active,
        }
      }).unwrap();
      toast.success(`${showConfigModal.title} configured successfully`);
      handleClose();
    } catch (err) {
      toast.error(`Failed to configure ${showConfigModal.title}`);
    }
  };

  const webhookUrl = showConfigModal?.webhook_url;

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    toast.success('Webhook URL copied to clipboard');
  };

  // Jira has its own dedicated configure modal (JiraConfigure)
  if (!showConfigModal || showConfigModal?.type === 'jira' || showConfigModal?.adapterName === 'jira') return null;

  return (
    <Modal
      open={!!showConfigModal}
      setOpen={(val) => !val && handleClose()}
      title={`Configure ${showConfigModal.title}`}
      description="Integration settings"
      icon={
        showConfigModal.logo ? (
          <img src={showConfigModal.logo.toLowerCase()} alt={showConfigModal.title} className="h-8 w-8 object-contain" />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center text-lg font-bold">
            {showConfigModal.title?.charAt(0)}
          </div>
        )
      }
      className="max-w-xl"
      footer={
        <div className="flex w-full justify-end gap-3 pt-2 pb-1 pr-1">
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving}>Save Changes</Button>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Integration Name</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={`e.g. ${showConfigModal.title} Prod`}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Assessment</Label>
          <AssessmentSelect
            value={assessmentId}
            placeholder="Select assessment"
            onChange={(option) => setAssessmentId(option.value)}
          />
        </div>

        <div className="flex items-center justify-between gap-4 p-4 rounded-md border border-border/50 bg-secondary/10">
          <div className="flex flex-col gap-1">
            <Label className="text-sm font-medium">Enable Ingestion</Label>
            <span className="text-xs text-muted-foreground">
              Allow this integration to automatically ingest vulnerabilities.
            </span>
          </div>
          <Switch
            checked={active}
            onCheckedChange={setActive}
          />
        </div>

        {showConfigModal?.title?.toLowerCase() !== 'semgrep' && !showConfigModal?.title?.toLowerCase()?.includes('nessus') && (
          showConfigModal.kind === 'integration' ? (
            <div className="-mb-6 mt-2">
              <ManualWebhookPanel carrier={showConfigModal.type} />
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Webhook URL</Label>
              <span className="text-xs text-muted-foreground mb-1">
                Configure your {showConfigModal.title} instance to push results to this endpoint.
              </span>
              <div className="flex relative items-center">
                <Input
                  readOnly
                  value={webhookUrl}
                  className="font-mono text-xs pr-24 h-10 truncate bg-background border-border/50"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute right-1 h-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                  onClick={handleCopyWebhook}
                >
                  <Copy className="mr-1.5 size-3.5" /> Copy
                </Button>
              </div>
            </div>
          )
        )}
      </div>
    </Modal>
  );
}
