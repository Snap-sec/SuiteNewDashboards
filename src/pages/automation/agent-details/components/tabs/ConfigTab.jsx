import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import {
  useUpdateAgentMutation,
  useGetAgentByIdQuery,
} from '@/services/automation/agentsApi';
import { useGetInstalledAutomationAdaptersQuery } from '@/services/automation/adaptersApi';
import { useGetSkillsQuery } from '@/services/automation/skillsApi';
import { toast } from 'sonner';

import ApiErrorHandler from '@/components/common/api-error-handler';
import SystemDirectiveCard from './components/SystemDirectiveCard';
import AssignedSkillsCard from './components/AssignedSkillsCard';
import ModelEngineCard from './components/ModelEngineCard';
import GuardrailsCard from './components/GuardrailsCard';
import AddSkillsModal, { getSkillIcon } from './components/AddSkillsModal';

export default function ConfigTab({ agent }) {
  const { id: paramId } = useParams();
  const [searchParams] = useSearchParams();

  // Resolve agentId from prop or URL
  const agentId = agent?._id || agent?.id || paramId || searchParams.get('id');

  // Agent API endpoint: GET agent by ID
  const {
    data: fetchedAgentData,
    isError: isAgentError,
    error: agentError,
    refetch: refetchAgent,
  } = useGetAgentByIdQuery(agentId, {
    skip: !agentId,
  });

  const [updateAgent, { isLoading: isUpdating }] = useUpdateAgentMutation();

  // Active Integrations endpoint (/automations/api/v1/adapters/installed)
  const { data: installedAdaptersData } = useGetInstalledAutomationAdaptersQuery();

  // Fetch available skills to resolve names <-> _id
  const { data: allSkillsData } = useGetSkillsQuery();

  const allAvailableSkills = useMemo(() => {
    const raw =
      allSkillsData?.data?.skills ||
      allSkillsData?.data?.data ||
      allSkillsData?.data ||
      allSkillsData?.skills ||
      (Array.isArray(allSkillsData) ? allSkillsData : []);
    return Array.isArray(raw) ? raw : [];
  }, [allSkillsData]);


  // Active agent object
  const currentAgent = useMemo(() => {
    const fetched = fetchedAgentData?.data?.data || fetchedAgentData?.data || fetchedAgentData;
    if (fetched && (fetched._id || fetched.id || fetched.name)) {
      return fetched;
    }
    return agent || null;
  }, [fetchedAgentData, agent]);

  // Extract installed active integrations directly from endpoint data
  const installedAdapters = useMemo(() => {
    const installedPayload =
      installedAdaptersData?.data?.data ||
      installedAdaptersData?.data ||
      installedAdaptersData ||
      {};
    const adapters =
      installedPayload?.adapters ||
      (Array.isArray(installedPayload) ? installedPayload : []);

    return Array.isArray(adapters) ? adapters : [];
  }, [installedAdaptersData]);

  // Model options strictly mapped from the active integrations endpoint
  const modelOptions = useMemo(() => {
    if (installedAdapters.length > 0) {
      return installedAdapters.map((adapter) => {
        const title = adapter.title || adapter.name || adapter.type || 'Model';
        const instanceName = adapter.name || adapter.config?.name;
        const label =
          instanceName && instanceName !== title
            ? `${title} (${instanceName})`
            : title;

        return {
          value: title,
          id: title,
          label,
          raw: adapter,
        };
      });
    }

    if (currentAgent?.model) {
      return [
        {
          value: currentAgent.model,
          id: currentAgent.model,
          label: currentAgent.model,
        },
      ];
    }

    return [];
  }, [installedAdapters, currentAgent?.model]);

  // Form states
  const [agentName, setAgentName] = useState(currentAgent?.name || '');
  const [agentDescription, setAgentDescription] = useState(currentAgent?.description || '');
  const [prompt, setPrompt] = useState(currentAgent?.prompt || '');
  const [model, setModel] = useState('');
  const [temperature, setTemperature] = useState(currentAgent?.temperature ?? 0.1);
  const [maxSteps, setMaxSteps] = useState(currentAgent?.maxSteps ?? 25);
  const [skills, setSkills] = useState([]);
  const [isAddSkillsModalOpen, setIsAddSkillsModalOpen] = useState(false);

  // Helper to map raw skill item from agent into normalized UI skill object
  const normalizeAgentSkill = (s) => {
    if (typeof s === 'object' && s !== null) {
      const id = s._id || s.id;
      const matched = allAvailableSkills.find(
        (item) =>
          (id && (item._id === id || item.id === id)) ||
          (s.name && item.name?.toLowerCase() === s.name.toLowerCase())
      );
      const skillId = matched?._id || matched?.id || id || s.name;
      const name = s.name || matched?.name || s.title || skillId;
      const desc =
        s.description ||
        s.desc ||
        matched?.description ||
        matched?.desc ||
        'Autonomous capability package';

      return {
        id: skillId,
        _id: skillId,
        name,
        desc,
        icon: getSkillIcon(name),
      };
    }

    // String identifier (could be _id or skill name)
    const strVal = String(s);
    const matched = allAvailableSkills.find(
      (item) =>
        item._id === strVal ||
        item.id === strVal ||
        item.name?.toLowerCase() === strVal.toLowerCase()
    );
    const skillId = matched?._id || matched?.id || strVal;
    const name = matched?.name || strVal;
    const desc = matched?.description || matched?.desc || 'Autonomous capability package';

    return {
      id: skillId,
      _id: skillId,
      name,
      desc,
      icon: getSkillIcon(name),
    };
  };

  // Synchronize state when agent data or model options arrive
  useEffect(() => {
    if (currentAgent?.name) {
      setAgentName(currentAgent.name);
    }
    if (currentAgent?.description) {
      setAgentDescription(currentAgent.description);
    }
    if (currentAgent?.prompt !== undefined) {
      setPrompt(currentAgent.prompt || '');
    }
    if (currentAgent?.temperature !== undefined) {
      setTemperature(Number(currentAgent.temperature));
    }
    if (currentAgent?.maxSteps !== undefined) {
      setMaxSteps(Number(currentAgent.maxSteps));
    }

    // Model selection resolution
    if (currentAgent?.model && modelOptions.length > 0) {
      const target = currentAgent.model.trim().toLowerCase();
      const matched = modelOptions.find(
        (m) =>
          m.value.toLowerCase() === target ||
          m.label.toLowerCase() === target ||
          m.raw?.type?.toLowerCase() === target ||
          m.raw?.name?.toLowerCase() === target ||
          m.raw?.title?.toLowerCase() === target
      );
      if (matched) {
        setModel(matched.value);
      } else {
        setModel(currentAgent.model);
      }
    } else if (!model && modelOptions.length > 0) {
      setModel(modelOptions[0].value);
    }

    // Skills resolution from agent payload
    if (Array.isArray(currentAgent?.skills)) {
      const mapped = currentAgent.skills.map(normalizeAgentSkill);
      setSkills(mapped);
    } else {
      setSkills([]);
    }
  }, [currentAgent, modelOptions, allAvailableSkills]);

  const handleAddSkills = async (updatedSkills) => {
    setSkills(updatedSkills);

    if (agentId) {
      try {
        const payload = {
          agentId,
          name: agentName || currentAgent?.name,
          description: agentDescription || currentAgent?.description,
          prompt,
          model,
          temperature,
          maxSteps,
          skills: updatedSkills.map((s) => (typeof s === 'string' ? s : s._id || s.id || s.name)),
        };
        await updateAgent(payload).unwrap();
        refetchAgent?.();
        toast.success('Agent skills updated successfully');
      } catch (err) {
        toast.error(err?.data?.message || err?.message || 'Failed to update skills on server');
      }
    } else {
      toast.success('Skills updated in configuration');
    }
  };

  const handleRemoveSkill = (skillId) => {
    setSkills((prev) => prev.filter((s) => s.id !== skillId && s._id !== skillId));
  };

  const handleDiscard = () => {
    setAgentName(currentAgent?.name || '');
    setAgentDescription(currentAgent?.description || '');
    setPrompt(currentAgent?.prompt || '');
    setModel(currentAgent?.model || (modelOptions[0]?.value || ''));
    setTemperature(currentAgent?.temperature ?? 0.1);
    setMaxSteps(currentAgent?.maxSteps ?? 25);
    if (Array.isArray(currentAgent?.skills)) {
      const mapped = currentAgent.skills.map(normalizeAgentSkill);
      setSkills(mapped);
    } else {
      setSkills([]);
    }
    toast.info('Changes discarded');
  };

  // PUT /automations/api/v1/agents/{agentId}
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!agentId) {
      toast.error('Unable to save: Agent ID not found');
      return;
    }

    try {
      const payload = {
        agentId,
        name: agentName || currentAgent?.name,
        description: agentDescription || currentAgent?.description,
        prompt,
        model,
        temperature,
        maxSteps,
        skills: skills.map((s) => (typeof s === 'string' ? s : s._id || s.id || s.name)),
      };

      await updateAgent(payload).unwrap();
      refetchAgent?.();
      toast.success('Agent configuration updated successfully');
    } catch (err) {
      toast.error(err?.data?.message || err?.message || 'Failed to update agent configuration');
    }
  };

  if (isAgentError && !agent) {
    return <ApiErrorHandler error={agentError} />;
  }

  return (
    <>
      <form onSubmit={handleSave} className="gap-5">
        <div className="flex justify-between gap-2">
          {/* <SystemDirectiveCard
            prompt={prompt}
            setPrompt={setPrompt}
          /> */}

          <ModelEngineCard
            model={model}
            setModel={setModel}
            modelOptions={modelOptions}
            temperature={temperature}
            setTemperature={setTemperature}
            maxSteps={maxSteps}
            setMaxSteps={setMaxSteps}
            handleDiscard={handleDiscard}
            isUpdating={isUpdating}
          />

          <AssignedSkillsCard
            skills={skills}
            onRemoveSkill={handleRemoveSkill}
            onOpenAddSkillsModal={() => setIsAddSkillsModalOpen(true)}
          />
        </div>
      </form>

      {/* Add Skills & Capabilities Modal */}
      <AddSkillsModal
        open={isAddSkillsModalOpen}
        setOpen={setIsAddSkillsModalOpen}
        assignedSkills={skills}
        onAddSkills={handleAddSkills}
        isAdding={isUpdating}
      />
    </>
  );
}
