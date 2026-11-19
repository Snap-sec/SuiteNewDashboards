import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useUpdateVmIntegrationMutation } from '@/services/vm/integrationsApi';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/custom/modal';
import { useStore } from '../../../store';

import StepIndicator from './StepIndicator';
import StepEditCredentials from './steps/StepEditCredentials';
import StepProjectConfig from '../jira/steps/StepProjectConfig';
import StepStatusMapping, { SNAPSEC_STATUSES } from '../jira/steps/StepStatusMapping';

import { ChevronLeft, ChevronRight, Save } from 'lucide-react';

const STEPS = [
  { id: 'credentials', label: 'Credentials' },
  { id: 'project', label: 'Project' },
  { id: 'status-mapping', label: 'Status Mapping' },
];

function JiraConfigure() {
  const { showConfigModal, setShowConfigModal } = useStore();

  // Only render for jira integrations
  const isJira =
    showConfigModal?.type === 'jira' || showConfigModal?.adapterName === 'jira';

  const [currentStep, setCurrentStep] = useState(0);
  const [payload, setPayload] = useState({
    name: '',
    project: '',
    assignee: '',
    ticketType: '',
    statusMappings: [],
  });

  const credentialsRef = useRef(null);

  const [updateIntegration, { isLoading: isUpdating }] = useUpdateVmIntegrationMutation();

  // Reset whenever this modal opens for a Jira adapter
  useEffect(() => {
    if (isJira && showConfigModal) {
      const cfg = showConfigModal.config?.configuration || {};
      const rawStatusMap = showConfigModal.config?.statusMap || {};
      setCurrentStep(0);
      setPayload({
        name: showConfigModal.name || '',
        project: cfg.project?.key || '',
        assignee: cfg.assignee?.accountId || '',
        ticketType: cfg.ticketType?.name || '',
        statusMappings: SNAPSEC_STATUSES.map((s) => ({
          left: s,
          right: rawStatusMap[s] || '',
        })),
      });
    }
  }, [showConfigModal, isJira]);

  const handleClose = () => {
    setShowConfigModal(null);
  };

  const handleSelect = (field, value) => {
    setPayload((prev) => ({ ...prev, [field]: value }));
  };

  // Step 1 — name only validation passes, then advance
  const handleCredentialsValid = (data) => {
    setPayload((prev) => ({ ...prev, name: data.name }));
    setCurrentStep(1);
  };

  // Step 2 — validate project/assignee/ticketType then advance
  const handleStep2Next = () => {
    if (!payload.project || !payload.assignee || !payload.ticketType) {
      toast.error('Please select project, assignee, and ticket type.');
      return;
    }
    setCurrentStep(2);
  };

  // Step 3 — PATCH the integration with all config
  const handleFinish = async () => {
    if (!showConfigModal?.instance_id) {
      toast.error('Integration ID is missing. Please try again.');
      return;
    }

    const statusMap = {};
    payload.statusMappings.forEach(({ left, right }) => {
      if (right?.trim()) statusMap[left] = right.trim();
    });

    const patchBody = {
      id: showConfigModal.instance_id,
      name: payload.name,
      configuration: {
        project: { key: payload.project },
        ticketType: { name: payload.ticketType },
        assignee: { accountId: payload.assignee },
      },
      statusMap,
    };

    try {
      await toast.promise(updateIntegration(patchBody).unwrap(), {
        loading: 'Saving Jira configuration...',
        success: 'Jira configuration updated successfully!',
        error: (err) =>
          err?.data?.message || 'Failed to update Jira configuration. Please try again.',
      });
      handleClose();
    } catch {
      // handled by toast.promise
    }
  };

  const handleNext = () => {
    if (currentStep === 0) {
      credentialsRef.current?.submit();
      return;
    }
    if (currentStep === 1) return handleStep2Next();
  };

  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const isLastStep = currentStep === STEPS.length - 1;

  const footer = (
    <div className="flex items-center justify-between w-full">
      <Button
        variant="outline"
        onClick={handleBack}
        disabled={currentStep === 0 || isUpdating}
      >
        <ChevronLeft className="size-4" />
        Back
      </Button>

      {isLastStep ? (
        <Button onClick={handleFinish} disabled={isUpdating}>
          <Save className="size-4" />
          {isUpdating ? 'Saving...' : 'Save Changes'}
        </Button>
      ) : (
        <Button onClick={handleNext} disabled={isUpdating}>
          Next
          <ChevronRight className="size-4" />
        </Button>
      )}
    </div>
  );

  if (!isJira || !showConfigModal) return null;

  return (
    <Modal
      className="sm:max-w-[900px]"
      open={!!showConfigModal && isJira}
      setOpen={(val) => !val && handleClose()}
      title="Configure Jira"
      description="Update your Jira integration settings"
      icon={
        showConfigModal?.logo ? (
          <img
            src={showConfigModal.logo.toLowerCase()}
            alt="Jira"
            className="h-8 w-8 object-contain"
          />
        ) : undefined
      }
      footer={footer}
    >
      <StepIndicator steps={STEPS} currentStep={currentStep} />

      {currentStep === 0 && (
        <StepEditCredentials
          ref={credentialsRef}
          onValidData={handleCredentialsValid}
          defaultValues={{
            name: payload.name,
            webhookUrl: showConfigModal.webhook_url || showConfigModal.config?.webhookUrl || '',
          }}
        />
      )}

      {currentStep === 1 && (
        <StepProjectConfig
          payload={payload}
          onSelect={handleSelect}
          credentialsReady={true}
        />
      )}

      {currentStep === 2 && (
        <StepStatusMapping
          projectKey={payload.project}
          ticketType={payload.ticketType}
          mappings={payload.statusMappings}
          onChange={(updated) =>
            setPayload((prev) => ({ ...prev, statusMappings: updated }))
          }
        />
      )}
    </Modal>
  );
}

export default JiraConfigure;
