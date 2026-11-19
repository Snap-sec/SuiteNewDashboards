import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useSearchParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import AgentHeaderCard from './components/AgentHeaderCard';
import DashboardTab from './components/tabs/DashboardTab';
import RunsTab from './components/tabs/RunsTab';
import ConfigTab from './components/tabs/ConfigTab';
import AddSkillsModal from './components/tabs/components/AddSkillsModal';
import EditAgentInfoModal from './components/tabs/components/EditAgentInfoModal';

import ApiErrorHandler from '@/components/common/api-error-handler';
import { useGetAgentByIdQuery, useUpdateAgentMutation } from '@/services/automation/agentsApi';

export default function AgentDetailsPage() {
  const { id: paramId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const agentId = paramId || searchParams.get('id');

  const validTabs = ['dashboard', 'runs', 'config'];
  const tabParam = searchParams.get('tab');
  const activeTab = validTabs.includes(tabParam) ? tabParam : 'dashboard';

  const handleTabChange = (value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('tab', value);
      return next;
    });
  };

  const { data: apiData, isLoading, isError, error, refetch } = useGetAgentByIdQuery(agentId, {
    skip: !agentId,
  });

  const [updateAgent, { isLoading: isUpdating }] = useUpdateAgentMutation();
  const [isAddSkillsModalOpen, setIsAddSkillsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const agent = useMemo(() => {
    const fetched = apiData?.data?.data || apiData?.data || apiData;
    if (fetched && (fetched._id || fetched.id || fetched.name)) {
      return fetched;
    }
    return null;
  }, [apiData]);

  if (isError) {
    return <ApiErrorHandler error={error} />;
  }

  const handleSaveAgentInfo = async ({ name, description }) => {
    if (!agentId || !agent) return;
    try {
      await updateAgent({
        agentId,
        name,
        description,
        prompt: agent.prompt,
        model: agent.model,
        temperature: agent.temperature,
        maxSteps: agent.maxSteps,
        skills: Array.isArray(agent.skills)
          ? agent.skills.map((s) => (typeof s === 'string' ? s : s?._id || s?.id || s?.name)).filter(Boolean)
          : [],
      }).unwrap();
      refetch?.();
      toast.success('Agent details updated successfully');
      setIsEditModalOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || err?.message || 'Failed to update agent details');
    }
  };

  const handleAddSkills = async (newSkills) => {
    if (!agentId || !agent) return;
    try {
      const currentSkills = Array.isArray(agent.skills)
        ? agent.skills.map((s) => (typeof s === 'string' ? s : s?._id || s?.id || s?.name)).filter(Boolean)
        : [];
      const newIds = newSkills.map((s) => s._id || s.id || s.name);
      const combined = Array.from(new Set([...currentSkills, ...newIds]));

      await updateAgent({
        agentId,
        name: agent.name,
        description: agent.description,
        prompt: agent.prompt,
        model: agent.model,
        temperature: agent.temperature,
        maxSteps: agent.maxSteps,
        skills: combined,
      }).unwrap();
      refetch?.();
      toast.success(`Attached ${newSkills.length} skill${newSkills.length > 1 ? 's' : ''} to agent`);
    } catch (err) {
      toast.error(err?.data?.message || err?.message || 'Failed to attach skills to agent');
    }
  };

  return (
    <div className="px-6 py-5 flex flex-col gap-6 min-w-0 w-full max-w-full overflow-x-hidden">
      <Helmet>
        <title>Automation | Agent Details</title>
      </Helmet>

      {/* Main Agent Info & Stats Header Card */}
      <AgentHeaderCard
        agent={agent}
        isLoading={isLoading}
        onOpenEditModal={() => setIsEditModalOpen(true)}
        onOpenAddSkillsModal={() => setIsAddSkillsModalOpen(true)}
      />

      {/* Tabs Layout */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList
          variant="line"
          size="md"
          className="border-b border-border mb-4"
        >
          <TabsTrigger value="dashboard" variant="line">
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="runs" variant="line">
            Runs
          </TabsTrigger>
          <TabsTrigger value="config" variant="line">
            Configuration
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab Content */}
        <TabsContent value="dashboard" className="mt-0">
          <DashboardTab agent={agent} isLoading={isLoading} />
        </TabsContent>

        {/* Runs Tab Content */}
        <TabsContent value="runs" className="mt-0">
          <RunsTab agentId={agentId} agent={agent} />
        </TabsContent>

        {/* Configuration Tab Content */}
        <TabsContent value="config" className="mt-0">
          <ConfigTab agent={agent} />
        </TabsContent>
      </Tabs>

      {/* Edit Agent Info Modal */}
      <EditAgentInfoModal
        open={isEditModalOpen}
        setOpen={setIsEditModalOpen}
        agent={agent}
        onSave={handleSaveAgentInfo}
        isSaving={isUpdating}
      />

      {/* Add Skills & Capabilities Modal */}
      <AddSkillsModal
        open={isAddSkillsModalOpen}
        setOpen={setIsAddSkillsModalOpen}
        assignedSkills={agent?.skills || []}
        onAddSkills={handleAddSkills}
        isAdding={isUpdating}
      />
    </div>
  );
}
