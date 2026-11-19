import { create } from 'zustand';

const useStore = create((set) => ({
  searchQuery: '',
  filters: {},
  selectedRule: {},
  isEditingRule: false,
  pagination: { pageIndex: 0, pageSize: 20 }, // for tanstack table
  sorting: [],
  showCreateUpdateModal: false,
  modalMode: 'create', // create | update

  setPagination: (callback) =>
    set((state) => {
      let newState = callback(state.pagination);
      return { pagination: newState };
    }), // for tanstack table (passes callback)

  setSorting: (callback) =>
    set((state) => {
      let newState = callback(state.sorting);
      if (!newState.length) return { sorting: [] };
      return { sorting: [newState.at(-1)] };
    }),

  setSearchQuery: (search) => set(() => ({ searchQuery: search })),

  setFilters: (callback) =>
    set((state) => {
      let newState =
        typeof callback === 'function' ? callback(state.filters) : callback;
      return { filters: newState };
    }),

  setSelectedRule: (rule) => set({ selectedRule: rule }),

  setIsEditingRule: (state) => set({ isEditingRule: state }),

  setShowCreateUpdateModal: (show) => set({ showCreateUpdateModal: show }),
  setModalMode: (mode) => set({ modalMode: mode }),
  setSelectedScan: (scan) => set({ selectedScan: scan }),
}));

export default useStore;
