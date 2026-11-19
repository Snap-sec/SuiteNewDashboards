import { create } from 'zustand';

const useStore = create((set) => ({
  tab: 'adapters',
  adapter_type: "",
  adapter_modal_open: false,


  setTab: (value) => set({ tab: value }),
  setAdapterType: (value) => set({ adapter_type: value }),
  setAdapterModalOpen: (value) => set({ adapter_modal_open: value })
}));

export { useStore };
