import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  useInstallVmIntegrationMutation,
  useUpdateVmIntegrationMutation,
} from '@/services/vm/integrationsApi';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/custom/modal';
import { useStore } from '../../../store';

import StepIndicator from './StepIndicator';
import StepCredentials from './steps/StepCredentials';
import StepProjectConfig from './steps/StepProjectConfig';
import StepStatusMapping from './steps/StepStatusMapping';

import { ChevronLeft, ChevronRight, Download } from 'lucide-react';

const STEPS = [
  { id: 'credentials', label: 'Credentials' },
  { id: 'project', label: 'Project' },
  { id: 'status-mapping', label: 'Status Mapping' },
];

const INITIAL_PAYLOAD = {
  name: '',
  email: '',
  apiToken: '',
  domain: '',
  adapterName: 'jira',
  project: '',
  assignee: '',
  ticketType: '',
  statusMappings: [],
};

function Jira() {
  const { showInstallModal, setShowInstallModal } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [payload, setPayload] = useState(INITIAL_PAYLOAD);

  const [integrationId, setIntegrationId] = useState(null);
  const [credentialsReady, setCredentialsReady] = useState(false);

  const credentialsRef = useRef(null);

  const [installIntegration, { isLoading: isInstalling }] = useInstallVmIntegrationMutation();
  const [updateIntegration, { isLoading: isUpdating }] = useUpdateVmIntegrationMutation();

  useEffect(() => {
    const { type } = showInstallModal || {};
    if (type === 'jira') {
      setIsOpen(true);
      setCurrentStep(0);
      setPayload(INITIAL_PAYLOAD);
      setIntegrationId(null);
      setCredentialsReady(false);
    } else {
      setIsOpen(false);
    }
  }, [showInstallModal]);

  const handleClose = (val) => {
    if (!val) {
      setIsOpen(false);
      setShowInstallModal({});
    }
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setPayload((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelect = (field, value) => {
    setPayload((prev) => ({ ...prev, [field]: value }));
  };

  const handleCredentialsValid = async (data) => {
    let result;
    try {
      result = await installIntegration({
        adapterName: 'jira',
        name: data.name,
        domain: data.domain,
        email: data.email,
        apiToken: data.apiToken,
      }).unwrap();
    } catch (err) {
      // POST failed — show error, stay on step 1, don't fetch projects/users
      const message =
        err?.data?.message ||
        err?.data?.error ||
        'Jira integration failed. Please check your credentials and try again.';
      toast.error(message);
      return;
    }

    // POST succeeded (201) — unlock project & user fetches, advance to step 2
    const id = result?.data?.adapterId || result?.adapterId || result?.data?._id || result?.data?.id || result?.id || result?.integration?._id;
    setIntegrationId(id);
    setCredentialsReady(true);
    setPayload((prev) => ({ ...prev, ...data }));
    setCurrentStep(1);
  };

  const handleStep2Next = () => {
    if (!payload.project || !payload.assignee || !payload.ticketType) {
      toast.error('Please select project, assignee, and ticket type.');
      return;
    }
    setCurrentStep(2);
  };

  const handleFinish = async () => {
    if (!integrationId) {
      toast.error('Integration ID is missing. Please restart the flow.');
      return;
    }

    const statusMap = {};
    payload.statusMappings.forEach(({ left, right }) => {
      if (right?.trim()) statusMap[left] = right.trim();
    });

    const patchBody = {
      id: integrationId,
      configuration: {
        project: { key: payload.project },
        ticketType: { name: payload.ticketType },
        assignee: { accountId: payload.assignee },
      },
      statusMap,
    };

    try {
      await toast.promise(updateIntegration(patchBody).unwrap(), {
        loading: 'Saving integration configuration...',
        success: 'Jira has been integrated successfully!',
        error: (err) => err?.data?.message || 'Jira integration failed. Please try again.',
      });
      handleClose(false);
    } catch {
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
  const isBusy = isInstalling || isUpdating;

  const footer = (
    <div className="flex items-center justify-between w-full">
      <Button
        variant="outline"
        onClick={handleBack}
        disabled={currentStep === 0 || isBusy}
      >
        <ChevronLeft className="size-4" />
        Back
      </Button>

      {isLastStep ? (
        <Button onClick={handleFinish} disabled={isBusy}>
          <Download className="size-4" />
          {isUpdating ? 'Saving...' : 'Finish & Install'}
        </Button>
      ) : (
        <Button onClick={handleNext} disabled={isBusy}>
          {isInstalling ? 'Saving...' : 'Next'}
          <ChevronRight className="size-4" />
        </Button>
      )}
    </div>
  );

  return (
    <Modal
      className="sm:max-w-[900px]"
      open={isOpen}
      setOpen={handleClose}
      title="Integrate Jira"
      description="Connect Jira to your Vulnerability Management workflow in 3 easy steps"
      footer={footer}
    >
      <StepIndicator steps={STEPS} currentStep={currentStep} />

      {currentStep === 0 && (
        <StepCredentials
          ref={credentialsRef}
          onValidData={handleCredentialsValid}
          defaultValues={{
            name: payload.name,
            email: payload.email,
            apiToken: payload.apiToken,
            domain: payload.domain,
          }}
        />
      )}
      {currentStep === 1 && (
        <StepProjectConfig payload={payload} onSelect={handleSelect} credentialsReady={credentialsReady} />
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
export default Jira;
