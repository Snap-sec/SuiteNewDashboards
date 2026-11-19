import { create } from 'zustand';

const useAutomationStore = create((set) => ({
  activeRuleId: null,
  ruleSearch: '',
  setActiveRuleId: (id) => set({ activeRuleId: id }),
  setRuleSearch: (search) => set({ ruleSearch: search }),
  resetSearch: () => set({ ruleSearch: '' }),
}));

export default useAutomationStore;
