import { Brain } from 'lucide-react';
import { toast } from 'sonner';
import { useRunVmFalsePositiveAnalysisMutation } from '@/services/vm/falsePositiveApi';
import { Button } from '@/components/ui/button';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import useStore from '../../store';

const FalsePositiveAnalysis = ({ vulnIds = [] }) => {
  const [runAnalysis, { isLoading: isAnalyzing }] =
    useRunVmFalsePositiveAnalysisMutation();

  const setRowSelection = useStore((state) => state.setRowSelection);

  const handleRunAnalysis = () => {
    if (vulnIds?.length === 0)
      return toast.error('Please select at least one vulnerability');

    toast.promise(runAnalysis(vulnIds).unwrap(), {
      loading: 'Running false positive analysis...',
      success: (data) => {
        setRowSelection(() => ({}));
        return (
          data?.message || 'False positive analysis completed successfully!'
        );
      },
      error: (e) => e?.data?.message || 'Failed to run false positive analysis',
    });
  };

  return (
    <ButtonWithConfirm
      disabled={isAnalyzing}
      variant="outline"
      confirm={true}
      onConfirm={handleRunAnalysis}
      confirmButton={<Button variant="primary">Proceed</Button>}
      cancelButton={<Button variant="outline">Cancel</Button>}
      dialog="Are you sure you want to run false positive analysis on the selected vulnerabilities?"
      confirmTitle="False Positive Analysis"
    >
      <Brain size={14} className="mr-1" /> False Positive Analysis
    </ButtonWithConfirm>
  );
};

export default FalsePositiveAnalysis;
