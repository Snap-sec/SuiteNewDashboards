import React, { useState } from 'react';
import { useAuth } from '@/auth/context/auth-context';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ConfirmDialog } from '@/components/custom/button-with-confirmation';
import {
  useGetTrueRiskPolicyQuery,
  useToggleTrueRiskEnabledMutation,
} from '@/services/vm/true-riskApi';

export default function ToggleTrueRisk() {
  const { user } = useAuth();
  const isAuditor = user?.role?.toLowerCase() === 'auditor';

  const { data: policyData, isLoading: isPolicyLoading } =
    useGetTrueRiskPolicyQuery();
  const [toggleTrueRiskEnabled, { isLoading: isToggling }] =
    useToggleTrueRiskEnabledMutation();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingEnabled, setPendingEnabled] = useState(false);

  const handleToggleTrueRisk = (checked) => {
    if (isAuditor) return;
    setPendingEnabled(checked);
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    setConfirmOpen(false);
    toast.promise(toggleTrueRiskEnabled(pendingEnabled).unwrap(), {
      loading: 'Updating scoring methodology...',
      success: pendingEnabled
        ? 'True Risk Framework enabled'
        : 'Standard CVSS v3.1 enabled',
      error: 'Failed to update scoring methodology',
    });
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Label htmlFor="true-risk-toggle" className="text-sm font-medium">
          Enable True Risk
        </Label>
        <Switch
          id="true-risk-toggle"
          checked={policyData?.data?.viewEnabled ?? false}
          onCheckedChange={handleToggleTrueRisk}
          disabled={isPolicyLoading || isToggling || isAuditor}
        />
      </div>

      <ConfirmDialog
        open={confirmOpen}
        setOpen={setConfirmOpen}
        onConfirm={handleConfirm}
        variant="warning"
        title="Change Scoring Methodology?"
        dialog={
          pendingEnabled
            ? 'Switching to True Risk Framework will re-prioritize all findings using contextual risk scoring. This may affect your current vulnerability triage.'
            : 'Switching to Standard CVSS v3.1 will use baseline severity ratings only, without contextual adjustments.'
        }
      />
    </>
  );
}
