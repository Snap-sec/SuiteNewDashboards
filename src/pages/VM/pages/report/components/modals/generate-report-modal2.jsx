import { useState } from 'react';
import { ArrowRight, FileDown } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/custom/modal';
import { useGenerateVmReportMutation } from '../../../../../../services/vm/reportApi';

// Sub-components
import { Step1KindSelection } from './generate-report/step-1-kind-selection';
import { Step2Configuration } from './generate-report/step-2-configuration';

function GenerateReportModel2({ supportedFormats = [], supportedFor, systemAssessmentSlug }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedKindIdx, setSelectedKindIdx] = useState(null);

  // Step 2 fields
  const [selectedScopeIdx, setSelectedScopeIdx] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState('');
  const [selectedAssessment, setSelectedAssessment] = useState('');
  const [selectedChangeRequest, setSelectedChangeRequest] = useState('');

  // ─── Derived from API data ───────────────────────────────────────────────
  const selectedKind = supportedFormats[selectedKindIdx] || null;
  const scopes = selectedKind?.generate_on || [];
  const selectedScope = scopes.length > 0 ? (scopes[selectedScopeIdx] || scopes[0]) : null;
  const availableFormats = selectedScope?.formats || selectedKind?.formats || [];

  // ─── Mutation ────────────────────────────────────────────────────────────
  const [generateVmReport, { isLoading: isGeneratingReport }] =
    useGenerateVmReportMutation();

  // ─── Handlers ────────────────────────────────────────────────────────────
  const handleReset = () => {
    setStep(1);
    setSelectedKindIdx(null);
    setSelectedScopeIdx(null);
    setSelectedFormat('');
    setSelectedAssessment('');
    setSelectedChangeRequest('');
  };

  const handleNext = () => {
    if (selectedKindIdx === null)
      return toast.error('Please select a report kind');
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setSelectedScopeIdx(null);
    setSelectedFormat('');
    setSelectedAssessment('');
    setSelectedChangeRequest('');
  };

  const handleGenerate = () => {
    if (scopes.length > 0 && !selectedScope) {
      return toast.error('Please select where to generate');
    }

    if (!selectedFormat) {
      return toast.error('Please select an export format');
    }

    const format = selectedFormat;
    // Fallback to selectedKind.id or selectedKind.type if no scope
    const typeId = selectedScope ? selectedScope.id : (selectedKind.id || selectedKind.type);

    let body = { type: typeId, format };
    let params = {};
    
    if (supportedFor) {
      params.supported_for = supportedFor;
    }

    if (systemAssessmentSlug) {
      body.system_assessment_slug = systemAssessmentSlug;
    }

    if (selectedScope?.type === 'assessment') {
      if (!selectedAssessment) return toast.error('Please select an assessment');
      body.assessmentId = selectedAssessment;
    } else if (selectedScope?.type === 'change-request') {
      if (!selectedChangeRequest) return toast.error('Please select a change request');
      body.assessmentId = selectedChangeRequest;
      body.isChangeRequest = true;
    }

    toast.promise(generateVmReport({ body, params }).unwrap(), {
      loading: 'Generating report...',
      success: () => {
        setIsModalOpen(false);
        handleReset();
        return 'Report generated successfully';
      },
      error: (err) => err?.data?.message || 'Error generating report',
    });
  };

  // ─── Dynamic modal props ─────────────────────────────────────────────────
  const modalDescription =
    step === 1
      ? 'Select the type of report to generate'
      : `Configure · ${selectedKind?.name}`;

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <Modal
      open={isModalOpen}
      setOpen={(open) => {
        setIsModalOpen(open);
        if (!open) handleReset();
      }}
      title="Generate Report"
      description={modalDescription}
      trigger={
        <Button>
          <FileDown className="w-4 h-4" /> Generate Report
        </Button>
      }
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setIsModalOpen(false);
              handleReset();
            }}
          >
            Cancel
          </Button>

          {step === 1 ? (
            <Button onClick={handleNext} disabled={selectedKindIdx === null}>
              Next <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleGenerate} disabled={isGeneratingReport}>
              <FileDown className="w-4 h-4" />
              {isGeneratingReport ? 'Generating...' : 'Generate Report'}
            </Button>
          )}
        </div>
      }
      className="sm:max-w-lg"
    >
      <div className="flex flex-col gap-5">
        {/* ── Progress Bar ────────────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5 flex-1">
            <div className="h-1 flex-1 rounded-full bg-primary" />
            <div
              className={cn(
                'h-1 flex-1 rounded-full transition-colors',
                step === 2 ? 'bg-primary' : 'bg-muted',
              )}
            />
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            STEP 1 — Select Kind
           ════════════════════════════════════════════════════════════════ */}
        {step === 1 && (
          <Step1KindSelection
            supportedFormats={supportedFormats}
            selectedKindIdx={selectedKindIdx}
            setSelectedKindIdx={setSelectedKindIdx}
          />
        )}

        {/* ════════════════════════════════════════════════════════════════
            STEP 2 — Configure
           ════════════════════════════════════════════════════════════════ */}
        {step === 2 && selectedKind && (
          <Step2Configuration
            selectedKind={selectedKind}
            scopes={scopes}
            selectedScope={selectedScope}
            selectedScopeIdx={selectedScopeIdx}
            setSelectedScopeIdx={setSelectedScopeIdx}
            availableFormats={availableFormats}
            selectedFormat={selectedFormat}
            setSelectedFormat={setSelectedFormat}
            selectedAssessment={selectedAssessment}
            setSelectedAssessment={setSelectedAssessment}
            selectedChangeRequest={selectedChangeRequest}
            setSelectedChangeRequest={setSelectedChangeRequest}
            handleBack={handleBack}
          />
        )}
      </div>
    </Modal>
  );
}

export default GenerateReportModel2;