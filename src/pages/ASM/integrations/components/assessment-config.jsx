import { useState } from 'react';
import { File, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useGetAsmConfigQuery, useUpdateAsmConfigMutation } from '@/services/asm/configApi';

import {
  useGetVmAssessmentsQuery,
} from '@/services/vm/assessmentsApi';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Select from '@/components/custom/select';

export default function AssessmentConfig() {
  const [selectedAssessment, setSelectedAssessment] = useState('');

  const { data: config, isLoading: loadingConfig } = useGetAsmConfigQuery();
  const { data: assessments, isLoading: assessmentsLoading } =
    useGetVmAssessmentsQuery();

  const [updateConfig] = useUpdateAsmConfigMutation();

  if (loadingConfig || assessmentsLoading) {
    return <Skeleton className="w-full h-[150px]" />;
  }

  const handleUpdate = (assessmentId) => {
    toast.promise(updateConfig({ assessmentId: assessmentId }).unwrap(), {
      loading: 'updating config',
      success: 'config updated',
      error: (error) => {
        return error?.data?.message || 'Failed to update config';
      },
    });
  };


  const assessmentOptions = assessments?.data?.assessments?.map(
    (assessment) => ({ label: assessment.title, value: assessment._id }),
  );

  return (
    <Card className="p-4">
      <p>Vulnerability Synchronization Configuration</p>
      <p className="text-[11px] mb-4">
        Configure the vulnerability synchronization to your asset inventory.
      </p>
      <div className="flex gap-2 items-center">
        <Select
          defaultValue={config?.assessmentId}
          options={assessmentOptions}
          onChange={(option) => setSelectedAssessment(option.value)}
          areOptionsNavigating={true}
        />

        <Button
          variant="outline"
          onClick={() => handleUpdate(selectedAssessment)}
        >
          <File /> Update
        </Button>
      </div>
    </Card>
  );
}
