import React from 'react';
import { Route, Routes } from 'react-router';

const AutomationDashboard = React.lazy(() => import('@/pages/automation/dashboard'));
const AutomationWorkflows = React.lazy(() => import('@/pages/automation/workflows'));
const AutomationWorkflowEdit = React.lazy(() => import('@/pages/automation/workflow-edit'));
const AutomationRuns = React.lazy(() => import('@/pages/automation/runs'));
const AutomationRunDetails = React.lazy(() => import('@/pages/automation/run-details'));
const AutomationIntegrations = React.lazy(() => import('@/pages/automation/integrations'));
const AgentLibrary = React.lazy(() => import('@/pages/automation/agent-library'));
const AutomationAgents = React.lazy(() => import('@/pages/automation/agents'));
const AgentDetailsPage = React.lazy(() => import('@/pages/automation/agent-details'));
const AutomationSkills = React.lazy(() => import('@/pages/automation/skills'));
const SkillDetailsPage = React.lazy(() => import('@/pages/automation/skill-details'));
const AutomationPlayground = React.lazy(() => import('@/pages/automation/playground'));

const SingleRunLogDetails = React.lazy(() => import('@/pages/automation/single-run-logs/single-run-logs-page'));

export const AutomationRoutingSetup = () => {
  return (
    <Routes>
      <Route path="/" element={<AutomationDashboard />} />
      <Route path="playground" element={<AutomationPlayground />} />
      <Route path="agents" element={<AutomationAgents />} />
      <Route path="agents/:id" element={<AgentDetailsPage />} />
      <Route path="agent-details/:id" element={<AgentDetailsPage />} />
      <Route path="skills" element={<AutomationSkills />} />
      <Route path="skills/:id" element={<SkillDetailsPage />} />
      <Route path="skill-details" element={<SkillDetailsPage />} />
      <Route path="skill-details/:id" element={<SkillDetailsPage />} />
      <Route path="workflows" element={<AutomationWorkflows />} />
      <Route path="workflows/new" element={<AutomationWorkflowEdit />} />
      <Route path="workflows/:id" element={<AutomationWorkflowEdit />} />
      <Route path="runs" element={<AutomationRuns />} />
      <Route path="run-details/:id" element={<AutomationRunDetails />} />
      <Route path="models" element={<AutomationIntegrations />} />
      <Route path="agents/library" element={<AgentLibrary />} />
      <Route path="view-run-logs/:id" element={<SingleRunLogDetails />} />

    </Routes>
  );
};
