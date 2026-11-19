import { create } from 'zustand';

const useAutomationStore = create((set) => ({
  agentData: null,
  setAgentData: (data) => set({ agentData: data }),
  activeSkillPackage: null,
  setActiveSkillPackage: (pkg) => set({ activeSkillPackage: pkg }),
}));

export { useAutomationStore };
