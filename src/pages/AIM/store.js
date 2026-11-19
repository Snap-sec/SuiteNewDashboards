import { create } from 'zustand';

const useStore = create((set) => ({
  searchQuery: '',
  filters: {},
  selectedRule: {},
  isEditingRule: false,

  setSearchQuery: (search) => set(() => ({ searchQuery: search })),
  setFilters: (callback) =>
    set((state) => {
      let newState = callback(state.filters);
      return { filters: newState };
    }),
  setSelectedRule: (rule) => set({ selectedRule: rule }),
  setIsEditingRule: (state) => set({ isEditingRule: state }),
}));

export default useStore;
