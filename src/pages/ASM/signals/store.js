import { create } from 'zustand';

const useStore2 = create((set) => ({
  activeRuleId: null,
  currentTab: 'built-in',
  assetSearch: '',
  ruleSearch: '',

  setActiveRuleId: (id) => set({ activeRuleId: id }),
  setCurrentTab: (tab) => set({ currentTab: tab }),
  setAssetSearch: (search) => set({ assetSearch: search }),
  setRuleSearch: (search) => set({ ruleSearch: search }),

  // Reset search when changing rules or tabs if needed
  resetSearch: () => set({ assetSearch: '', ruleSearch: '' })
}));

export default useStore2;
