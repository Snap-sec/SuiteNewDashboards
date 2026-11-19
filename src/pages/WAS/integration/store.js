import { create } from 'zustand';

const useStore = create((set) => ({
  showInstallModal: { type: "" },
  selectedTab: "all-integrations",


  setShowInstallModal: (show) => (set((state) => ({ ...state, showInstallModal: show }))),
  setSelectedTab: (tab) => (set((state) => ({ ...state, selectedTab: tab })))
}));


export { useStore };
