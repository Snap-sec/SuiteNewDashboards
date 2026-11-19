import { create } from 'zustand';

const useStore = create((set) => ({
    showInstallModal: { type: "" },
    showConfigModal: null,
    selectedTab: "all-integrations",


    setShowInstallModal: (show) => (set((state) => ({ ...state, showInstallModal: show }))),
    setShowConfigModal: (adapter) => (set((state) => ({ ...state, showConfigModal: adapter }))),
    setSelectedTab: (tab) => (set((state) => ({ ...state, selectedTab: tab })))
}));


export { useStore };