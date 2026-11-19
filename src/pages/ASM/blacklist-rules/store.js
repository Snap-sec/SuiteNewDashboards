import { create } from 'zustand';

const useStore = create((set) => ({
  pagination: { pageIndex: 0, pageSize: 10 },
  searchQuery: '',
  filters: {},
  sorting: [],
  showModal: false,
  selectedRule: null,
  mode: 'create',

  setPagination: (callback) =>
    set((state) => {
      const newState =
        typeof callback === 'function' ? callback(state.pagination) : callback;
      return { pagination: newState };
    }),
  setPage: (page) =>
    set((state) => ({
      pagination: { ...state.pagination, pageIndex: page - 1 },
    })),
  setSearchQuery: (search) => set(() => ({ searchQuery: search })),
  setFilters: (callback) =>
    set((state) => {
      const newState =
        typeof callback === 'function' ? callback(state.filters) : callback;
      return { filters: newState };
    }),
  setSorting: (callback) =>
    set((state) => {
      const newState =
        typeof callback === 'function' ? callback(state.sorting) : callback;
      if (!newState?.length) return { sorting: [] };
      return { sorting: [newState.at(-1)] };
    }),
  setShowModal: (open) => set({ showModal: open }),
  setSelectedRule: (rule) => set({ selectedRule: rule }),
  setMode: (mode) => set({ mode: mode }),
}));

export default useStore;
