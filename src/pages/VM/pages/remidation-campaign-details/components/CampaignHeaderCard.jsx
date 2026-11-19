import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import AuthorityGuard from '../../../../../components/custom/authority-guard/AuthorityGuard';
import RemediationProgress from '../../assets/components/ui/remediation-progress';
import DeleteRemediationCampaign from './actions/delete-remediation-campaign';
import ExportCampaignActionPlan from './actions/export-campaign-action-plan';
import RecomputeRemidationCampaign from './actions/recompute-remidation-campaign';
import SendRemediationCampaignToJira from './actions/send-remidation-campaign-to-jira';
import CampaignOwnerDropdown from './dropdowns/CampaignOwnerDropdown';
import CampaignStatusDropdown from './dropdowns/CampaignStatusDropdown';
import RiskAcceptanceCampaignModal from './modals/risk-acceptance-campaign-modal';


export function CampaignHeaderCardSkeleton() {
  return (
    <div className="flex flex-col gap-5 w-full bg-card border border-border p-6 rounded-xl shadow-xs animate-pulse">
      {/* Top Title & Actions Row */}
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

        <div className="flex items-center gap-2.5 shrink-0">
          <Skeleton className="h-9 w-32 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-20 rounded-md" />
        </div>
      </div>

      {/* Campaign Summary Stats Grid */}
      <div className="flex flex-row gap-6 mt-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="flex flex-col gap-1 border border-dashed border-border rounded-lg px-4 py-3 min-w-28"
          >
            <Skeleton className="h-7 w-12 rounded-md" />
            <Skeleton className="h-3.5 w-16 mt-2 rounded-md" />
          </div>
        ))}
      </div>

      {/* Progress Bar Container */}
      <div className="flex flex-col gap-2 w-full mt-2">
        <Skeleton className="h-4 w-48 rounded-md" />
        <Skeleton className="h-1.5 w-full rounded-full" />
      </div>
    </div>
  );
}

export default function CampaignHeaderCard({
  campaign,
  progressPercent,
  isLoading,
}) {
  if (isLoading) {
    return <CampaignHeaderCardSkeleton />;
  }

  return (
    <div className="flex flex-col gap-5 w-full bg-card border border-border p-6 rounded-xl shadow-xs">
      {/* Top Title & Actions Row */}
      <div className="flex items-start justify-between flex-wrap gap-4 w-full">
        <div className="flex flex-col gap-1.5 max-w-3/4">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold text-foreground leading-tight">
              {campaign?.name}
            </h1>
            {/* <Badge
              variant="success"
              appearance="outline"
              shape="circle"
              size="xs"
              className="px-2 py-0.5"
            >
              {campaign?.status || 'Active'}
            </Badge> */}
          </div>
          <p className="text-sm leading-relaxed">{campaign?.description}</p>
        </div>

        <AuthorityGuard forbidRoles={'Auditor'}>
          <div className="flex items-center gap-2.5 shrink-0">
            {/* <AuthorityGuard forbidRoles={'Developer'}>
              <RiskAcceptanceCampaignModal campaign={campaign} />
            </AuthorityGuard> */}

            {/* If ticketing system is available show this */}
            {campaign?.connectedTicketingSystems?.length > 0 && (
              <SendRemediationCampaignToJira
                campaignId={campaign?._id}
                size="sm"
                campaign={campaign}
              />
            )}
            <ExportCampaignActionPlan campaignId={campaign?._id} size="sm" />
            <RecomputeRemidationCampaign campaignId={campaign?._id} size="sm" />
            <DeleteRemediationCampaign campaignId={campaign?._id} size="sm" />
          </div>
        </AuthorityGuard>
      </div>

      {/* Campaign Summary Stats Grid */}
      <div className="flex flex-row gap-6 mt-2">
        <div className="flex flex-col gap-1 border border-dashed border-border rounded-lg px-4 py-3">
          <span className="text-xl text-foreground font-semibold">
            {campaign?.assetCount || 0}
          </span>
          <span className="text-2xs uppercase tracking-wider mt-1 text-muted-foreground">
            Assets
          </span>
        </div>

        <div className="flex flex-col gap-1 border border-dashed border-border rounded-lg px-4 py-3">
          <span className="text-xl text-foreground font-semibold">
            {campaign?.openVulnCount || 0}
          </span>
          <span className="text-2xs uppercase tracking-wider mt-1 text-muted-foreground">
            Vulnerabilities
          </span>
        </div>

        <div className="flex flex-col gap-1 border border-dashed border-border rounded-lg px-4 py-3">
          <span className="text-xl text-foreground font-semibold">
            {campaign?.exposureScoreReduction || 0}
          </span>
          <span className="text-2xs uppercase tracking-wider mt-1 text-muted-foreground">
            Score Reduction
          </span>
        </div>

        <div className="flex flex-col gap-1 border border-dashed border-border rounded-lg px-4 py-3">
          <span className="text-xl text-foreground font-semibold">
            {campaign?.package || '-'}
          </span>
          <span className="text-2xs uppercase tracking-wider mt-1 text-muted-foreground">
            Package
          </span>
        </div>

        <div className="flex flex-col gap-1 border border-dashed border-border rounded-lg px-4 py-3">
          <CampaignOwnerDropdown campaign={campaign} />

          <span className="text-2xs uppercase tracking-wider mt-1 text-muted-foreground">
            Owner
          </span>
        </div>

        <div className="flex flex-col gap-1 border border-dashed border-border rounded-lg px-4 py-3">
          <CampaignStatusDropdown campaign={campaign} />

          <span className="text-2xs uppercase tracking-wider mt-1 text-muted-foreground">
            State
          </span>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="flex flex-col gap-1.5 w-full mt-2">
        <span className="text-xs text-muted-foreground font-medium">
          Resolving ({campaign?.closedVulnCount || 0} of{' '}
          {campaign?.vulnCount || 0} vulns)
        </span>

        <RemediationProgress progress={progressPercent} />
      </div>
    </div>
  );
}