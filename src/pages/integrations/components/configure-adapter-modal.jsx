import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Copy, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/custom/modal';
import { Switch } from '@/components/ui/switch';
import { useStore } from '../store';
import AssessmentSelect from './assessment-select';
import { useConfigureVmAdapterMutation } from '@/services/vm/adaptersApi';
import { useInstallAutoPtIntegrationMutation } from '@/services/integration/integrationsApi';
import { Label } from '@/components/ui/label';
import { ManualWebhookPanel } from './manual-webhook-panel';
import { getAdapterType } from '../utils';

export default function ConfigureAdapterModal() {
  const { showConfigModal, setShowConfigModal } = useStore();
  const [configureAdapter, { isLoading: isVmSaving }] = useConfigureVmAdapterMutation();
  const [installAutoPt, { isLoading: isAutoPtSaving }] = useInstallAutoPtIntegrationMutation();
  const isSaving = isVmSaving || isAutoPtSaving;

  const [name, setName] = useState('');
  const [region, setRegion] = useState('');
  const [assessmentId, setAssessmentId] = useState('');
  const [active, setActive] = useState(true);
  const [configValues, setConfigValues] = useState({});
  const [showPassword, setShowPassword] = useState({});

  const configFields =
    showConfigModal?.config_fields ||
    showConfigModal?.config_feilds ||
    [];

  const hasRegionInConfigFields = configFields.some(
    (field) => field.name?.toLowerCase() === 'region'
  );

  useEffect(() => {
    if (showConfigModal) {
      setName(
        showConfigModal.userProvidedName ||
        showConfigModal.config?.name ||
        showConfigModal.name ||
        ''
      );
      setRegion(
        showConfigModal.config?.region ||
        showConfigModal.region ||
        showConfigModal.configValues?.region ||
        ''
      );
      setAssessmentId(showConfigModal.assessmentId ?? '');
      setActive(showConfigModal.active ?? showConfigModal.is_active ?? true);

      const fields =
        showConfigModal.config_fields ||
        showConfigModal.config_feilds ||
        [];
      const initialConfig = {};
      fields.forEach((field) => {
        initialConfig[field.name] =
          showConfigModal.config?.[field.name] ??
          showConfigModal[field.name] ??
          '';
      });
      setConfigValues(initialConfig);
      setShowPassword({});
    }
  }, [showConfigModal]);

  const handleClose = () => {
    setShowConfigModal(null);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Instance Name is required');
      return;
    }

    // Validate required config_fields
    for (const field of configFields) {
      if (field.required && !configValues[field.name]?.trim()) {
        toast.error(`${field.label || field.name} is required`);
        return;
      }
    }

    const payload = {
      name: name.trim(),
      userProvidedName: name.trim(),
      active,
      is_active: active,
      ...configValues,
    };

    if (region?.trim()) {
      payload.region = region.trim();
    }

    if (assessmentId) {
      payload.assessmentId = assessmentId;
    }

    const isAutoPt = Boolean(
      showConfigModal.integrationId ||
      showConfigModal.products?.includes('AUTO-PT') ||
      showConfigModal.type === 'ingress' ||
      configFields.length > 0
    );

    const integrationTitle =
      showConfigModal.title || showConfigModal.name || 'Integration';

    try {
      if (isAutoPt) {
        const id =
          showConfigModal.integrationId ||
          showConfigModal.id ||
          showConfigModal._id ||
          showConfigModal.type;
        await installAutoPt({
          integrationId: id,
          ...payload,
        }).unwrap();
      } else {
        await configureAdapter({
          adapterId:
            showConfigModal.instance_id ||
            showConfigModal._id ||
            showConfigModal.id,
          data: payload,
        }).unwrap();
      }
      toast.success(`${integrationTitle} configured successfully`);
      handleClose();
    } catch (err) {
      // Fallback attempt
      try {
        if (isAutoPt) {
          await configureAdapter({
            adapterId:
              showConfigModal.instance_id ||
              showConfigModal._id ||
              showConfigModal.id,
            data: payload,
          }).unwrap();
        } else {
          const id =
            showConfigModal.integrationId ||
            showConfigModal.id ||
            showConfigModal._id ||
            showConfigModal.type;
          await installAutoPt({
            integrationId: id,
            ...payload,
          }).unwrap();
        }
        toast.success(`${integrationTitle} configured successfully`);
        handleClose();
      } catch (fallbackErr) {
        toast.error(
          err?.data?.message ||
          fallbackErr?.data?.message ||
          `Failed to configure ${integrationTitle}`
        );
      }
    }
  };

  const webhookUrl = showConfigModal?.webhook_url;

  const handleCopyWebhook = () => {
    if (webhookUrl) {
      navigator.clipboard.writeText(webhookUrl);
      toast.success('Webhook URL copied to clipboard');
    }
  };

  // Dedicated adapter modals handle GCP, AWS, Azure, Oracle, GitHub, GitLab, and Jira
  const adapterType = getAdapterType(showConfigModal);
  const isDedicatedType = [
    'gcp',
    'aws',
    'azure',
    'oracle',
    'github',
    'gitlab',
    'jira',
  ].includes(adapterType);

  if (!showConfigModal || isDedicatedType) {
    return null;
  }

  const modalTitle = showConfigModal.title || showConfigModal.name || 'Integration';

  return (
    <Modal
      open={!!showConfigModal}
      setOpen={(val) => !val && handleClose()}
      title={`Configure ${modalTitle}`}
      description="Integration settings"
      icon={
        showConfigModal.logo ? (
          <img
            src={showConfigModal.logo.toLowerCase()}
            alt={modalTitle}
            className="h-8 w-8 object-contain"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center text-lg font-bold">
            {modalTitle?.charAt(0)}
          </div>
        )
      }
      className="max-w-xl"
      footer={
        <div className="flex w-full justify-end gap-3 pt-2 pb-1 pr-1">
          <Button variant="outline" onClick={handleClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        {/* Anti-autofill decoy inputs */}
        <div style={{ position: 'absolute', opacity: 0, height: 0, width: 0, overflow: 'hidden', zIndex: -1 }} aria-hidden="true">
          <input type="text" name="fake_username_autofill" tabIndex={-1} autoComplete="username" />
          <input type="password" name="fake_password_autofill" tabIndex={-1} autoComplete="current-password" />
        </div>

        {/* Instance Name Input Field */}
        <div className="flex flex-col gap-2">
          <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            Instance Name <span className="text-destructive">*</span>
          </Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={`e.g. ${modalTitle} Prod`}
            autoComplete="off"
            data-1p-ignore="true"
            data-lpignore="true"
          />
        </div>

        {/* Dynamic config_fields from backend */}
        {configFields.length > 0 && (
          <div className="flex flex-col gap-4">
            {configFields.map((field) => {
              const isPassword = field.type === 'password';
              const isShowingPass = !!showPassword[field.name];

              return (
                <div key={field.name} className="flex flex-col gap-2">
                  <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    {field.label || field.name}
                    {field.required && (
                      <span className="text-destructive ml-0.5">*</span>
                    )}
                  </Label>
                  <div className="relative flex items-center">
                    <Input
                      type={
                        isPassword
                          ? isShowingPass
                            ? 'text'
                            : 'password'
                          : field.type || 'text'
                      }
                      value={configValues[field.name] ?? ''}
                      onChange={(e) =>
                        setConfigValues((prev) => ({
                          ...prev,
                          [field.name]: e.target.value,
                        }))
                      }
                      placeholder={
                        field.placeholder || `Enter ${field.label || field.name}`
                      }
                      autoComplete={isPassword ? 'new-password' : 'off'}
                      data-1p-ignore="true"
                      data-lpignore="true"
                      className={isPassword ? 'pr-10' : ''}
                    />
                    {isPassword && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 size-8 text-muted-foreground hover:text-foreground"
                        onClick={() =>
                          setShowPassword((prev) => ({
                            ...prev,
                            [field.name]: !prev[field.name],
                          }))
                        }
                      >
                        {isShowingPass ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </Button>
                    )}
                  </div>
                  {field.description && (
                    <span className="text-[11px] text-muted-foreground -mt-0.5">
                      {field.description}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Region Input Field */}
        {!hasRegionInConfigFields && (
          <div className="flex flex-col gap-2">
            <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Region
            </Label>
            <Input
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="e.g. us-east-1, eu-west-1, us-west-2"
              autoComplete="off"
              data-1p-ignore="true"
              data-lpignore="true"
            />
          </div>
        )}

        {/* Assessment selection (for VM adapters that use it) */}
        {(showConfigModal.assessmentId !== undefined ||
          (!configFields.length && showConfigModal.type !== 'ingress')) && (
          <div className="flex flex-col gap-2">
            <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Assessment
            </Label>
            <AssessmentSelect
              value={assessmentId}
              placeholder="Select assessment"
              onChange={(option) => setAssessmentId(option.value)}
            />
          </div>
        )}

        {/* Enable Ingestion Toggle */}
        {/* <div className="flex items-center justify-between gap-4 p-4 rounded-md border border-border/50 bg-secondary/10">
          <div className="flex flex-col gap-1">
            <Label className="text-sm font-medium">Enable Ingestion</Label>
            <span className="text-xs text-muted-foreground">
              Allow this integration to automatically ingest vulnerabilities and security posture.
            </span>
          </div>
          <Switch checked={active} onCheckedChange={setActive} />
        </div> */}

        {/* Webhook panel if applicable */}
        {webhookUrl &&
          showConfigModal?.title?.toLowerCase() !== 'semgrep' &&
          !showConfigModal?.title?.toLowerCase()?.includes('nessus') && (
            showConfigModal.kind === 'integration' ? (
              <div className="-mb-6 mt-2">
                <ManualWebhookPanel carrier={showConfigModal.type} />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Webhook URL
                </Label>
                <span className="text-xs text-muted-foreground mb-1">
                  Configure your {modalTitle} instance to push results to this endpoint.
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
