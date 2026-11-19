import React from 'react';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { useGetVmRelevanceGroupByIdQuery } from '@/services/vm/relevanceGroupsApi';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RelevanceGroupHeaderCard from './components/RelevanceGroupHeaderCard';
import VulnsTab from './components/tabs/VulnsTab';
import DashboardTab from './components/tabs/DashboardTab';
import AboutTab from './components/tabs/AboutTab';
import ActionsTab from './components/tabs/ActionsTab';

export default function RelevanceGroupDetailsPage() {
  const { id } = useParams();

  const {
    data: apiData,
    isLoading,
    isFetching,
  } = useGetVmRelevanceGroupByIdQuery(id, {
    skip: !id,
  });

  const group = apiData?.data || apiData || {};

  return (
    <div className="px-6 py-5 flex flex-col gap-6">
      <Helmet>
        <title>UniRisk | Relevance Group Details</title>
      </Helmet>

      {/* Main Campaign Info & Stats Header Card */}
      <RelevanceGroupHeaderCard
        group={group}
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
          <TabsTrigger value="about" variant="line">
            About
          </TabsTrigger>
          <TabsTrigger value="vulns" variant="line">
            Vulnerabilities
          </TabsTrigger>
          <TabsTrigger value="actions" variant="line">
            Automation
          </TabsTrigger>

        </TabsList>

        {/* Dashboard Tab Content */}
        <TabsContent value="dashboard" className="mt-0">
          <DashboardTab group={group} isLoading={isLoading || isFetching} />
        </TabsContent>

        {/* Vulnerabilities Tab Content */}
        <TabsContent value="vulns" className="mt-0">
          <VulnsTab groupId={id} groupName={group?.name} />
        </TabsContent>

        {/* Actions Tab Content */}
        <TabsContent value="actions" className="mt-0">
          <ActionsTab relevanceGroupId={id} relevanceGroupName={group?.name} />
        </TabsContent>

        {/* About Tab Content */}
        <TabsContent value="about" className="mt-0">
          <AboutTab group={group} isLoading={isLoading || isFetching} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
