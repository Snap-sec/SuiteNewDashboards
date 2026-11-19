import React from 'react';
import { RiExportFill } from '@remixicon/react';
import { FilePlus, FileText, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { CustomTooltip } from '../../../../../../components/custom/tooltip';
import { Button } from '../../../../../../components/ui/button';
import { useGenerateVmReportMutation } from '../../../../../../services/vm/reportApi';


// THIS WILL BE USED FOR BOTH GENERATE AND REGENERATE REPORT

function GenerateAssessmentReport({
  reportType,
  assessmentId,
  format = 'pdf',
  isRegenerating = false,
  showText = true,
  disabled
}) {
  const [generateAssessmentReport, { isLoading: isGeneratingReport }] =
    useGenerateVmReportMutation();

  const handleGenerateVmReport = () => {
    let body = {
      type: reportType,
      assessmentId: assessmentId,
      format
    };

    toast.promise(generateAssessmentReport({ body }).unwrap(), {
      loading: `${isRegenerating ? 'Regenerating' : 'Generating'} report...`,
      success: () => {
        return `Report ${isRegenerating ? 'Regenerated' : 'generated'} successfully`;
      },
      error: (err) =>
        err?.data?.message ||
        `Error ${isRegenerating ? 'Regenerating' : 'Generating'} report`,
    });
  };

  return (
    <CustomTooltip
      text={`${isRegenerating ? 'Regenerate' : 'Generate'} report`}
    >
      <Button
        className="cursor-pointer"
        disabled={isGeneratingReport || disabled}
        onClick={handleGenerateVmReport}
        variant="outline"
      >
        {isRegenerating ? (
          <p className="flex items-center gap-1">
            {isGeneratingReport ? <Loader2 className="animate-spin" /> : <RefreshCw />}
            {showText && (isGeneratingReport ? 'Regenerating..' : 'Regenerate')}
          </p>
        ) : (
          <p className="flex items-center gap-1">
            {isGeneratingReport ? <Loader2 className="animate-spin" /> : <FilePlus />}
            {showText && (isGeneratingReport ? 'Generating..' : 'Generate')}
          </p>
        )}
      </Button>
    </CustomTooltip>
  );
}

export default GenerateAssessmentReport;