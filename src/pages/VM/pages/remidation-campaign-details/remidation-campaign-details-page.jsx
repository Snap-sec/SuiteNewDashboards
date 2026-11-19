import React from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';
import { useGetVmRemidationCampaignByIdQuery } from '@/services/vm/remidationCampaignApi';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CampaignHeaderCard from './components/CampaignHeaderCard';
import AssetsTab from './components/tabs/AssetsTab';
import DashboardTab from './components/tabs/DashboardTab';
import MigrationTab from './components/tabs/MigrationTab';
import VulnsTab from './components/tabs/VulnsTab';
import ApiErrorHandler from '../../../../components/common/api-error-handler';

export default function RemidationCampaignDetailsPage() {
  const [searchParams] = useSearchParams();
  const campaignId = searchParams.get('id');

  const {
    data: apiData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetVmRemidationCampaignByIdQuery(campaignId, {
    skip: !campaignId,
  });

  const campaign = apiData || {};

  const progressPercent = campaign.vulnCount
    ? Math.round(((campaign.closedVulnCount || 0) / campaign.vulnCount) * 100)
    : 0;

    if(isError) return <ApiErrorHandler error={error} />

  return (
    <div className="px-6 py-5 flex flex-col gap-6">
      <Helmet>
        <title>UniRisk | Remediation Campaign Details</title>
      </Helmet>

      {/* Main Campaign Info & Stats Header Card */}
      <CampaignHeaderCard
        campaign={campaign}
        progressPercent={progressPercent}
        isLoading={isLoading || isFetching}
      />

      {/* Tabs Layout */}
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList
          variant="line"
          size="md"
          className="border-b border-border mb-4"
        >
          <TabsTrigger value="dashboard" variant="line">
            Dashboard
          </TabsTrigger>
          {/* <TabsTrigger value="migration" variant="line">
            Migration
          </TabsTrigger> */}
          <TabsTrigger value="assets" variant="line">
            Assets
          </TabsTrigger>
          <TabsTrigger value="vulns" variant="line">
            Vulnerabilities
          </TabsTrigger>
        </TabsList>

        {/* Migration Tab Content */}
        {/* <TabsContent value="migration" className="mt-0">
          <MigrationTab />
        </TabsContent> */}

        <TabsContent value="dashboard" className="mt-0">
          <DashboardTab remediationCampaignId={campaignId} />
        </TabsContent>

        {/* Assets Tab Content */}
        <TabsContent value="assets" className="mt-0">
          <AssetsTab campaignId={campaignId} />
        </TabsContent>

        {/* Vulnerabilities Tab Content */}
        <TabsContent value="vulns" className="mt-0">
          <VulnsTab campaignId={campaignId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
