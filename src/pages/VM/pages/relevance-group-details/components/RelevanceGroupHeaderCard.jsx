import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import RelevanceGroupOwnerDropdown from './dropdowns/RelevanceGroupOwnerDropdown';
import { Button } from '@/components/ui/button';
import { ButtonWithConfirm } from '@/components/custom/button-with-confirmation';
import { toast } from 'sonner';
import { ShieldX, ShieldCheck } from 'lucide-react';
import RiskAcceptanceForm from '../../vulnerability-report/components/report-details/risk-acceptance-form';
import { useTriggerVmRelevanceGroupsBulkActionMutation } from '@/services/vm/relevanceGroupsApi';
import { CustomTooltip } from '@/components/custom/tooltip';
import AuthorityGuard from '@/components/custom/authority-guard/AuthorityGuard';

export function RelevanceGroupHeaderCardSkeleton() {
  return (
    <div className="flex flex-col gap-5 w-full bg-card border border-border p-6 rounded-xl shadow-xs animate-pulse">
      <div className="flex items-start justify-between flex-wrap gap-4 w-full">
        <div className="flex flex-col gap-2.5 max-w-3/4 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Skeleton className="h-7 w-64 rounded-md" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <div className="flex flex-col gap-1.5 mt-1">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-4/5 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RelevanceGroupHeaderCard({ group, isLoading }) {
  const [triggerBulkAction, { isLoading: isMarking }] = useTriggerVmRelevanceGroupsBulkActionMutation();
  const [showRiskAcceptanceModal, setShowRiskAcceptanceModal] = useState(false);
  const groupId = group?._id;
  const groupName = group?.name;

  const handleMarkFalsePositive = async () => {
    if (!groupId) return;
    try {
      await triggerBulkAction({ id: groupId, payload: { action: 'mark_fp' } }).unwrap();
      toast.success('Successfully marked vulnerabilities as false positive');
    } catch (error) {
      toast.error('Failed to mark as false positive');
    }
  };

  const handleRiskAccepted = async (formData) => {
    if (!groupId) return;
    try {
      await triggerBulkAction({ id: groupId, payload: { action: 'mark_riskaccepted', ...formData } }).unwrap();
      toast.success('Successfully accepted risk for vulnerabilities');
      setShowRiskAcceptanceModal(false);
    } catch (error) {
      toast.error('Failed to accept risk');
    }
  };

  if (isLoading) {
    return <RelevanceGroupHeaderCardSkeleton />;
  }

  const totalVulns = group?.vulnCount
    ? Object.values(group.vulnCount).reduce((a, b) => a + (Number(b) || 0), 0)
    : 0;

  return (
    <div className="flex flex-col gap-5 w-full bg-card border border-border p-6 rounded-xl shadow-xs">
      <div className="flex items-start justify-between flex-wrap gap-4 w-full">
        <div className="flex flex-col gap-1.5 max-w-3/4">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold text-foreground leading-tight">
              {group?.name || group?._id}
            </h1>
          </div>
          <p className="text-sm leading-relaxed">{group?.description}</p>
        </div>

        {/* <AuthorityGuard forbidRoles={'Auditor'}>
          <div className="flex items-center gap-2.5 shrink-0">
            <AuthorityGuard forbidRoles={"Developer"}>
              <CustomTooltip text="Mark Risk Accepted">
                <div>
                  <Button
                    variant="outline"
                    className="h-8 w-8 text-foreground"
                    disabled={isMarking}
                    onClick={() => setShowRiskAcceptanceModal(true)}
                  >
                    <ShieldCheck size={16} />
                  </Button>
                </div>

              </CustomTooltip>

              <CustomTooltip text="Mark False Positive">
                <div>
                  <ButtonWithConfirm
                    confirm
                    onConfirm={handleMarkFalsePositive}
                    disabled={isMarking}
                    confirmTitle="Mark False Positive"
                    dialog="Are you sure you want to mark all vulnerabilities in this relevance group as false positive?"
                    confirmVariant="info"
                    variant="outline"
                    className="h-8 w-8 text-foreground"
                  >
                    <ShieldX size={16} />
                  </ButtonWithConfirm>
                </div>
              </CustomTooltip>


            </AuthorityGuard>
          </div>
        </AuthorityGuard> */}

        {
          showRiskAcceptanceModal && (
            <RiskAcceptanceForm
              show={showRiskAcceptanceModal}
              onClose={() => setShowRiskAcceptanceModal(false)}
              isBulkGroup={true}
              groupName={groupName}
              isLoading={isMarking}
              onSubmit={handleRiskAccepted}
              onSuccess={() => setShowRiskAcceptanceModal(false)}
            />
          )
        }
      </div >

      <div className="flex flex-row gap-6 mt-2">
        <div className="flex flex-col gap-1 border border-dashed border-border rounded-lg px-4 py-3">
          <span className="text-xl text-foreground font-semibold">
            {totalVulns}
          </span>
          <span className="text-2xs uppercase tracking-wider mt-1 text-muted-foreground">
            Vulnerabilities
          </span>
        </div>

        <div className="flex flex-col gap-1 border border-dashed border-border rounded-lg px-4 py-3">
          <span className="text-xl text-foreground font-semibold">
            {group?.exposureScoreReduction || 0}
          </span>
          <span className="text-2xs uppercase tracking-wider mt-1 text-muted-foreground">
            Risk Points
          </span>
        </div>
        {/* 
        <div className="flex flex-col gap-1 border border-dashed border-border rounded-lg px-4 py-3 min-w-[220px]">
          <RelevanceGroupOwnerDropdown group={group} />
          <span className="text-2xs uppercase tracking-wider mt-1 text-muted-foreground">
            Owner
          </span>
        </div> */}
      </div>
    </div >
  );
}
