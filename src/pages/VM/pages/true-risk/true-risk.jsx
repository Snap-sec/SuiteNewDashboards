import { useCallback, useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { toast } from 'sonner';
import {
  useGetTrueRiskPolicyQuery,
  useUpdateTrueRiskPolicyMutation,
} from '@/services/vm/true-riskApi';
import PageHeading from '@/components/custom/page-heading';
import RiskScoring from './components/risk-scoring';
import RiskScoringSkeleton from './components/skeletons/risk-scoring-skeleton';
import ToggleTrueRisk from './components/actions/toggle-true-risk';
import TrueRiskStats from './components/true-risk-stats';
import ApiErrorHandler from '../../../../components/common/api-error-handler';

function TrueRisk() {
  const riskScoringRef = useRef();
  const [pollingInterval, setPollingInterval] = useState(0);

  const { data: policyData, isLoading: isPolicyLoading, isError, error, } =
    useGetTrueRiskPolicyQuery(undefined, {
      pollingInterval,
    });

  useEffect(() => {
    if (policyData?.data?.status === 'in_progress') {
      setPollingInterval(5000);
    } else {
      setPollingInterval(0);
    }
  }, [policyData?.data?.status]);
  const [updatePolicy, { isLoading: isUpdating }] =
    useUpdateTrueRiskPolicyMutation();

  const [currentPolicy, setCurrentPolicy] = useState(null);
  const isDirty = useRef(false);
  const debounceTimer = useRef(null);

  useEffect(() => {
    if (policyData?.data?.factors) {
      // Reset dirty flag whenever fresh data arrives (initial load or refetch)
      isDirty.current = false;
      setCurrentPolicy(policyData.data.factors);
    }
  }, [policyData]);

  const handlePolicyUpdate = useCallback((newData) => {
    setCurrentPolicy(() => ({ ...newData?.factors }));

    if (!isDirty.current) return; // Skip auto-save on initial sync

    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      const policyToSave = newData?.factors;
      if (!policyToSave) return;
      toast.promise(updatePolicy(policyToSave).unwrap(), {
        loading: 'Saving configuration...',
        success: 'Configuration saved',
        error: 'Failed to save configuration',
      });
    }, 1500);
  }, [updatePolicy]);

  // Mark dirty only after the user makes a real interaction
  const handleUserChange = useCallback((newData) => {
    if (JSON.stringify(newData?.factors) === JSON.stringify(currentPolicy)) return;
    isDirty.current = true;
    handlePolicyUpdate(newData);
  }, [handlePolicyUpdate, currentPolicy]);

  if (isError) return <ApiErrorHandler error={error} />

  return (
    <div className="py-4 px-4">
      <Helmet>
        <title>UniRisk | True Risk</title>
      </Helmet>

      <div className="flex justify-between items-center">
        <PageHeading
          title="True Risk"
          description="Customize your True Risk framework for accurate risk assessment."
        />
        <ToggleTrueRisk />
      </div>

      <div className="py-2">
        <TrueRiskStats
          data={policyData?.data}
          isLoading={isPolicyLoading}
        />
        {isPolicyLoading ? (
          <RiskScoringSkeleton />
        ) : (
          <RiskScoring
            ref={riskScoringRef}
            data={policyData}
            onChange={handleUserChange}
          />
        )}
      </div>
    </div>
  );
}

export default TrueRisk;
