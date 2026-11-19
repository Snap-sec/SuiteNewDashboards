import { create } from 'zustand';

const useStore = create((set) => ({
  pagination: { pageIndex: 0, pageSize: 25 },
  searchQuery: '',
  filters: {},
  sorting: [],

  setPagination: (callback) =>
    set((state) => {
      const newState = typeof callback === 'function' ? callback(state.pagination) : callback;
      return { pagination: newState };
    }),

  setSearchQuery: (search) => set(() => ({ searchQuery: search })),

  setSorting: (callback) =>
    set((state) => {
      const newState = typeof callback === 'function' ? callback(state.sorting) : callback;
      if (!newState?.length) return { sorting: [] };
      return { sorting: [newState.at(-1)] };
    }),

  setFilters: (callback) =>
    set((state) => {
      const newState = typeof callback === 'function' ? callback(state.filters) : callback;
      return { filters: newState };
    }),
}));

export default useStore;
